interface DashboardHeaderProps {
  businessName: string
  currentPage: 'services' | 'customers'
  onPrimaryAction: () => void
  primaryActionLabel?: string
  subtitle?: string
  className?: string
}

export default function DashboardHeader({ 
  businessName, 
  currentPage,
  onPrimaryAction,
  primaryActionLabel,
  subtitle,
  className = '' 
}: DashboardHeaderProps) {
  // Default labels and subtitles based on current page
  const defaultPrimaryActionLabel = currentPage === 'services' ? 'New Service' : 'Add Customer'
  const defaultSubtitle = currentPage === 'services' 
    ? "Welcome back! Here's what's happening." 
    : "Manage your customer relationships"
  
  const finalPrimaryActionLabel = primaryActionLabel || defaultPrimaryActionLabel
  const finalSubtitle = subtitle || defaultSubtitle

  return (
    <div className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4">
          
          {/* Left side - Title and Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            {/* Business name and subtitle */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {businessName} {currentPage === 'services' ? 'Dashboard' : 'Customers'}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                {finalSubtitle}
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

          {/* Right side - Action buttons */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <button 
              onClick={onPrimaryAction}
              className="
                inline-flex items-center gap-2 px-4 py-2 
                bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                text-white font-medium rounded-lg 
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                shadow-sm hover:shadow-md
              "
              aria-label={`${finalPrimaryActionLabel.toLowerCase()}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">{finalPrimaryActionLabel}</span>
              <span className="sm:hidden">{currentPage === 'services' ? 'New' : 'Add'}</span>
            </button>
            
            <button 
              onClick={async () => {
                const { signOut } = await import('@/lib/auth')
                await signOut()
                window.location.href = '/login'
              }}
              className="
                inline-flex items-center gap-2 px-4 py-2 
                bg-gray-600 hover:bg-gray-700 active:bg-gray-800
                text-white font-medium rounded-lg 
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                shadow-sm hover:shadow-md
              "
              aria-label="Sign out"
            >
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}