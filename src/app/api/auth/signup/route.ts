import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

function createSubdomain(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name, businessName } = await request.json()

    if (!userId || !email || !name || !businessName) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, email, name, businessName' 
      }, { status: 400 })
    }

    // Create subdomain from business name
    const baseSubdomain = createSubdomain(businessName)
    
    // Check if subdomain already exists and make it unique if needed
    let subdomain = baseSubdomain
    let counter = 1
    
    while (true) {
      const existingBusiness = await prisma.business.findUnique({
        where: { subdomain }
      })
      
      if (!existingBusiness) {
        break // This subdomain is available
      }
      
      subdomain = `${baseSubdomain}-${counter}`
      counter++
    }

    // Create business first
    const newBusiness = await prisma.business.create({
      data: {
        name: businessName,
        subdomain: subdomain,
        plan: 'starter' // Default plan
      }
    })

    // Create user and link to the new business
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        businessId: newBusiness.id,  // ← Link to the NEW business, not Xtremery
        email: email,
        name: name,
        role: 'ADMIN'
      }
    })

    return NextResponse.json({ 
      user: newUser,
      business: newBusiness,
      message: 'Business and user account created successfully'
    })
  } catch (error) {
    console.error('Database user creation failed:', error)
    return NextResponse.json({ 
      error: 'Failed to create user and business account',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}