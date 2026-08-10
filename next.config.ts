import { withContentCollections } from "@content-collections/next";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// `withBotId` adds the rewrites BotID's client script is served through. It is
// half of the check; the other half is `initBotId` in `instrumentation-client.ts`
// naming the route, and `checkBotId()` inside the route reading the verdict.
// Miss any one of the three and the check silently passes everything (#30).
//
// `withContentCollections` runs the collections build as a pre-step of both
// `next build` and `next dev`, including the watcher.
export default withContentCollections(withBotId(nextConfig));
