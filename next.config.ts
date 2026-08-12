import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/miftah-privacy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
