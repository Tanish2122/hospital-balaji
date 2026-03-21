'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity, 
  ChevronRight,
  Loader2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    monthGrowth: 12,
    today: 0,
    pending: 0,
    popularDept: 'Orthopedic'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    // In a real app, you'd use SQL aggregations. Here's a mock/simple fetch for demo.
    const { count: total } = await supabase.from('appointments').select('*', { count: 'exact', head: true })
    const todayStr = new Date().toISOString().split('T')[0]
    const { count: today } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', todayStr)
    const { count: pending } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending')

    setStats(prev => ({ 
      ...prev, 
      total: total || 0, 
      today: today || 0,
      pending: pending || 0
    }))
    setLoading(false)
  }

  const cards = [
    { label: 'Total Patients', value: stats.total, icon: Users, color: 'blue', growth: '+5%' },
    { label: "Today's Volume", value: stats.today, icon: Calendar, color: 'emerald', growth: '+12%' },
    { label: 'Pending Bookings', value: stats.pending, icon: Activity, color: 'amber', growth: '-2%' },
    { label: 'Growth rate', value: '24%', icon: TrendingUp, color: 'purple', growth: '+8%' },
  ]

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Hospital Intelligence</h1>
          <p className="text-slate-500 font-medium tracking-tight">Data-driven insights for your healthcare practice.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-all">
             <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                card.color === 'blue' && "bg-blue-50 text-blue-600",
                card.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                card.color === 'amber' && "bg-amber-50 text-amber-600",
                card.color === 'purple' && "bg-purple-50 text-purple-600"
             )}>
                <card.icon className="w-6 h-6" />
             </div>
             
             <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                <div className="flex items-end gap-2">
                   <h3 className="text-2xl font-black text-slate-800 font-display">{card.value}</h3>
                   <span className={cn(
                      "text-[10px] font-bold flex items-center mb-1",
                      card.growth.startsWith('+') ? "text-emerald-500" : "text-red-500"
                   )}>
                      {card.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {card.growth}
                   </span>
                </div>
             </div>

             <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-slate-50/50 rounded-full group-hover:bg-blue-50 transition-colors" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mock Chart Area */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                 <BarChart3 className="w-5 h-5 text-blue-600" />
                 Appointment Trends
              </h3>
              <select className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 outline-none">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
              </select>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-1 pt-4">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                 <div key={i} className="flex-1 space-y-2 group flex flex-col items-center">
                    <div className="relative w-full flex justify-center">
                        <div 
                        style={{ height: `${h}%` }} 
                        className="w-full max-w-[40px] bg-blue-100 rounded-t-xl group-hover:bg-blue-600 transition-all duration-500 relative cursor-pointer"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {h}
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase letter-spacing-[0.2em]">Day {i+1}</span>
                 </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
           <h3 className="font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Service Distribution
           </h3>
           
           <div className="space-y-4 pt-2">
              {[
                { name: 'Orthopedics', value: 45, color: 'bg-blue-600' },
                { name: 'ENT/Ear Surgery', value: 30, color: 'bg-emerald-500' },
                { name: 'Physiotherapy', value: 15, color: 'bg-amber-500' },
                { name: 'Other', value: 10, color: 'bg-slate-300' },
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="text-slate-400">{item.value}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div style={{ width: `${item.value}%` }} className={cn("h-full rounded-full", item.color)} />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-8 p-6 bg-slate-50 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="space-y-0.5">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top Specialist</p>
                 <h4 className="font-bold text-slate-800 uppercase">Dr. Tanish Gupta</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
           </div>
        </div>
      </div>
    </div>
  )
}
