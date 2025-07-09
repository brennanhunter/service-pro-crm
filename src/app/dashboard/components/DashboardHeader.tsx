interface DashboardHeaderProps {
  businessName: string
  currentPage: 'services' | 'customers'
  onCreateService: () => void
  className?: string
}

export default function DashboardHeader({ 
  businessName, 
  currentPage,
  onCreateService,
  className = '' 
}: DashboardHeaderProps) {
  return (
    <div className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4">
          
          {/* Left side - Title and Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            {/* Business name and subtitle */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {businessName} Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Welcome back! Here's what's happening.
              </p>
            </div>
            
            {/* Navigation */}
            <nav className="flex gap-6" role="navigation" aria-label="Main navigation">
              <a 
                href="/dashboard" 
                className={`
                  font-medium transition-colors duration-150 pb-1 border-b-2
                  ${currentPage === 'services' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 border-transparent hover:border-gray-300'
                  }
                `}
                aria-current={currentPage === 'services' ? 'page' : undefined}
              >
                Services
              </a>
              <a 
                href="/customers" 
                className={`
                  font-medium transition-colors duration-150 pb-1 border-b-2
                  ${currentPage === 'customers' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 border-transparent hover:border-gray-300'
                  }
                `}
                aria-current={currentPage === 'customers' ? 'page' : undefined}
              >
                Customers
              </a>
            </nav>
          </div>

          {/* Right side - Action button */}
          <div className="flex-shrink-0">
            <button 
              onClick={onCreateService}
              className="
                inline-flex items-center gap-2 px-4 py-2 
                bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                text-white font-medium rounded-lg 
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                shadow-sm hover:shadow-md
              "
              aria-label="Create new service request"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">New Service</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}