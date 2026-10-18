import Link from "next/link";

export default function PdfApiNotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="pdfapi-card" style={{ maxWidth: 440, width: "100%", textAlign: "center", padding: "36px 28px" }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: "var(--pdf-accent)" }}>404</div>
        <h1 style={{ fontSize: 20, margin: "8px 0" }}>Page not found</h1>
        <p style={{ color: "var(--pdf-muted)", fontSize: 14, margin: "0 0 20px" }}>This page does not exist or has moved.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/pdf-api" className="pdfapi-btn pdfapi-btn-secondary">PDF API home</Link>
          <Link href="/pdf-api/dashboard" className="pdfapi-btn pdfapi-btn-primary">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
