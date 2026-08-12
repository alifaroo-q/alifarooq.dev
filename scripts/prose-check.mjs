/**
 * The measurements behind `docs/agents/prose.md`.
 *
 * **This reports; it does not gate, with one exception.** Every rule in the
 * prose doc except one is a judgement call — whether an em dash is an aside or
 * a pivot, whether a short sentence is plain or a fortune cookie. A gate on a
 * judgement call is a gate that gets argued with once and routed around from
 * then on, which is the reasoning `js-budget.mjs` sets out for putting its
 * teeth on the one number that cannot drift. The exception here is the banned
 * word list: "leverage" is either in the copy or it is not, so that one exits 1.
 *
 * **What it counts is what the diagnosis actually turned on.** The /stack page
 * was rewritten because twelve entries measured the same shape — a fragment of
 * three to thirteen words, then one sentence of nineteen to thirty-nine, ten of
 * them turning on a reversal. Nobody spotted that by reading. The numbers are
 * here so the next page does not need a fresh pair of eyes to find it.
 *
 * **Comments are stripped before anything is counted.** This repo's JSDoc is
 * long, first-person and full of em dashes on purpose, and it is not copy. A
 * checker that counted it would report the comments rather than the site.
 *
 * **A string counts as copy if it reads like a sentence.** There is no marker
 * in the source saying which literals a reader sees, so `looksLikeCopy` guesses
 * from shape and throws out class lists, paths, URLs and identifiers. It is a
 * heuristic and it will be wrong at the edges; that is affordable because the
 * output is read by a person, not enforced.
 *
 * Usage: `pnpm prose`. Add a path to measure a different tree.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The reversal tic, rule 2, in the shapes it actually turned up in.
 *
 * `instead of` and `rather than` are included knowing they catch plain factual
 * contrasts as well as rhetorical ones. That is the right way round: the
 * checker raises the count and a person decides which kind it is. The three
 * case studies came out at 1, 2 and 4 and every one survived that read.
 */
export const REVERSAL = [
  /\brather than\b/gi,
  /\bnot\s+(?:a|an|the|only|just|merely)\b[^.?!]{0,60}?\bbut\b/gi,
  /\bit is not\b[^.?!]{0,60}?\bit is\b/gi,
  /\bnever\b[^.?!]{0,40}?[—:,][^.?!]{0,40}?\bit is\b/gi,
  /\bwas never the\b/gi,
  /\binstead of\b/gi,
];

/**
 * Rule 8, and the only list with teeth.
 *
 * The site measured zero of these before the rewrite and zero after, so this
 * gate has never fired. It is here to keep it that way: these are the words
 * that arrive when copy is written in a hurry or by a model, and none of them
 * has ever been the shortest way to say the thing.
 */
export const BANNED = [
  "leverage",
  "robust",
  "seamless",
  "powerful",
  "cutting-edge",
  "best-in-class",
  "unlock",
  "journey",
  "pivotal",
  "crucial",
  "vital",
  "testament",
  "underscores",
  "showcases",
  "highlights",
  "landscape",
  "tapestry",
  "passionate",
  "seasoned",
  "advanced",
  "expert",
  "deep expertise",
  "delve",
  "intricate",
  "vibrant",
  "boasts",
  "nestled",
  "groundbreaking",
];

/** Block and line comments out, so JSDoc is never counted as copy. */
export function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/**
 * Whether a string literal is something a reader sees.
 *
 * The rejects matter more than the accepts: a Tailwind class list is mostly
 * lowercase words separated by spaces and would otherwise read as a sentence
 * with a very low mean length, which would drag every average on the page.
 */
