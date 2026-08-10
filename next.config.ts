import { withContentCollections } from "@content-collections/next";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The resume PDF's two headers (#32).
   *
   * Next checks `headers()` before the filesystem, so these reach the file in
   * `public/` even though nothing routes to it.
   */
  headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [
          {
            // Two different problems that look like one (#15). The URL is
            // pasted into applications and has to outlive every revision, so
            // it carries no year and no name — but `resume.pdf` is useless in
            // a folder holding two hundred of them, so the SAVED file gets a
            // name here. `inline` so the browser still previews it.
            key: "Content-Disposition",
            value: 'inline; filename="Ali-Farooq-Resume.pdf"',
          },
          {
            // An indexed resume PDF lets a scraper collect the phone number
            // and email inside it, and it competes with the site for the same
            // query while being the worse landing page (#16).
            //
            // There is deliberately NO matching `Disallow` in robots. The two
            // controls do not stack, they conflict: a `Disallow` stops the
            // crawler fetching the file, so it never reads this header, and a
            // blocked URL found through a link can still be listed. Adding
            // one would quietly undo the decision it looks like it reinforces.
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
    ];
  },
};

// `withBotId` adds the rewrites BotID's client script is served through. It is
// half of the check; the other half is `initBotId` in `instrumentation-client.ts`
// naming the route, and `checkBotId()` inside the route reading the verdict.
// Miss any one of the three and the check silently passes everything (#30).
//
// `withContentCollections` runs the collections build as a pre-step of both
// `next build` and `next dev`, including the watcher.
export default withContentCollections(withBotId(nextConfig));
