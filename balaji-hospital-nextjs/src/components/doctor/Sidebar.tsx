"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  User, 
  LogOut, 
  ChevronRight,
  Hospital,
  X,
  Users,
  Settings,
  FileText,
  MessageSquare,
  BarChart3,
  Stethoscope,
  Image as ImageIcon,
  Instagram
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const menuGroups = [
  {
    title: 'Practice Management',
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/doctor/dashboard' },
      { icon: Calendar, label: 'Calendar', href: '/doctor/dashboard/calendar' },
      { icon: Clock, label: 'Availability', href: '/doctor/dashboard/availability' },
      { icon: Users, label: 'Appointments', href: '/doctor/dashboard/appointments' },
      { icon: User, label: 'Patients', href: '/doctor/dashboard/patients' },
    ]
  },
  {
    title: 'Website CMS',
    adminOnly: true,
    items: [
      { icon: Stethoscope, label: 'Services', href: '/doctor/dashboard/cms/services' },
      { icon: FileText, label: 'Blog Posts', href: '/doctor/dashboard/cms/blogs' },
      { icon: MessageSquare, label: 'Testimonials', href: '/doctor/dashboard/cms/testimonials' },
      { icon: ImageIcon, label: 'Gallery', href: '/doctor/dashboard/cms/gallery' },
      { icon: Instagram, label: 'Social Feed', href: '/doctor/dashboard/cms/social' },
    ]
  },
  {
    title: 'Reports & Analytics',
    adminOnly: true,
    items: [
      { icon: BarChart3, label: 'Insights', href: '/doctor/dashboard/analytics' },
      { icon: Users, label: 'Staff Management', href: '/doctor/dashboard/cms/doctors' },
      { icon: Settings, label: 'Settings', href: '/doctor/dashboard/settings' },
    ]
  }
]

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Try to fetch doctor profile
        const { data, error } = await supabase
          .from('doctors')
          .select('is_admin, role')
          .eq('auth_id', session.user.id)
          .maybeSingle()
        
        console.log('Sidebar Auth Debug:', { userId: session.user.id, data, error })
        
        if (data) {
          setIsAdmin(data.role === 'admin' || data.is_admin === true)
        }
      }
    }
    checkAdmin()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/doctor/login')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Hospital className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-800 text-lg">Balaji Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
          {menuGroups.map((group, idx) => {
            if (group.adminOnly && !isAdmin) return null;
            
            return (
              <div key={idx} className="space-y-2">
                <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group",
                          isActive 
                            ? "bg-blue-50 text-blue-600 shadow-sm" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3 h-3" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-500" />
            <span className="font-medium font-bold">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}
