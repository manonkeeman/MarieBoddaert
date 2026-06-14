import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact — Marie H. Boddaert' }

export default function Contact() {
  return (
    <>
      <div className="post-banner" style={{ backgroundColor: '#B8E3E3' }}>
        <div className="post-banner-inner">
          <p className="post-category">Contact</p>
          <h1 className="post-title">Neem contact op</h1>
        </div>
      </div>

      <div className="contact-page">
        <p className="contact-intro">
          Schrijf me. Over iets wat je las, een samenwerking, een vraag — of gewoon hallo.
          Ik lees alles en ik schrijf terug.
        </p>

        <div className="contact-form-box">
          <form
            action="mailto:mh.boddaert@gmail.com"
            method="post"
            encType="text/plain"
            className="comment-form"
          >
            <div className="form-group">
              <label htmlFor="naam" className="form-label">Naam</label>
              <input type="text" id="naam" name="naam" className="form-input" placeholder="Jouw naam" required />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">E-mailadres</label>
              <input type="email" id="email" name="email" className="form-input" placeholder="jij@voorbeeld.nl" required />
            </div>
            <div className="form-group">
              <label htmlFor="onderwerp" className="form-label">Onderwerp</label>
              <input type="text" id="onderwerp" name="onderwerp" className="form-input" placeholder="Waar gaat je bericht over?" />
            </div>
            <div className="form-group">
              <label htmlFor="bericht" className="form-label">Bericht</label>
              <textarea id="bericht" name="bericht" className="form-textarea" placeholder="Schrijf hier je bericht..." rows={5} required />
            </div>
            <button type="submit" className="btn btn-turquoise">Verstuur bericht →</button>
          </form>
        </div>

        <p className="contact-email">Of mail direct naar mh.boddaert@gmail.com</p>

        <div className="contact-newsletter">
          <p>Liever niets missen?</p>
          <a href="https://substack.com/@marieboddaert" target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            Abonneer op de nieuwsbrief →
          </a>
        </div>
      </div>
    </>
  )
}
