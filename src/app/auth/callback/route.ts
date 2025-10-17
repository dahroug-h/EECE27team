import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirect')


  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the original page if provided, otherwise go to home
  if (redirectTo) {
    const redirectUrl = requestUrl.origin + redirectTo
    return NextResponse.redirect(redirectUrl)
  }
  
  // If no redirect parameter, redirect to a page that will check localStorage
  return NextResponse.redirect(requestUrl.origin + '/auth/redirect')
}
