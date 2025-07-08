import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/database';

// Initialize Supabase client for server-side operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
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
    const { status, notes } = body;

    // Validate required fields
    if (!status) {
      return NextResponse.json({ 
        error: 'Missing required field: status' 
      }, { status: 400 });
    }

    // Validate status value
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
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

    // Get the service and verify it belongs to the user's business
    const existingService = await prisma.service.findFirst({
      where: {
        id: params.id,
        businessId: dbUser.businessId
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

    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Update the service status
    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: { 
        status,
        updatedAt: new Date()
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

    // Create a service update record
    const statusChangeMessage = `Status changed from ${existingService.status} to ${status}`;
    const updateMessage = notes ? `${statusChangeMessage}. Notes: ${notes}` : statusChangeMessage;

    await prisma.serviceUpdate.create({
      data: {
        serviceId: params.id,
        message: updateMessage,
        userId: dbUser.id
      }
    });

    // Return the updated service
    return NextResponse.json({
      success: true,
      service: {
        id: updatedService.id,
        title: updatedService.title,
        description: updatedService.description,
        status: updatedService.status,
        priority: updatedService.priority,
        createdAt: updatedService.createdAt,
        updatedAt: updatedService.updatedAt,
        customer: updatedService.customer,
        technician: updatedService.technician,
        estimatedCost: updatedService.estimatedCost,
        actualCost: updatedService.actualCost
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ 
      error: 'Failed to update service',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}