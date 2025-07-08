// app/auth-test/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient, User } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthTest() {
  const [user, setUser] = useState<User | null>(null)  // ← Fixed the type!
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if someone is logged in when page loads
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      console.log('Auth event:', event, session?.user?.email)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <h2 className="font-semibold text-green-800">✅ You are logged in!</h2>
            <p className="text-green-700">Email: {user.email}</p>
            <p className="text-green-700">User ID: {user.id}</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
            <h2 className="font-semibold text-yellow-800">❌ You are not logged in</h2>
          </div>
          
          <a 
            href="/login"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </a>
        </div>
      )}
    </div>
  )
}