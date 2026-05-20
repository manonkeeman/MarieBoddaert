import Link from 'next/link'
import type { Post } from '@/lib/posts'
import { getReadingTime } from '@/lib/utils'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PostCard({ post }: { post: Post }) {
  const minutes = getReadingTime(post.content, post.portableContent)
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="post-card" style={{ '--c': post.color } as React.CSSProperties}>
        <div className="post-card-image" style={{ backgroundColor: post.color }} />
        <div className="post-card-body">
          <span className="post-card-category">{post.category}</span>
          <h2 className="post-card-title">{post.title}</h2>
          <p className="post-card-excerpt">{post.excerpt}</p>
          <div className="post-card-footer">
            <span>{formatDate(post.date)}</span>
            <span className="post-card-dot">·</span>
            <span>{minutes} min lezen</span>
            <span className="post-card-link">Lees meer →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
