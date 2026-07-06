import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell listing-page not-found-page">
      <section className="listing-hero section-inner">
        <p className="mono">404</p>
        <h1>That page isn&apos;t here.</h1>
        <div>
          <p>
            If someone sent you a personal link, double-check the spelling — or
            head back to the main site.
          </p>
          <Link className="text-draw" href="/">
            <span>Back to brodybillings.com</span>
            <span className="text-draw__line" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
