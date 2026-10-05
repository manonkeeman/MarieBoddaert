import sanitizeHtml from 'sanitize-html'

// Alleen wat de Tiptap StarterKit kan maken. Scripts, iframes, event handlers
// (onclick e.d.) en javascript:-links worden eruit gehaald.
export function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'b', 'em', 'i', 's', 'u', 'code', 'pre',
      'blockquote', 'ul', 'ol', 'li', 'a',
    ],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  })
}
