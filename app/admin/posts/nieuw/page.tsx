import type { Metadata } from 'next'
import PostForm from '../PostForm'

export const metadata: Metadata = { title: 'Nieuwe post' }

export default function NieuwePost() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Nieuwe post</h1>
      </div>
      <PostForm />
    </div>
  )
}
