// lib/database.ts
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

// Prisma Client Singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gexwglnqgypqnatctnrp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHdnbG5xZ3lwcW5hdGN0bnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTQ1MjgsImV4cCI6MjA2NzQ5MDUyOH0.3GWmIUbyluxCymtIMN64KjRnWGlf_I_Q9ZmsPRXYSF8'

// Supabase Client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase Service Role Client (for server-side/admin operations)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHdnbG5xZ3lwcW5hdGN0bnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkxNDUyOCwiZXhwIjoyMDY3NDkwNTI4fQ.P8MQrCrd1knQb4h2CMGc3qRJ5BlAF3Gfj3mE0Lkle8Q'
)

// Multi-tenant helper functions
export class TenantContext {
  private businessId: string

  constructor(businessId: string) {
    this.businessId = businessId
  }

  // Get all users for this business
  async getUsers() {
    return prisma.user.findMany({
      where: { businessId: this.businessId },
      include: {
        business: true
      }
    })
  }

  // Get all customers for this business
  async getCustomers() {
    return prisma.customer.findMany({
      where: { businessId: this.businessId },
      include: {
        services: true
      }
    })
  }

  // Get all services for this business
  async getServices() {
    return prisma.service.findMany({
      where: { businessId: this.businessId },
      include: {
        customer: true,
        technician: true,
        updates: true
      }
    })
  }

  // Create a new service for this business
  async createService(data: {
    customerId: string
    title: string
    description: string
    technicianId?: string
  }) {
    return prisma.service.create({
      data: {
        customerId: data.customerId,
        title: data.title,
        description: data.description,
        technicianId: data.technicianId,
        businessId: this.businessId
      },
      include: {
        customer: true,
        technician: true
      }
    })
  }

  // Create a new customer for this business
  async createCustomer(data: {
    name: string
    email: string
    phone?: string
    address?: string
    notes?: string
  }) {
    return prisma.customer.create({
      data: {
        ...data,
        businessId: this.businessId
      }
    })
  }
}

// Helper function to get tenant context
export function getTenantContext(businessId: string) {
  return new TenantContext(businessId)
}

// Helper function to get business by subdomain
export async function getBusinessBySubdomain(subdomain: string) {
  return prisma.business.findUnique({
    where: { subdomain },
    include: {
      users: true,
      customers: true,
      services: true
    }
  })
}

// Helper function to create a new business (for onboarding)
export async function createBusiness(data: {
  name: string
  subdomain: string
  logoUrl?: string
  brandColors?: Record<string, string>
}) {
  return prisma.business.create({
    data: {
      name: data.name,
      subdomain: data.subdomain,
      logoUrl: data.logoUrl,
      brandColors: data.brandColors,
      plan: 'starter'
    }
  })
}