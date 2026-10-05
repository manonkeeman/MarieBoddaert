import { createHash } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-nf-client-connection-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'onbekend'
  )
}

// Rate limit per IP-adres, bijgehouden in de database (public.rate_limits)
// zodat alle serverless instanties dezelfde teller delen. IP-adressen worden
// alleen gehasht opgeslagen.
export async function isRateLimited(
  scope: string,
  ip: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const key = `${scope}:${createHash('sha256').update(ip).digest('hex')}`

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase.rpc('hit_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_seconds: Math.round(windowMs / 1000),
    })
    if (error) throw error
    return data === true
  } catch {
    // Database niet bereikbaar of functie ontbreekt: val terug op de
    // teller in het geheugen van deze instantie
    return isRateLimitedInMemory(key, limit, windowMs)
  }
}

const hits = new Map<string, number[]>()

function isRateLimitedInMemory(key: string, limit: number, windowMs: number): boolean {
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
