'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

interface AboutData {
  tagline:   string
  bio:       string
  services:  string[]
  slogan:    string
  instagram: string
  linkedin:  string
  blogger:   string
  substack:  string
  photo_url: string | null
}

export default function OverMijForm({ initial }: { initial?: AboutData | null }) {
  const [tagline,   setTagline]   = useState(initial?.tagline   ?? 'Marie H. Boddaert schrijft.')
  const [bio,       setBio]       = useState(initial?.bio       ?? '')
  const [services,  setServices]  = useState((initial?.services ?? ['Blogs', 'Gedichten', 'Kattenbellen']).join('\n'))
  const [slogan,    setSlogan]    = useState(initial?.slogan    ?? 'Gelukkig kan ze nog wel schrijven.')
  const [instagram, setInstagram] = useState(initial?.instagram ?? '')
  const [linkedin,  setLinkedin]  = useState(initial?.linkedin  ?? '')
  const [blogger,   setBlogger]   = useState(initial?.blogger   ?? '')
  const [substack,  setSubstack]  = useState(initial?.substack  || '')
  const [photoUrl,  setPhotoUrl]  = useState(initial?.photo_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')

    const supabase = createClient()
    const ext  = file.name.split('.').pop()
    const path = `about/marie-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('marie-images')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Foto uploaden mislukt: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('marie-images').getPublicUrl(path)
    setPhotoUrl(publicUrl)
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('about').upsert({
      id:        'about-page',
      tagline,
      bio,
      services:  services.split('\n').map(s => s.trim()).filter(Boolean),
      slogan,
      instagram,
      linkedin,
      blogger,
      substack,
      photo_url: photoUrl || null,
      updated_at: new Date().toISOString(),
    })

    if (err) {
      setError(err.message)
    } else {
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scope: 'about' }),
        })
      } catch {}
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">

      {/* Tagline */}
      <label className="admin-label">
        Tagline (grote banner tekst)
        <input
          type="text"
          value={tagline}
          onChange={e => setTagline(e.target.value)}
          className="admin-input"
        />
      </label>

      {/* Foto */}
      <div className="admin-label">
        Profielfoto
        <div className="admin-photo-row">
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Huidige foto" className="admin-photo-preview" />
          )}
          <div className="admin-photo-actions">
            <button
              type="button"
              className="admin-btn-ghost"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploaden...' : 'Foto kiezen'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            {photoUrl && (
              <button type="button" className="admin-btn-danger" onClick={() => setPhotoUrl('')}>
                Foto verwijderen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Biografie */}
      <div className="admin-label">
        Biografie (over mij tekst)
        <RichTextEditor
          content={bio}
          onChange={setBio}
          placeholder="Vertel hier iets over Marie..."
        />
      </div>

      {/* Slogan */}
      <label className="admin-label">
        Slogan (onderaan de tekst)
        <input
          type="text"
          value={slogan}
          onChange={e => setSlogan(e.target.value)}
          className="admin-input"
        />
      </label>

      {/* Services */}
      <label className="admin-label">
        Schrijfstijlen (één per regel)
        <textarea
          value={services}
          onChange={e => setServices(e.target.value)}
          className="admin-input admin-textarea"
          rows={5}
          placeholder="Blogs&#10;Gedichten&#10;Kattenbellen"
        />
      </label>

      {/* Sociale links */}
      <fieldset className="admin-fieldset">
        <legend className="admin-legend">Sociale links</legend>
        <div className="admin-row-2">
          <label className="admin-label">
            Instagram
            <input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} className="admin-input" placeholder="https://instagram.com/..." />
          </label>
          <label className="admin-label">
            LinkedIn
            <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="admin-input" placeholder="https://linkedin.com/in/..." />
          </label>
          <label className="admin-label">
            Blogger
            <input type="url" value={blogger} onChange={e => setBlogger(e.target.value)} className="admin-input" placeholder="https://...blogspot.com" />
          </label>
          <label className="admin-label">
            Substack
            <input type="url" value={substack} onChange={e => setSubstack(e.target.value)} className="admin-input" placeholder="https://substack.com/..." />
          </label>
        </div>
      </fieldset>

      {error && <p className="admin-error">{error}</p>}
      {saved && <p className="admin-success">✓ Opgeslagen!</p>}

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn-primary" disabled={saving || uploading}>
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
      </div>
    </form>
  )
}
