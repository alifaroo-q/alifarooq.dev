import { describe, expect, it } from "vitest";
import { SCENE_NAMES } from "@/lib/scene-names";
import { GET } from "./route";

const ask = (name: string) =>
  GET(new Request(`http://test/scenes/${name}`), {
    params: Promise.resolve({ name }),
  });

describe("/scenes/[name]", () => {
  it.each(SCENE_NAMES)("serves %s as an SVG fragment", async (name) => {
    const response = await ask(name);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("<svg");
  });

  it("answers an unknown name with 404", async () => {
    expect((await ask("nowhere")).status).toBe(404);
  });
});
