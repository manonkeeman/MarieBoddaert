/**
 * Zet een back-up van het oude Supabase-project terug in een nieuw project.
 * Gebruik: node scripts/restore-to-supabase.mjs <map-met-backup>
 *
 * Verwacht in de back-upmap: posts.json, about.json, comments.json,
 * reactions.json, auth_users.json en images/ (bestanden uit marie-images).
 *
 * Vereist .env.local met de gegevens van het NIEUWE project:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Voorwaarden: supabase-schema.sql is al uitgevoerd, en de beheerders
 * (zie auth_users.json) zijn in Authentication → Users aangemaakt met een
 * wachtwoord. Wachtwoorden kunnen niet worden overgezet.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

// Laad .env.local
const envPath = path.join(ROOT, '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key?.trim() && rest.length) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const BACKUP_DIR   = process.argv[2]

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Voeg NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY toe aan .env.local')
  process.exit(1)
}
if (!BACKUP_DIR || !fs.existsSync(BACKUP_DIR)) {
  console.error('❌ Geef de back-upmap mee: node scripts/restore-to-supabase.mjs <map>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, name), 'utf8'))
const BUCKET = 'marie-images'

async function upsert(table, rows, onConflict = 'id') {
  if (!rows.length) return
  const { error } = await supabase.from(table).upsert(rows, { onConflict })
  if (error) throw new Error(`${table}: ${error.message}`)
  console.log(`✅ ${table}: ${rows.length}`)
}

// Afbeeldingen uploaden, geeft een map oud pad → nieuwe publieke URL
async function uploadImages() {
  const imagesDir = path.join(BACKUP_DIR, 'images')
  if (!fs.existsSync(imagesDir)) return

  const files = fs.readdirSync(imagesDir, { recursive: true })
    .filter((f) => fs.statSync(path.join(imagesDir, f)).isFile())

  for (const file of files) {
    const key = file.split(path.sep).join('/')
    const ext = path.extname(file).slice(1).toLowerCase()
    const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(key, fs.readFileSync(path.join(imagesDir, file)), { contentType, upsert: true })
    if (error) throw new Error(`upload ${key}: ${error.message}`)
  }
  console.log(`✅ afbeeldingen: ${files.length}`)
}

// Verwijzingen naar de oude storage-URL omzetten naar het nieuwe project
function rewriteStorageUrls(value) {
  if (typeof value !== 'string') return value
  return value.replace(
    /https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\//g,
    `${SUPABASE_URL}/storage/v1/object/public/`
  )
}

async function linkAdmins() {
  const oldUsers = readJson('auth_users.json').users ?? []
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) throw new Error(`auth: ${error.message}`)

  const byEmail = new Map(data.users.map((u) => [u.email?.toLowerCase(), u.id]))
  const rows = []
  for (const u of oldUsers) {
    const id = byEmail.get(u.email?.toLowerCase())
    if (id) rows.push({ user_id: id })
    else console.warn(`⚠️  ${u.email} bestaat nog niet in het nieuwe project, maak aan en draai opnieuw`)
  }
  await upsert('admins', rows, 'user_id')
}

async function main() {
  await uploadImages()

  const posts = readJson('posts.json').map((p) => ({ ...p, content: rewriteStorageUrls(p.content) }))
  const about = readJson('about.json').map((a) => ({ ...a, photo_url: rewriteStorageUrls(a.photo_url), bio: rewriteStorageUrls(a.bio) }))

  await upsert('posts', posts)
  await upsert('about', about)
  await upsert('comments', readJson('comments.json'))
  await upsert('reactions', readJson('reactions.json'))
  await linkAdmins()

  console.log('\n🎉 Klaar')
}

main().catch((err) => {
  console.error('❌', err.message)
  process.exit(1)
})
