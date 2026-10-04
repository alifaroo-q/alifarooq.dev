import type { ReactElement } from "react";
import { Camel } from "@/components/camel";
import {
  Dunes,
  Dusk,
  FishMarket,
  Harbour,
  Port,
  SeaView,
  Stars,
} from "@/components/scenery";
import { SCENE_NAMES, type SceneName } from "@/lib/scene-names";

/**
 * One scenery band as bare HTML, for `late-scenery.tsx` to insert once the
 * page is idle. Rendered at build, so a request is a static file.
 */
const SCENES: Record<SceneName, () => ReactElement> = {
  fishMarket: FishMarket,
  port: Port,
  dunes: Dunes,
  seaView: SeaView,
  dusk: Dusk,
  stars: Stars,
  harbour: Harbour,
  camel: Camel,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return SCENE_NAMES.map((name) => ({ name }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const scene = SCENES[name as SceneName];
  if (!scene) return new Response(null, { status: 404 });
  // The app-router bundler refuses a static `react-dom/server` import. This
  // handler is prerendered at build and plain Node resolves the module.
  const { renderToStaticMarkup } = await import(
    /* turbopackIgnore: true */ "react-dom/server"
  );
  return new Response(renderToStaticMarkup(scene()), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
