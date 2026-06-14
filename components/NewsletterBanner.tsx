export default function NewsletterBanner() {
  return (
    <section className="newsletter-banner">
      <div className="newsletter-inner">
        <div className="newsletter-text">
          <h2 className="newsletter-heading">Volg Marie op Substack</h2>
          <p>Abonneer je op Substack en ontvang nieuwe verhalen direct in je inbox.</p>
        </div>
        <a
          href="https://substack.com/@marieboddaert"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-dark"
        >
          Lees op Substack →
        </a>
      </div>
    </section>
  )
}
