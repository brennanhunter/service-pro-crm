import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import { Customer, Service } from '@/types'

interface CustomerDetailsModalProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  getCustomerServices: (customerEmail: string) => Service[]
  onUpdateCustomer?: (customerId: string, customerData: UpdateCustomerData) => Promise<void>
  onDeleteCustomer?: (customerId: string) => Promise<void> 
}

interface UpdateCustomerData {
  name: string
  email: string
  phone?: string
  address?: string
  notes?: string
}

export default function CustomerDetailsModal({
  customer,
  isOpen,
  onClose,
  getCustomerServices,
  onUpdateCustomer,
  onDeleteCustomer
}: CustomerDetailsModalProps) {
    const [deletingCustomer, setDeletingCustomer] = useState(false)
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [updatingCustomer, setUpdatingCustomer] = useState(false)
  const [editFormError, setEditFormError] = useState<string | null>(null)
  const [editCustomerData, setEditCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  const handleClose = () => {
    setIsEditingCustomer(false)
    setEditFormError(null)
    setShowDeleteConfirm(false)
    onClose()
  }

  const handleStartEdit = () => {
    if (!customer) return
    
    setIsEditingCustomer(true)
    setEditCustomerData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: (customer as any).address || '',
      notes: (customer as any).notes || ''
    })
  }

  const handleCancelEdit = () => {
    setIsEditingCustomer(false)
    setEditFormError(null)
  }

  const handleUpdateCustomer = async () => {
    if (!editCustomerData.name || !editCustomerData.email) {
      setEditFormError('Please fill in name and email')
      return
    }

    if (!customer || !onUpdateCustomer) return

    setUpdatingCustomer(true)
    setEditFormError(null)

    try {
      await onUpdateCustomer(customer.id, editCustomerData)
      
      // Close edit mode on success
      setIsEditingCustomer(false)
    } catch (err) {
      setEditFormError(err instanceof Error ? err.message : 'Failed to update customer')
    } finally {
      setUpdatingCustomer(false)
    }
  }

  const handleDeleteCustomer = async () => {
  if (!customer || !onDeleteCustomer) return

  setDeletingCustomer(true)
  setEditFormError(null)

  try {
    await onDeleteCustomer(customer.id)
    handleClose()
  } catch (err) {
    setEditFormError(err instanceof Error ? err.message : 'Failed to delete customer')
  } finally {
    setDeletingCustomer(false)
    setShowDeleteConfirm(false)
  }
}

  if (!customer) return null

  const customerServices = getCustomerServices(customer.email)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditingCustomer ? 'Edit Customer' : customer.name}
      size="lg"
      disabled={updatingCustomer}
    >
      <div className="space-y-6">
        {/* Error Message */}
        {editFormError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {editFormError}
          </div>
        )}

        {/* Customer Info - Display or Edit Mode */}
        <div>
          {isEditingCustomer ? (
            /* Edit Mode - Form Inputs */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={editCustomerData.name}
                  onChange={(e) => setEditCustomerData({...editCustomerData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={updatingCustomer}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={editCustomerData.email}
                  onChange={(e) => setEditCustomerData({...editCustomerData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={updatingCustomer}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editCustomerData.phone || ''}
                  onChange={(e) => setEditCustomerData({...editCustomerData, phone: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={updatingCustomer}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editCustomerData.address || ''}
                  onChange={(e) => setEditCustomerData({...editCustomerData, address: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={updatingCustomer}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editCustomerData.notes || ''}
                  onChange={(e) => setEditCustomerData({...editCustomerData, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={updatingCustomer}
                />
              </div>
            </div>
          ) : (
            /* Display Mode - Show Info */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">{customer.email}</p>
                  {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
                  {/* Show address and notes if available */}
                  {(customer as any).address && (
                    <p className="text-gray-600 text-sm mt-1">📍 {(customer as any).address}</p>
                  )}
                  {(customer as any).notes && (
                    <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-2 rounded">
                      💭 {(customer as any).notes}
                    </p>
                  )}
                </div>
                {onUpdateCustomer && (
  <button
    onClick={handleStartEdit}
    className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
  >
    ✏️ Edit
  </button>
)}
{onDeleteCustomer && customerServices.length === 0 && (
  <button
    onClick={() => setShowDeleteConfirm(true)}
    className="text-red-600 hover:text-red-800 text-sm font-medium"
  >
    🗑️ Delete
  </button>
)}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons for Edit Mode */}
        {isEditingCustomer && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={updatingCustomer}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCustomer}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updatingCustomer}
            >
              {updatingCustomer ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
        
        {/* Delete Confirmation */}
{showDeleteConfirm && (
  <div className="border-t pt-4">
    <div className="bg-red-50 border border-red-200 rounded p-4">
      <h4 className="font-medium text-red-800 mb-2">Delete Customer</h4>
      <p className="text-red-700 text-sm mb-4">
        Are you sure you want to delete this customer? This action cannot be undone.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
          disabled={deletingCustomer}
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteCustomer}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
          disabled={deletingCustomer}
        >
          {deletingCustomer ? 'Deleting...' : 'Delete Customer'}
        </button>
      </div>
    </div>
  </div>
)}
        {/* Service History */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Service History</h4>
          {customerServices.length === 0 ? (
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
                    <StatusBadge status={service.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}