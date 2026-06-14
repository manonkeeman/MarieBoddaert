/**
 * Migreert alle Markdown-posts naar Supabase.
 * Gebruik: node scripts/migrate-to-supabase.mjs
 *
 * Vereist .env.local met:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
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

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Voeg NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY toe aan .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Simpele markdown → HTML parser (geen externe dep nodig)
function mdToHtml(md) {
  return md
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    .split('\n\n')
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (block.startsWith('<h') || block.startsWith('<blockquote')) return block
      return `<p>${block.replace(/\n/g, '<br />')}</p>`
    })
    .filter(Boolean)
    .join('\n')
}

// Parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, body: content }

  const data = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (key?.trim()) {
      let value = rest.join(':').trim()
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
      data[key.trim()] = value
    }
  }
  return { data, body: match[2].trim() }
}

async function migrate() {
  const postsDir = path.join(ROOT, 'content', 'posts')
  if (!fs.existsSync(postsDir)) {
    console.error('❌ Map content/posts niet gevonden')
    process.exit(1)
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  console.log(`📚 ${files.length} Markdown-posts gevonden\n`)

  let ok = 0
  let skip = 0
  let fail = 0

  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    const raw  = fs.readFileSync(path.join(postsDir, file), 'utf8')
    const { data, body } = parseFrontmatter(raw)

    const post = {
      slug,
      title:     data.title     ?? slug,
      date:      data.date      ?? new Date().toISOString().split('T')[0],
      excerpt:   data.excerpt   ?? '',
      category:  data.category  ?? 'Verhalen',
      color:     data.color     ?? '#FAD5DA',
      emoji:     data.emoji     ?? '✍️',
      content:   mdToHtml(body),
      published: true,
    }

    const { error } = await supabase
      .from('posts')
      .upsert(post, { onConflict: 'slug' })

    if (error) {
      console.error(`  ❌ ${slug}: ${error.message}`)
      fail++
    } else {
      console.log(`  ✓ ${slug}`)
      ok++
    }
  }

  console.log(`\n✅ Klaar: ${ok} gemigreerd, ${skip} overgeslagen, ${fail} mislukt`)
}

migrate().catch(err => {
  console.error('Onverwachte fout:', err)
  process.exit(1)
})
