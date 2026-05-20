'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/zoeken?q=${encodeURIComponent(q)}` : '/zoeken')
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Zoeken..."
        className="search-input"
        aria-label="Zoeken"
      />
      <button type="submit" className="search-submit" aria-label="Zoeken">
        <FiSearch size={14} />
      </button>
    </form>
  )
}
