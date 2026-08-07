import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Take A's face. Tallest x-height of the free monos and drawn for extended
// reading rather than glanceable code — the reason 15px body copy holds up.
const terminal = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jb-mono",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = "https://alifarooq.dev";
const description =
  "Ali Farooq — full stack engineer building AI-powered backend systems, automation workflows, and integration-heavy products in TypeScript.";

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
};

// Person entity so the page reads as a real profile rather than a soft 404.
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${terminal.variable}`}
    >
      {/* PROTOTYPE: `ground` (bloom + grain) removed so each take paints its own background. */}
      <body className="min-h-dvh font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
