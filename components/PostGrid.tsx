import PostCard from './PostCard'
import type { Post } from '@/lib/posts'

export default function PostGrid({ posts, empty = 'Nog geen posts in deze categorie.' }: {
  posts: Post[]
  empty?: string
}) {
  if (posts.length === 0) {
    return <p className="no-posts">{empty}</p>
  }
  return (
    <div className="posts-grid">
      {posts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
