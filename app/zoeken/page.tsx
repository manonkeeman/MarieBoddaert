import { Suspense } from 'react'
import { getAllPosts } from '@/lib/posts'
import SearchPage from '@/components/SearchPage'
import type { Metadata } from 'next'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Zoeken — Marie H. Boddaert' }

export default async function Zoeken() {
  const posts = await getAllPosts()
  return (
    <Suspense>
      <SearchPage posts={posts} />
    </Suspense>
  )
}
