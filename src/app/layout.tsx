import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
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

const siteUrl = "https://alifarooq.dev";
const description =
  "Ali Farooq — full stack engineer building AI-powered backend systems, automation workflows, and integration-heavy products in TypeScript.";

// Carried over from the scaffolding unchanged. The social card image and the
// rest of the metadata belong to their own ticket; this only keeps what was
// already working rather than deleting it and leaving a gap.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ali Farooq — Full Stack Engineer",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ali Farooq — Full Stack Engineer",
    description,
    url: siteUrl,
    siteName: "alifarooq.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Farooq — Full Stack Engineer",
    description,
  },
};

// Person entity, so the page reads as a real profile rather than a soft 404.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ali Farooq",
  url: siteUrl,
  jobTitle: "Full Stack Engineer",
  email: "mailto:hello@alifarooq.dev",
  telephone: "+923167902206",
  sameAs: [
    "https://github.com/alifaroo-q",
    "https://www.linkedin.com/in/itsalifarooq",
  ],
};

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
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other insertion point, and the value is a local literal with no user input in it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          type="application/ld+json"
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
