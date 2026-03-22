'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Instagram, 
  Save, 
  Loader2, 
  Globe, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Info,
  Youtube
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SocialSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [settings, setSettings] = useState({
    instagram_url: '',
    type: 'static'
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'social_feed')
      .single()
    
    if (data?.value) {
      setSettings(data.value as any)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        key: 'social_feed', 
        value: settings,
        updated_at: new Date().toISOString()
      })

    if (!error) {
      setMessage({ type: 'success', text: 'Social feed settings updated successfully!' })
    } else {
      setMessage({ type: 'error', text: error.message })
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight uppercase font-poppins">Social Feed Automation</h1>
        <p className="text-slate-500 mt-2">Connect your Instagram account to show real-time posts on the website.</p>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 text-sm font-medium",
          message.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        )}>
          {message.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Connection Tool Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-lg">
              <Instagram className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Direct Instagram Link</h3>
              <p className="text-xs text-slate-400">Recommended for live sync</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
               <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700 leading-relaxed font-medium">
                    We recommend using <strong>Behold.so</strong> or a similar feed service. They provide a simple "JSON Feed URL" that keeps your website updated without complex coding.
                  </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">JSON Feed URL / API Token</label>
              <input 
                type="text"
                placeholder="https://behold.so/api/v1/..."
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
                value={settings.instagram_url}
                onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-3">
               <button 
                onClick={() => setSettings({...settings, type: settings.type === 'live' ? 'static' : 'live'})}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  settings.type === 'live' ? "bg-blue-600" : "bg-slate-200"
                )}
               >
                 <div className={cn(
                   "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                   settings.type === 'live' ? "left-7" : "left-1"
                 )} />
               </button>
               <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Enable Live Sync</span>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-100"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            SAVE CONFIGURATION
          </button>
        </div>

        {/* Instructions/Help Card */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            HOW TO GET UPDATED
          </h4>
          
          <ul className="space-y-5">
            <li className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200">1</div>
               <p className="text-xs text-slate-600 leading-relaxed">
                 Go to <a href="https://behold.so" target="_blank" className="text-blue-600 font-bold underline">Behold.so</a> and sign up for a free account.
               </p>
            </li>
            <li className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200">2</div>
               <p className="text-xs text-slate-600 leading-relaxed">
                 Follow their steps to connect your Instagram profile (@balajihospitaljaipur).
               </p>
            </li>
            <li className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200">3</div>
               <p className="text-xs text-slate-600 leading-relaxed">
                 Copy the <strong>JSON Feed URL</strong> and paste it here. Turn on "Live Sync" and Save!
               </p>
            </li>
          </ul>

          <div className="pt-6 border-t border-slate-200">
             <div className="p-4 bg-white rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-200 border border-transparent transition-all">
                <div className="flex items-center gap-3">
                   <Youtube className="w-5 h-5 text-red-600" />
                   <span className="text-xs font-bold text-slate-700">Watch Setup Video</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
