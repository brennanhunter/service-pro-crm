import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/database';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { business: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the request body
    const body = await request.json();
    const { name, email, phone, address, notes } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if customer exists and belongs to user's business
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: id,
        businessId: dbUser.businessId
      }
    });

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Update the customer
    const updatedCustomer = await prisma.customer.update({
      where: { id: id },
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'Customer updated successfully',
      customer: updatedCustomer 
    });

  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ 
      error: 'Failed to update customer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { business: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if customer exists and belongs to user's business
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: id,
        businessId: dbUser.businessId
      }
    });

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check if customer has any services
    const customerServices = await prisma.service.findMany({
      where: {
        customerId: id,
        businessId: dbUser.businessId
      }
    });

    if (customerServices.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete customer with existing services' 
      }, { status: 400 });
    }

    // Delete the customer
    await prisma.customer.delete({
      where: { id: id }
    });

    return NextResponse.json({ 
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ 
      error: 'Failed to delete customer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}