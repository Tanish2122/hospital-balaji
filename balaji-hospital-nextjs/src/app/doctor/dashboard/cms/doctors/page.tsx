'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Shield, 
  User, 
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  UserCheck,
  UserX,
  Edit2,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createDoctorAccount, updateDoctorStatus, updateDoctorRole, deleteDoctorAccount, updateDoctorProfile } from '@/app/actions/adminActions'

interface Department {
  id: string
  name: string
}

interface Doctor {
  id: string
  auth_id: string
  name: string
  email: string
  phone: string
  specialization: string
  designation: string
  slug: string
  image_url: string
  department_id: string
  role: 'admin' | 'doctor' | 'staff'
  status: 'active' | 'inactive'
  experience_years: number
  created_at: string
}

export default function DoctorsManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: 0,
    role: 'doctor' as const,
    image_url: ''
  })

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)

  useEffect(() => {
    fetchDoctors()
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('*')
    if (data) setDepartments(data)
  }

  const fetchDoctors = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setDoctors(data)
    setLoading(false)
  }

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const result = await createDoctorAccount(newDoctor)
    if (result.success) {
      setMessage({ type: 'success', text: 'Doctor account created successfully!' })
      setIsModalOpen(false)
      fetchDoctors()
      setNewDoctor({ name: '', email: '', phone: '', specialization: '', experience: 0, role: 'doctor', image_url: '' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create account' })
    }
    setSubmitting(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleUpdateDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoctor) return
    setSubmitting(true)
    
    const result = await updateDoctorProfile(editingDoctor.id, {
        name: editingDoctor.name,
        phone: editingDoctor.phone,
        specialization: editingDoctor.specialization,
        experience_years: editingDoctor.experience_years,
        image_url: editingDoctor.image_url || '',
        designation: editingDoctor.designation || '',
        slug: editingDoctor.slug || '',
        department_id: editingDoctor.department_id || ''
    })

    if (result.success) {
      setMessage({ type: 'success', text: 'Doctor updated successfully!' })
      setIsEditModalOpen(false)
      setEditingDoctor(null)
      fetchDoctors()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update' })
    }
    setSubmitting(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const result = await updateDoctorStatus(id, newStatus as 'active' | 'inactive')
    if (result.success) fetchDoctors()
  }

  const changeRole = async (id: string, role: string) => {
    const result = await updateDoctorRole(id, role)
    if (result.success) fetchDoctors()
  }

  const handleDelete = async (id: string, authId: string) => {
    if (confirm('Are you sure you want to PERMANENTLY delete this account?')) {
      const result = await deleteDoctorAccount(id, authId)
      if (result.success) fetchDoctors()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'new' | 'edit') => {
    const file = e.target.files?.[0]
    if (!file) return

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

      if (type === 'new') {
        setNewDoctor(prev => ({ ...prev, image_url: publicUrl }))
      } else {
        setEditingDoctor(prev => prev ? ({ ...prev, image_url: publicUrl }) : null)
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                         doc.email?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || doc.role === roleFilter
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase font-poppins">Staff Management</h1>
          <p className="text-slate-500 text-sm">Manage doctor accounts, roles, and system access.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          ADD STAFF MEMBER
        </button>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-2",
          message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 py-2 px-4 text-sm text-slate-600"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="doctor">Doctors</option>
          <option value="staff">Staff</option>
        </select>
        <select 
          className="bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 py-2 px-4 text-sm text-slate-600"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active Members</option>
          <option value="inactive">Inactive Members</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Specialization</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-slate-400 italic text-sm">Syncing staff data...</p>
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                    No staff members found matching your criteria.
                  </td>
                </tr>
              ) : filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 overflow-hidden flex items-center justify-center font-bold">
                        {doc.image_url ? (
                            <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-blue-600">{doc.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm leading-tight">{doc.name}</div>
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{doc.designation || 'Specialist'}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {doc.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select 
                      value={doc.role}
                      onChange={(e) => changeRole(doc.id, e.target.value)}
                      className={cn(
                        "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border-none focus:ring-1 inline-block mx-auto cursor-pointer",
                        doc.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700 font-bold"
                      )}
                    >
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="staff">Staff</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-700">{doc.specialization}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">{doc.experience_years}Y EXP</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(doc.id, doc.status)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all mx-auto",
                        doc.status === 'active' 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                          : "bg-red-50 text-red-500 hover:bg-red-100"
                      )}
                    >
                      {doc.status === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {doc.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => {
                             setEditingDoctor(doc)
                             setIsEditModalOpen(true)
                         }}
                         className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                         title="Edit Profile"
                       >
                          <Edit2 className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(doc.id, doc.auth_id)}
                         className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                         title="Delete Account"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Create New Staff Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Role</label>
                  <select
                    value={newDoctor.role}
                    onChange={(e) => setNewDoctor({...newDoctor, role: e.target.value as any})}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="admin">Administrator</option>
                    <option value="staff">Nursing/Staff</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address (Login ID)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                    placeholder="doctor@hospital.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                    placeholder="91XXXXXXXX"
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">EXP (Years)</label>
                  <input
                    type="number"
                    required
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({...newDoctor, experience: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Profile Photo</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newDoctor.image_url}
                      onChange={(e) => setNewDoctor({...newDoctor, image_url: e.target.value})}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'new')}
                      className="hidden"
                      id="new-doctor-file-upload"
                    />
                    <label 
                      htmlFor="new-doctor-file-upload"
                      className={cn(
                        "flex flex-col items-center justify-center w-12 h-10 bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:bg-blue-100 transition-all border border-dashed border-blue-200",
                        uploading && "opacity-50 animate-pulse"
                      )}
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span className="text-[8px] font-bold mt-0.5">LOAD</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 p-2 bg-blue-50 rounded-2xl">
                 <p className="text-[11px] text-blue-600 font-medium text-center">
                   Default password will be set to: <strong>TemporaryPassword123!</strong><br/>
                   The user should change it after first login.
                 </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                INVITE TO DASHBOARD
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => {
              setIsEditModalOpen(false)
              setEditingDoctor(null)
          }} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight font-poppins text-blue-600">Edit Staff Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateDoctor} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.name}
                    onChange={(e) => setEditingDoctor({...editingDoctor, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    value={editingDoctor.experience_years}
                    onChange={(e) => setEditingDoctor({...editingDoctor, experience_years: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editingDoctor.phone}
                  onChange={(e) => setEditingDoctor({...editingDoctor, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.designation || ''}
                    onChange={(e) => setEditingDoctor({...editingDoctor, designation: e.target.value})}
                    placeholder="e.g. Senior Consultant"
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">SLUG (URL ID)</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.slug || ''}
                    onChange={(e) => setEditingDoctor({...editingDoctor, slug: e.target.value})}
                    placeholder="dr-john-doe"
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Profile Photo</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editingDoctor.image_url || ''}
                      onChange={(e) => setEditingDoctor({...editingDoctor, image_url: e.target.value})}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'edit')}
                      className="hidden"
                      id="edit-doctor-file-upload"
                    />
                    <label 
                      htmlFor="edit-doctor-file-upload"
                      className={cn(
                        "flex flex-col items-center justify-center w-12 h-10 bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:bg-blue-100 transition-all border border-dashed border-blue-200",
                        uploading && "opacity-50 animate-pulse"
                      )}
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span className="text-[8px] font-bold mt-0.5">LOAD</span>
                    </label>
                  </div>
                </div>
                {editingDoctor.image_url && (
                  <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={editingDoctor.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Assign Department</label>
                <select
                  value={editingDoctor.department_id || ''}
                  onChange={(e) => setEditingDoctor({...editingDoctor, department_id: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none"
                >
                  <option value="">No Department Assigned</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Specialization</label>
                <input
                  type="text"
                  required
                  value={editingDoctor.specialization}
                  onChange={(e) => setEditingDoctor({...editingDoctor, specialization: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div className="pt-4 p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                 <AlertCircle className="w-5 h-5 text-slate-400" />
                 <p className="text-[10px] text-slate-500 font-medium">
                   Email and Account Role cannot be changed here. Use the main table to toggle roles or status.
                 </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50 mt-4 active:scale-95"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                SAVE CHANGES
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
