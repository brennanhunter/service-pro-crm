'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'

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
      setMessage('✅ Account created! Redirecting to setup...')
      console.log('New user:', result.user)
      
      // Redirect to onboarding for business setup
      setTimeout(() => {
        window.location.href = '/onboarding'
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

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true)
      setMessage('')
      await signInWithGoogle()
      // Google OAuth will handle the redirect
    } catch (error) {
      let errorMessage = 'Google sign-up failed'
      if (error instanceof Error) {
        errorMessage = `❌ ${errorMessage}: ${error.message}`
      }
      setMessage(errorMessage)
      console.log('Google sign-up error:', error)
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
            Join thousands of service businesses using ServiceTracker Pro
          </p>
          <p className="text-cyan-300 text-sm mt-2">
            ✨ No credit card required • Quick 2-minute setup
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

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Google Sign-Up Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full bg-white text-gray-700 p-4 rounded-lg font-semibold text-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{isLoading ? 'Signing Up...' : 'Continue with Google'}</span>
          </button>

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