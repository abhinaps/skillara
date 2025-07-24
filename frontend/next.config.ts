import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@skillara/shared'],
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
