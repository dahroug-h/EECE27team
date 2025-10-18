'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createProject } from '@/lib/supabase/queries'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateProjectPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const project = await createProject(
        name.trim(),
        description.trim() || undefined
      )
      router.push(`/p/${project.slug}`)
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Card>
          <CardHeader className="px-3 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-lg sm:text-xl">Create New Project</CardTitle>
            <CardDescription>
              
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Project Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., E-commerce Website, Mobile App"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project goals, technologies, or what you're looking for in team members..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full text-sm sm:text-base">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 text-sm sm:text-base" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
