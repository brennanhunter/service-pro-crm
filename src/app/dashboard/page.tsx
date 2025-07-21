'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/database'
import { Sidebar } from '@/components/ui/Sidebar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import NewServiceModal from '@/features/services/components/NewServiceModal'

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
  brandColors?: {
    primary?: string
    secondary?: string
    [key: string]: string | undefined
  }
}

type DashboardStats = {
  totalCustomers: number
  activeServices: number
  totalRevenue: number
  completedServices: number
}

type DashboardData = {
  business: Business
  services: Service[]
  stats: DashboardStats
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewServiceModal, setShowNewServiceModal] = useState(false)
  const [creatingService, setCreatingService] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      console.log('Starting dashboard fetch...');
      
      // Check if supabase client is available
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      // Simple session check without aggressive retries
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        throw new Error(`Authentication error: ${error.message}`);
      }
      
      if (!session) {
        console.log('No session found, redirecting to login');
        router.push('/login');
        return;
      }

      console.log('Session found, fetching dashboard data...');
      const response = await fetch('/api/dashboard', {
        headers: {
          'authorization': `Bearer ${session.access_token}`
        }
      });
      
      const dashboardData = await response.json()
      
      if (response.ok) {
        // Calculate stats from services data
        const activeServices = dashboardData.services.filter((s: Service) => s.status !== 'COMPLETED').length
        const completedServices = dashboardData.services.filter((s: Service) => s.status === 'COMPLETED').length
        
        // Create unique customer count
        const uniqueCustomers = new Set(dashboardData.services.map((s: Service) => s.customer.email)).size
        
        setData({
          business: dashboardData.business,
          services: dashboardData.services,
          stats: {
            totalCustomers: uniqueCustomers,
            activeServices,
            totalRevenue: 0, // We'll calculate this later if needed
            completedServices,
          }
        });
        
        console.log('Dashboard state updated successfully');
      } else {
        if (response.status === 404) {
          console.log('No business data found, redirecting to onboarding');
          router.push('/onboarding');
        } else {
          throw new Error(dashboardData.error || `Failed to fetch dashboard: ${response.status}`);
        }
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false)
    }
  }

  // Add error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Dashboard error:', event.error);
      setError('An unexpected error occurred. Please refresh the page.');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError('An unexpected error occurred. Please refresh the page.');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    console.log('Dashboard component mounted, fetching data...');
    
    // Check if Supabase environment variables are available
    const hasEnvVars = typeof window !== 'undefined' && 
                      process.env.NEXT_PUBLIC_SUPABASE_URL && 
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                      
    if (!hasEnvVars) {
      console.error('Missing environment variables');
      setError('Application configuration error. Missing Supabase environment variables.');
      setLoading(false);
      return;
    }
    
    fetchDashboard()
  }, [fetchDashboard])

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
      await fetchDashboard()

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create service'
      setError(errorMessage)
      throw err
    } finally {
      setCreatingService(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar businessName="Loading..." />
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner size="lg" text="Loading your dashboard..." />
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
              <p className="text-gray-600 mb-4">{error || 'Something went wrong'}</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setError(null);
                    fetchDashboard();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mr-2"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/login';
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Clear Session & Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { business, stats, services } = data

  // Helper function to get brand colors with fallbacks
  const getBrandColors = () => {
    const colors = business?.brandColors
    return {
      primary: colors?.primary || '#6366f1',
      secondary: colors?.secondary || '#06b6d4'
    }
  }

  const brandColors = getBrandColors()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        businessName={business?.name || 'ServicePro'} 
        brandColors={brandColors}
      />
      
      <div className="flex-1 md:ml-64">        
        <div className="p-4 md:p-8 pt-16 md:pt-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: brandColors.primary }}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: brandColors.secondary }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Services</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeServices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${brandColors.primary}CC` }} // 80% opacity
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${brandColors.secondary}CC` }} // 80% opacity
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedServices}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Services */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Services</h3>
              </div>
              <div className="p-6">
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.slice(0, 5).map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{service.title}</h4>
                          <p className="text-xs text-gray-500">{service.customer.name}</p>
                        </div>
                        <div className="text-right">
                          <span 
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                            style={{
                              backgroundColor: 
                                service.status === 'COMPLETED' ? brandColors.secondary :
                                service.status === 'IN_PROGRESS' ? brandColors.primary :
                                service.status === 'PENDING' ? '#f59e0b' : // amber-500
                                '#6b7280' // gray-500
                            }}
                          >
                            {service.status.replace('_', ' ').toLowerCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No services yet</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => setShowNewServiceModal(true)}
                    className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                      style={{ backgroundColor: brandColors.primary }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Create New Service</span>
                  </button>
                  
                  <a
                    href="/customers"
                    className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                      style={{ backgroundColor: brandColors.secondary }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">View All Customers</span>
                  </a>

                  <a
                    href="/services"
                    className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                      style={{ backgroundColor: brandColors.primary + 'CC' }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Manage Services</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  )
}