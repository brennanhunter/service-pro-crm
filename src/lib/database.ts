// lib/database.ts
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

// Prisma Client Singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your configuration.')
}

// Supabase Client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase Service Role Client (for server-side/admin operations)  
const serverSupabaseUrl = process.env.SUPABASE_URL
const serverSupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = (serverSupabaseUrl && serverSupabaseServiceKey) 
  ? createClient(serverSupabaseUrl, serverSupabaseServiceKey)
  : null

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