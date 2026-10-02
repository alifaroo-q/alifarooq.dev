import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
  Spectral,
} from "next/font/google";
import { Analytics } from "@/components/analytics";
import { Camel } from "@/components/camel";
import { HourWatcher } from "@/components/hour-watcher";
import { MotionRuntime } from "@/components/motion-runtime";
import { rootMetadata } from "@/lib/metadata";
import "./globals.css";

// One face per job. Bricolage Grotesque is the voice of headings, Hanken
// Grotesk is body, Spectral italic is the single accented word in a heading,
// and JetBrains Mono is kept for code and the times printed on the scenery,
// which are data. Each weight listed is one that something on the site uses.

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: "italic",
  variable: "--font-spectral",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/** The home description. It is not the headline: the headline says the claim, this says what is behind it. */
const description =
  "Software engineer in Karachi, working remotely across backend, full-stack and AI product work.";

/**
 * `metadataBase`, the title template, and the home page's own `<head>` (#16).
 *
 * The template applies to child segments only, which is why the home title is
 * `title.default` rather than a fourth literal of the name. `og:image` and
 * `twitter:image` are not here: `opengraph-image.tsx` is the file convention
 * that fills them.
 */
export const metadata: Metadata = rootMetadata(description);

// The page opens at dawn, so the browser chrome matches the first thing the
// reader sees. There is no dark scheme: the dark half of the day is a section.
export const viewport: Viewport = {
  themeColor: "#f7cfae",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${hanken.variable} ${spectral.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        {/* The site's only client boundary, and it renders nothing. It reads
            the motion hooks already on the markup above it, so a page stays
            server-rendered and the animation stays out of the page's own
            source. See `motion-runtime.tsx`. */}
        <MotionRuntime />
        <HourWatcher />
        <Camel />
        <Analytics />
      </body>
    </html>
  );
}
