import { useState } from 'react'

interface NewServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (serviceData: {
    title: string
    description: string
    customerName: string
    customerEmail: string
  }) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export default function NewServiceModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error = null
}: NewServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerName: '',
    customerEmail: ''
  })

  const [localError, setLocalError] = useState<string | null>(null)

  // Don't render if not open
  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // Basic validation
    if (!formData.title.trim()) {
      setLocalError('Service title is required')
      return
    }
    if (!formData.description.trim()) {
      setLocalError('Service description is required')
      return
    }
    if (!formData.customerName.trim()) {
      setLocalError('Customer name is required')
      return
    }
    if (!formData.customerEmail.trim()) {
      setLocalError('Customer email is required')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.customerEmail)) {
      setLocalError('Please enter a valid email address')
      return
    }

    try {
      await onSubmit(formData)
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        customerName: '',
        customerEmail: ''
      })
    } catch (err) {
      // Error will be handled by parent component
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        title: '',
        description: '',
        customerName: '',
        customerEmail: ''
      })
      setLocalError(null)
      onClose()
    }
  }

  const displayError = error || localError

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New Service Request
          </h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {displayError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {displayError}
            </div>
          )}

          <div className="space-y-4">
            {/* Service Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="What needs to be fixed?"
                disabled={isLoading}
                required
              />
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe the problem in detail..."
                disabled={isLoading}
                required
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Customer's full name"
                disabled={isLoading}
                required
              />
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Email *
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="customer@email.com"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-150 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}