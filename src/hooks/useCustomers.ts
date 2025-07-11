import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { getCustomers, createCustomer as apiCreateCustomer } from '@/lib/api'
import { 
  CustomersResponse, 
  CreateCustomerData,
  Service 
} from '@/types'

// Add this interface for update data
interface UpdateCustomerData {
  name: string
  email: string
  phone?: string
  address?: string
  notes?: string
}

export function useCustomers() {
  const { isAuthenticated, token } = useAuth()
  const [data, setData] = useState<CustomersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCustomers()
    }
  }, [isAuthenticated, token])

  const fetchCustomers = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      
      const customersData = await getCustomers(token)
      setData(customersData)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
      setError(err instanceof Error ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const createCustomer = async (customerData: CreateCustomerData) => {
    if (!token) throw new Error('No auth token available')

    try {
      const result = await apiCreateCustomer(token, customerData)
      
      // Refresh the customer data after successful creation
      await fetchCustomers()
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create customer'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateCustomer = async (customerId: string, customerData: UpdateCustomerData) => {
    if (!token) throw new Error('No auth token available')

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update customer')
      }

      const result = await response.json()
      
      // Refresh the customer data after successful update
      await fetchCustomers()
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteCustomer = async (customerId: string) => {
  if (!token) throw new Error('No auth token available')

  try {
    const response = await fetch(`/api/customers/${customerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete customer')
    }

    // Refresh the customer data after successful deletion
    await fetchCustomers()
    
    return await response.json()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete customer'
    setError(errorMessage)
    throw new Error(errorMessage)
  }
}

  // Helper functions for calculated data
  const getCustomersThisMonth = () => {
    if (!data?.customers) return 0
    
    return data.customers.filter(customer => {
      const createdDate = new Date(customer.createdAt)
      const now = new Date()
      const thisMonth = now.getMonth()
      const thisYear = now.getFullYear()
      return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
    }).length
  }

  const getActiveServicesCount = () => {
    if (!data?.services) return 0
    return data.services.filter(s => s.status !== 'COMPLETED').length
  }

  const getCustomerServices = (customerEmail: string): Service[] => {
    if (!data?.services) return []
    return data.services.filter(service => service.customer.email === customerEmail)
  }

  return {
    data,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers: fetchCustomers,
    // Calculated values
    totalCustomers: data?.customers.length || 0,
    customersThisMonth: getCustomersThisMonth(),
    activeServicesCount: getActiveServicesCount(),
    getCustomerServices
  }
}