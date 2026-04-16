'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Stethoscope, 
  Loader2,
  X,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
  Maximize2,
  Save,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface BodyPart {
  id: string
  name: string
  slug: string
  description: string
  hotspot_x: number
  hotspot_y: number
}

interface CaseStudy {
  id: string
  body_part_id: string
  title: string
  description: string
  xray_image_url: string
  created_at: string
}

export default function AnatomyCMS() {
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([])
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null)
  const [cases, setCases] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCases, setLoadingCases] = useState(false)
  
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false)
  const [currentCase, setCurrentCase] = useState<Partial<CaseStudy> | null>(null)
  const [savingPart, setSavingPart] = useState(false)
  const [savingCase, setSavingCase] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchBodyParts()
  }, [])

  const fetchBodyParts = async () => {
    setLoading(true)
    const { data } = await supabase.from('body_parts').select('*').order('name')
    if (data) setBodyParts(data)
    setLoading(false)
  }

  const handlePartSelect = async (part: BodyPart) => {
    setSelectedPart(part)
    setLoadingCases(true)
    const { data } = await supabase
      .from('body_part_cases')
      .select('*')
      .eq('body_part_id', part.id)
      .order('created_at', { ascending: false })
    if (data) setCases(data)
    setLoadingCases(false)
  }

  const handleSavePart = async () => {
    if (!selectedPart) return
    setSavingPart(true)
    const { error } = await supabase
      .from('body_parts')
      .update({
        name: selectedPart.name,
        description: selectedPart.description
      })
      .eq('id', selectedPart.id)
    
    if (error) alert('Error saving part: ' + error.message)
    else {
        await fetchBodyParts()
        alert('Details updated successfully!')
    }
    setSavingPart(false)
  }

  const handleSaveCase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPart || !currentCase) return
    setSavingCase(true)

    const caseData = {
      ...currentCase,
      body_part_id: selectedPart.id
    }

    let error
    if (currentCase.id) {
      ({ error } = await supabase.from('body_part_cases').update(caseData).eq('id', currentCase.id))
    } else {
      ({ error } = await supabase.from('body_part_cases').insert([caseData]))
    }

    if (error) alert('Error saving case: ' + error.message)
    else {
      await handlePartSelect(selectedPart)
      setIsCaseModalOpen(false)
      setCurrentCase(null)
    }
    setSavingCase(false)
  }

  const handleDeleteCase = async (id: string) => {
    if (!confirm('Delete this clinical subsection?')) return
    const { error } = await supabase.from('body_part_cases').delete().eq('id', id)
    if (error) alert('Error deleting: ' + error.message)
    else if (selectedPart) handlePartSelect(selectedPart)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`
      const filePath = `anatomy-cases/${fileName}`

      const { data, error } = await supabase.storage
        .from('gallery') // Reusing gallery bucket for simplicity unless anatomy bucket is created
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      setCurrentCase(prev => ({ ...prev, xray_image_url: publicUrl }))
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 lowercase">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <Stethoscope className="w-6 h-6" />
            </div>
            Anatomy <span className="text-blue-600 font-medium">Explorer CMS</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Manage clinical case studies and body part documentation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Body Parts List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm overflow-hidden">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 px-2">
              <Info className="w-3 h-3" /> Body Parts List
            </h2>
            <div className="space-y-2">
              {loading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-200" /></div>
              ) : bodyParts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => handlePartSelect(part)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                    selectedPart?.id === part.id 
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1" 
                      : "bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md hover:translate-x-1"
                  )}
                >
                  <span className="uppercase tracking-tight">{part.name}</span>
                  <ChevronRight className={cn("w-4 h-4", selectedPart?.id === part.id ? "text-white" : "text-slate-300")} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats/Tip */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-lg font-bold mb-2 relative">Admin Tip</h3>
            <p className="text-sm text-slate-400 leading-relaxed relative italic">
              "Select a body part to manage its clinical details and add surgical case studies (subsections)."
            </p>
          </div>
        </div>

        {/* Right Side: Detailed Editor */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {!selectedPart ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200 p-12 text-center text-slate-400">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <Maximize2 className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Drafting Area</h3>
              <p className="max-w-xs mt-2 font-medium">Select a part from the left to start adding clinical documentation.</p>
            </div>
          ) : (
            <>
              {/* Part Info Editor */}
              <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                        Editing: <span className="text-blue-600">{selectedPart.name}</span>
                   </h2>
                   <button 
                    onClick={handleSavePart}
                    disabled={savingPart}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-100"
                   >
                     {savingPart ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                     UPDATE PART DETAILS
                   </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">General Description</label>
                    <textarea 
                      value={selectedPart.description}
                      onChange={(e) => setSelectedPart({ ...selectedPart, description: e.target.value })}
                      className="w-full h-32 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 resize-none"
                      placeholder="Write a brief overview of treatments for this body part..."
                    />
                  </div>
                </div>
              </div>

              {/* Case Studies (Subsections) Manager */}
              <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                 <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Clinical <span className="text-blue-600">Subsections</span></h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Specific surgical case studies</p>
                    </div>
                    <button 
                        onClick={() => { setCurrentCase({}); setIsCaseModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                    >
                        <Plus className="w-5 h-5" />
                        ADD CASE STUDY
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loadingCases ? (
                        <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-200" /></div>
                    ) : cases.length === 0 ? (
                        <div className="col-span-full py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                             <ImageIcon className="w-12 h-12 mb-4 opacity-10" />
                             <p className="font-bold uppercase tracking-tight text-xs">No clinical subsections found.</p>
                        </div>
                    ) : cases.map((cs) => (
                        <div key={cs.id} className="group p-6 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-100 transition-all">
                            <div className="aspect-video relative rounded-2xl overflow-hidden bg-white border border-slate-100 mb-4">
                                <img src={cs.xray_image_url} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <button 
                                        onClick={() => { setCurrentCase(cs); setIsCaseModalOpen(true); }}
                                        className="p-3 bg-white text-blue-600 rounded-xl shadow-xl active:scale-95"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-black text-slate-800 uppercase tracking-tight line-clamp-1 mb-2">{cs.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{cs.description}</p>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleDeleteCase(cs.id)}
                                    className="p-2.5 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <span className="ml-auto text-[10px] font-bold text-slate-300 flex items-center gap-1 uppercase tracking-widest">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Published
                                </span>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Case Modal */}
      <AnimatePresence>
        {isCaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
               onClick={() => setIsCaseModalOpen(false)} 
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                        {currentCase?.id ? 'Edit Subsection' : 'New Subsection'}
                    </h2>
                    <button onClick={() => setIsCaseModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSaveCase} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Case Title</label>
                        <input
                            type="text"
                            required
                            value={currentCase?.title || ''}
                            onChange={(e) => setCurrentCase({ ...currentCase, title: e.target.value })}
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                            placeholder="e.g. Total Shoulder Replacement"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">X-Ray / Clinical Photo</label>
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    required
                                    value={currentCase?.xray_image_url || ''}
                                    onChange={(e) => setCurrentCase({ ...currentCase, xray_image_url: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold pr-12"
                                    placeholder="https://..."
                                />
                                <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="case-image-upload"
                            />
                            <label 
                                htmlFor="case-image-upload"
                                className={cn(
                                    "flex flex-col items-center justify-center w-16 h-14 bg-blue-600/10 text-blue-600 rounded-2xl cursor-pointer hover:bg-blue-600/20 transition-all border-2 border-dashed border-blue-200",
                                    uploading && "opacity-50 cursor-not-allowed animate-pulse"
                                )}
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                <span className="text-[8px] font-black mt-1">UPLOAD</span>
                            </label>
                        </div>
                        {currentCase?.xray_image_url && (
                            <div className="mt-4 aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 bg-slate-50">
                                <img src={currentCase.xray_image_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Case Description</label>
                        <textarea 
                            value={currentCase?.description || ''}
                            onChange={(e) => setCurrentCase({ ...currentCase, description: e.target.value })}
                            className="w-full h-32 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 resize-none"
                            placeholder="Describe the clinical condition and treatment outcome..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={savingCase}
                        className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 mt-4 disabled:opacity-50"
                    >
                        {savingCase ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                {currentCase?.id ? 'UPDATE SUBSECTION' : 'CREATE SUBSECTION'}
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
