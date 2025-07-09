'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Import our new components
import DashboardHeader from './components/DashboardHeader'
import StatsGrid from './components/StatsGrid'
import ServicesList from './components/ServicesList'
import NewServiceModal from './components/NewServiceModal'
import ServiceDetailsModal from './components/ServiceDetailsModal'
import LoadingSpinner from './components/LoadingSpinner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Service = {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  customer: {
    name: string
    email: string
  }
  createdAt?: string
  updatedAt?: string
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
  // Data state
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [showNewServiceModal, setShowNewServiceModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  
  // Loading and error state
  const [creatingService, setCreatingService] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        console.log('Services data:', dashboardData.services)
      } else {
        throw new Error(dashboardData.error || 'Failed to fetch dashboard')
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = async (serviceData: {
    title: string
    description: string
    customerName: string
    customerEmail: string
  }) => {
    setCreatingService(true)
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
          title: serviceData.title,
          description: serviceData.description,
          customerName: serviceData.customerName,
          customerEmail: serviceData.customerEmail,
          priority: 'MEDIUM'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create service')
      }

      // Success! Close modal and refresh data
      setShowNewServiceModal(false)
      await fetchDashboard()

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create service'
      setError(errorMessage)
      throw err // Re-throw so modal can handle it
    } finally {
      setCreatingService(false)
    }
  }

  const handleStatusUpdate = async (serviceId: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    setUpdatingStatus(true)
    setError(null)
    
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

      // Success! Refresh data and close modal
      await fetchDashboard()
      setSelectedService(null)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status'
      setError(errorMessage)
      throw err // Re-throw so modal can handle it
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setError(null) // Clear any previous errors
  }

  const handleCloseNewServiceModal = () => {
    setShowNewServiceModal(false)
    setError(null)
  }

  const handleCloseServiceDetailsModal = () => {
    setSelectedService(null)
    setError(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    )
  }

  // Error state (if data failed to load)
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-600 mb-4">{error || 'Something went wrong'}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Calculate stats
  const totalServices = data.services.length
  const activeServices = data.services.filter(s => s.status !== 'COMPLETED').length
  const completedServices = data.services.filter(s => s.status === 'COMPLETED').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        businessName={data.business.name}
        currentPage="services"
        onCreateService={() => setShowNewServiceModal(true)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <StatsGrid
          totalServices={totalServices}
          activeServices={activeServices}
          completedServices={completedServices}
          className="mb-8"
        />

        {/* Services List */}
        <ServicesList
          services={data.services}
          onServiceClick={handleServiceClick}
          onCreateService={() => setShowNewServiceModal(true)}
        />
      </div>

      {/* Modals */}
      <NewServiceModal
        isOpen={showNewServiceModal}
        onClose={handleCloseNewServiceModal}
        onSubmit={handleCreateService}
        isLoading={creatingService}
        error={error}
      />

      <ServiceDetailsModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={handleCloseServiceDetailsModal}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={updatingStatus}
        error={error}
      />
    </div>
  )
}