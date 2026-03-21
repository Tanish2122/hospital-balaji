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
  ArrowDownRight
} from 'lucide-react'

interface Stats {
  total: number
  today: number
  upcoming: number
  cancelled: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0, upcoming: 0, cancelled: 0 })
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
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, Dr. {doctorName}</h1>
        <p className="text-slate-500 mt-1">Here is what's happening with your practice today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ${card.shadow} transition-all hover:scale-[1.02] cursor-default`}>
            <div className="flex justify-between items-start">
              <div className={`${card.color} p-3 rounded-xl text-white`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full ${card.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{card.trend}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-slate-500 font-medium text-sm">{card.label}</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">{loading ? '...' : card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Quick Actions or Recent Activity could go here */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Appointments</h2>
                <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
                {/* Simplified list for now */}
                <p className="text-slate-400 text-center py-10 italic">Quick access to recent bookings will appear here.</p>
            </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-200" />
                Monthly Insights
            </h2>
            <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-blue-100 text-sm">Growth Rate</p>
                    <p className="text-2xl font-bold">+24% Patients</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-blue-100 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold">98.2%</p>
                </div>
                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl mt-4 hover:bg-blue-50 transition-colors shadow-lg">
                    Download Full Report
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}
