import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude heavy serverless packages from the client bundle
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  // Client demo pages: static HTML in public/client/<NAME>/index.html,
  // served at /client/<NAME> and /client/<NAME>/ (not indexed by Google).
  async rewrites() {
    return [
      { source: "/client/:name", destination: "/client/:name/index.html" },
      { source: "/client/:name/", destination: "/client/:name/index.html" },
    ];
  },

  async headers() {
    return [
      {
        source: "/client/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

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