export function looksLikeCopy(s) {
  if (s.length < 12) return false;
  if (!/\s/.test(s)) return false;
  if (/^[#/.]|^https?:|^mailto:/.test(s)) return false;
  if (/^[a-z-]+(\s+[a-z0-9:[\]/.-]+)+$/.test(s) && !/[.,;?!]/.test(s))
    return false;
  if (/[{}<>]/.test(s) && !/[.?!]/.test(s)) return false;
  const words = s.split(/\s+/);
  if (words.length < 3) return false;
  if (!words.some((w) => /^[A-Za-z][a-z]{2,}/.test(w))) return false;
  return true;
}

/** Copy out of a `.ts`/`.tsx` file: string literals plus JSX text nodes. */
export function stringsFromCode(src) {
  const clean = stripComments(src);
  const out = [];
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g;
  for (const m of clean.matchAll(re)) {
    const raw = m[1] ?? m[2];
    if (!raw) continue;
    const s = raw
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, " ");
    if (looksLikeCopy(s)) out.push(s);
  }
  const jsx = /> *([A-Z][^<>{}\n]{15,}?) *</g;
  for (const m of clean.matchAll(jsx)) {
    if (looksLikeCopy(m[1])) out.push(m[1].trim());
  }
  return out;
}

/**
 * Copy out of an `.mdx` file: the quoted frontmatter values and the prose.
 *
 * Fenced code goes first. A code block is the one place in a case study where
 * a line has no sentence in it at all, and counting it would report the sample
 * rather than the writing around it.
 */
export function stringsFromMdx(src) {
  const out = [];
  const fm = src.match(/^---\n([\s\S]*?)\n---/);
  let body = src;
  if (fm) {
    body = src.slice(fm[0].length);
    for (const line of fm[1].split("\n")) {
      const kv = line.match(/^(\w+):\s*"([\s\S]*)"$/);
      if (kv && looksLikeCopy(kv[2])) out.push(kv[2]);
    }
  }
  body = body.replace(/```[\s\S]*?```/g, "");
  for (const para of body.split(/\n{2,}/)) {
    const t = para.trim();
    if (!t || t.startsWith("#") || t.startsWith(">")) continue;
    if (looksLikeCopy(t)) out.push(t.replace(/\s+/g, " "));
  }
  return out;
}

const sentences = (s) =>
  s
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter(Boolean);

/**
 * The numbers, for one file or for the whole site.
 *
 * `uniformity` is the one that found the original problem. It buckets each
 * string's sentence lengths into short/medium/long and reports how many share
 * the commonest pattern. Twelve identical buckets is a template, and it reads
 * as one long before anybody can say why.
 */
export function measure(strings) {
  const m = {
    strings: strings.length,
    emDash: 0,
    reversals: 0,
    curly: 0,
    firstPerson: 0,
    banned: [],
    lengths: [],
    uniformity: null,
  };
  const shapes = [];
  for (const s of strings) {
    m.emDash += (s.match(/—/g) || []).length;
    m.curly += (s.match(/[“”‘’]/g) || []).length;
    for (const re of REVERSAL) m.reversals += (s.match(re) || []).length;
    for (const b of BANNED) {
      const hits = s.match(new RegExp(`\\b${b}\\b`, "gi"));
      if (hits) m.banned.push(`${b} (${hits.length})`);
    }
    if (/\b(I|I'm|I've|my|me)\b/.test(s)) m.firstPerson++;
    const lens = sentences(s).map((x) => x.split(/\s+/).length);
    m.lengths.push(...lens);
    if (lens.length > 1) shapes.push(lens);
  }
  if (shapes.length > 2) {
    const counts = {};
    for (const lens of shapes) {
      const bucket = lens
        .map((n) => (n < 10 ? "S" : n < 25 ? "M" : "L"))
        .join("");
      counts[bucket] = (counts[bucket] || 0) + 1;
    }
    const [top, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    m.uniformity = `${n}/${shapes.length} share the top rhythm (${top})`;
  }
  const L = m.lengths;
  if (L.length) {
    const mean = L.reduce((a, b) => a + b, 0) / L.length;
    m.short = L.filter((n) => n < 10).length;
    m.mid = L.filter((n) => n >= 10 && n < 25).length;
    m.long = L.filter((n) => n >= 25).length;
    m.mean = mean.toFixed(1);
    m.sd = Math.sqrt(
      L.reduce((a, b) => a + (b - mean) ** 2, 0) / L.length,
    ).toFixed(1);
  }
  return m;
}

/** Every file that can hold copy: the MDX collections and the app source. */
export function copyFiles(root) {
  const walk = (dir, out = []) => {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name === ".next" || name === ".git")
        continue;
      const p = join(dir, name);
      statSync(p).isDirectory() ? walk(p, out) : out.push(p);
    }
    return out;
  };
  return walk(root).filter((p) => {
    const r = relative(root, p);
    if (r.includes("/ui/") || /\.test\.[tj]sx?$/.test(r)) return false;
    if (r.startsWith("content/") && extname(p) === ".mdx") return true;
    return r.startsWith("src/") && /\.tsx?$/.test(p);
  });
}

export function report(root) {
  const rows = [];
  let all = [];
  for (const p of copyFiles(root)) {
    const src = readFileSync(p, "utf8");
    const strings =
      extname(p) === ".mdx" ? stringsFromMdx(src) : stringsFromCode(src);
    if (!strings.length) continue;
    all = all.concat(strings);
    rows.push({ file: relative(root, p), m: measure(strings) });
  }
  return { rows, total: measure(all) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ? resolve(process.argv[2]) : ROOT;
  const { rows, total } = report(root);

  console.log("FILE".padEnd(52), "str", "1st", "mean", "sd", "S/M/L", "flags");
  console.log("-".repeat(118));
  for (const { file, m } of rows) {
    const flags = [];
    if (m.emDash) flags.push(`emdash:${m.emDash}`);
    if (m.reversals) flags.push(`reversal:${m.reversals}`);
    if (m.curly) flags.push(`curly:${m.curly}`);
    if (m.banned.length) flags.push(`BANNED:${m.banned.join("|")}`);
    console.log(
      file.padEnd(52),
      String(m.strings).padStart(3),
      String(m.firstPerson).padStart(3),
      String(m.mean ?? "-").padStart(5),
      String(m.sd ?? "-").padStart(4),
      `${m.short}/${m.mid}/${m.long}`.padStart(9),
      flags.join(" ") || "clean",
    );
  }

  console.log("\n=== SITE TOTAL ===");
  console.log({
    strings: total.strings,
    firstPersonStrings: total.firstPerson,
    emDash: total.emDash,
    reversals: total.reversals,
    curly: total.curly,
    banned: total.banned.length ? total.banned : "none",
    meanSentence: total.mean,
    sdSentence: total.sd,
    shortMidLong: `${total.short}/${total.mid}/${total.long}`,
    uniformity: total.uniformity,
  });
  console.log(
    "\nem dashes and reversals are counts to read, not failures.",
    "\nSee docs/agents/prose.md — rule 9 for the aside, rule 2 for the pivot.",
  );

  if (total.banned.length) {
    console.error(`\nBanned words in copy: ${total.banned.join(", ")}`);
    process.exit(1);
  }
}
