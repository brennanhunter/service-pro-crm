import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Clear any potential client-side auth issues
    return NextResponse.json({ 
      message: 'Session cleared successfully',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Clear-Site-Data': '"storage"',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Clear session error:', error)
    return NextResponse.json({ 
      error: 'Failed to clear session',
      message: 'Please clear your browser data manually'
    }, { status: 500 })
  }
}

export async function POST() {
  return GET() // Same functionality for POST
}
