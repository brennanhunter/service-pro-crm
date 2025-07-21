'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmail } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await signInWithEmail(email, password)
      setMessage('✅ Login successful! Redirecting...')
      console.log('Logged in user:', result.user)
      
      // Use Next.js router for better mobile compatibility
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
      
    } catch (error) {
      let errorMessage = 'Login failed'
      if (error instanceof Error) {
        errorMessage = `❌ ${errorMessage}: ${error.message}`
      } else {
        errorMessage = `❌ ${errorMessage}: An unknown error occurred`
      }
      setMessage(errorMessage)
      console.log('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
      
      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Welcome
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
              {" "}Back
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Sign in to your ServiceTracker Pro dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-white/5 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-white/5 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Show any messages */}
            {message && (
              <div className="p-4 rounded-lg bg-white/10 border border-white/20 text-sm text-gray-200">
                {message}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg font-semibold text-lg hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Link to signup */}
          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <p className="text-gray-300 text-sm">
              Don&apos;t have an account?{' '}
              <Link 
                href="/signup"
                className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
              >
                Start your free trial
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <Link 
            href="/"
            className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            ← Back to ServiceTracker Pro
          </Link>
        </div>
      </div>
    </div>
  )
}