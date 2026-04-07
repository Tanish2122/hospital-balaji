'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  Stethoscope,
  X,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Activity,
  LayoutGrid,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  image: string | null
  category: string | null
  is_active: boolean
  created_at: string
}

type CategoryFilter = 'all' | 'orthopedic' | 'ent' | 'speciality'

const CATEGORY_HUBS = [
  {
    key: 'orthopedic' as CategoryFilter,
    label: 'Orthopedic',
    icon: '🦴',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    iconBg: 'bg-amber-100',
    badgeColor: 'bg-amber-100 text-amber-700',
    activeRing: 'ring-2 ring-amber-400',
  },
  {
    key: 'ent' as CategoryFilter,
    label: 'ENT',
    icon: '👂',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconBg: 'bg-blue-100',
    badgeColor: 'bg-blue-100 text-blue-700',
    activeRing: 'ring-2 ring-blue-400',
  },
  {
    key: 'speciality' as CategoryFilter,
    label: 'Speciality',
    icon: '🔬',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    iconBg: 'bg-purple-100',
    badgeColor: 'bg-purple-100 text-purple-700',
    activeRing: 'ring-2 ring-purple-400',
  },
]

function getCategoryStyle(category: string | null) {
  const cat = (category || '').toLowerCase()
  const hub = CATEGORY_HUBS.find(h => h.key === cat)
  if (hub) return hub
  return {
    key: 'other',
    label: category || 'General',
    icon: '🏥',
    color: 'bg-slate-50 border-slate-200 text-slate-700',
    iconBg: 'bg-slate-100',
    badgeColor: 'bg-slate-100 text-slate-600',
    activeRing: 'ring-2 ring-slate-400',
  }
}

export default function ServicesCMS() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

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
      slug: currentService?.name?.toLowerCase().replace(/\s+/g, '-'),
      is_active: currentService?.is_active ?? true,
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

  const handleToggleActive = async (service: Service) => {
    setTogglingId(service.id)
    const { error } = await supabase
      .from('departments')
      .update({ is_active: !service.is_active })
      .eq('id', service.id)
    if (!error) {
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s))
    }
    setTogglingId(null)
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

  // Category counts
  const categoryCounts = CATEGORY_HUBS.reduce((acc, hub) => {
    acc[hub.key] = services.filter(s => (s.category || '').toLowerCase() === hub.key).length
    return acc
  }, {} as Record<string, number>)

  const filteredServices = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = categoryFilter === 'all' || (s.category || '').toLowerCase() === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hospital Services & Departments</h1>
          <p className="text-slate-500">Manage the services displayed on your website.</p>
        </div>
        <button 
          onClick={() => { setCurrentService({ is_active: true }); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          ADD NEW SERVICE
        </button>
      </div>

      {/* Category Hub Cards — mirrors the website's Browse by Department section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORY_HUBS.map(hub => (
          <button
            key={hub.key}
            onClick={() => setCategoryFilter(categoryFilter === hub.key ? 'all' : hub.key)}
            className={cn(
              'group p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg flex items-center gap-4',
              hub.color,
              categoryFilter === hub.key && hub.activeRing
            )}
          >
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0', hub.iconBg)}>
              {hub.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-0.5">{hub.label}</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{categoryCounts[hub.key] ?? 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">departments</p>
            </div>
            <ChevronRight className={cn('w-5 h-5 shrink-0 transition-colors', categoryFilter === hub.key ? 'text-slate-700' : 'text-slate-300 group-hover:text-slate-500')} />
          </button>
        ))}
      </div>

      {/* Search + Filter row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', ...CATEGORY_HUBS.map(h => h.key)] as CategoryFilter[]).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border',
                categoryFilter === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300'
              )}
            >
              {cat === 'all' ? `All (${services.length})` : `${cat} (${categoryCounts[cat] ?? 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading hospital services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
            <LayoutGrid className="w-12 h-12 mb-4 opacity-40" />
            <p className="font-semibold text-lg">No services found</p>
            <p className="text-sm mt-1">Try a different filter or add a new service.</p>
          </div>
        ) : filteredServices.map((service) => {
          const catStyle = getCategoryStyle(service.category)
          return (
            <div key={service.id} className={cn(
              'bg-white rounded-3xl border shadow-sm overflow-hidden group transition-all',
              service.is_active
                ? 'border-slate-100 hover:border-blue-200 hover:shadow-md'
                : 'border-dashed border-slate-200 opacity-60'
            )}>
              {/* Image / thumbnail */}
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {service.image ? (
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                  </div>
                )}
                {/* Gradient overlay + name */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent flex items-end p-5">
                  <h3 className="text-white font-bold text-base leading-tight uppercase tracking-tight">{service.name}</h3>
                </div>
                {/* Active badge top-right */}
                <div className={cn(
                  'absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full',
                  service.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                )}>
                  {service.is_active ? 'Live' : 'Hidden'}
                </div>
              </div>

              <div className="p-5 space-y-3">
                {/* Category badge */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{catStyle.icon}</span>
                  <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full', catStyle.badgeColor)}>
                    {catStyle.label}
                  </span>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {service.description || 'No description provided.'}
                </p>

                {/* Actions row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setCurrentService(service); setIsModalOpen(true); }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(service)}
                      disabled={togglingId === service.id}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        service.is_active
                          ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                      )}
                      title={service.is_active ? 'Hide from website' : 'Show on website'}
                    >
                      {togglingId === service.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : service.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />
                      }
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
          )
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase">
                {currentService?.id ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={currentService?.name || ''}
                  onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="e.g. Knee Replacement"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category *</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_HUBS.map(hub => (
                    <button
                      key={hub.key}
                      type="button"
                      onClick={() => setCurrentService({ ...currentService, category: hub.key })}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all',
                        (currentService?.category || '').toLowerCase() === hub.key
                          ? `${hub.color} ${hub.activeRing}`
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      )}
                    >
                      <span>{hub.icon}</span>
                      <span>{hub.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
                <textarea
                  rows={3}
                  value={currentService?.description || ''}
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                  placeholder="Describe the service..."
                />
              </div>

              {/* Image */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Service Image</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentService?.image || ''}
                      onChange={(e) => setCurrentService({ ...currentService, image: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="shrink-0">
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
                        'flex flex-col items-center justify-center w-12 h-10 bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:bg-blue-100 transition-all border border-dashed border-blue-200',
                        uploading && 'opacity-50 animate-pulse'
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

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-700">Show on Website</p>
                  <p className="text-xs text-slate-400 mt-0.5">When disabled, this service is hidden from the departments page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentService({ ...currentService, is_active: !currentService?.is_active })}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors shrink-0 ml-4',
                    (currentService?.is_active ?? true) ? 'bg-emerald-500' : 'bg-slate-300'
                  )}
                >
                  <span className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
                    (currentService?.is_active ?? true) ? 'left-7' : 'left-1'
                  )} />
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
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
