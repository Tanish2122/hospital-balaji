'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function createDoctorAccount(formData: {
  email: string
  name: string
  phone: string
  specialization: string
  experience: number
  role: 'admin' | 'doctor' | 'staff'
}) {
  // 1. Create Auth User
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: 'TemporaryPassword123!', // You should probably send an invite instead or ask them to reset
    email_confirm: true,
  })

  if (authError) return { error: authError.message }

  // 2. Create Public Profile
  const { error: profileError } = await supabaseAdmin
    .from('doctors')
    .insert([{
      auth_id: authData.user.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization,
      experience_years: formData.experience,
      role: formData.role,
      status: 'active'
    }])

  if (profileError) {
    // Cleanup auth user if profile creation fails
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return { error: profileError.message }
  }

  revalidatePath('/doctor/dashboard/cms/doctors')
  return { success: true }
}

export async function updateDoctorStatus(id: string, status: 'active' | 'inactive') {
  const { error } = await supabaseAdmin
    .from('doctors')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/doctor/dashboard/cms/doctors')
  return { success: true }
}

export async function updateDoctorRole(id: string, role: string) {
    const { error } = await supabaseAdmin
      .from('doctors')
      .update({ role, is_admin: role === 'admin' })
      .eq('id', id)
  
    if (error) return { error: error.message }
    revalidatePath('/doctor/dashboard/cms/doctors')
    return { success: true }
  }

export async function updateDoctorProfile(id: string, updates: {
  name: string
  phone: string
  specialization: string
  experience_years: number
  image_url: string
  designation: string
  slug: string
  department_id: string
}) {
  const { error } = await supabaseAdmin
    .from('doctors')
    .update(updates)
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/doctor/dashboard/cms/doctors')
  revalidatePath('/doctors')
  return { success: true }
}

export async function deleteDoctorAccount(id: string, authId: string) {
  // Soft delete prefered, but if actual delete is needed:
  const { error: profileError } = await supabaseAdmin.from('doctors').delete().eq('id', id)
  if (profileError) return { error: profileError.message }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authId)
  if (authError) return { error: authError.message }

  revalidatePath('/doctor/dashboard/cms/doctors')
  return { success: true }
}
