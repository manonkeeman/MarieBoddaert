import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: { absolute: 'Contact Marie H. Boddaert — schrijfster uit Sliedrecht' },
  description: 'Stuur Marie H. Boddaert een bericht — over iets wat je las, een samenwerking of gewoon hallo.',
}

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
        <div className="contact-form-box">
          <ContactForm />
        </div>

        <p className="contact-email">
          Of mail direct naar{' '}
          <a href="mailto:mh.boddaert@gmail.com">mh.boddaert@gmail.com</a>
        </p>

        <div className="contact-newsletter">
          <p>Liever niets missen?</p>
          <a href="https://substack.com/@marieboddaert" target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            Lees op Substack →
          </a>
        </div>
      </div>
    </>
  )
}
