import { getAllPosts } from '@/lib/posts'
import PostGrid from '@/components/PostGrid'
import type { Metadata } from 'next'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Kattenbellen — Marie H. Boddaert' }

export default async function Kattenbellen() {
  const posts = (await getAllPosts()).filter(p => p.category === 'Kattenbellen')
  return (
    <>
      <div className="post-banner" style={{ backgroundColor: '#E2D4F0' }}>
        <div className="post-banner-inner">
          <p className="post-category">Categorie</p>
          <h1 className="post-title">Kattenbellen</h1>
          <p className="post-date">Korte overdenkingen, losse gedachten, gevatte notities.</p>
        </div>
      </div>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Alle kattenbellen</h2>
          <span className="section-count">{posts.length} posts</span>
        </div>
        <PostGrid posts={posts} />
      </div>
    </>
  )
}
