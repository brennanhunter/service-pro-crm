interface StatsGridProps {
  totalServices: number
  activeServices: number
  completedServices: number
  className?: string
}

interface StatCardProps {
  title: string
  value: number
  color: 'blue' | 'green' | 'purple'
  icon: React.ReactNode
}

function StatCard({ title, value, color, icon }: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          textColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          iconBg: 'bg-emerald-100'
        }
      case 'purple':
        return {
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          iconBg: 'bg-purple-100'
        }
      case 'blue':
      default:
        return {
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          iconBg: 'bg-blue-100'
        }
    }
  }

  const colors = getColorClasses(color)

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 ${colors.bgColor}/30`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.textColor}`}>
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colors.iconBg}`}>
          <div className={colors.textColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StatsGrid({ 
  totalServices, 
  activeServices, 
  completedServices,
  className = '' 
}: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      <StatCard
        title="Total Services"
        value={totalServices}
        color="blue"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
      
      <StatCard
        title="Active Services"
        value={activeServices}
        color="purple"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
      
      <StatCard
        title="Completed"
        value={completedServices}
        color="green"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  )
}