'use client'

import { Button } from '@/components/ui/button'
import { signInWithGoogle, signOut } from '@/lib/supabase/queries'
import { LogIn, LogOut } from 'lucide-react'

interface AuthButtonProps {
  isAuthenticated: boolean
  onSignOut?: () => void
}

export function AuthButton({ isAuthenticated, onSignOut }: AuthButtonProps) {
  const handleSignIn = async () => {
    await signInWithGoogle()
  }

  const handleSignOut = async () => {
    await signOut()
    onSignOut?.()
  }

  if (isAuthenticated) {
    return (
      <Button onClick={handleSignOut} variant="outline" size="sm">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    )
  }

  return (
    <Button onClick={handleSignIn} size="sm">
      <LogIn className="w-4 h-4 mr-2" />
      Get me in
    </Button>
  )
}
