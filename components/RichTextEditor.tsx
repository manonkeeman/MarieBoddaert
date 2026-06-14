'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface Props {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? 'Schrijf hier...' }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  })

  // Sync external content changes (bijv. bij laden bestaande post)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null

  return (
    <div className="rte-wrapper">
      <div className="rte-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'rte-btn active' : 'rte-btn'} title="Vet">
          <b>V</b>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'rte-btn active' : 'rte-btn'} title="Cursief">
          <i>I</i>
        </button>
        <span className="rte-divider" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'rte-btn active' : 'rte-btn'} title="Koptekst">
          H2
        </button>
        <span className="rte-divider" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'rte-btn active' : 'rte-btn'} title="Opsomming">
          ≡
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'rte-btn active' : 'rte-btn'} title="Genummerd">
          1.
        </button>
        <span className="rte-divider" />
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'rte-btn active' : 'rte-btn'} title="Citaat">
          "
        </button>
        <span className="rte-divider" />
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rte-btn" title="Horizontale lijn">
          —
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()}
          className="rte-btn" title="Ongedaan maken">
          ↩
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}
          className="rte-btn" title="Opnieuw">
          ↪
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
