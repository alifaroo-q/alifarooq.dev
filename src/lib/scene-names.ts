/** The scenery bands drawn after load, by the name `/scenes/<name>` serves them under. */
export const SCENE_NAMES = [
  "fishMarket",
  "port",
  "dunes",
  "seaView",
  "dusk",
  "stars",
  "harbour",
  "camel",
] as const;

export type SceneName = (typeof SCENE_NAMES)[number];
