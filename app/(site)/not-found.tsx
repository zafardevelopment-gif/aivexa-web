import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="page-hero" style={{ minHeight: "60vh" }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>
            404
          </div>
          <h1 className="section-title">
            Page <span className="accent">Not Found</span>
          </h1>
          <p className="section-desc" style={{ margin: "0 auto 2rem" }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
