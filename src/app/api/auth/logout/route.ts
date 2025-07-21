import { NextResponse } from 'next/server'
import { supabase } from '@/lib/database'

export async function POST() {
  try {
    // Sign out all sessions
    await supabase.auth.signOut()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if there's an error, we'll return success
    // because we want to clear the client-side session
    return NextResponse.json({ 
      success: true, 
      message: 'Session cleared' 
    })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST method to logout' }, { status: 405 })
}
