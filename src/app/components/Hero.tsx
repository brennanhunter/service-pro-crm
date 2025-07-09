'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Stop Losing Customers to
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
            Poor Communication
          </span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          ServiceTracker Pro gives your service business the professional customer portal 
          that keeps clients informed, happy, and coming back.
        </p>
        
        {/* Social proof */}
        <div className="mb-10">
          <p className="text-cyan-300 font-medium mb-2">
            ✨ Trusted by service businesses like Xtremery Computer Repair
          </p>
          <p className="text-gray-400 text-sm">
            "Our customers love seeing real-time updates on their repairs"
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/signup"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            href="/login"
            className="px-8 py-4 border-2 border-gray-400 text-gray-300 font-semibold rounded-full text-lg transition-all duration-300 hover:border-cyan-300 hover:text-cyan-300 hover:shadow-lg"
          >
            Login
          </Link>
        </div>
        
        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-Time Updates</h3>
            <p className="text-gray-400">Keep customers informed every step of the way</p>
          </div>
          
          <div className="group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Professional Image</h3>
            <p className="text-gray-400">Stand out from competitors with branded portals</p>
          </div>
          
          <div className="group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-300 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Grow Revenue</h3>
            <p className="text-gray-400">Happy customers return and refer others</p>
          </div>
        </div>
      </div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-700"></div>
    </section>
  )
}