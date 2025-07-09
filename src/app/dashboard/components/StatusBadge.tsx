interface StatusBadgeProps {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'Completed',
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800',
          borderColor: 'border-emerald-200'
        }
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        }
      case 'PENDING':
      default:
        return {
          label: 'Pending',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-200'
        }
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs'
      case 'lg':
        return 'px-4 py-2 text-sm'
      case 'md':
      default:
        return 'px-3 py-1 text-sm'
    }
  }

  const config = getStatusConfig(status)
  const sizeClasses = getSizeClasses(size)

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${config.bgColor} 
        ${config.textColor} 
        ${config.borderColor}
        ${sizeClasses}
        ${className}
      `}
    >
      {/* Optional status dot */}
      <span 
        className={`
          w-2 h-2 rounded-full mr-2
          ${status === 'COMPLETED' ? 'bg-emerald-500' : ''}
          ${status === 'IN_PROGRESS' ? 'bg-blue-500' : ''}
          ${status === 'PENDING' ? 'bg-amber-500' : ''}
        `}
      />
      {config.label}
    </span>
  )
}