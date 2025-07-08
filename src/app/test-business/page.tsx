// app/test-business/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Define the types
type Business = {
  id: string
  name: string
  subdomain: string
  plan: string
  logoUrl?: string
  brandColors?: Record<string, string> // e.g., { primary: "#fff", secondary: "#000" }
}

type User = {
  id: string
  name: string
  email: string
  role: string
}

type BusinessInfo = {
  user: User
  business: Business
}

export default function TestBusiness() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        // Get current user's session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setError('You need to be logged in')
          setLoading(false)
          return
        }

        const response = await fetch('/api/user/business', {
          headers: {
            'authorization': `Bearer ${session.access_token}`
          }
        })
        const data = await response.json()
        
        if (response.ok) {
          setBusinessInfo(data)
        } else {
          setError(data.error)
        }
      } catch (err) {
        console.error('Failed to fetch business info:', err)
        setError('Failed to fetch business info')
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return (
    <div className="p-8">
      <div className="text-red-600 mb-4">Error: {error}</div>
      <a href="/login" className="text-blue-600 hover:underline">
        Go to Login
      </a>
    </div>
  )

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Business Info</h1>
      
      {businessInfo && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h2 className="text-xl font-semibold">{businessInfo.business.name}</h2>
            <p>Subdomain: {businessInfo.business.subdomain}</p>
            <p>Plan: {businessInfo.business.plan}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold">Your Info:</h3>
            <p>Name: {businessInfo.user.name}</p>
            <p>Email: {businessInfo.user.email}</p>
            <p>Role: {businessInfo.user.role}</p>
          </div>
        </div>
      )}
    </div>
  )
}