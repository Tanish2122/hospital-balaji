'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  X, 
  ChevronRight, 
  Info, 
  Stethoscope, 
  ImageIcon,
  Loader2,
  Maximize2
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
  title: string
  description: string
  xray_image_url: string
  before_image_url?: string
  after_image_url?: string
}

export default function AnatomyExplorer() {
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([])
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null)
  const [cases, setCases] = useState<CaseStudy[]>([])
  const [loadingCases, setLoadingCases] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    fetchBodyParts()
  }, [])

  const fetchBodyParts = async () => {
    const { data } = await supabase
      .from('body_parts')
      .select('*')
    if (data) setBodyParts(data)
  }

  const handlePartClick = async (part: BodyPart) => {
    setSelectedPart(part)
    setIsSidebarOpen(true)
    setLoadingCases(true)
    
    const { data } = await supabase
      .from('body_part_cases')
      .select('*')
      .eq('body_part_id', part.id)
    
    if (data) setCases(data)
    setLoadingCases(false)
  }

  return (
    <section className="py-24 bg-[#FDFFFF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-poppins">
            Explore Your <span className="text-blue-600">Recovery</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Click on the markers to learn about our specialized treatments and view real clinical case studies from Balaji Hospital.
          </p>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Skeleton Interactive Area */}
          <div className="relative w-full max-w-[500px] aspect-[4/5] bg-white rounded-[3rem] shadow-2xl shadow-blue-50 border border-blue-50/50 p-8 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* The Skeleton Image */}
              <img 
                src="/images/anatomy-skeleton.png" 
                alt="Human Anatomy Skeleton"
                className="w-full h-full object-contain pointer-events-none opacity-90 transition-all duration-700"
              />

              {/* Hotspots */}
              {bodyParts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => handlePartClick(part)}
                  className={cn(
                    "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-10 transition-all group",
                    selectedPart?.id === part.id ? "scale-125" : "hover:scale-110"
                  )}
                  style={{ left: `${part.hotspot_x}%`, top: `${part.hotspot_y}%` }}
                >
                  <span className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-150 group-hover:opacity-40" />
                  <div className={cn(
                    "w-full h-full rounded-full flex items-center justify-center shadow-lg transition-all border-2",
                    selectedPart?.id === part.id 
                      ? "bg-blue-600 border-white text-white rotate-45" 
                      : "bg-white border-blue-500 text-blue-600"
                  )}>
                    <Plus className="w-4 h-4" />
                  </div>
                  
                  {/* Tooltip on Hover */}
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl tracking-widest uppercase">
                    {part.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Side Info Panel / Desktop */}
          <div className={cn(
            "lg:w-1/3 w-full bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm transition-all duration-500",
            !selectedPart && "opacity-50 pointer-events-none grayscale"
          )}>
            {!selectedPart ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Maximize2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Select a Part</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-[200px]">Click any marker on the skeleton to explore clinical data.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2 block">Clinical Spotlight</span>
                    <h3 className="text-3xl font-bold text-slate-900">{selectedPart.name}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm">
                  {selectedPart.description}
                </p>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Real X-Ray Reports
                  </h4>
                  
                  {loadingCases ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-200" />
                    </div>
                  ) : cases.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {cases.map((cs) => (
                        <div key={cs.id} className="group cursor-pointer">
                          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-50 mb-3">
                             <img src={cs.xray_image_url} alt={cs.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                             <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <Maximize2 className="text-white w-8 h-8" />
                             </div>
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors uppercase tracking-tight">{cs.title}</h5>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{cs.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-50 rounded-3xl text-center border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-medium italic">New case studies being uploaded soon.</p>
                    </div>
                  )}
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                   BOOK APPOINTMENT
                   <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar / Modal - Full Screen on mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] lg:hidden bg-white p-6 overflow-y-auto"
          >
             {/* Content similar to desktop panel but optimized for mobile scrolling */}
             <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/80 backdrop-blur-md py-2 border-b border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900">{selectedPart?.name}</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             {/* ... and so on for mobile content ... */}
             <div className="space-y-8 pb-20">
                <p className="text-slate-600 leading-relaxed">
                  {selectedPart?.description}
                </p>

                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Case Studies
                  </h4>
                  {loadingCases ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                  ) : cases.map((cs) => (
                    <div key={cs.id} className="space-y-3">
                       <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                          <img src={cs.xray_image_url} alt={cs.title} className="w-full h-full object-cover" />
                       </div>
                       <h5 className="font-bold text-slate-800 uppercase tracking-tight">{cs.title}</h5>
                       <p className="text-sm text-slate-500">{cs.description}</p>
                    </div>
                  ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
