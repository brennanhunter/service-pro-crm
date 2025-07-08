'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Customer = {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
}

type Business = {
  name: string
  subdomain: string
}

type Service = {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  customer: Customer
}

type CustomersData = {
  business: Business
  customers: Customer[]
  services: Service[]
}

export default function Customers() {
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false)
const [creatingCustomer, setCreatingCustomer] = useState(false)
const [newCustomer, setNewCustomer] = useState({
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
})
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [data, setData] = useState<CustomersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/login'
      return
    }

    const response = await fetch('/api/customers', {
      headers: {
        'authorization': `Bearer ${session.access_token}`
      }
    })
    const customersData = await response.json()
    
    if (response.ok) {
      console.log('Full customers API response:', customersData)
      setData({
        business: customersData.business,
        customers: customersData.customers,  // Use customers directly from API
        services: customersData.services
      })
    }
  } catch (err) {
    console.error('Failed to fetch customers:', err)
    setError('Failed to load customers')
  } finally {
    setLoading(false)
  }
}
  const handleCreateCustomer = async () => {
  if (!newCustomer.name || !newCustomer.email) {
    setError('Please fill in name and email')
    return
  }

  setCreatingCustomer(true)
  setError(null)

  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      window.location.href = '/login'
      return
    }

    const response = await fetch('/api/customers/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
        notes: newCustomer.notes
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create customer')
    }

    // Success! Close modal and refresh data
    setShowAddCustomerForm(false)
    setNewCustomer({ name: '', email: '', phone: '', address: '', notes: '' })
    
    // Refresh the customer data
    await fetchCustomers()

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create customer')
  } finally {
    setCreatingCustomer(false)
  }
}

  if (loading) return <div className="p-8">Loading customers...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {data?.business.name} Customers
                </h1>
                <p className="text-gray-600">Manage your customer relationships</p>
              </div>
              <nav className="flex gap-6">
                <a href="/dashboard" className="text-gray-600 hover:text-blue-600">Services</a>
                <a href="/customers" className="text-blue-600 font-medium">Customers</a>
              </nav>
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setShowAddCustomerForm(true)}
            >
              + Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Customers</h3>
            <p className="text-3xl font-bold text-blue-600">{data?.customers.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">New This Month</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Active Services</h3>
            <p className="text-3xl font-bold text-gray-600">0</p>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">All Customers</h2>
          </div>
          <div className="overflow-x-auto">
            {data?.customers.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <p className="text-lg mb-2">No customers yet</p>
                <p className="text-sm mb-4">Customers are automatically added when you create services</p>
                <a 
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block"
                >
                  Create First Service
                </a>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50" onClick={() => setSelectedCustomer(customer)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {/* Customer Details Modal */}
{selectedCustomer && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
          <p className="text-gray-600">{selectedCustomer.email}</p>
          {selectedCustomer.phone && <p className="text-gray-600">{selectedCustomer.phone}</p>}
        </div>
        <button 
          onClick={() => setSelectedCustomer(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="border-t pt-4">
  <h4 className="font-semibold mb-3">Service History</h4>
  {(() => {
        console.log('Selected customer:', selectedCustomer.email)
    console.log('All services:', data?.services)
    // Filter services for this customer
    const customerServices = data?.services?.filter(service => 
      service.customer.email === selectedCustomer.email
    ) || []

    console.log('Filtered services:', customerServices)
    
    return customerServices.length === 0 ? (
      <p className="text-gray-500">No services yet</p>
    ) : (
      <div className="space-y-3">
        {customerServices.map((service) => (
          <div key={service.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">{service.title}</h5>
                <p className="text-gray-600 text-sm">{service.description}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Created: {new Date(service.createdAt).toLocaleDateString()}
                </p>
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
    )
  })()}
</div>
    </div>
  </div>
)}
{/* Add Customer Form Modal */}
{showAddCustomerForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Add New Customer</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Smith"
            disabled={creatingCustomer}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="john@example.com"
            disabled={creatingCustomer}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="(555) 123-4567"
            disabled={creatingCustomer}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="123 Main St, City, State"
            disabled={creatingCustomer}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={newCustomer.notes}
            onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Additional notes about this customer..."
            disabled={creatingCustomer}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={() => {
            setShowAddCustomerForm(false)
            setNewCustomer({ name: '', email: '', phone: '', address: '', notes: '' })
            setError(null)
          }}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={creatingCustomer}
        >
          Cancel
        </button>
        <button
          onClick={handleCreateCustomer}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={creatingCustomer}
        >
          {creatingCustomer ? 'Creating...' : 'Add Customer'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}