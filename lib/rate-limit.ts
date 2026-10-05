import type { NextRequest } from 'next/server'

// Eenvoudige rate limit per IP-adres, in het geheugen van de serverless
// functie. Niet waterdicht (elke instantie heeft z'n eigen teller), maar
// genoeg om scripts die honderden verzoeken achter elkaar sturen af te remmen.
const hits = new Map<string, number[]>()

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-nf-client-connection-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'onbekend'
  )
}

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every(t => now - t >= windowMs)) hits.delete(k)
    }
  }

  return recent.length > limit
}
