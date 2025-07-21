import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'

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
  prefilledCustomer?: {
    name: string
    email: string
  }
}

export default function NewServiceModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  prefilledCustomer
}: NewServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerName: '',
    customerEmail: ''
  })
  const [error, setError] = useState<string | null>(null)

  // Update form when prefilledCustomer changes
  useEffect(() => {
    if (prefilledCustomer) {
      setFormData(prev => ({
        ...prev,
        customerName: prefilledCustomer.name,
        customerEmail: prefilledCustomer.email
      }))
    }
  }, [prefilledCustomer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Please enter a service title')
      return
    }

    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      setError('Customer name and email are required')
      return
    }

    try {
      setError(null)
      await onSubmit({
        title: formData.title,
        description: formData.description,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail
      })
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        customerName: prefilledCustomer?.name || '',
        customerEmail: prefilledCustomer?.email || ''
      })
      
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service')
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        title: '',
        description: '',
        customerName: prefilledCustomer?.name || '',
        customerEmail: prefilledCustomer?.email || ''
      })
      setError(null)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Service"
      disabled={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., AC Repair, Plumbing Fix"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the service needed (optional)..."
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Customer's full name"
            disabled={isLoading || !!prefilledCustomer}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Email *
          </label>
          <input
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="customer@example.com"
            disabled={isLoading || !!prefilledCustomer}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
