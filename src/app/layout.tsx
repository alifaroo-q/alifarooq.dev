import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://alifarooq.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ali Farooq — Full Stack Engineer",
  description:
    "Personal site of Ali Farooq, a full stack engineer. Currently under construction.",
  openGraph: {
    title: "Ali Farooq — Full Stack Engineer",
    description:
      "Personal site of Ali Farooq, a full stack engineer. Currently under construction.",
    url: siteUrl,
    siteName: "alifarooq.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Farooq — Full Stack Engineer",
    description: "Personal site of Ali Farooq. Currently under construction.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-paper text-ink antialiased dark:bg-ink dark:text-paper">
        {children}
      </body>
    </html>
  );
}
