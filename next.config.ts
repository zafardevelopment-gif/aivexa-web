import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude heavy serverless packages from the client bundle
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

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
