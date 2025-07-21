'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Hero from './components/Hero'
import ProblemSolution from './components/ProblemSolution'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('Auth check error:', error)
          // Don't block the page for auth errors
        }
        
        if (session) {
          // Redirect to dashboard if already logged in
          window.location.href = '/dashboard'
          return
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setError('Authentication check failed')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // Show loading state briefly
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <ProblemSolution />
    </main>
  )
}
