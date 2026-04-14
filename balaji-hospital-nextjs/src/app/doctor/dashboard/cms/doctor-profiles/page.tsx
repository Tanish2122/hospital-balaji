'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Search, 
  User, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  ArrowRight,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Doctor {
  id: string
  name: string
  designation: string
  image_url: string
  specialization: string
  status: string
  bio: string
  qualification: string
  on_leave?: boolean
}

export default function DoctorProfilesCMS() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('doctors')
      .select('id, name, designation, image_url, specialization, status, bio, qualification')
      .order('name', { ascending: true })
    if (data) setDoctors(data)
    setLoading(false)
  }

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) || 
    doc.designation?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase font-poppins">Doctor Profiles</h1>
          <p className="text-slate-500 text-sm italic">Manage public-facing information for your medical team.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search doctors by name or department..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-slate-400 italic">Loading profile data...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 italic">No doctors found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const isComplete = doc.bio && doc.qualification && doc.image_url
            return (
              <div key={doc.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-100 group transition-all flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 overflow-hidden flex-shrink-0 border border-slate-50">
                    {doc.image_url ? (
                      <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-xl uppercase">
                        {doc.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 truncate mb-0.5">{doc.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{doc.designation || 'Specialist'}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6 flex-1">
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                        )}
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Profile Status</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                        isComplete ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {isComplete ? 'Complete' : 'Needs Review'}
                      </span>
                   </div>

                   <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-slate-100 rounded-lg">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Quals</p>
                        <p className="text-[10px] font-bold text-slate-700 truncate">{doc.qualification || 'Missing'}</p>
                      </div>
                      <div className="p-2 border border-slate-100 rounded-lg">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Bio</p>
                        <p className="text-[10px] font-bold text-slate-700 truncate">{doc.bio ? 'Filled' : 'Empty'}</p>
                      </div>
                   </div>
                </div>

                <Link 
                  href={`/doctor/dashboard/cms/doctor-profiles/${doc.id}`}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                >
                  Manage Profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
