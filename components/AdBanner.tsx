"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  format?: "auto" | "rectangle" | "horizontal";
  style?: React.CSSProperties;
}

export default function AdBanner({
  format = "auto",
  style = {},
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || pushed.current) return;
    try {
      // @ts-expect-error adsbygoogle is injected by AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div
      style={{
        textAlign: "center",
        margin: "1.5rem auto",
        minHeight: format === "rectangle" ? 250 : 90,
        overflow: "hidden",
        ...style,
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot="auto"
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
