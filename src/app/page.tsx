'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthButton } from '@/components/auth-button'
import { getUser, getProfile, getAllProjects, getUserApplication } from '@/lib/supabase/queries'
import { Project } from '@/lib/types'
import { Plus, Users } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [userApplications, setUserApplications] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getUser()
      setUser(currentUser)

      if (currentUser) {
        const userProfile = await getProfile(currentUser.id)
        setProfile(userProfile)

        if (!userProfile) {
          // Redirect to setup-profile with current URL as redirect parameter
          const currentUrl = window.location.pathname
          router.push(`/setup-profile?redirect=${encodeURIComponent(currentUrl)}`)
          return
        }

        // Load projects and user applications
        const [projectsData, allProjects] = await Promise.all([
          getAllProjects(),
          getAllProjects()
        ])

        setProjects(projectsData)

        // Get user applications for each project
        const applicationPromises = allProjects.map(project => 
          getUserApplication(project.id, currentUser.id)
        )
        const applications = await Promise.all(applicationPromises)
        
        const appliedProjectIds = new Set(
          applications
            .filter(app => app !== null)
            .map(app => app!.project_id)
        )
        setUserApplications(appliedProjectIds)
      }
      
      setIsLoading(false)
    }

    loadData()
  }, [router])

  const handleSignOut = () => {
    setUser(null)
    setProfile(null)
    setProjects([])
    setUserApplications(new Set())
  }

  if (isLoading) {
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">EECE27</CardTitle>
            <CardDescription>
            Find your project squad 🔥
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthButton isAuthenticated={false} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Image 
              src="/logo.png" 
              alt="EECE 27 Logo" 
              width={120} 
              height={40} 
              className="h-8 w-auto"
            />
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/create">
                <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Create Project</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </Link>
              <AuthButton isAuthenticated={true} onSignOut={handleSignOut} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Projects</h2>
          <p className="text-gray-600"></p>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-8 sm:py-12">
            <CardContent className="px-4 sm:px-6">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">Be the first to create a project and start building your team!</p>
              <Link href="/create">
                <Button className="text-sm sm:text-base">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
                  <CardTitle className="text-base sm:text-lg">{project.name}</CardTitle>
                  <CardDescription>
                    
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  {project.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {project.applications_count || 0} Available
                    </div>
                    <Link href={`/p/${project.slug}`}>
                      <Button variant="outline" size="sm" className="px-2 sm:px-3 text-xs sm:text-sm">
                        {userApplications.has(project.id) ? 'View Applications' : 'View Project'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
