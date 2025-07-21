'use client'

export default function EnvDebug() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not found',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found (hidden)' : 'Not found',
    NODE_ENV: process.env.NODE_ENV || 'Not found'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <pre className="text-sm">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>
        
        <div className="mt-6 space-y-2">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              alert('Storage cleared!');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Clear Storage
          </button>
        </div>
      </div>
    </div>
  )
}
