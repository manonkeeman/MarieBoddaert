import { notFound } from 'next/navigation'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import PostForm from '../PostForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Post bewerken' }

export default async function EditPost({ params }: { params: { slug: string } }) {
  const supabase = createSupabaseAdminClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!post) notFound()

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Post bewerken</h1>
        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn-ghost">
          Bekijk op site ↗
        </a>
      </div>
      <PostForm initial={post} />
    </div>
  )
}
