import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { rootMetadata } from "@/lib/metadata";
import "./globals.css";

// 400 and 500 only. The 700 was dropped: nothing on the site used a bold
// utility, so it was a font file shipped on every page load for nothing.
// Adding a weight back is a one-line change and should argue for itself.
//
// Naming the weights also pins them. JetBrains Mono is a variable font, so
// omitting `weight` would ship one file instead of two — but that file
// carries 100 to 800, which quietly makes every dropped weight work again.
// Two static cuts is the cost of the rule above having teeth.
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/**
 * The home description, verbatim from #16 (152 characters).
 *
 * It **deliberately gives up the positioning sentence**, which #8 called the
 * obvious site-level description. At 195 characters that sentence gets cut
 * after its first clause, throwing away two of the three — and since the
 * sentence IS the page's table of contents, a card showing one third of it is
 * worse than a card that does not attempt it.
 */
const description =
  "I'm a backend engineer who designs for the failure case first. Three case studies on where that mattered, and the open-source work that came out of it.";

/**
 * `metadataBase`, the title template, and the home page's own `<head>` (#16).
 *
 * The template applies to child segments only, which is why the home title is
 * `title.default` rather than a fourth literal of the name. `og:image` and
 * `twitter:image` are not here: `opengraph-image.tsx` is the file convention
 * that fills them, per route, so a case study cannot inherit the home card.
 */
export const metadata: Metadata = rootMetadata(description);

// Both grounds, so the browser chrome matches the page the reader gets.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edece9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="min-h-dvh">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
