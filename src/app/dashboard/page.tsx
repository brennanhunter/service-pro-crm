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
  const [currentStatus, setCurrentStatus] = useState<string>('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewServiceForm, setShowNewServiceForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    customerName: '',
    customerEmail: ''
  })

  useEffect(() => {
    fetchDashboard()
  }, [])

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
  console.log('Full dashboard data:', dashboardData)
  setData(dashboardData)
  console.log('Services data:', dashboardData.services) // Use dashboardData instead of data
}
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

const handleStatusUpdate = async (serviceId: string, newStatus: string) => {
  setUpdatingStatus(true)
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/login'
      return
    }

    const response = await fetch(`/api/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        status: newStatus
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update status')
    }

    // Success! Close modal and refresh data
    await fetchDashboard()

  } catch (err) {
    console.error('Failed to update status:', err)
    setError(err instanceof Error ? err.message : 'Failed to update status')
  } finally {
    setUpdatingStatus(false)
  }
}

const handleCreateService = async () => {
  if (!newService.title || !newService.description || !newService.customerName || !newService.customerEmail) {
    setError('Please fill in all required fields')
    return
  }

    setCreating(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/services/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: newService.title,
          description: newService.description,
          customerName: newService.customerName,
          customerEmail: newService.customerEmail,
          priority: 'MEDIUM'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create service')
      }

      // Success! Close modal and refresh data
      setShowNewServiceForm(false)
      setNewService({ title: '', description: '', customerName: '', customerEmail: '' })
      
      // Refresh the dashboard data
      await fetchDashboard()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="p-8">Loading your dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
<div className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.business.name} Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <nav className="flex gap-6">
          <a href="/dashboard" className="text-blue-600 font-medium">Services</a>
          <a href="/customers" className="text-gray-600 hover:text-blue-600">Customers</a>
        </nav>
      </div>
      <button 
        onClick={() => setShowNewServiceForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        + New Service
      </button>
    </div>
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
            {data?.services.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <p className="text-lg mb-2">No services yet</p>
                <p className="text-sm mb-4">Create your first service ticket to get started</p>
                <button
                  onClick={() => setShowNewServiceForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Create Service
                </button>
              </div>
            ) : (
              data?.services.map(service => (
  <div 
    key={service.id} 
    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
    onClick={() => setSelectedService(service)}
  >
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
))
            )}
          </div>
        </div>
      </div>

      {/* New Service Form Modal */}
      {showNewServiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Service Request</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({...newService, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What needs to be fixed?"
                  disabled={creating}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the problem..."
                  disabled={creating}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newService.customerName}
                  onChange={(e) => setNewService({...newService, customerName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Customer's name"
                  disabled={creating}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Email *
                </label>
                <input
                  type="email"
                  value={newService.customerEmail}
                  onChange={(e) => setNewService({...newService, customerEmail: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="customer@email.com"
                  disabled={creating}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowNewServiceForm(false)
                  setNewService({ title: '', description: '', customerName: '', customerEmail: '' })
                  setError(null)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateService}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedService && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Service Details</h3>
      <p><strong>Title:</strong> {selectedService.title}</p>
      <p><strong>Customer:</strong> {selectedService.customer.name}</p>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select 
          value={currentStatus || selectedService.status} 
          className="w-full p-2 border border-gray-300 rounded"
          disabled={updatingStatus}
          onChange={(e) => {
            setCurrentStatus(e.target.value)
            handleStatusUpdate(selectedService.id, e.target.value)
          }}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      
      <button 
        onClick={() => {
          setSelectedService(null)
          setCurrentStatus('')
        }}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  )
}