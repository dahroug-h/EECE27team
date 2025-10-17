export interface Profile {
  id: string
  email: string
  full_name: string
  section: string
  whatsapp_number: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  slug: string
  name: string
  description?: string
  team_size?: number
  creator_id: string
  created_at: string
}

export interface Application {
  id: string
  project_id: string
  user_id: string
  created_at: string
  profiles?: Profile
}

export interface ApplicationWithProfile extends Application {
  profiles: Profile
}
