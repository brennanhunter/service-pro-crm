import { NextResponse } from 'next/server'
import { supabase } from '@/lib/database'

export async function GET() {
  try {
    // Check if we can get session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    return NextResponse.json({
      hasSession: !!session,
      sessionId: session?.user?.id || null,
      error: error?.message || null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      hasSession: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
