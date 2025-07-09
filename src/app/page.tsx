'use client'

import Link from 'next/link'

export default function ProblemSolution() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Emotional Problem Hook */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your customers are frustrated,
            <span className="block text-red-400">
              and you don't even know it
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            While you're busy fixing their problems, they're sitting in the dark wondering 
            what's happening, when it'll be done, and if they should have called someone else.
          </p>
        </div>

        {/* 3 Specific Pain Points */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Pain Point 1: Lost Customers */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Lost Customers</h3>
            <p className="text-gray-300 mb-4">
              "I called three times and still don't know when my repair will be done. 
              Maybe I should try someone else..."
            </p>
            <div className="text-red-400 font-semibold">
              → Customers leave for competitors who "seem more organized"
            </div>
          </div>

          {/* Pain Point 2: Manual Tracking */}
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Manual Chaos</h3>
            <p className="text-gray-300 mb-4">
              Sticky notes, phone calls, "Did I update Mrs. Johnson?" 
              You're drowning in manual updates and losing track.
            </p>
            <div className="text-orange-400 font-semibold">
              → You work late just keeping customers informed
            </div>
          </div>

          {/* Pain Point 3: Unprofessional Image */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Unprofessional Look</h3>
            <p className="text-gray-300 mb-4">
              While your work is excellent, your customer experience feels 
              outdated compared to the "big guys" in town.
            </p>
            <div className="text-yellow-400 font-semibold">
              → Customers choose competitors who "look more professional"
            </div>
          </div>
        </div>

        {/* Agitation - Cost of Not Solving */}
        <div className="text-center mb-16 bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Here's What This Is Really Costing You
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">3-5</div>
              <div className="text-gray-300">Customers per month who don't return because they felt ignored</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">5-8 Hours</div>
              <div className="text-gray-300">Weekly spent fielding "what's the status?" phone calls</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">Missed</div>
              <div className="text-gray-300">Referrals because customers don't feel like they got VIP service</div>
            </div>
          </div>
        </div>

        {/* Solution Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            What if your customers felt like
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
              VIPs instead?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Imagine customers getting real-time updates, tracking their service online like an Amazon package, 
            and bragging to their friends about how professional and organized you are. 
            <strong className="text-cyan-300">That's the ServiceTracker Pro difference.</strong>
          </p>
          
          {/* Solution Preview */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-700/30 rounded-xl p-6 border border-purple-500/30">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">Instant Updates</h4>
              <p className="text-gray-300 text-sm">Customers see progress in real-time, just like tracking a package</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-700/30 rounded-xl p-6 border border-blue-500/30">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">Professional Portals</h4>
              <p className="text-gray-300 text-sm">Branded customer portal that makes you look like the premium choice</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-700/30 rounded-xl p-6 border border-cyan-500/30">
              <div className="w-12 h-12 mx-auto mb-4 bg-cyan-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">Happy Customers</h4>
              <p className="text-gray-300 text-sm">Customers become raving fans who refer friends and family</p>
            </div>
          </div>
        </div>

        {/* Xtremery Success Story */}
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-500/30 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Don't Just Take Our Word For It
            </h3>
            <p className="text-gray-300 text-lg">
              Here's what happened when <span className="text-cyan-300 font-semibold">Xtremery Computer Repair</span> made the switch:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Professionalism Result */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-cyan-300 mb-2">"More Professional Than Best Buy"</div>
              <p className="text-gray-300">
                Customers consistently say Xtremery looks and feels more professional than big box stores
              </p>
            </div>

            {/* Referrals Result */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-300 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-cyan-300 mb-2">70% More Referrals</div>
              <p className="text-gray-300">
                Customers love tracking their repairs online and telling friends about the experience
              </p>
            </div>

            {/* Automation Result */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-cyan-300 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-cyan-300 mb-2">Automated Everything</div>
              <p className="text-gray-300">
                Invoices send automatically, updates post in real-time - "I actually sleep better now"
              </p>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
            <blockquote className="text-xl text-white mb-4">
              "Our customers constantly tell us we look more professional than the big guys. 
              The automated updates and invoices have given me my evenings back. 
              Best investment I've made for the business."
            </blockquote>
            <div className="text-cyan-300 font-semibold">
              — Brennan Hunter, Xtremery Computer Repair
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Customer Experience?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join service businesses like Xtremery who've made the switch to professional customer management. 
            Your customers (and your sleep schedule) will thank you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:scale-105"
            >
              Start Your Free Trial
            </Link>
            
            <Link 
              href="/login"
              className="px-8 py-4 border-2 border-gray-400 text-gray-300 font-semibold rounded-full text-lg transition-all duration-300 hover:border-cyan-300 hover:text-cyan-300"
            >
              Login
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}