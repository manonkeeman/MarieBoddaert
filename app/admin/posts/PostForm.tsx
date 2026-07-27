'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

const CATEGORIES = ['Verhalen', 'Gedichten', 'Kattenbellen']
const COLORS = [
  { label: '🌸 Roze',      value: '#FAD5DA' },
  { label: '🩵 Turquoise', value: '#BEE9E9' },
  { label: '💜 Lavendel',  value: '#E2D4F0' },
  { label: '🍑 Perzik',    value: '#FAE5CE' },
  { label: '🌿 Mint',      value: '#C8EAD8' },
  { label: '💙 Blauw',     value: '#C8D8F0' },
]

interface PostData {
  id?: string
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  color: string
  emoji: string
  content: string
  published: boolean
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function PostForm({ initial }: { initial?: PostData }) {
  const isEdit = Boolean(initial?.id)
  const router = useRouter()

  const [title,     setTitle]     = useState(initial?.title     ?? '')
  const [slug,      setSlug]      = useState(initial?.slug      ?? '')
  const [date,      setDate]      = useState(initial?.date      ?? new Date().toISOString().split('T')[0])
  const [excerpt,   setExcerpt]   = useState(initial?.excerpt   ?? '')
  const [category,  setCategory]  = useState(initial?.category  ?? 'Verhalen')
  const [color,     setColor]     = useState(initial?.color     ?? '#FAD5DA')
  const [emoji,     setEmoji]     = useState(initial?.emoji     ?? '✍️')
  const [content,   setContent]   = useState(initial?.content   ?? '')
  const [published, setPublished] = useState(initial?.published ?? true)
  const [slugManual, setSlugManual] = useState(isEdit)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!slugManual) setSlug(slugify(v))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !date) {
      setError('Titel, slug en datum zijn verplicht.')
      return
    }
    setSaving(true)
    setError('')

    const supabase = createClient()
    const payload = { title, slug, date, excerpt, category, color, emoji, content, published, updated_at: new Date().toISOString() }

    let err
    if (isEdit) {
      ;({ error: err } = await supabase.from('posts').update(payload).eq('id', initial!.id))
    } else {
      ;({ error: err } = await supabase.from('posts').insert({ ...payload, created_at: new Date().toISOString() }))
    }

    if (err) {
      setError(err.message.includes('unique') ? 'Deze slug bestaat al. Kies een andere.' : err.message)
      setSaving(false)
      return
    }

    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'post', slug, category, previousCategory: initial?.category }),
      })
    } catch {}

    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {/* Titel */}
      <label className="admin-label">
        Titel *
        <input
          type="text"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          className="admin-input"
          required
        />
      </label>

      {/* Slug */}
      <label className="admin-label">
        URL-slug *
        <div className="admin-slug-row">
          <span className="admin-slug-prefix">/blog/</span>
          <input
            type="text"
            value={slug}
            onChange={e => { setSlug(e.target.value); setSlugManual(true) }}
            className="admin-input admin-slug-input"
            required
          />
        </div>
      </label>

      {/* Datum + Categorie */}
      <div className="admin-row-2">
        <label className="admin-label">
          Datum *
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="admin-input"
            required
          />
        </label>
        <label className="admin-label">
          Categorie
          <select value={category} onChange={e => setCategory(e.target.value)} className="admin-input">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      {/* Kleur + Emoji */}
      <div className="admin-row-2">
        <label className="admin-label">
          Bannerkleur
          <div className="admin-color-row">
            {COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                className={`admin-color-swatch ${color === c.value ? 'active' : ''}`}
                style={{ backgroundColor: c.value }}
                onClick={() => setColor(c.value)}
              />
            ))}
          </div>
        </label>
        <label className="admin-label">
          Emoji
          <input
            type="text"
            value={emoji}
            onChange={e => setEmoji(e.target.value)}
            className="admin-input admin-emoji-input"
            maxLength={8}
          />
        </label>
      </div>

      {/* Samenvatting */}
      <label className="admin-label">
        Samenvatting (wordt getoond op de postkaart)
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          className="admin-input admin-textarea"
          rows={3}
          maxLength={500}
        />
      </label>

      {/* Inhoud */}
      <div className="admin-label">
        Tekst
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Schrijf hier Marie's tekst..."
        />
      </div>

      {/* Publiceren */}
      <label className="admin-checkbox-label">
        <input
          type="checkbox"
          checked={published}
          onChange={e => setPublished(e.target.checked)}
          className="admin-checkbox"
        />
        Gepubliceerd (zichtbaar op de website)
      </label>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn-primary" disabled={saving}>
          {saving ? 'Opslaan...' : isEdit ? 'Wijzigingen opslaan' : 'Post aanmaken'}
        </button>
        <a href="/admin/posts" className="admin-btn-ghost">Annuleren</a>
      </div>
    </form>
  )
}
