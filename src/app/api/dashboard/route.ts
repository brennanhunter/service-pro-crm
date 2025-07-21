// app/api/dashboard/route.ts - Add some debug logging
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/database'

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  )
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No valid auth token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    console.log('Auth User ID:', user.id) // DEBUG

    // Get user's business and services
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        business: {
          include: {
            services: {
              include: {
                customer: true
              },
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        }
      }
    })

    console.log('DB User found:', !!dbUser) // DEBUG
    console.log('Services count:', dbUser?.business.services.length) // DEBUG

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      business: {
        name: dbUser.business.name,
        subdomain: dbUser.business.subdomain,
        brandColors: dbUser.business.brandColors
      },
      services: dbUser.business.services,
      stats: {
        totalCustomers: new Set(dbUser.business.services.map(s => s.customer.id)).size,
        activeServices: dbUser.business.services.filter(s => s.status !== 'COMPLETED').length,
        completedServices: dbUser.business.services.filter(s => s.status === 'COMPLETED').length,
        totalRevenue: 0 // Will be calculated when invoicing is implemented
      }
    })
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred'
    console.error('Dashboard API Error:', errorMessage) // DEBUG
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}