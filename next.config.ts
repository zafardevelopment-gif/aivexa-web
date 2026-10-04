import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude heavy serverless packages from the client bundle
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  async redirects() {
    return [
      // Old thin product page → the full MyRentSaathi landing page.
      { source: "/products/myrentsaathi", destination: "/myrentsaathi", permanent: true },
      { source: "/products/ai-munim", destination: "/ai-munim", permanent: true },
      {
        source: "/privacy-policy",
        destination: "/miftah-privacy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
