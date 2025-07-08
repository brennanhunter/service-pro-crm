import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/database';

// Initialize Supabase client for server-side operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { name, email, phone, address, notes } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Get the user's business context
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { business: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Check if customer with this email already exists in this business
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        businessId: dbUser.businessId,
        email: email
      }
    });

    if (existingCustomer) {
      return NextResponse.json({ 
        error: 'A customer with this email already exists' 
      }, { status: 400 });
    }

    // Create the new customer
    const customer = await prisma.customer.create({
      data: {
        businessId: dbUser.businessId,
        name,
        email,
        phone: phone || null,
        address: address || null,
        notes: notes || null
      }
    });

    // Return the created customer
    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        notes: customer.notes,
        createdAt: customer.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ 
      error: 'Failed to create customer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}