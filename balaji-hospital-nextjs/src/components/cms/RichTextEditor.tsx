'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link2,
  Unlink,
  Undo,
  Redo,
  Highlighter,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

const MenuButton = ({ 
  onClick, 
  active = false, 
  disabled = false, 
  children, 
  title 
}: { 
  onClick: () => void, 
  active?: boolean, 
  disabled?: boolean, 
  children: React.ReactNode,
  title: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "p-2 rounded transition-all",
      active 
        ? "bg-blue-100 text-blue-600 shadow-sm" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
      disabled && "opacity-30 cursor-not-allowed"
    )}
  >
    {children}
  </button>
)

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-medical-600 underline decoration-medical-200 underline-offset-4 font-bold cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'list'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter Hyperlink URL', previousUrl)
    
    // cancelled
    if (url === null) return

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="w-full border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all bg-white shadow-sm ring-1 ring-slate-100">
      {/* Toolbar */}
      <div className="px-2 py-1.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-0.5 items-center">
        <MenuButton 
          onClick={() => editor.chain().focus().undo().run()} 
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().redo().run()} 
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          active={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('left').run()} 
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('center').run()} 
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('right').run()} 
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
          active={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <MenuButton 
          onClick={setLink} 
          active={editor.isActive('link')}
          title="Add/Edit Hyperlink"
        >
          <Link2 className="w-4 h-4" />
        </MenuButton>
        {editor.isActive('link') && (
          <MenuButton 
            onClick={() => editor.chain().focus().unsetLink().run()} 
            title="Remove Hyperlink"
          >
            <Unlink className="w-4 h-4" />
          </MenuButton>
        )}

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <MenuButton 
          onClick={() => editor.chain().focus().toggleHighlight().run()} 
          active={editor.isActive('highlight')}
          title="Highlight Text"
        >
          <Highlighter className="w-4 h-4 text-amber-500" />
        </MenuButton>
      </div>

      {/* Editor Surface */}
      <div className="bg-white min-h-[200px] max-h-[450px] overflow-y-auto">
        <EditorContent 
          editor={editor} 
          className={cn(
            "prose prose-slate prose-sm max-w-none p-5 outline-none focus:outline-none min-h-[ inherit ]",
            "prose-headings:font-bold prose-headings:text-slate-900",
            "prose-p:leading-relaxed prose-p:text-slate-600",
            "prose-a:text-medical-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
            "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]"
          )} 
        />
      </div>
      
      {/* Footer Info */}
      <div className="px-3 py-1 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center shrink-0">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Type className="w-2.5 h-2.5" /> Rich Editor Active
        </span>
        <span className="text-[9px] text-slate-400 font-medium">
          Note: Justification support is enabled for paragraphs and lists.
        </span>
      </div>
    </div>
  )
}
