import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// Runs the collections build as a pre-step of both `next build` and
// `next dev`, including the watcher.
export default withContentCollections(nextConfig);
