import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get the auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No valid auth token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user exists in our database
    const dbUser = await prisma.user.findFirst({
      where: { email: user.email! },
      include: {
        business: true
      }
    })

    return NextResponse.json({
      exists: !!dbUser,
      user: dbUser,
      authUser: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name
      }
    })
  } catch (error) {
    console.error('User check error:', error)
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
