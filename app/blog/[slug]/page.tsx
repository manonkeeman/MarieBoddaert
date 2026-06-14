import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { getReadingTime } from '@/lib/utils'
import ReactionBar from '@/components/ReactionBar'
import CommentForm from '@/components/CommentForm'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://marie-boddaert.netlify.app'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Marie H. Boddaert' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Marie H. Boddaert'],
      url: `${BASE}/blog/${post.slug}`,
      images: [{ url: `/blog/${post.slug}/opengraph-image`, width: 1200, height: 630 }],
    },
    alternates: { canonical: `${BASE}/blog/${post.slug}` },
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const minutes = getReadingTime(post.content)

  const articleSchema = {
    '@context':    'https://schema.org',
    '@type':       'BlogPosting',
    headline:       post.title,
    description:    post.excerpt,
    datePublished:  post.date,
    dateModified:   post.date,
    author:        { '@type': 'Person', name: 'Marie H. Boddaert', url: `${BASE}/over` },
    publisher:     { '@type': 'Person', name: 'Marie H. Boddaert' },
    url:           `${BASE}/blog/${post.slug}`,
    inLanguage:    'nl-NL',
    articleSection: post.category,
    timeRequired:  `PT${minutes}M`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="post-banner" style={{ backgroundColor: post.color }}>
        <div className="post-banner-inner">
          <p className="post-category">{post.category}</p>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-meta">
            <span>{formatDate(post.date)}</span>
            <span className="post-meta-dot">·</span>
            <span>{minutes} min lezen</span>
          </p>
        </div>
      </div>

      <div className="blog-post">
        <Link href="/" className="back-link">← Terug</Link>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        <hr className="post-divider" />
        <ReactionBar postTitle={post.title} postSlug={post.slug} />
        <CommentForm postTitle={post.title} postSlug={post.slug} />
      </div>
    </>
  )
}
