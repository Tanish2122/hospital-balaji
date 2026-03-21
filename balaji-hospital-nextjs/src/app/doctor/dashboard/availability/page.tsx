'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Save, 
  Loader2,
  AlertCircle,
  XCircle,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvailabilitySlot {
  id?: string
  day_of_week: string
  specific_date?: string | null
  start_time: string
  end_time: string
  is_available: boolean
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AvailabilityPage() {
  const [weeklySlots, setWeeklySlots] = useState<AvailabilitySlot[]>([])
  const [leaves, setLeaves] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [doctorId, setDoctorId] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form states for adding new weekly slot
  const [newDay, setNewDay] = useState('Monday')
  const [newStart, setNewStart] = useState('09:00')
  const [newEnd, setNewEnd] = useState('17:00')

  // Form states for adding leave
  const [leaveDate, setLeaveDate] = useState('')

  useEffect(() => {
    const fetchDoctorAndAvailability = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: doctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('auth_id', user.id)
        .single()

      if (!doctor) return
      setDoctorId(doctor.id)
      fetchAvailability(doctor.id)
    }

    fetchDoctorAndAvailability()
  }, [])

  const fetchAvailability = async (docId: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('doctor_id', docId)

    if (data) {
      setWeeklySlots(data.filter(s => s.day_of_week !== 'SpecificDate'))
      setLeaves(data.filter(s => s.day_of_week === 'SpecificDate'))
    }
    setLoading(false)
  }

  const addWeeklySlot = async () => {
    if (!doctorId) return
    setSaving(true)
    const newSlot = {
      doctor_id: doctorId,
      day_of_week: newDay,
      start_time: newStart,
      end_time: newEnd,
      is_available: true
    }

    const { data, error } = await supabase
      .from('availability')
      .insert([newSlot])
      .select()

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else if (data) {
      setWeeklySlots([...weeklySlots, data[0]])
      setMessage({ type: 'success', text: 'Weekly slot added successfully' })
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const addLeave = async () => {
    if (!doctorId || !leaveDate) return
    setSaving(true)
    const newLeave = {
      doctor_id: doctorId,
      day_of_week: 'SpecificDate',
      specific_date: leaveDate,
      start_time: '00:00',
      end_time: '23:59',
      is_available: false
    }

    const { data, error } = await supabase
      .from('availability')
      .insert([newLeave])
      .select()

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else if (data) {
      setLeaves([...leaves, data[0]])
      setMessage({ type: 'success', text: 'Leave date marked successfully' })
    }
    setSaving(false)
    setLeaveDate('')
    setTimeout(() => setMessage(null), 3000)
  }

  const deleteSlot = async (id: string, isLeave: boolean) => {
    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', id)

    if (!error) {
      if (isLeave) {
        setLeaves(leaves.filter(s => s.id !== id))
      } else {
        setWeeklySlots(weeklySlots.filter(s => s.id !== id))
      }
    }
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Availability</h1>
        <p className="text-slate-500">Set your weekly schedule and mark leaves.</p>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-4",
          message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Weekly Schedule Section */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Weekly Recurring Schedule
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Day</label>
              <select 
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="w-full bg-white border-none rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start</label>
              <input 
                type="time" 
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="w-full bg-white border-none rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">End</label>
              <input 
                type="time" 
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full bg-white border-none rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={addWeeklySlot}
              disabled={saving}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Add Slot</span>
            </button>
          </div>

          <div className="space-y-3">
            {weeklySlots.length === 0 ? (
              <p className="text-slate-400 text-center py-6 italic">No weekly slots added yet.</p>
            ) : (
              weeklySlots.sort((a,b) => DAYS.indexOf(a.day_of_week) - DAYS.indexOf(b.day_of_week)).map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                      {slot.day_of_week.substring(0,3)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{slot.day_of_week}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {slot.start_time.substring(0,5)} - {slot.end_time.substring(0,5)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => slot.id && deleteSlot(slot.id, false)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Leaves / Holidays Section */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-500" />
            Specific Dates Unavailable (Leaves)
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
              <input 
                type="date" 
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white border-none rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={addLeave}
              disabled={saving || !leaveDate}
              className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              <span>Mark Leave</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {leaves.length === 0 ? (
              <p className="col-span-2 text-slate-400 text-center py-6 italic">No leave dates marked.</p>
            ) : (
              leaves.sort((a,b) => (a.specific_date || '').localeCompare(b.specific_date || '')).map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">
                      {new Date(slot.specific_date!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <button 
                    onClick={() => slot.id && deleteSlot(slot.id, true)}
                    className="text-red-300 hover:text-red-600 p-1"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
