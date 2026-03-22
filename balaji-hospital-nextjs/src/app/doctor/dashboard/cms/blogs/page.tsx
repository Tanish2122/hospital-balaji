'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FileText, 
  Loader2,
  X,
  Calendar,
  User,
  ExternalLink,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  author: string
  category: string
  image: string | null
  featured_image_url: string | null
  excerpt: string
  is_published: boolean
  published_at: string
  created_at: string
}

export default function BlogsCMS() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setBlogs(data)
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const blogData = {
      ...currentBlog,
      slug: currentBlog?.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      author: currentBlog?.author || 'Balaji Hospital',
      is_published: true,
      published_at: new Date().toISOString(),
      featured_image_url: currentBlog?.image || null,
      excerpt: currentBlog?.excerpt || currentBlog?.content?.substring(0, 150) + '...'
    }

    let error
    if (currentBlog?.id) {
        ({ error } = await supabase.from('blogs').update(blogData).eq('id', currentBlog.id))
    } else {
        ({ error } = await supabase.from('blogs').insert([blogData]))
    }

    if (!error) {
      fetchBlogs()
      setIsModalOpen(false)
      setCurrentBlog(null)
    } else {
      console.error('Save error:', error)
      alert('Error saving article: ' + (error.message || 'Unknown error'))
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const { error } = await supabase.from('blogs').delete().eq('id', id)
      if (!error) fetchBlogs()
    }
  }

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Blog & Articles</h1>
          <p className="text-slate-500">Manage health tips and hospital updates.</p>
        </div>
        <button 
          onClick={() => { setCurrentBlog({}); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          CREATE NEW ARTICLE
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
             <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium tracking-tight">Loading articles...</p>
            </div>
        ) : filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 hover:border-blue-200 transition-all group">
            <div className="w-full md:w-48 h-32 bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <FileText className="w-10 h-10" />
                </div>
              )}
              <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-blue-600 uppercase">
                {blog.category || 'General'}
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{blog.title}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setCurrentBlog(blog); setIsModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a 
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {blog.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.created_at).toLocaleDateString()}</span>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed italic">
                 {blog.content.substring(0, 200)}...
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Advanced Editor would go here, using simple textarea for now */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase">
                {currentBlog?.id ? 'Modify Article' : 'Create New Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Article Title</label>
                    <input
                    type="text"
                    required
                    value={currentBlog?.title || ''}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="Enter catchy title..."
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
                    <input
                    type="text"
                    value={currentBlog?.category || ''}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="e.g. Health Tips"
                    />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Excerpt (Short Summary)</label>
                <textarea
                  rows={2}
                  value={currentBlog?.excerpt || ''}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                  placeholder="A brief summary for the blog list..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Content (Markdown supported)</label>
                <textarea
                  rows={8}
                  required
                  value={currentBlog?.content || ''}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                  placeholder="Share your expert knowledge..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Hero Image URL</label>
                <input
                  type="text"
                  value={currentBlog?.image || ''}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="https://example.com/blog-hero.jpg"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 mt-4 disabled:opacity-50"
              >
                {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <FileText className="w-5 h-5" />
                        PUBLISH ARTICLE
                    </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
