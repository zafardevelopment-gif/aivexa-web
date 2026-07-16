// Shared page-classification logic used by both the client-side tracker
// (components/Analytics.tsx) and the admin dashboard (for display labels).

export type PageClass = {
  pageType: string;
  pageKey: string;
  label: string;
};

export function classifyPath(path: string): PageClass {
  const clean = path.split("?")[0].split("#")[0];
  const parts = clean.split("/").filter(Boolean);

  if (parts.length === 0) {
    return { pageType: "home", pageKey: "home", label: "Homepage" };
  }
  if (parts[0] === "tools") {
    if (parts.length === 1) {
      return { pageType: "tools_hub", pageKey: "tools", label: "Free Tools hub" };
    }
    if (parts.length === 2) {
      return {
        pageType: "tool_category",
        pageKey: parts[1],
        label: `Category: ${parts[1]}`,
      };
    }
    return {
      pageType: "tool",
      pageKey: `${parts[1]}/${parts[2]}`,
      label: `Tool: ${parts[1]}/${parts[2]}`,
    };
  }
  if (parts[0] === "products") {
    return {
      pageType: "product",
      pageKey: parts[1] ?? "unknown",
      label: `Product: ${parts[1] ?? "unknown"}`,
    };
  }
  if (parts[0] === "blog") {
    if (parts.length === 1) {
      return { pageType: "blog_hub", pageKey: "blog", label: "Blog hub" };
    }
    return { pageType: "blog", pageKey: parts[1], label: `Blog: ${parts[1]}` };
  }
  if (["privacy", "terms", "data-deletion"].includes(parts[0])) {
    return { pageType: "legal", pageKey: parts[0], label: `Legal: ${parts[0]}` };
  }
  return { pageType: "other", pageKey: clean, label: clean };
}

export type UAInfo = {
  deviceType: string; // Mobile | Tablet | Desktop
  browser: string;
  os: string;
};

// Small dependency-free user-agent parser — good enough for analytics
// labels (not meant to be exhaustive like a full UA-parsing library).
export function parseUserAgent(ua: string): UAInfo {
  const s = ua || "";

  let os = "Other";
  if (/windows/i.test(s)) os = "Windows";
  else if (/iphone|ipad|ipod/i.test(s)) os = "iOS";
  else if (/android/i.test(s)) os = "Android";
  else if (/mac os x|macintosh/i.test(s)) os = "macOS";
  else if (/linux/i.test(s)) os = "Linux";

  let browser = "Other";
  if (/edg\//i.test(s)) browser = "Edge";
  else if (/opr\/|opera/i.test(s)) browser = "Opera";
  else if (/chrome\//i.test(s) && !/chromium/i.test(s)) browser = "Chrome";
  else if (/crios\//i.test(s)) browser = "Chrome";
  else if (/fxios\//i.test(s) || /firefox\//i.test(s)) browser = "Firefox";
  else if (/safari\//i.test(s) && /version\//i.test(s)) browser = "Safari";

  let deviceType = "Desktop";
  if (/ipad|tablet/i.test(s)) deviceType = "Tablet";
  else if (/mobi|iphone|android/i.test(s)) deviceType = "Mobile";

  return { deviceType, browser, os };
}

export const PAGE_TYPE_LABELS: Record<string, string> = {
  home: "Homepage",
  tools_hub: "Free Tools hub",
  tool_category: "Tool category page",
  tool: "Individual tool",
  product: "Product page",
  blog_hub: "Blog hub",
  blog: "Blog post",
  legal: "Legal page",
  other: "Other",
};
