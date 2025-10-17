'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AuthButton } from '@/components/auth-button'
import { getUser, getProfile, getProjectBySlug, applyToProject, removeApplication, getApplications, getUserApplication } from '@/lib/supabase/queries'
import { Project, ApplicationWithProfile } from '@/lib/types'
import { ArrowLeft, Users, Calendar, User, MessageCircle, ExternalLink, ChevronDown, Search } from 'lucide-react'

// WhatsApp-style time formatting
function formatTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  
  
  if (diffInSeconds < 60) {
    return 'Just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}

export default function ProjectPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [applications, setApplications] = useState<ApplicationWithProfile[]>([])
  const [userApplication, setUserApplication] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined)
  const [sortBy, setSortBy] = useState('recent')
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const sectionOptions = [
    { value: '1', label: 'Section 1' },
    { value: '2', label: 'Section 2' },
    { value: '3', label: 'Section 3' },
    { value: '4', label: 'Section 4' }
  ]

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = app.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSection = !selectedSection || selectedSection === 'all' || app.profiles.section === selectedSection
      return matchesSearch && matchesSection
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return 0
    })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load project by slug
        const projectData = await getProjectBySlug(slug)
        if (!projectData) {
          router.push('/')
          return
        }
        setProject(projectData)

        // Load user data
        const currentUser = await getUser()
        setUser(currentUser)

        // Load applications for all users (signed in or not)
        const applicationsData = await getApplications(projectData.id)
        setApplications(applicationsData)

        if (currentUser) {
          const userProfile = await getProfile(currentUser.id)
          setProfile(userProfile)

          if (!userProfile) {
            // Redirect to setup-profile with current URL as redirect parameter
            const currentUrl = window.location.pathname
            router.push(`/setup-profile?redirect=${encodeURIComponent(currentUrl)}`)
            return
          }

          // Load user's application status
          const userAppData = await getUserApplication(projectData.id, currentUser.id)
          setUserApplication(userAppData)
        }
      } catch (error) {
        console.error('Error loading project data:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadData()
    }
  }, [slug, router])

  const handleApply = async () => {
    if (!user || !project || userApplication) return

    setIsApplying(true)
    try {
      await applyToProject(project.id)
      // Reload user application status
      const userAppData = await getUserApplication(project.id, user.id)
      setUserApplication(userAppData)
      
      // Reload applications list
      const applicationsData = await getApplications(project.id)
      setApplications(applicationsData)
    } catch (error) {
      console.error('Error applying to project:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const handleRemoveApplication = async () => {
    if (!userApplication) return

    setIsApplying(true)
    try {
      await removeApplication(userApplication.id)
      setUserApplication(null)
      
      // Reload applications list
      if (project) {
        const applicationsData = await getApplications(project.id)
        setApplications(applicationsData)
      }
    } catch (error) {
      console.error('Error removing application:', error)
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Project Not Found</CardTitle>
            <CardDescription>
              The project you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isCreator = user && project.creator_id === user.id

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16">
            {user && (
              <AuthButton isAuthenticated={true} />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle></CardTitle>
              </CardHeader>
               <CardContent className="pt-0">
                 {project.description ? (
                   <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                 ) : (
                   <p className="text-gray-500 italic">No description provided</p>
                 )}
                 
                 {/* Available People Count and Created Date */}
                 <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                   <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
                     <Users className="w-4 h-4 mr-2" />
                     <span className="font-semibold">{applications.length} Available</span>
                   </div>
                   <div className="flex items-center">
                     <Calendar className="w-4 h-4 mr-1" />
                     <span>Created {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                   </div>
                 </div>
               </CardContent>
            </Card>

            {/* Search and Filter Bar */}
            {applications.length > 0 && (
              <div className="mt-4 p-4 bg-white border rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Section Filter */}
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {sectionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                </div>
              </div>
            )}

            {applications.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle></CardTitle>
                  <CardDescription>
                    
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-6 border rounded-lg">
                        <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{application.profiles.full_name}</h4>
                            <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                              Sec: {application.profiles.section}
                            </p>
                            <p className="text-xs text-green-500 font-medium mt-1">
                              {formatTimeAgo(application.created_at)}
                            </p>
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/${application.profiles.whatsapp_number.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {!user ? (
              <Card>
                <CardHeader>
                  <CardTitle></CardTitle>
                  <CardDescription>
                    
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AuthButton isAuthenticated={false} />
                </CardContent>
              </Card>
            ) : isCreator ? (
              <Card>
                <CardHeader>
                  <CardTitle>You created this project</CardTitle>
                  <CardDescription>
                    
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full">
                      <Users className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{applications.length} Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle></CardTitle>
                  <CardDescription>
                    {userApplication 
                      ? ''
                      : ''
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {userApplication ? (
                    <div className="space-y-2">
                      <div className="text-center text-green-600">
                        <Users className="w-6 h-6 mx-auto mb-1" />
                        <p className="font-medium text-sm">You Are here!</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleRemoveApplication}
                        disabled={isApplying}
                        className="w-full"
                      >
                        {isApplying ? 'Removing...' : 'Remove Me'}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleApply}
                      disabled={isApplying}
                      className="w-full"
                    >
                      {isApplying ? 'Applying...' : 'I am available'}
                    </Button>
                  )}
                </CardContent>
              </Card>
             )}
          </div>
        </div>
      </main>
    </div>
  )
}
