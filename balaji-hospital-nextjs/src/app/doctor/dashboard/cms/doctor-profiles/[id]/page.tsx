'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, 
  Save, 
  Award, 
  Stethoscope, 
  Calendar, 
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { updateDoctorProfile } from '@/app/actions/adminActions'

interface ScheduleSlot {
  days: string
  hours: string
}

interface Doctor {
  id: string
  name: string
  designation: string
  image_url: string
  specialization: string
  status: string
  bio: string
  qualification: string
  slug: string
  department_id: string
  on_leave: boolean
  schedule: ScheduleSlot[]
  services: string[]
}

interface Department {
  id: string
  name: string
}

export default function DoctorProfileEditor() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchDoctor()
    fetchDepartments()
  }, [id])

  const fetchDoctor = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) {
      // Ensure arrays/objects are initialized correctly
      setDoctor({
        ...data,
        schedule: data.schedule || [
            { days: "Monday – Saturday", hours: "10:00 AM – 04:00 PM" },
            { days: "Sunday", hours: "Emergency Only" }
        ],
        services: data.services || []
      })
    }
    setLoading(false)
  }

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('id, name')
    if (data) setDepartments(data)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctor) return
    
    setSaving(true)
    const result = await updateDoctorProfile(doctor.id, {
        name: doctor.name,
        phone: (doctor as any).phone || '', // Need to keep existing phone
        specialization: doctor.specialization,
        experience_years: (doctor as any).experience_years || 0,
        image_url: doctor.image_url || '',
        designation: doctor.designation || '',
        slug: doctor.slug || '',
        on_leave: doctor.on_leave || false,
        department_id: doctor.department_id || '',
        bio: doctor.bio || '',
        qualification: doctor.qualification || '',
        schedule: doctor.schedule,
        services: doctor.services
    })

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated and published!' })
      router.refresh()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !doctor) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`
      const filePath = `doctor-assets/${fileName}`

      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      setDoctor({ ...doctor, image_url: publicUrl })
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const addScheduleSlot = () => {
    if (!doctor) return
    setDoctor({
      ...doctor,
      schedule: [...doctor.schedule, { days: '', hours: '' }]
    })
  }

  const updateScheduleSlot = (index: number, field: keyof ScheduleSlot, value: string) => {
    if (!doctor) return
    const newSchedule = [...doctor.schedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setDoctor({ ...doctor, schedule: newSchedule })
  }

  const removeScheduleSlot = (index: number) => {
    if (!doctor) return
    setDoctor({
      ...doctor,
      schedule: doctor.schedule.filter((_, i) => i !== index)
    })
  }

  const updateServices = (text: string) => {
    if (!doctor) return
    setDoctor({
      ...doctor,
      services: text.split('\n').filter(s => s.trim() !== '')
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Profile...</p>
      </div>
    )
  }

  if (!doctor) return <div className="p-8 text-center text-red-500">Doctor profile not found.</div>

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/doctor/dashboard/cms/doctor-profiles"
            className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight font-poppins">{doctor.name}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Public Profile Editor</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Profile
        </button>
      </div>

      {message && (
        <div className={cn(
          "mb-8 p-4 rounded-2xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-2",
          message.type === 'success' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Core Identity Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-1 h-6 bg-blue-600 rounded-full" />
             <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Identity & Branding</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group mx-auto md:mx-0">
               <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 overflow-hidden border-2 border-slate-100 shadow-inner group-hover:border-blue-400 transition-all">
                  {doctor.image_url ? (
                    <img src={doctor.image_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  )}
               </div>
               <input 
                 type="file" 
                 id="profile-upload" 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileUpload}
               />
               <label 
                 htmlFor="profile-upload"
                 className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-2xl cursor-pointer hover:bg-blue-700 transition-all shadow-lg active:scale-95"
               >
                 <ImageIcon className="w-4 h-4" />
               </label>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Display Name</label>
                <input
                  type="text"
                  value={doctor.name}
                  onChange={(e) => setDoctor({...doctor, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Official Designation</label>
                <input
                  type="text"
                  value={doctor.designation || ''}
                  onChange={(e) => setDoctor({...doctor, designation: e.target.value})}
                  placeholder="e.g. Senior Orthopaedic Surgeon"
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">URL Slug (For Profile Link)</label>
                <input
                  type="text"
                  value={doctor.slug || ''}
                  onChange={(e) => setDoctor({...doctor, slug: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm text-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Department</label>
                <select
                  value={doctor.department_id || ''}
                  onChange={(e) => setDoctor({...doctor, department_id: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none"
                >
                  <option value="">No Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
           <div className="flex items-center gap-3">
             <div className="w-1 h-6 bg-blue-600 rounded-full" />
             <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Professional Qualifications & Bio</h2>
          </div>

          <div className="space-y-4">
             <div className="space-y-1">
                <div className="flex items-center gap-2 pl-1 mb-1">
                  <Award className="w-3 h-3 text-slate-400" />
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Qualifications (e.g. MS, MBBS)</label>
                </div>
                <input
                  type="text"
                  value={doctor.qualification || ''}
                  onChange={(e) => setDoctor({...doctor, qualification: e.target.value})}
                  placeholder="Comma separated: MS Ortho, MBBS, DNB"
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
             </div>

             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Professional Overview (Biography)</label>
                <textarea
                  rows={8}
                  value={doctor.bio || ''}
                  onChange={(e) => setDoctor({...doctor, bio: e.target.value})}
                  placeholder="Describe the doctor's career, specialization details, and patient care philosophy..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm leading-relaxed"
                />
             </div>
          </div>
        </section>

        {/* Schedule & Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 flex flex-col">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-1 h-6 bg-blue-600 rounded-full" />
                   <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Schedule</h2>
                 </div>
                 <button 
                   onClick={addScheduleSlot}
                   className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all active:scale-95"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
               </div>

               <div className="space-y-3 flex-1">
                  {doctor.schedule.map((slot, idx) => (
                    <div key={idx} className="flex gap-2 items-start animate-in slide-in-from-right-2">
                       <input 
                         type="text"
                         value={slot.days}
                         onChange={(e) => updateScheduleSlot(idx, 'days', e.target.value)}
                         placeholder="Days"
                         className="flex-1 px-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold"
                       />
                       <input 
                         type="text"
                         value={slot.hours}
                         onChange={(e) => updateScheduleSlot(idx, 'hours', e.target.value)}
                         placeholder="Hours"
                         className="flex-1 px-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold"
                       />
                       <button 
                         onClick={() => removeScheduleSlot(idx)}
                         className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
               </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 flex flex-col">
               <div className="flex items-center gap-3">
                 <div className="w-1 h-6 bg-blue-600 rounded-full" />
                 <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Treatments</h2>
               </div>

               <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block italic">One treatment per line</label>
                  <textarea
                    rows={6}
                    value={doctor.services?.join('\n') || ''}
                    onChange={(e) => updateServices(e.target.value)}
                    placeholder="e.g. Joint Replacement Surgery&#10;Arthroscopic ACL Reconstruction"
                    className="w-full h-full min-h-[150px] px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-xs leading-relaxed"
                  />
               </div>
            </section>
        </div>
      </div>
    </div>
  )
}
