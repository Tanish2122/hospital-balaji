'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  X, 
  Loader2,
  Star,
  User,
  Quote
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  patient_name: string
  content: string
  rating: number
  is_approved: boolean
  created_at: string
}

export default function TestimonialsCMS() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  const toggleApproval = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: !current })
      .eq('id', id)
    
    if (!error) {
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, is_approved: !current } : t
      ))
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial permanently?')) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      if (!error) fetchTestimonials()
    }
  }

  const filtered = testimonials.filter(t => {
    if (filter === 'pending') return !t.is_approved
    if (filter === 'approved') return t.is_approved
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Patient Testimonials</h1>
          <p className="text-slate-500">Moderate and approve patient feedback for the website.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                filter === f ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium tracking-tight">Loading testimonials...</p>
            </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 italic uppercase font-bold tracking-widest">No testimonials found.</p>
          </div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-blue-100 transition-all group">
              <Quote className="absolute top-4 right-4 w-20 h-20 text-slate-50 opacity-[0.03] -rotate-12 pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200")} />
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed italic text-lg tracking-tight font-medium">
                  "{t.content}"
                </p>
                
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <User className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 uppercase tracking-tight">{t.patient_name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString()}</p>
                   </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   {t.is_approved ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-green-100">
                         <CheckCircle className="w-3.5 h-3.5" /> Approved
                      </span>
                   ) : (
                      <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-yellow-100 text-amber-500">
                         Pending
                      </span>
                   )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleApproval(t.id, t.is_approved)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      t.is_approved ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                    )}
                  >
                    {t.is_approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Permanently"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
