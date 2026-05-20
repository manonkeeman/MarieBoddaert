import { getAllPosts } from '@/lib/posts'
import PostGrid from '@/components/PostGrid'
import type { Metadata } from 'next'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Gedichten — Marie H. Boddaert' }

export default async function Gedichten() {
  const posts = (await getAllPosts()).filter(p => p.category === 'Gedichten')
  return (
    <>
      <div className="post-banner" style={{ backgroundColor: '#C8EAD8' }}>
        <div className="post-banner-inner">
          <p className="post-category">Categorie</p>
          <h1 className="post-title">Gedichten</h1>
        </div>
      </div>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Alle gedichten</h2>
          <span className="section-count">{posts.length} posts</span>
        </div>
        <PostGrid posts={posts} />
      </div>
    </>
  )
}
