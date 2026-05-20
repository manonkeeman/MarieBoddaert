import { Suspense } from 'react'
import { getAllPosts } from '@/lib/posts'
import SearchPage from '@/components/SearchPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Zoeken — Marie H. Boddaert' }

export default function Zoeken() {
  const posts = getAllPosts()
  return (
    <Suspense>
      <SearchPage posts={posts} />
    </Suspense>
  )
}
