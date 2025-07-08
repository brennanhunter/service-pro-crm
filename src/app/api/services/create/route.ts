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
    const { title, description, customerName, customerEmail, customerPhone, priority = 'MEDIUM' } = body;

    // Validate required fields
    if (!title || !description || !customerName || !customerEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, description, customerName, customerEmail' 
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

    // Check if customer already exists, if not create them
    let customer = await prisma.customer.findFirst({
      where: {
        businessId: dbUser.businessId,
        email: customerEmail
      }
    });

    if (!customer) {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          businessId: dbUser.businessId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone || null,
          address: null, // Can be added later
          notes: null
        }
      });
    }

    // Create the service ticket
    const service = await prisma.service.create({
      data: {
        businessId: dbUser.businessId,
        customerId: customer.id,
        title,
        description,
        status: 'PENDING',
        priority,
        estimatedCost: null,
        actualCost: null,
        technicianId: null, // Will be assigned later
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create initial service update
    await prisma.serviceUpdate.create({
      data: {
        serviceId: service.id,
        message: `Service request created: ${title}`,
        userId: dbUser.id
      }
    });

    // Return the created service
    return NextResponse.json({
      success: true,
      service: {
        id: service.id,
        title: service.title,
        description: service.description,
        status: service.status,
        priority: service.priority,
        createdAt: service.createdAt,
        customer: service.customer,
        technician: service.technician,
        estimatedCost: service.estimatedCost,
        actualCost: service.actualCost
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ 
      error: 'Failed to create service',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}