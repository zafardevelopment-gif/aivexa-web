import Link from "next/link";

// Site-wide fallback for any URL that does not exist (outside the main site layout).
export default function RootNotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#0b1220", color: "#e5e7eb", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: "#818cf8" }}>404</div>
        <h1 style={{ fontSize: 22, margin: "8px 0" }}>Page not found</h1>
        <p style={{ color: "#9ca3af", fontSize: 15, margin: "0 0 24px" }}>This page does not exist or has moved.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ background: "#6366f1", color: "#fff", padding: "10px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>AIVEXA home</Link>
          <Link href="/tools" style={{ border: "1px solid #374151", color: "#e5e7eb", padding: "10px 18px", borderRadius: 8, textDecoration: "none" }}>Free tools</Link>
          <Link href="/pdf-api" style={{ border: "1px solid #374151", color: "#e5e7eb", padding: "10px 18px", borderRadius: 8, textDecoration: "none" }}>PDF API</Link>
        </div>
      </div>
    </main>
  );
}
