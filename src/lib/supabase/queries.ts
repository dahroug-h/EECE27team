import { createClient } from '@/lib/supabase/client'
import { Profile, Project, ApplicationWithProfile } from '@/lib/types'

export async function signInWithGoogle() {
  const supabase = createClient()
  // Capture the current URL to redirect back after sign in
  const currentUrl = window.location.pathname
  
  // Store the redirect URL in localStorage as a backup
  localStorage.setItem('auth_redirect', currentUrl)
  
  
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: location.origin + '/auth/callback'
    }
  })
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  // Refresh the page after sign out
  window.location.reload()
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function createProfile(profileData: { full_name: string, section: string, whatsapp_number: string }) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) throw new Error('User not authenticated')
  
  const { data: profileResult, error } = await supabase.from('profiles').upsert({
    id: authData.user.id,
    email: authData.user.email!,
    full_name: profileData.full_name,
    section: profileData.section,
    whatsapp_number: profileData.whatsapp_number
  }).select().single()

  if (error) throw error
  return profileResult
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data: profileData, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return profileData
}

export async function createProject(name: string, description?: string, team_size?: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  let slug = baseSlug
  let counter = 1

  while (true) {
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!existingProject) break
    
    slug = baseSlug + '-' + counter
    counter++
  }
  
  const { data: projectResult, error } = await supabase.from('projects').insert({
    name,
    slug,
    description,
    team_size,
    creator_id: user.id
  }).select().single()

  if (error) throw error
  return projectResult
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createClient()
  const { data: projectData, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return projectData
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = createClient()
  const { data: projectsData, error } = await supabase
    .from('projects')
    .select(`
      *,
      applications(count)
    `)
    .order('created_at', { ascending: false })

  if (error) return []
  
  return (projectsData || []).map(project => ({
    ...project,
    applications_count: project.applications[0]?.count || 0
  }))
}

export async function applyToProject(projectId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  
  const { data: applicationData, error } = await supabase.from('applications').insert({
    project_id: projectId,
    user_id: user.id
  }).select().single()

  if (error) throw error
  
  return applicationData
}

export async function removeApplication(applicationId: string) {
  const supabase = createClient()
  
  
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId)

  if (error) throw error
}

export async function getApplications(projectId: string): Promise<ApplicationWithProfile[]> {
  const supabase = createClient()
  
  const { data: applicationsData, error } = await supabase
    .from('applications')
    .select(`
      id,
      project_id,
      user_id,
      created_at,
      profiles!inner (
        id, 
        full_name, 
        section, 
        whatsapp_number
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }
  
  // Type assertion to handle Supabase's data structure
  return (applicationsData || []) as unknown as ApplicationWithProfile[]
}

export async function getUserApplication(projectId: string, userId: string) {
  const supabase = createClient()
  const { data: applicationData, error } = await supabase
    .from('applications')
    .select('*')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single()

  if (error) return null
  return applicationData
}

export async function deleteProject(projectId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')
  
  // First verify the user is the creator of the project
  const { data: projectData, error: fetchError } = await supabase
    .from('projects')
    .select('creator_id')
    .eq('id', projectId)
    .single()
  
  if (fetchError) throw fetchError
  if (projectData.creator_id !== user.id) {
    throw new Error('Only the project creator can delete this project')
  }
  
  // Delete the project (applications will be deleted automatically due to CASCADE)
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
  
  if (error) throw error
}

export function formatWhatsAppLink(number: string): string {
  const cleaned = number.replace(/\D/g, '')
  const withCountryCode = cleaned.startsWith('20') ? cleaned : '20' + cleaned
  return 'https://wa.me/' + withCountryCode
}
