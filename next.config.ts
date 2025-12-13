import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone"
  /* config options here */
  // eslint: {
    // ignoreDuringBuilds: true
  // },
  // typescript: {
  //   ignoreBuildErrors: true
  // }
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
