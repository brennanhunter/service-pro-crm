// app/login/page.tsx
'use client'
import { useState } from 'react'
import { signInWithEmail, signUpWithEmail } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSignUp, setIsSignUp] = useState(false) // Track if we're in signup mode

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        // Handle signup
        if (!name.trim()) {
          setMessage('❌ Please enter your name')
          return
        }
        const result = await signUpWithEmail(email, password, name)
        setMessage('✅ Account created!')
        console.log('New user:', result.user)
      } else {
        // Handle login
        const result = await signInWithEmail(email, password)
        setMessage('✅ Login successful!')
        console.log('Logged in user:', result.user)
      }
    } catch (error) {
      let errorMessage = isSignUp ? 'Sign up failed' : 'Login failed'
      if (error instanceof Error) {
        errorMessage = `❌ ${errorMessage}: ${error.message}`
      } else {
        errorMessage = `❌ ${errorMessage}: An unknown error occurred`
      }
      setMessage(errorMessage)
      console.log('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-center text-gray-600">
            {isSignUp ? 'Join ServiceTracker Pro' : 'Access your business dashboard'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Only show name field when signing up */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Your full name"
                required
              />
            </div>
          )}

          {/* Show any messages */}
          {message && (
            <div className="p-3 rounded-lg bg-gray-100 text-sm">
              {message}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading 
              ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
              : (isSignUp ? 'Create Account' : 'Sign In')
            }
          </button>

          {/* Toggle between login and signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage('')
                setName('')
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}