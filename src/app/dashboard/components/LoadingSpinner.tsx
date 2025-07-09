interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-8 h-8'
      case 'md':
      default:
        return 'w-6 h-6'
    }
  }

  const getTextSize = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-lg'
      case 'md':
      default:
        return 'text-base'
    }
  }

  const spinnerSize = getSizeClasses(size)
  const textSize = getTextSize(size)

  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      {/* Spinner */}
      <div className={`${spinnerSize} animate-spin`}>
        <svg
          className="w-full h-full text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      
      {/* Loading text */}
      {text && (
        <span className={`text-gray-600 font-medium ${textSize}`}>
          {text}
        </span>
      )}
    </div>
  )
}