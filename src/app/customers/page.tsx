'use client'
import { useState } from 'react'
import { useCustomers } from '@/hooks/useCustomers'
import DashboardHeader from '@/components/ui/DashboardHeader'
import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import CustomerDetailsModal from '@/features/customers/components/CustomerDetailsModal'

import { Customer } from '@/types'

export default function Customers() {
  const {
    data,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    totalCustomers,
    customersThisMonth,
    activeServicesCount,
    getCustomerServices
  } = useCustomers()

  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false)
  const [creatingCustomer, setCreatingCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      setFormError('Please fill in name and email')
      return
    }

    setCreatingCustomer(true)
    setFormError(null)

    try {
      await createCustomer(newCustomer)
      
      // Success! Close modal and reset form
      setShowAddCustomerForm(false)
      setNewCustomer({ name: '', email: '', phone: '', address: '', notes: '' })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create customer')
    } finally {
      setCreatingCustomer(false)
    }
  }

  const handleCloseAddForm = () => {
    setShowAddCustomerForm(false)
    setNewCustomer({ name: '', email: '', phone: '', address: '', notes: '' })
    setFormError(null)
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader 
        businessName={data?.business.name || 'Your Business'}
        currentPage="customers"
        onPrimaryAction={() => setShowAddCustomerForm(true)}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Customers</h3>
            <p className="text-3xl font-bold text-blue-600">{totalCustomers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">New This Month</h3>
            <p className="text-3xl font-bold text-green-600">{customersThisMonth}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Active Services</h3>
            <p className="text-3xl font-bold text-purple-600">{activeServicesCount}</p>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">All Customers</h2>
          </div>
          <div className="overflow-x-auto">
            {totalCustomers === 0 ? (
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
                    <tr 
                      key={customer.id} 
                      className="hover:bg-gray-50 cursor-pointer" 
                      onClick={() => setSelectedCustomer(customer)}
                    >
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
      <CustomerDetailsModal
  customer={selectedCustomer}
  isOpen={!!selectedCustomer}
  onClose={() => setSelectedCustomer(null)}
  getCustomerServices={getCustomerServices}
  onUpdateCustomer={updateCustomer}
  onDeleteCustomer={deleteCustomer} // We'll add this function next
/>

      {/* Add Customer Form Modal */}
      <Modal
        isOpen={showAddCustomerForm}
        onClose={handleCloseAddForm}
        title="Add New Customer"
        disabled={creatingCustomer}
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {formError}
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
            onClick={handleCloseAddForm}
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
      </Modal>
    </div>
  )
}