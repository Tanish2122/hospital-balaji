'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus,
  Loader2,
  Phone
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Appointment {
  id: string
  patient_name: string
  phone: string
  appointment_date: string
  appointment_time: string
  status: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchMonthAppointments()
  }, [currentDate])

  const fetchMonthAppointments = async () => {
    setLoading(true)
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString()
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString()

    const { data } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', firstDay.split('T')[0])
      .lte('appointment_date', lastDay.split('T')[0])

    if (data) setAppointments(data)
    setLoading(false)
  }

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = []
  // Fill empty slots for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }
  // Fill days of the month
  for (let i = 1; i <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); i++) {
    days.push(i)
  }

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.filter(a => a.appointment_date === dateStr)
  }

  const selectedDateAppointments = appointments.filter(a => a.appointment_date === selectedDate)

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Appointment Calendar</h1>
          <p className="text-slate-500 font-medium">Visual overview of your monthly schedule.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-white rounded-lg transition-colors border border-slate-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Today
              </button>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-white rounded-lg transition-colors border border-slate-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null
              const isSelected = selectedDate === dayStr
              const isToday = new Date().toISOString().split('T')[0] === dayStr
              const dayApps = day ? getAppointmentsForDay(day) : []

              return (
                <div 
                  key={idx} 
                  onClick={() => dayStr && setSelectedDate(dayStr)}
                  className={cn(
                    "min-h-[100px] p-2 border-b border-r border-slate-50 relative cursor-pointer hover:bg-blue-50/30 transition-all",
                    !day && "bg-slate-50/30",
                    isSelected && "bg-blue-50/50 shadow-inner ring-1 ring-blue-100 ring-inset"
                  )}
                >
                  {day && (
                    <>
                      <span className={cn(
                        "text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center transition-colors",
                        isToday ? "bg-blue-600 text-white" : isSelected ? "text-blue-600" : "text-slate-400"
                      )}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayApps.slice(0, 3).map(a => (
                          <div 
                            key={a.id} 
                            className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded truncate font-bold uppercase tracking-tighter",
                                a.status === 'confirmed' ? "bg-green-100 text-green-700" : a.status === 'pending' ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {a.appointment_time?.substring(0,5)} {a.patient_name}
                          </div>
                        ))}
                        {dayApps.length > 3 && (
                          <div className="text-[10px] text-blue-500 font-bold px-1.5">+ {dayApps.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
             <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-1">Details for</h3>
             <h4 className="text-xl font-bold tracking-tight">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'No date selected'}
             </h4>
          </div>

          <div className="space-y-4">
            {loading ? (
                 <div className="py-10 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                 </div>
            ) : selectedDateAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
                 <p className="text-slate-400 font-medium italic">No appointments for this day.</p>
                 <button className="text-blue-600 font-bold text-xs flex items-center justify-center gap-1 mx-auto">
                    <Plus className="w-4 h-4" /> ADD SLOT
                 </button>
              </div>
            ) : (
              selectedDateAppointments.sort((a,b) => (a.appointment_time || '').localeCompare(b.appointment_time || '')).map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 group transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-tight">
                       <Clock className="w-3.5 h-3.5" />
                       {app.appointment_time || 'No Time'}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase border tracking-widest",
                      app.status === 'confirmed' ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      {app.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {app.patient_name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {app.phone}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
