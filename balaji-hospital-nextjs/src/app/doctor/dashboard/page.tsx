'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Appointment {
  id: string
  patient_name: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  type: string
}

interface Stats {
  total: number
  today: number
  upcoming: number
  cancelled: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0, upcoming: 0, cancelled: 0 })
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [doctorName, setDoctorName] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get doctor ID
      const { data: doctor } = await supabase
        .from('doctors')
        .select('id, name')
        .eq('auth_id', user.id)
        .single()

      if (!doctor) return
      
      // Fix potential "Dr. Dr." issue
      let name = doctor.name
      if (name.toLowerCase().startsWith('dr.')) {
        name = name.substring(3).trim()
      } else if (name.toLowerCase().startsWith('dr')) {
        name = name.substring(2).trim()
      }
      
      setDoctorName(name)

      // Fetch appointments counts
      const today = new Date().toISOString().split('T')[0]
      
      const { count: total } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctor.id)

      const { count: todayCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctor.id)
        .eq('appointment_date', today)

      const { count: upcoming } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctor.id)
        .gte('appointment_date', today)
        .neq('status', 'cancelled')
        .neq('status', 'completed')

      const { count: cancelled } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctor.id)
        .eq('status', 'cancelled')

      setStats({
        total: total || 0,
        today: todayCount || 0,
        upcoming: upcoming || 0,
        cancelled: cancelled || 0
      })

      // Fetch 5 recent appointments
      const { data: recent } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctor.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (recent) setAppointments(recent)

      setLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    { 
      label: 'Total Appointments', 
      value: stats.total, 
      icon: Users, 
      color: 'bg-blue-500', 
      shadow: 'shadow-blue-200/50',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: "Today's Schedule", 
      value: stats.today, 
      icon: Clock, 
      color: 'bg-purple-500', 
      shadow: 'shadow-purple-200/50',
      trend: 'Busy',
      trendUp: true
    },
    { 
      label: 'Upcoming', 
      value: stats.upcoming, 
      icon: CalendarCheck, 
      color: 'bg-green-500', 
      shadow: 'shadow-green-200/50',
      trend: 'Active',
      trendUp: true
    },
    { 
      label: 'Cancelled', 
      value: stats.cancelled, 
      icon: XCircle, 
      color: 'bg-red-500', 
      shadow: 'shadow-red-200/50',
      trend: '-5%',
      trendUp: false
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display font-poppins">Welcome back, Dr. {doctorName}</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Here's a snapshot of your medical practice today.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 font-bold text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Hospital Online
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group cursor-default`}>
            <div className="flex justify-between items-start">
              <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg ${card.shadow} transform group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${card.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {card.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{card.trend}</span>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">{card.label}</h3>
              <p className="text-4xl font-bold text-slate-900 mt-2 font-poppins tracking-tighter">{loading ? '...' : card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-display font-poppins">Recent Appointments</h2>
                    <p className="text-slate-400 text-sm mt-1">Status of your most recent patient bookings</p>
                </div>
                <Link href="/doctor/dashboard/appointments" className="px-6 py-2.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 transition-all uppercase tracking-widest border border-slate-100">
                    View All
                </Link>
            </div>
            
            <div className="space-y-4">
                {appointments.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {appointments.map((apt) => (
                           <div key={apt.id} className="py-4 flex items-center justify-between group hover:bg-slate-50/50 -mx-4 px-4 rounded-2xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {apt.patient_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{apt.patient_name}</h4>
                                        <p className="text-xs text-slate-400 font-medium">{apt.type || 'General Consultation'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-700">{new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{apt.appointment_time}</p>
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                    apt.status === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                    apt.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                    "bg-slate-50 text-slate-500 border-slate-100"
                                )}>
                                    {apt.status}
                                </div>
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Calendar className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-slate-400 italic">No recent appointments found.</p>
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                <h3 className="text-xl font-bold mb-6 font-display font-poppins">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex flex-col items-center gap-3">
                        <CalendarCheck className="w-6 h-6 text-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Schedule</span>
                    </button>
                    <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex flex-col items-center gap-3">
                        <Users className="w-6 h-6 text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Reports</span>
                    </button>
                    <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex flex-col items-center gap-3">
                        <Clock className="w-6 h-6 text-purple-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Shifts</span>
                    </button>
                    <button className="p-4 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-2xl transition-all flex flex-col items-center gap-3">
                        <ArrowUpRight className="w-6 h-6 text-white" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Emergency</span>
                    </button>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-8 text-white shadow-xl relative overflow-hidden">
                <h3 className="text-lg font-bold mb-2">Practice Assistant</h3>
                <p className="text-xs text-indigo-100 leading-relaxed opacity-90">Your schedule for tomorrow is looking busy with 12 appointments starting at 9:00 AM.</p>
                <div className="mt-6 flex gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 p-0.5">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xs uppercase">B</div>
                    </div>
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-bold border border-white/10">
                        Remind me at 8 AM
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
