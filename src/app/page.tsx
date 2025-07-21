'use client'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Hero from './components/Hero'
import ProblemSolution from './components/ProblemSolution'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Redirect to dashboard if already logged in
        window.location.href = '/dashboard'
      }
    }
    
    checkAuth()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <ProblemSolution />
    </main>
  )
}
