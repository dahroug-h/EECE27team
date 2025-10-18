'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createProfile, getUser } from '@/lib/supabase/queries'

const sectionOptions = [
  { value: '1', label: 'Section 1' },
  { value: '2', label: 'Section 2' },
  { value: '3', label: 'Section 3' },
  { value: '4', label: 'Section 4' }
]

export default function SetupProfilePage() {
  const [fullName, setFullName] = useState('')
  const [section, setSection] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error loading user:', error)
        router.push('/')
      }
    }
    loadUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !section.trim() || !whatsappNumber.trim()) return

    setIsLoading(true)
    try {
      await createProfile({
        full_name: fullName.trim(),
        section: section.trim(),
        whatsapp_number: whatsappNumber.trim()
      })
      
      // Redirect to the original page if provided, otherwise go to home
      const redirectTo = searchParams.get('redirect')
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl">Fill This</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            one time setup for forever 
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm sm:text-base">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section" className="text-sm sm:text-base">Section</Label>
              <Select value={section} onValueChange={setSection} required>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm sm:text-base">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="e.g., 01234567890"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
                className="text-sm sm:text-base"
              />
              <p className="text-xs sm:text-sm text-gray-500">
                
              </p>
            </div>
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? 'Just a sec...' : 'let\'s go'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
