'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ChevronRight,
  Filter,
  Loader2,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Patient {
  id: string
  name: string
  phone: string
  email: string | null
  total_appointments: number
  created_at: string
}

export default function PatientsDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'appointments' | 'newest'>('newest')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('patient_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setPatients(data)
    }
    setLoading(false)
  }

  const filteredPatients = patients
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'appointments') return b.total_appointments - a.total_appointments
      return 0 // default handles newest
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Patient Management</h1>
          <p className="text-slate-500">View and manage patient history and records.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="name">A-Z Name</option>
            <option value="appointments">Most Appointments</option>
          </select>
        </div>
      </div>

      {/* Patients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Fetching patient records...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <User className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 italic">No patients found.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Link 
              key={patient.id}
              href={`/doctor/dashboard/patients/${patient.phone}`}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                  {patient.name.charAt(0)}
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                  {patient.total_appointments} Appointments
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {patient.name}
                </h3>
                <div className="space-y-1.5 pt-2">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {patient.phone}
                  </p>
                  {patient.email && (
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {patient.email}
                    </p>
                  )}
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Joined {new Date(patient.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between text-blue-600 font-bold text-xs">
                <span>VIEW HISTORY</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
