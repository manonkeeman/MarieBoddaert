'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PostCard from './PostCard'
import type { Post } from '@/lib/posts'

export default function SearchPage({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const q = query.trim().toLowerCase()
  const results = q
    ? posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.content.replace(/<[^>]+>/g, '').toLowerCase().includes(q)
      )
    : []

  return (
    <div className="container">
      <div className="search-page">
        <h1 className="search-heading">Zoeken</h1>
        <input
          autoFocus
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Zoek op woord, naam of thema..."
          className="search-page-input"
          aria-label="Zoeken"
        />
        {q && (
          <p className="search-count">
            {results.length === 0
              ? `Geen resultaten voor "${query}"`
              : `${results.length} resultaat${results.length !== 1 ? 'en' : ''} voor "${query}"`}
          </p>
        )}
        {results.length > 0 && (
          <div className="posts-grid">
            {results.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
        {!q && <p className="search-hint">Begin met typen om te zoeken in alle posts en verhalen.</p>}
      </div>
    </div>
  )
}
