'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signUpWithEmail } from '@/lib/auth'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      if (!name.trim()) {
        setMessage('❌ Please enter your name')
        return
      }
      
      const result = await signUpWithEmail(email, password, name)
      setMessage('✅ Account created! Redirecting to dashboard...')
      console.log('New user:', result.user)
      
      // Redirect to dashboard after successful signup
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
      
    } catch (error) {
      let errorMessage = 'Account creation failed'
      if (error instanceof Error) {
        errorMessage = `❌ ${errorMessage}: ${error.message}`
      } else {
        errorMessage = `❌ ${errorMessage}: An unknown error occurred`
      }
      setMessage(errorMessage)
      console.log('Signup error:', error)
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
            Start Your 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
              {" "}Free Trial
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Join service businesses using ServiceTracker Pro
          </p>
          <p className="text-cyan-300 text-sm mt-2">
            ✨ No credit card required • 30-day free trial
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Full Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-white/5 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Business Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-white/5 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                placeholder="your@business.com"
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
                placeholder="Create a secure password"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Must be at least 6 characters
              </p>
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
              {isLoading ? 'Creating Your Account...' : 'Start Free Trial'}
            </button>
          </form>

          {/* Benefits reminder */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm text-gray-300">
              <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              30-day free trial, no credit card required
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Professional customer portals
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Real-time service tracking
            </div>
          </div>

          {/* Login link */}
          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <Link 
                href="/login"
                className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Social proof */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Trusted by service businesses like{' '}
            <span className="text-cyan-300 font-medium">Xtremery Computer Repair</span>
          </p>
        </div>
      </div>
    </div>
  )
}