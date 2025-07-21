'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/database'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash
        
        if (hashFragment) {
          // Parse the hash fragment to get the access token and other params
          const params = new URLSearchParams(hashFragment.substring(1))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          
          if (accessToken) {
            // Set the session using the tokens
            const { data: { user }, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            })
            
            if (error) {
              console.error('Session error:', error)
              router.push('/login?error=session_error')
              return
            }
            
            if (user) {
              // Check if user exists in database
              const response = await fetch('/api/user/check', {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              })
              
              if (response.ok) {
                const data = await response.json()
                if (data.exists) {
                  // User exists, go to dashboard
                  router.push('/dashboard')
                } else {
                  // New user, go to onboarding
                  router.push('/onboarding')
                }
              } else {
                // If check fails, assume new user
                router.push('/onboarding')
              }
            }
          } else {
            console.error('No access token in callback')
            router.push('/login?error=no_token')
          }
        } else {
          console.error('No hash fragment in callback')
          router.push('/login?error=no_hash')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign-in...</p>
      </div>
    </div>
  )
}
