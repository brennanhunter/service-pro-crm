import StatusBadge from "@/components/ui/StatusBadge"

interface ServiceCardProps {
  service: {
    id: string
    title: string
    description: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    customer: {
      name: string
      email: string
    }
    createdAt?: string
  }
  onClick: (service: ServiceCardProps['service']) => void
  className?: string
}

export default function ServiceCard({ service, onClick, className = '' }: ServiceCardProps) {
  const handleClick = () => {
    onClick(service)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(service)
    }
  }

  return (
    <div
      className={`
        bg-white border-b border-gray-100 p-6 
        hover:bg-gray-50 cursor-pointer transition-colors duration-150
        focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-inset
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${service.title}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Service Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {service.title}
          </h3>
          
          {/* Service Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {service.description}
          </p>
          
          {/* Customer Info */}
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Customer:</span>
            <span className="ml-1">{service.customer.name}</span>
            {service.customer.email && (
              <span className="text-gray-400 ml-2 hidden sm:inline">
                ({service.customer.email})
              </span>
            )}
          </div>
          
          {/* Created Date (if available) */}
          {service.createdAt && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {/* Status Badge */}
        <div className="flex-shrink-0 ml-4">
          <StatusBadge status={service.status} />
        </div>
      </div>
      
      {/* Click indicator */}
      <div className="flex items-center justify-end mt-3 text-sm text-gray-400">
        <span className="mr-1">Click to view details</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}