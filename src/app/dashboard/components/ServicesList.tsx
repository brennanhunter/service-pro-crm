import ServiceCard from './ServiceCard'
import EmptyState from './EmptyState'

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
}

interface ServicesListProps {
  services: Service[]
  onServiceClick: (service: Service) => void
  onCreateService: () => void
  className?: string
}

export default function ServicesList({ 
  services, 
  onServiceClick, 
  onCreateService,
  className = '' 
}: ServicesListProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Services</h2>
          <span className="text-sm text-gray-500">
            {services.length} {services.length === 1 ? 'service' : 'services'}
          </span>
        </div>
      </div>

      {/* Services List or Empty State */}
      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Create your first service ticket to get started with managing customer requests."
          actionLabel="Create Service"
          onAction={onCreateService}
          icon="services"
          className="py-12"
        />
      ) : (
        <div className="divide-y divide-gray-100">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={onServiceClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}