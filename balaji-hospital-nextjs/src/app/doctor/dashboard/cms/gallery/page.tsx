'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Loader2,
  X,
  PlusCircle,
  Link as LinkIcon,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryItem {
  id: string
  url: string
  category: string
  created_at: string
}

export default function GalleryCMS() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({ url: '', category: 'Hospital' })
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    setLoading(true)
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('gallery').insert([newItem])
    if (!error) {
      fetchGallery()
      setIsModalOpen(false)
      setNewItem({ url: '', category: 'Hospital' })
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this image?')) {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (!error) fetchGallery()
    }
  }

  const categories = ['All', 'Hospital', 'Facilities', 'Equipment', 'Team', 'Events']
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Website Gallery</h1>
          <p className="text-slate-500">Manage the photos displayed on your website.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <PlusCircle className="w-5 h-5" />
          UPLOAD PHOTO
        </button>
      </div>

      <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-fit overflow-x-auto max-w-full">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap",
              filter === c ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium">Fetching gallery...</p>
            </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
             <ImageIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-500 italic">No images in this category.</p>
          </div>
        ) : filtered.map((item) => (
          <div key={item.id} className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden aspect-square">
            <img src={item.url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
              <div className="flex justify-end">
                 <button 
                   onClick={() => handleDelete(item.id)}
                   className="p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600"
                 >
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-lg w-fit">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Upload New Photo</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Image URL</label>
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                    type="text"
                    required
                    value={newItem.url}
                    onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="https://example.com/photo.jpg"
                    />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none"
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="pt-2">
                 {newItem.url && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-100 mb-4">
                       <img src={newItem.url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                 )}
                 <button
                    type="submit"
                    disabled={saving || !newItem.url}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                    PUBLISH TO GALLERY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
