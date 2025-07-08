// app/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Service = {
  id: string
  title: string
  description: string
  status: string
  customer: {
    name: string
    email: string
  }
}

type Business = {
  name: string
  subdomain: string
}

type DashboardData = {
  business: Business
  services: Service[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

// In app/dashboard/page.tsx, update the useEffect:

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If no session, redirect to login
      if (!session) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/dashboard', {
        headers: {
          'authorization': `Bearer ${session.access_token}`
        }
      })
      const dashboardData = await response.json()
      
      if (response.ok) {
        setData(dashboardData)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  fetchDashboard()
}, [])

  if (loading) return <div className="p-8">Loading your dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.business.name} Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Services</h3>
            <p className="text-3xl font-bold text-blue-600">{data?.services.length || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Active Services</h3>
            <p className="text-3xl font-bold text-green-600">
              {data?.services.filter(s => s.status !== 'COMPLETED').length || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold text-gray-600">
              {data?.services.filter(s => s.status === 'COMPLETED').length || 0}
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Recent Services</h2>
          </div>
          <div className="divide-y">
            {data?.services.map(service => (
              <div key={service.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                    <p className="text-gray-500 text-sm">Customer: {service.customer.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    service.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}