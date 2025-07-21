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

export async function POST(request: NextRequest) {
  try {
    const { businessName, businessType, teamSize, primaryGoal, brandColors, userName } = await request.json()

    if (!businessName?.trim()) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }

    // Get the current user from Supabase auth using session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get auth header from the request
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    let user = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token)
      if (!error && authUser) {
        user = authUser
      }
    }

    // If no user from auth header, try getting from session (this is the fallback)
    if (!user) {
      const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser()
      if (!sessionError && sessionUser) {
        user = sessionUser
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user already has a business
    const existingUser = await prisma.user.findFirst({
      where: { email: user.email! },
      include: { business: true }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already has a business profile' }, { status: 400 })
    }

    // Create business first with brand colors and onboarding data
    const business = await prisma.business.create({
      data: {
        name: businessName.trim(),
        subdomain: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`,
        plan: 'starter',
        // Store brand colors and additional data
        brandColors: {
          primary: brandColors?.primary || '#6366f1',
          secondary: brandColors?.secondary || '#06b6d4',
          businessType: businessType || null,
          teamSize: teamSize || null,
          primaryGoal: primaryGoal || null,
          onboardedAt: new Date().toISOString()
        }
      }
    })

    // Then create user
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        businessId: business.id,
        email: user.email!,
        name: userName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        role: 'ADMIN'
      }
    })

    return NextResponse.json({
      success: true,
      user: newUser,
      business: business,
      onboarding: {
        businessType,
        teamSize,
        primaryGoal,
        brandColors
      }
    })

  } catch (error) {
    console.error('Business creation error:', error)
    const errorMessage = (error instanceof Error) ? error.message : 'Failed to create business profile';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}