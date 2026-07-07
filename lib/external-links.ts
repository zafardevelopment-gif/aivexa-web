// Some AIVEXA products are standalone apps hosted on their own
// subdomain rather than a page inside this site. For those, map
// the product slug to its live external URL — the UI uses this to
// send "Learn more" / marquee clicks straight to the live app
// instead of an internal /products/<slug> route.
export const externalProductLinks: Record<string, string> = {
  "saferide-qr": "https://saferide.aivexallp.com/",
  myrentsaathi: "https://www.myrentsaathi.com/",
};

export function getExternalLink(slug: string): string | undefined {
  return externalProductLinks[slug];
}
