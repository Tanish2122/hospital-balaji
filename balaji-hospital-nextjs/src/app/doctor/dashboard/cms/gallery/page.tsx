'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Loader2,
  X,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  LayoutGrid,
  Zap,
  Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryItem {
  id: string
  url: string
  title: string
  description: string
  category: string
  type: 'facility' | 'xray' | 'news'
  is_active: boolean
  created_at: string
}

const TYPES = [
  { id: 'facility', label: 'Our Facilities', icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'xray', label: 'Patient X-Rays', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'news', label: 'News & Updates', icon: Filter, color: 'text-red-600', bg: 'bg-red-50' }
]

const XRAY_CATEGORIES = ['Shoulder', 'Wrist', 'Elbow', 'Knee', 'Spine', 'Ankle', 'Other']
const FACILITY_CATEGORIES = ['Hospital View', 'Operation Theatre', 'Patient Room', 'Equipment', 'Corridor', 'Other']

export default function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const galleryData = {
      ...currentItem,
      alt_text: currentItem?.alt_text || currentItem?.title || 'Hospital Gallery Image'
    }

    let error
    if (currentItem?.id) {
        ({ error } = await supabase.from('gallery').update(galleryData).eq('id', currentItem.id))
    } else {
        ({ error } = await supabase.from('gallery').insert([galleryData]))
    }

    if (!error) {
      fetchGallery()
      setIsModalOpen(false)
      setCurrentItem(null)
    } else {
        alert('Error saving item: ' + error.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this item from the gallery?')) {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (!error) fetchGallery()
    }
  }

  const toggleStatus = async (item: GalleryItem) => {
    const { error } = await supabase
        .from('gallery')
        .update({ is_active: !item.is_active })
        .eq('id', item.id)
    if (!error) fetchGallery()
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || item.type === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 lowercase">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <ImageIcon className="w-6 h-6" />
            </div>
            Gallery <span className="text-blue-600 font-medium">Management</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Organize facilities, x-rays, and news updates.</p>
        </div>
        <button 
          onClick={() => { setCurrentItem({ type: 'facility', is_active: true }); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          ADD NEW ITEM
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm grow overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setActiveTab('all')}
                className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                    activeTab === 'all' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                )}
            >
                All Assets
            </button>
            {TYPES.map(type => (
                <button 
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                    activeTab === type.id ? `${type.bg} ${type.color}` : "text-slate-500 hover:bg-slate-50"
                )}
            >
                <type.icon className="w-4 h-4" />
                {type.label}
            </button>
            ))}
        </div>
        
        <div className="relative md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-medium text-sm"
          />
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
             <div className="col-span-full py-32 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching Visual Data...</p>
            </div>
        ) : filteredItems.map((item) => (
          <div key={item.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-blue-50/50 flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-slate-100">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                 <span className={cn(
                     "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm",
                     item.type === 'facility' ? "bg-blue-600/90 text-white" : 
                     item.type === 'xray' ? "bg-amber-400/90 text-slate-900" : "bg-red-500/90 text-white"
                 )}>
                     {item.type}
                 </span>
              </div>
              <button 
                 onClick={() => toggleStatus(item)}
                 className={cn(
                    "absolute bottom-4 right-4 p-2 rounded-xl transition-all",
                    item.is_active ? "bg-green-500 text-white" : "bg-slate-400 text-white"
                 )}
                 title={item.is_active ? 'Active' : 'Hidden'}
              >
                  <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Tag className="w-3 h-3" />
                  {item.category || 'General'}
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight line-clamp-1">{item.title || 'Untitled Item'}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description || 'No description provided.'}
              </p>
              
              <div className="pt-4 flex gap-2">
                <button 
                  onClick={() => { setCurrentItem(item); setIsModalOpen(true); }}
                  className="flex-1 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" /> EDIT
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && filteredItems.length === 0 && (
            <div className="col-span-full py-32 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 italic">
                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="tracking-tight">No assets found for your search.</p>
            </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                {currentItem?.id ? 'Modify Asset' : 'Add New Asset'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        {TYPES.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setCurrentItem({ ...currentItem, type: t.id as any, category: '' })}
                                className={cn(
                                    "py-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all",
                                    currentItem?.type === t.id 
                                        ? "bg-blue-50 border-blue-600 text-blue-600" 
                                        : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"
                                )}
                            >
                                <t.icon className="w-5 h-5" />
                                <span className="text-[10px] font-bold">{t.id}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    {currentItem?.type === 'xray' ? (
                        <select
                            value={currentItem?.category || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none"
                            required
                        >
                            <option value="">Select Part...</option>
                            {XRAY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    ) : currentItem?.type === 'facility' ? (
                        <select
                            value={currentItem?.category || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none"
                            required
                        >
                            <option value="">Select Type...</option>
                            {FACILITY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={currentItem?.category || ''}
                            placeholder="e.g. Event, Update"
                            onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                        />
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input
                  type="text"
                  required
                  value={currentItem?.title || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  placeholder="Enter a descriptive title..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                <div className="relative">
                    <input
                    type="text"
                    required
                    value={currentItem?.url || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, url: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold pr-12"
                    placeholder="https://example.com/image.jpg"
                    />
                    <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={currentItem?.description || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold resize-none"
                  placeholder="Provide more context for this gallery item..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 mt-4 disabled:opacity-50"
              >
                {saving ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        <CheckCircle2 className="w-5 h-5" />
                        {currentItem?.id ? 'UPDATE ASSET' : 'PUBLISH TO GALLERY'}
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
