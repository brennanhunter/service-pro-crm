import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import NewServiceModal from '@/features/services/components/NewServiceModal'
import ServiceDetailsModal from '@/features/services/components/ServiceDetailsModal'
import { Customer, Service } from '@/types'

interface CustomerDetailsModalProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  getCustomerServices: (customerEmail: string) => Service[]
  onUpdateCustomer?: (customerId: string, customerData: UpdateCustomerData) => Promise<void>
  onDeleteCustomer?: (customerId: string) => Promise<void>
  onCreateService?: (serviceData: {
    title: string
    description: string
    customerName: string
    customerEmail: string
  }) => Promise<void>
  onServiceStatusUpdate?: (serviceId: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => Promise<void>
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
  onDeleteCustomer,
  onCreateService,
  onServiceStatusUpdate
}: CustomerDetailsModalProps) {
  const [deletingCustomer, setDeletingCustomer] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [updatingCustomer, setUpdatingCustomer] = useState(false)
  const [editFormError, setEditFormError] = useState<string | null>(null)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  
  // New service creation state
  const [showNewServiceModal, setShowNewServiceModal] = useState(false)
  const [creatingService, setCreatingService] = useState(false)
  
  // Service details modal state
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  
  const [editCustomerData, setEditCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  if (!customer) return null

  const customerServices = getCustomerServices(customer.email)
  const activeServices = customerServices.filter(s => s.status !== 'COMPLETED')
  const completedServices = customerServices.filter(s => s.status === 'COMPLETED')

  const handleClose = () => {
    setIsEditingCustomer(false)
    setEditFormError(null)
    setShowDeleteConfirm(false)
    setShowNewServiceModal(false)
    setShowActionsMenu(false)
    setShowServiceModal(false)
    setSelectedService(null)
    onClose()
  }

  const handleStartEdit = () => {
    setIsEditingCustomer(true)
    setEditCustomerData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? '',
      address: customer.address ?? '',
      notes: customer.notes ?? ''
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

    if (!onUpdateCustomer) return

    setUpdatingCustomer(true)
    setEditFormError(null)

    try {
      await onUpdateCustomer(customer.id, editCustomerData)
      setIsEditingCustomer(false)
    } catch (err) {
      setEditFormError(err instanceof Error ? err.message : 'Failed to update customer')
    } finally {
      setUpdatingCustomer(false)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!onDeleteCustomer) return

    setDeletingCustomer(true)
    setEditFormError(null)

    try {
      await onDeleteCustomer(customer.id)
      handleClose()
    } catch (err) {
      setEditFormError(err instanceof Error ? err.message : 'Failed to delete customer')
    } finally {
      setDeletingCustomer(false)
    }
  }

  // Handle service creation from customer modal
  const handleCreateService = async (serviceData: {
    title: string
    description: string
    customerName: string
    customerEmail: string
  }) => {
    if (!onCreateService) return

    setCreatingService(true)
    
    try {
      await onCreateService(serviceData)
      setShowNewServiceModal(false)
    } catch (err) {
      // Error handling is done in the parent component
      throw err
    } finally {
      setCreatingService(false)
    }
  }

  // Handle service click to open details modal
  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setShowServiceModal(true)
  }

  // Handle service modal close
  const handleServiceModalClose = () => {
    setShowServiceModal(false)
    setSelectedService(null)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="" // We'll handle the title ourselves
        size="xl"
        disabled={updatingCustomer || deletingCustomer}
      >
        <div className="space-y-0">
          {/* HubSpot-style Header */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Customer Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Customer Name & Info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                  <p className="text-gray-600 mt-1">{customer.email}</p>
                  {customer.phone && (
                    <p className="text-gray-500 text-sm mt-0.5">{customer.phone}</p>
                  )}
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowNewServiceModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  + New Service
                </button>
                
                {/* Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Actions
                    <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showActionsMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowActionsMenu(false)
                            handleStartEdit()
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Edit Customer
                        </button>
                        <button
                          onClick={() => {
                            setShowActionsMenu(false)
                            setShowDeleteConfirm(true)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete Customer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-3 gap-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{customerServices.length}</div>
                <div className="text-sm text-gray-600">Total Services</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{activeServices.length}</div>
                <div className="text-sm text-gray-600">Active Services</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedServices.length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          {editFormError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {editFormError}
            </div>
          )}

          {/* Main Content */}
          <div className="pt-6">
            {isEditingCustomer ? (
              /* Edit Form */
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Customer Information</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={editCustomerData.name}
                      onChange={(e) => setEditCustomerData({...editCustomerData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={updatingCustomer}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={editCustomerData.email}
                      onChange={(e) => setEditCustomerData({...editCustomerData, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={updatingCustomer}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editCustomerData.phone}
                      onChange={(e) => setEditCustomerData({...editCustomerData, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={updatingCustomer}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={editCustomerData.address}
                      onChange={(e) => setEditCustomerData({...editCustomerData, address: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={updatingCustomer}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editCustomerData.notes}
                      onChange={(e) => setEditCustomerData({...editCustomerData, notes: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={updatingCustomer}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={handleCancelEdit}
                    disabled={updatingCustomer}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCustomer}
                    disabled={updatingCustomer}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updatingCustomer ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              /* Customer Details & Services */
              <div className="space-y-6">
                {/* Customer Information Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-gray-900">{customer.email}</p>
                      </div>
                      {customer.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                          <p className="mt-1 text-gray-900">{customer.phone}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {customer.address && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Address</label>
                          <p className="mt-1 text-gray-900">{customer.address}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Customer Since</label>
                        <p className="mt-1 text-gray-900">
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {customer.notes && (
                    <div className="mt-6 pt-6 border-t">
                      <label className="block text-sm font-medium text-gray-500">Notes</label>
                      <p className="mt-2 text-gray-900 bg-gray-50 p-3 rounded-lg">{customer.notes}</p>
                    </div>
                  )}
                </div>

                {/* Services Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Service History</h2>
                    <button
                      onClick={() => setShowNewServiceModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      + Add Service
                    </button>
                  </div>
                  
                  {customerServices.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
                      <p className="text-gray-600 mb-4">Get started by creating {customer.name}&apos;s first service.</p>
                      <button
                        onClick={() => setShowNewServiceModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Create First Service
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customerServices.map((service) => (
                        <div 
                          key={service.id} 
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer group"
                          onClick={() => handleServiceClick(service)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {service.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <StatusBadge status={service.status} size="sm" />
                              <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Created: {new Date(service.createdAt || '').toLocaleDateString()}</span>
                            {service.updatedAt && (
                              <span>Updated: {new Date(service.updatedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">Delete Customer</h3>
              <p className="text-red-700 mb-4">
                Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be undone.
              </p>
              {customerServices.length > 0 && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm">
                    ⚠️ <strong>Warning:</strong> This customer has {customerServices.length} service{customerServices.length !== 1 ? 's' : ''} 
                    that will also be deleted permanently.
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCustomer}
                  disabled={deletingCustomer}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deletingCustomer ? 'Deleting...' : 'Delete Forever'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deletingCustomer}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* New Service Modal - Pre-populated with customer info */}
      <NewServiceModal
        isOpen={showNewServiceModal}
        onClose={() => setShowNewServiceModal(false)}
        onSubmit={handleCreateService}
        isLoading={creatingService}
        prefilledCustomer={{
          name: customer.name,
          email: customer.email
        }}
      />

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          isOpen={showServiceModal}
          onClose={handleServiceModalClose}
          onStatusUpdate={onServiceStatusUpdate || (() => Promise.resolve())}
        />
      )}
    </>
  )
}