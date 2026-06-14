export default function NewsletterBanner() {
  return (
    <section className="newsletter-banner">
      <div className="newsletter-inner">
        <div className="newsletter-text">
          <h2 className="newsletter-heading">Mis geen enkel verhaal</h2>
          <p>Schrijf je in voor Marie&apos;s nieuwsbrief en ontvang nieuwe posts direct in je inbox.</p>
        </div>
        <a
          href="https://substack.com/@marieboddaert"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-dark"
        >
          Abonneer op Substack →
        </a>
      </div>
    </section>
  )
}
