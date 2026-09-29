// Dagelijkse ping naar Supabase. Gratis projecten gaan na 7 dagen zonder
// database-activiteit op pauze; deze query houdt het project actief, ook als
// er een week geen bezoekers zijn.
export default async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const res = await fetch(`${url}/rest/v1/posts?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })

  if (!res.ok) {
    console.error(`Supabase keep-alive mislukt: ${res.status} ${await res.text()}`)
    return new Response('fout', { status: 500 })
  }

  console.log('Supabase keep-alive ok')
  return new Response('ok')
}

export const config = {
  schedule: '@daily',
}
