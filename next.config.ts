import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict Mode double-invokes effects in dev only. ArtModal's browser-back
  // integration (history.pushState on open, history.back on cleanup) reacts to
  // that double-invoke by firing a popstate that instantly re-closes the modal,
  // so `next dev` couldn't open paintings. Production never double-invokes, so
  // this only aligns dev behavior with the live build. (No production effect —
  // Strict Mode is a dev-time feature.)
  reactStrictMode: false,
};

export default nextConfig;
