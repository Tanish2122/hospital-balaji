'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Settings as SettingsIcon, 
  Hospital, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SiteSettings {
  hospital_name: string
  address: string
  phone: string
  whatsapp_number: string
  email: string
  google_maps_url: string
  meta_title: string
  meta_description: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
    if (data) setSettings(data)
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    
    const { error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', 1)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Settings updated successfully' })
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) {
     return (
        <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Fetching settings...</p>
        </div>
     )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">System Settings</h1>
          <p className="text-slate-500 font-medium">Manage hospital branding and website SEO.</p>
        </div>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4",
          message.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hospital Identity */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Hospital className="w-4 h-4 text-blue-600" />
               Hospital Branding
            </h2>
            
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Hospital Name</label>
                  <input
                    type="text"
                    value={settings?.hospital_name || ''}
                    onChange={(e) => setSettings({ ...settings!, hospital_name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tagline / Bio</label>
                  <textarea
                    rows={3}
                    value={settings?.meta_description || ''}
                    onChange={(e) => setSettings({ ...settings!, meta_description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 resize-none"
                  />
               </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Share2 className="w-4 h-4 text-emerald-600" />
               Contact & Social
            </h2>
            <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1">
                     <Phone className="w-3 h-3" /> WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settings?.whatsapp_number || ''}
                    onChange={(e) => setSettings({ ...settings!, whatsapp_number: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1">
                     <Mail className="w-3 h-3" /> Business Email
                  </label>
                  <input
                    type="email"
                    value={settings?.email || ''}
                    onChange={(e) => setSettings({ ...settings!, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* SEO & Location */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Globe className="w-4 h-4 text-purple-600" />
             SEO & Location Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Full Address
                    </label>
                    <textarea
                        rows={2}
                        value={settings?.address || ''}
                        onChange={(e) => setSettings({ ...settings!, address: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 resize-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Maps URL
                    </label>
                    <input
                        type="text"
                        value={settings?.google_maps_url || ''}
                        onChange={(e) => setSettings({ ...settings!, google_maps_url: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                    />
                </div>
             </div>
             <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Meta Title Tag</label>
                    <input
                        type="text"
                        value={settings?.meta_title || ''}
                        onChange={(e) => setSettings({ ...settings!, meta_title: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-700"
                    />
                </div>
             </div>
          </div>
        </div>

        <div className="flex justify-end">
            <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white font-bold py-4 px-12 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
            >
                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                PUSH SETTINGS TO LIVE WEBSITE
            </button>
        </div>
      </form>
    </div>
  )
}
