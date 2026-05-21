/**
 * Migratiescript: importeert alle markdown-posts naar Sanity
 *
 * Gebruik:
 *   SANITY_TOKEN=xxx node scripts/migrate-to-sanity.mjs
 *
 * Token aanmaken op:
 *   https://www.sanity.io/manage/personal/project/xfgj8bxt/api
 *   → "Add API token" → rol: Editor
 */

import { createClient }            from '@sanity/client'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname }            from 'path'
import { fileURLToPath }            from 'url'
import matter                       from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Sanity client ────────────────────────────────────────────────
const token = process.env.SANITY_TOKEN
if (!token) {
  console.error('\n❌  Geef SANITY_TOKEN mee:')
  console.error('   SANITY_TOKEN=xxx node scripts/migrate-to-sanity.mjs\n')
  process.exit(1)
}

const client = createClient({
  projectId: 'xfgj8bxt',
  dataset:   'production',
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

// ─── Hulpfuncties ─────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10)

function parseInline(text) {
  const spans = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let lastIdx = 0, m

  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx)
      spans.push({ _type: 'span', _key: uid(), text: text.slice(lastIdx, m.index), marks: [] })
    spans.push({
      _type: 'span', _key: uid(),
      text:  m[1] ?? m[2],
      marks: m[1] !== undefined ? ['strong'] : ['em'],
    })
    lastIdx = m.index + m[0].length
  }
  if (lastIdx < text.length)
    spans.push({ _type: 'span', _key: uid(), text: text.slice(lastIdx), marks: [] })

  return spans.filter(s => s.text)
}

function markdownToBlocks(md) {
  const blocks = []

  for (const section of md.trim().split(/\n{2,}/)) {
    const s = section.trim()
    if (!s) continue

    // ## Kop
    if (s.startsWith('## ')) {
      blocks.push({ _type:'block', _key:uid(), style:'h2', markDefs:[],
        children:[{ _type:'span', _key:uid(), text:s.slice(3).trim(), marks:[] }] })
      continue
    }

    const lines = s.split('\n')

    // Gedicht (regels met twee spaties aan het eind)
    if (lines.some(l => l.endsWith('  '))) {
      const spans = []
      lines.forEach((line, i) => {
        const clean = line.replace(/\s+$/, '')
        if (clean) spans.push(...parseInline(clean))
        if (i < lines.length - 1 && clean)
          spans.push({ _type:'span', _key:uid(), text:'\n', marks:[] })
      })
      blocks.push({ _type:'block', _key:uid(), style:'normal', markDefs:[],
        children: spans.filter(s => s.text) })
      continue
    }

    // Normale alinea
    const text = lines.map(l => l.trim()).join(' ').trim()
    if (text)
      blocks.push({ _type:'block', _key:uid(), style:'normal', markDefs:[],
        children: parseInline(text) })
  }

  return blocks
}

// ─── Migratie ─────────────────────────────────────────────────────
const postsDir = join(__dirname, '..', 'content', 'posts')
const files    = readdirSync(postsDir).filter(f => f.endsWith('.md'))

console.log(`\n🚀  ${files.length} posts migreren naar Sanity...\n`)

let ok = 0, skip = 0, fail = 0

for (const file of files) {
  const slug = file.replace(/\.md$/, '')

  // Al aanwezig?
  const exists = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]._id`, { slug })
  if (exists) {
    console.log(`⏭   ${slug}  (al aanwezig)`)
    skip++
    continue
  }

  const { data, content } = matter(readFileSync(join(postsDir, file), 'utf8'))

  const doc = {
    _type:    'post',
    _id:      `migrated-${slug}`,
    title:     data.title   ?? slug,
    slug:    { _type: 'slug', current: slug },
    date:      String(data.date ?? ''),
    excerpt:   data.excerpt  ?? '',
    category:  data.category ?? 'Verhalen',
    color:     data.color    ?? '#FAD5DA',
    emoji:     data.emoji    ?? '✍️',
    content:   markdownToBlocks(content),
  }

  try {
    await client.createOrReplace(doc)
    console.log(`✅  ${slug}`)
    ok++
  } catch (err) {
    console.error(`❌  ${slug}: ${err.message}`)
    fail++
  }
}

console.log(`
✨  Klaar!
   ${ok} geïmporteerd  |  ${skip} al aanwezig  |  ${fail} mislukt

Posts zijn nu bewerkbaar in de Studio:
👉  https://marie-boddaert.sanity.studio
`)
