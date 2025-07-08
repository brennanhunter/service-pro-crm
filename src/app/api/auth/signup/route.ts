// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name } = await request.json()

    // Find the Xtremery business
    const xtremeryBusiness = await prisma.business.findFirst({
      where: { subdomain: 'xtremery-repair' }
    })

    if (!xtremeryBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Create user in our database
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        businessId: xtremeryBusiness.id,
        email: email,
        name: name,
        role: 'ADMIN'
      }
    })

    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error('Database user creation failed:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}