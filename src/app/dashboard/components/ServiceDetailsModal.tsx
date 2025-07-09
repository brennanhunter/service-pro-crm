import { useState } from 'react'
import StatusBadge from './StatusBadge'

interface Service {
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

interface ServiceDetailsModalProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (serviceId: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => Promise<void>
  isUpdating?: boolean
  error?: string | null
}

export default function ServiceDetailsModal({
  service,
  isOpen,
  onClose,
  onStatusUpdate,
  isUpdating = false,
  error = null
}: ServiceDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | ''>('')

  // Don't render if not open or no service
  if (!isOpen || !service) return null

  const handleStatusChange = async (newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    setSelectedStatus(newStatus)
    try {
      await onStatusUpdate(service.id, newStatus)
      // No need to use the result here; parent handles update
    } catch {
      setSelectedStatus('')
    }
  }

  const handleClose = () => {
    if (!isUpdating) {
      setSelectedStatus('')
      onClose()
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'Unknown'
    }
  }

  const getStatusOptions = () => {
    const options = [
      { value: 'PENDING', label: 'Pending' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'COMPLETED', label: 'Completed' }
    ]
    return options
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Service Details
          </h3>
          <button
            onClick={handleClose}
            disabled={isUpdating}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Service Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title
              </label>
              <h4 className="text-lg font-semibold text-gray-900">
                {service.title}
              </h4>
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {service.description}
              </p>
            </div>

            {/* Customer Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Information
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium text-gray-900">{service.customer.name}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a 
                    href={`mailto:${service.customer.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {service.customer.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <StatusBadge status={service.status} size="lg" />
            </div>

            {/* Status Update */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={selectedStatus || service.status}
                onChange={(e) => handleStatusChange(e.target.value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED')}
                disabled={isUpdating}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getStatusOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {isUpdating && (
                <p className="text-sm text-gray-500 mt-1">
                  Updating status...
                </p>
              )}
            </div>

            {/* Timestamps */}
            {(service.createdAt || service.updatedAt) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                  {service.createdAt && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-1 text-gray-900">{formatDate(service.createdAt)}</span>
                    </div>
                  )}
                  {service.updatedAt && service.updatedAt !== service.createdAt && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-gray-600">Last updated:</span>
                      <span className="ml-1 text-gray-900">{formatDate(service.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isUpdating}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}