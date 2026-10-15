import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { OgCard, ogFonts, ogSize } from "@/lib/og-card";

/**
 * Dev-only: the share card against worst-case fills. `?data=<state>`; each
 * state is the props a real page would hand `OgCard`, at the size that page
 * uses (home 120/34, case 100/34, work 88/34). Not found in production.
 */
type Fill = {
  eyebrow?: string;
  headline: string;
  headlineSize: number;
  footline: string;
  footlineSize: number;
  footlineTone: "muted" | "label";
};

const CASE = {
  headlineSize: 100,
  footlineSize: 34,
  footlineTone: "label",
} as const;
const FILLS: Record<string, Fill> = {
  demo: {
    eyebrow: "HCPA",
    headline: "AI voice agent",
    footline: "Ali Farooq",
    ...CASE,
  },
  long: {
    eyebrow:
      "Healthcare credentialing and compliance platform for multi-state hospital networks",
    headline: "Multi-region healthcare credentialing and compliance platform",
    footline: "Ali Farooq",
    ...CASE,
  },
  compound: {
    eyebrow: "Client",
    headline: "Benachrichtigungseinstellungen",
    footline: "Ali Farooq",
    ...CASE,
  },
  wide: {
    eyebrow: "Client",
    headline: "Donaudampfschifffahrtsgesellschaftskapitänsmützenfabrik",
    footline: "Ali Farooq",
    ...CASE,
  },
  url: {
    eyebrow: "Open source",
    headline: "@zireal/result-kit-eslint-plugin-no-unhandled-result",
    footline: "Ali Farooq",
    ...CASE,
  },
  diacritics: {
    eyebrow: "Klient",
    headline: "Wiśniewska-Kowalczyk Łódź Ångström Ñandú",
    footline: "Ali Farooq",
    ...CASE,
  },
  scripts: {
    eyebrow: "عميل · 客户 · 🚚",
    headline: "نور الهدى 王秀英 🦊",
    footline: "Ali Farooq",
    ...CASE,
  },
  arabic: {
    eyebrow: "Client",
    headline: "نور الهدى عبد الرحمن",
    footline: "Ali Farooq",
    ...CASE,
  },
  cjk: {
    eyebrow: "Client",
    headline: "王秀英 株式会社",
    footline: "Ali Farooq",
    ...CASE,
  },
  emoji: {
    eyebrow: "Client",
    headline: "Fox 🦊 Logistics",
    footline: "Ali Farooq",
    ...CASE,
  },
  one: { eyebrow: "CLI", headline: "Q", footline: "Ali Farooq", ...CASE },
  noeyebrow: {
    headline: "Everything I built",
    footline: "Ali Farooq",
    ...CASE,
  },
  homelong: {
    headline: "Aleksandra Wiśniewska-Kowalczyk",
    footline: "AI full-stack engineer, voice agents and email assistants",
    headlineSize: 120,
    footlineSize: 34,
    footlineTone: "muted",
  },
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") notFound();
  const key = new URL(request.url).searchParams.get("data") ?? "demo";
  const fill = FILLS[key];
  if (!fill) return new Response("unknown state", { status: 404 });
  return new ImageResponse(<OgCard {...fill} />, {
    ...ogSize,
    fonts: [...ogFonts],
  });
}
