'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Check localStorage for the stored redirect URL
    const storedRedirect = localStorage.getItem('auth_redirect')
    
    if (storedRedirect) {
      // Clear the stored redirect and navigate to it
      localStorage.removeItem('auth_redirect')
      router.push(storedRedirect)
    } else {
      // No stored redirect, go to home
      router.push('/')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
