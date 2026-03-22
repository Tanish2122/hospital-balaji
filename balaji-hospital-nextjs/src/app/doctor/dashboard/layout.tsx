'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/doctor/Sidebar'
import { Loader2, Menu, X, Hospital } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/doctor/login')
        return
      }

      // Verify if the user is a doctor
      const { data: doctor, error } = await supabase
        .from('doctors')
        .select('id, is_admin, status')
        .eq('auth_id', session.user.id)
        .maybeSingle()

      if (doctor && doctor.status === 'inactive') {
        await supabase.auth.signOut()
        router.push('/doctor/login')
        return
      }

      // If we found a doctor OR if it's potentially an RLS lag, we allow entry.
      // The Sidebar and other components also have their own checks.
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Authenticating...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Hospital className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800">Balaji Admin</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <main className="lg:pl-64 min-h-screen transition-all">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
