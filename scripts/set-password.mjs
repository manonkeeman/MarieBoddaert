/**
 * Zet het wachtwoord van een beheerder direct via de Supabase Admin API
 * en controleert meteen of inloggen ermee lukt.
 *
 * Gebruik (wachtwoord tussen enkele aanhalingstekens):
 *   NEW_PASSWORD='...' node scripts/set-password.mjs mh.boddaert@gmail.com
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key?.trim() && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const email    = process.argv[2]?.toLowerCase()
const password = process.env.NEW_PASSWORD

if (!email || !password) {
  console.error("❌ Gebruik: NEW_PASSWORD='...' node scripts/set-password.mjs <e-mailadres>")
  process.exit(1)
}

const url   = process.env.NEXT_PUBLIC_SUPABASE_URL
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY)
const anon  = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })

const { data, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 })
if (listError) { console.error('❌', listError.message); process.exit(1) }

const user = data.users.find((u) => u.email?.toLowerCase() === email)
if (!user) { console.error(`❌ ${email} bestaat niet in Supabase`); process.exit(1) }

const { error: updateError } = await admin.auth.admin.updateUserById(user.id, { password })
if (updateError) { console.error('❌ Opslaan mislukt:', updateError.message); process.exit(1) }

const { error: loginError } = await anon.auth.signInWithPassword({ email, password })
if (loginError) { console.error('❌ Opgeslagen, maar test-login mislukt:', loginError.message); process.exit(1) }

console.log(`✅ Wachtwoord voor ${email} ingesteld en test-login gelukt`)
