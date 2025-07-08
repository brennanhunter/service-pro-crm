// app/api/user/business/route.ts
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

    // Create Supabase client with the token
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user from our database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        business: true
      }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    return NextResponse.json({
      user: dbUser,
      business: dbUser.business
    })
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}