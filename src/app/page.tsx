'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Hero from './components/Hero'
import ProblemSolution from './components/ProblemSolution'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Use Next.js router for better mobile compatibility
        router.push('/dashboard')
      }
    }
    
    checkAuth()
  }, [router])

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <ProblemSolution />
    </main>
  )
}
