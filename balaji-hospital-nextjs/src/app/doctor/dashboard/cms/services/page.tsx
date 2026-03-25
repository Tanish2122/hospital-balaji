'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LayoutGrid, 
  List, 
  Loader2,
  Stethoscope,
  ChevronRight,
  X,
  Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  image: string | null
  created_at: string
}

export default function ServicesCMS() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('departments')
      .select('*')
      .order('name')
    if (data) setServices(data)
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const serviceData = {
      ...currentService,
      slug: currentService?.name?.toLowerCase().replace(/\s+/g, '-')
    }

    let error
    if (currentService?.id) {
        ({ error } = await supabase.from('departments').update(serviceData).eq('id', currentService.id))
    } else {
        ({ error } = await supabase.from('departments').insert([serviceData]))
    }

    if (!error) {
      fetchServices()
      setIsModalOpen(false)
      setCurrentService(null)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const { error } = await supabase.from('departments').delete().eq('id', id)
      if (!error) fetchServices()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`
      const filePath = `service-assets/${fileName}`

      const { error } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      setCurrentService(prev => ({ ...prev, image: publicUrl }))
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hospital Services & Departments</h1>
          <p className="text-slate-500">Manage the services displayed on your website.</p>
        </div>
        <button 
          onClick={() => { setCurrentService({}); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          ADD NEW SERVICE
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium">Loading hospital services...</p>
            </div>
        ) : filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
            <div className="aspect-video bg-slate-100 relative group-hover:scale-105 transition-transform duration-500">
              {service.image ? (
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6">
                <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">{service.name}</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {service.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setCurrentService(service); setIsModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                    {service.slug}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase">
                {currentService?.id ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={currentService?.name || ''}
                  onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="e.g. Cardiology"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
                <textarea
                  rows={4}
                  value={currentService?.description || ''}
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                  placeholder="Describe the service..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Service Image</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentService?.image || ''}
                      onChange={(e) => setCurrentService({ ...currentService, image: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="service-file-upload"
                    />
                    <label 
                      htmlFor="service-file-upload"
                      className={cn(
                        "flex flex-col items-center justify-center w-12 h-10 bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:bg-blue-100 transition-all border border-dashed border-blue-200",
                        uploading && "opacity-50 animate-pulse"
                      )}
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span className="text-[8px] font-bold mt-0.5">LOAD</span>
                    </label>
                  </div>
                </div>
                {currentService?.image && (
                  <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-slate-100">
                    <img src={currentService.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
                        <Stethoscope className="w-5 h-5" />
                        SAVE SERVICE DETAILS
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
