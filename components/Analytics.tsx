"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { logPageview } from "@/app/actions";

const VISITOR_KEY = "aivexa_vid";

function getVisitorId(): string {
  try {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode, etc.) — use a per-session id.
    return `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Silent pageview tracker — logs one row to aivexa_pageviews per route
 * change via a server action. Never blocks or throws into the page.
 */
export default function Analytics() {
  const pathname = usePathname();
  const lastLogged = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastLogged.current === pathname) return;
    if (pathname.startsWith("/admin")) return; // don't track our own admin usage
    lastLogged.current = pathname;

    const visitorId = getVisitorId();
    const referrer = document.referrer || "";
    const userAgent = navigator.userAgent || "";

    logPageview({ path: pathname, referrer, visitorId, userAgent }).catch(() => {
      // Analytics must never surface an error to the user.
    });
  }, [pathname]);

  return null;
}
