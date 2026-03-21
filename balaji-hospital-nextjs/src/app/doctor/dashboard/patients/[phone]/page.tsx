'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  ChevronLeft, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  ExternalLink,
  Loader2,
  Stethoscope,
  Activity,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Booking {
  id: string
  type: 'appointment' | 'emergency'
  date: string
  time?: string
  status: string
  doctor_name?: string
  description?: string
  report_url?: string
}

interface PatientProfile {
  name: string
  phone: string
  email: string | null
  created_at: string
}

export default function PatientDetailPage() {
  const { phone } = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<PatientProfile | null>(null)
  const [history, setHistory] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (phone) {
      fetchPatientData()
    }
  }, [phone])

  const fetchPatientData = async () => {
    setLoading(true)
    
    // Fetch profile
    const { data: profile } = await supabase
      .from('patient_profiles')
      .select('*')
      .eq('phone', phone)
      .single()
    
    if (profile) setPatient(profile)

    // Fetch Appointments
    const { data: apps } = await supabase
      .from('appointments')
      .select('*, doctors(name)')
      .eq('phone', phone)

    // Fetch Emergencies
    const { data: ems } = await supabase
      .from('emergencies')
      .select('*')
      .eq('phone', phone)

    const combined: Booking[] = [
      ...(apps || []).map(a => ({
        id: a.id,
        type: 'appointment' as const,
        date: a.appointment_date,
        time: a.appointment_time,
        status: a.status,
        doctor_name: a.doctors?.name,
        description: a.reason
      })),
      ...(ems || []).map(e => ({
        id: e.id,
        type: 'emergency' as const,
        date: e.created_at.split('T')[0],
        status: e.status,
        description: e.description,
        report_url: e.report_url
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setHistory(combined)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">Loading patient history...</p>
      </div>
    )
  }

  if (!patient && !loading) {
     return (
        <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Patient not found</h2>
            <button onClick={() => router.back()} className="mt-4 text-blue-600 font-bold hover:underline">Go Back</button>
        </div>
     )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        BACK TO PATIENTS
      </button>

      {/* Profile Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16" />
        
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-200 shrink-0">
          {patient?.name.charAt(0)}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-1">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{patient?.name}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <span className="flex items-center gap-2 text-slate-500 font-medium">
              <Phone className="w-4 h-4" /> {patient?.phone}
            </span>
            <span className="flex items-center gap-2 text-slate-500 font-medium">
              <Calendar className="w-4 h-4" /> Joined {new Date(patient!.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 tracking-tight uppercase">
          <Activity className="w-6 h-6 text-blue-600" />
          Medical History Timeline
        </h2>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
              <p className="text-slate-400 italic">No medical records found for this patient.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={item.id} className="relative pl-8 pb-8 group last:pb-0">
                {/* Timeline Line */}
                {idx !== history.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-100 group-hover:bg-blue-100 transition-colors" />
                )}
                
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 transition-transform group-hover:scale-110",
                  item.type === 'emergency' ? "bg-red-500" : "bg-blue-500"
                )} />

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group-hover:border-blue-100 group-hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        item.type === 'emergency' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {item.type}
                      </span>
                      <span className="text-sm font-bold text-slate-400">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase border",
                      item.status === 'completed' || item.status === 'confirmed' ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50 text-slate-500 border-slate-200"
                    )}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {item.doctor_name && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Stethoscope className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold">Dr. {item.doctor_name}</span>
                      </div>
                    )}
                    
                    {item.description && (
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                        "{item.description}"
                      </p>
                    )}

                    {item.report_url && (
                      <a 
                        href={item.report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors mt-2"
                      >
                        <FileText className="w-4 h-4" />
                        VIEW MEDICAL REPORT
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
