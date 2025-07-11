// Core business entities
export interface Business {
  id: string
  name: string
  subdomain: string
  logoUrl?: string
  brandColors?: string
  subscriptionPlan?: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  businessId: string
  name: string
  email: string
  phone?: string
  address?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  businessId: string
  customerId: string
  title: string
  description: string
  status: ServiceStatus
  priority?: ServicePriority
  estimatedCost?: number
  actualCost?: number
  createdAt: string
  updatedAt: string
  customer: Customer
}

export interface ServiceUpdate {
  id: string
  serviceId: string
  userId: string
  message: string
  createdAt: string
}

export interface User {
  id: string
  businessId: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
  business: Business
}

export interface Invoice {
  id: string
  businessId: string
  serviceId: string
  customerId: string
  amount: number
  status: InvoiceStatus
  dueDate: string
  createdAt: string
  updatedAt: string
}

// Enums
export type ServiceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type ServicePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type UserRole = 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER'
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE'

// API Response types
export interface CustomersResponse {
  business: {
    name: string
    subdomain: string
  }
  customers: Customer[]
  services: Service[]
}

export interface DashboardResponse {
  business: {
    name: string
    subdomain: string
  }
  services: Service[]
  stats: {
    totalServices: number
    activeServices: number
    completedServices: number
  }
}

// Form data types
export interface CreateCustomerData {
  name: string
  email: string
  phone?: string
  address?: string
  notes?: string
}

export interface CreateServiceData {
  title: string
  description: string
  customerName: string
  customerEmail: string
  priority?: ServicePriority
}

export interface UpdateServiceStatusData {
  status: ServiceStatus
  notes?: string
}

// Component prop types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
  disabled?: boolean
}

export interface StatusBadgeProps {
  status: ServiceStatus
  size?: 'sm' | 'md' | 'lg'
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Auth types
export interface AuthState {
  isLoading: boolean
  isAuthenticated: boolean
  session: any | null
  token: string | null
}

// Error types
export interface ApiError {
  error: string
  details?: string
  code?: string
}