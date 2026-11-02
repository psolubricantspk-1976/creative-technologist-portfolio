import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the hosted preview/sandbox proxy origins to reach the dev server.
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1", "[::1]"],
  // Hide the floating dev badge so it never covers the live preview.
  devIndicators: false,
};

export default nextConfig;
