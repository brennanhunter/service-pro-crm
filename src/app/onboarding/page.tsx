'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/database'

export default function OnboardingPage() {
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [primaryGoal, setPrimaryGoal] = useState('')
  const [brandColors, setBrandColors] = useState({
    primary: '#6366f1', // Default indigo
    secondary: '#06b6d4' // Default cyan
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<{ 
    id: string; 
    email?: string; 
    user_metadata?: { full_name?: string }
  } | null>(null)
  const router = useRouter()

  const businessTypes = [
    'HVAC & Air Conditioning',
    'Plumbing',
    'Electrical',
    'Computer & IT Repair',
    'Appliance Repair',
    'Auto Repair',
    'Landscaping & Lawn Care',
    'Cleaning Services',
    'Handyman Services',
    'Other'
  ]

  const teamSizes = [
    'Just me (1)',
    'Small team (2-5)',
    'Medium team (6-20)',
    'Large team (21+)'
  ]

  const primaryGoals = [
    'Organize customer information',
    'Track service requests',
    'Manage scheduling',
    'Improve customer communication',
    'Increase revenue',
    'All of the above'
  ]

  const colorPresets = [
    { name: 'Professional Blue', primary: '#2563eb', secondary: '#06b6d4' },
    { name: 'Business Green', primary: '#059669', secondary: '#34d399' },
    { name: 'Energy Orange', primary: '#ea580c', secondary: '#fb923c' },
    { name: 'Tech Purple', primary: '#7c3aed', secondary: '#a78bfa' },
    { name: 'Trust Navy', primary: '#1e40af', secondary: '#60a5fa' },
    { name: 'Growth Emerald', primary: '#047857', secondary: '#10b981' },
    { name: 'Bold Red', primary: '#dc2626', secondary: '#f87171' },
    { name: 'Modern Gray', primary: '#374151', secondary: '#6b7280' }
  ]

  useEffect(() => {
    // Check if user is authenticated
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
    }
    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!businessName.trim()) {
      setMessage('❌ Please enter your business name')
      return
    }
    if (!businessType) {
      setMessage('❌ Please select your business type')
      return
    }
    if (!teamSize) {
      setMessage('❌ Please select your team size')
      return
    }
    if (!primaryGoal) {
      setMessage('❌ Please select your primary goal')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      // Create business and user via API
      const response = await fetch('/api/user/business', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessType: businessType,
          teamSize: teamSize,
          primaryGoal: primaryGoal,
          brandColors: brandColors,
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create business profile')
      }

      setMessage('✅ Welcome to ServiceTracker Pro! Redirecting to your dashboard...')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (error) {
      console.error('Onboarding error:', error)
      setMessage(`❌ ${error instanceof Error ? error.message : 'Failed to create business profile. Please try again.'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
      
      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Welcome to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
              {" "}ServiceTracker Pro
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Let&apos;s set up your business profile
          </p>
          <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
            <p className="text-sm text-gray-200">
              <span className="font-medium">Signed in as:</span> {user.email}
            </p>
          </div>
        </div>

        {/* Onboarding Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Business Name *
              </label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-4 bg-white/5 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                placeholder="e.g. Smith HVAC, Tech Repair Pro, ABC Plumbing"
                required
                autoFocus
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                What type of service business do you run? *
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full p-4 bg-white/5 border border-gray-300/30 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                required
              >
                <option value="" className="bg-slate-800">Select your business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type} className="bg-slate-800">{type}</option>
                ))}
              </select>
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                What&apos;s your team size? *
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full p-4 bg-white/5 border border-gray-300/30 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                required
              >
                <option value="" className="bg-slate-800">Select team size</option>
                {teamSizes.map((size) => (
                  <option key={size} value={size} className="bg-slate-800">{size}</option>
                ))}
              </select>
            </div>

            {/* Primary Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                What&apos;s your primary goal with ServiceTracker Pro? *
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full p-4 bg-white/5 border border-gray-300/30 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                required
              >
                <option value="" className="bg-slate-800">Select your primary goal</option>
                {primaryGoals.map((goal) => (
                  <option key={goal} value={goal} className="bg-slate-800">{goal}</option>
                ))}
              </select>
            </div>

            {/* Brand Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Choose Your Brand Colors
              </label>
              <p className="text-gray-400 text-sm mb-4">
                These colors will be used throughout your dashboard and customer-facing materials
              </p>
              
              {/* Color Presets */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setBrandColors({ primary: preset.primary, secondary: preset.secondary })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      brandColors.primary === preset.primary 
                        ? 'border-white bg-white/10' 
                        : 'border-gray-600 hover:border-gray-400 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-sm text-white font-medium">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={brandColors.primary}
                      onChange={(e) => setBrandColors(prev => ({ ...prev, primary: e.target.value }))}
                      className="w-12 h-12 rounded-lg border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandColors.primary}
                      onChange={(e) => setBrandColors(prev => ({ ...prev, primary: e.target.value }))}
                      className="flex-1 p-2 bg-white/5 border border-gray-600 rounded text-white text-sm"
                      placeholder="#6366f1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={brandColors.secondary}
                      onChange={(e) => setBrandColors(prev => ({ ...prev, secondary: e.target.value }))}
                      className="w-12 h-12 rounded-lg border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandColors.secondary}
                      onChange={(e) => setBrandColors(prev => ({ ...prev, secondary: e.target.value }))}
                      className="flex-1 p-2 bg-white/5 border border-gray-600 rounded text-white text-sm"
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-gray-600">
                <p className="text-sm text-gray-300 mb-3">Preview:</p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    style={{ 
                      backgroundColor: brandColors.primary,
                      borderColor: brandColors.primary 
                    }}
                    className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    style={{ 
                      backgroundColor: brandColors.secondary,
                      borderColor: brandColors.secondary 
                    }}
                    className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>

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
              {isLoading ? 'Setting up your business...' : 'Complete Setup'}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm text-gray-300">
              <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              30-day free trial included
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Manage customers and services
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Professional invoicing system
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
