'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Sidebar } from '@/components/ui/Sidebar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ServicesList from '@/features/services/components/ServicesList'
import NewServiceModal from '@/features/services/components/NewServiceModal'
import ServiceDetailsModal from '@/features/services/components/ServiceDetailsModal'

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

type ServicesData = {
  business: Business
  services: Service[]
}

export default function ServicesPage() {
  const [data, setData] = useState<ServicesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewServiceModal, setShowNewServiceModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [creatingService, setCreatingService] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
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
        setData({
          business: dashboardData.business,
          services: dashboardData.services
        })
      } else {
        throw new Error(dashboardData.error || 'Failed to fetch services')
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setError(err instanceof Error ? err.message : 'Failed to load services')
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

      setShowNewServiceModal(false)
      await fetchServices()

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create service'
      setError(errorMessage)
      throw err
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

      await fetchServices()
      setSelectedService(null)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status'
      setError(errorMessage)
      throw err
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setError(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar businessName="Loading..." />
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner size="lg" text="Loading services..." />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar businessName="Error" />
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Services</h3>
              <p className="text-gray-600 mb-4">{error || 'Something went wrong'}</p>
              <button
                onClick={fetchServices}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { business, services } = data

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar businessName={business.name} />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-2">Manage all your service requests and track their progress</p>
            </div>
            <button
              onClick={() => setShowNewServiceModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Service</span>
            </button>
          </div>

          {/* Services List */}
          <ServicesList
            services={services}
            onServiceClick={handleServiceClick}
            onCreateService={() => setShowNewServiceModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <NewServiceModal
        isOpen={showNewServiceModal}
        onClose={() => {
          setShowNewServiceModal(false)
          setError(null)
        }}
        onSubmit={handleCreateService}
        isLoading={creatingService}
      />

      <ServiceDetailsModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => {
          setSelectedService(null)
          setError(null)
        }}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={updatingStatus}
        error={error}
      />
    </div>
  )
}
