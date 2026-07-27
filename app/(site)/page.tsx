import { getAllPosts } from '@/lib/posts'
import PostGrid from '@/components/PostGrid'
import HeroSlider from '@/components/HeroSlider'
import NewsletterBanner from '@/components/NewsletterBanner'

export const revalidate = 3600

export default async function Home() {
  const posts = await getAllPosts()
  return (
    <>
      <HeroSlider />
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Recente posts</h2>
          <span className="section-count">{posts.length} posts</span>
        </div>
        <PostGrid posts={posts} />
      </div>
      <NewsletterBanner />
    </>
  )
}
