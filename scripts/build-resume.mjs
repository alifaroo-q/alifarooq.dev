/**
 * Prints `resume/resume.html` to `public/resume.pdf` with headless Chrome.
 *
 * This runs LOCALLY and the PDF it produces is committed (#15, #32). That is
 * deliberate and it is the whole reason this script is a script rather than a
 * build step: the alternative puts a browser download and a browser run into
 * the Vercel deploy path, on every deploy, to regenerate a file that changes
 * about four times a year.
 *
 * It shells out to a Chrome that is already on the machine rather than
 * depending on Puppeteer, for the same reason. A ~200MB devDependency that
 * exists to render one file four times a year is the cost this design was
 * chosen to avoid, and installing it would also put it in the Vercel install
 * step whether the build runs it or not.
 *
 * Usage: `pnpm resume:build`. Set `CHROME_BIN` if Chrome is somewhere this
 * script does not look.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "resume", "resume.html");
const OUTPUT = join(ROOT, "public", "resume.pdf");

/**
 * Distro packages disagree about the name and the directory, so the list is
 * long on purpose — a wrong guess here reads as "the script is broken" rather
 * than "install Chrome", which is the failure this is written to avoid.
 */
const CANDIDATES = [
  process.env.CHROME_BIN,
  "/usr/sbin/google-chrome-stable",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

function findChrome() {
  const found = CANDIDATES.find((path) => existsSync(path));
  if (found) return found;

  throw new Error(
    `No Chrome found. Looked in:\n  ${CANDIDATES.join("\n  ")}\n` +
      "Install Chrome or Chromium, or set CHROME_BIN to its path.",
  );
}

function build() {
  if (!existsSync(SOURCE)) {
    throw new Error(`Resume source is missing: ${SOURCE}`);
  }

  const chrome = findChrome();
  mkdirSync(dirname(OUTPUT), { recursive: true });

  // A throwaway profile. Without it Chrome refuses to start whenever the
  // user already has a normal Chrome window open, which is most of the time.
  const profile = mkdtempSync(join(tmpdir(), "resume-chrome-"));

  try {
    const result = spawnSync(
      chrome,
      [
        "--headless",
        "--disable-gpu",
        `--user-data-dir=${profile}`,
        // Page numbers and a file path across the top of a resume. Off.
        "--no-pdf-header-footer",
        `--print-to-pdf=${OUTPUT}`,
        pathToFileURL(SOURCE).href,
      ],
      { stdio: "inherit" },
    );

    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`${chrome} exited with ${result.status}`);
    }
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }

  if (!existsSync(OUTPUT)) {
    throw new Error(`Chrome reported success but wrote no file: ${OUTPUT}`);
  }

  const kb = Math.round(statSync(OUTPUT).size / 1024);
  console.log(`Wrote public/resume.pdf (${kb} KB) using ${chrome}`);
  console.log("Commit it — the PDF is version-controlled on purpose (#15).");
}

try {
  build();
} catch (error) {
  // One line, then a non-zero exit — the same shape as
  // `generate-content-types.mjs`. An uncaught throw buries the "install
  // Chrome" help inside a stack trace, which is the failure this script is
  // most likely to hand somebody.
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
