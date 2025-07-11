import { 
  CustomersResponse, 
  DashboardResponse, 
  CreateCustomerData, 
  CreateServiceData, 
  UpdateServiceStatusData,
  ApiError 
} from '@/types'

class ApiClient {
  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    token: string
  ): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(token),
        ...options.headers
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `API request failed: ${response.status}`)
    }

    return data
  }

  // Customer endpoints
  async getCustomers(token: string): Promise<CustomersResponse> {
    return this.request<CustomersResponse>('/customers', {}, token)
  }

  async createCustomer(token: string, customerData: CreateCustomerData) {
    return this.request('/customers/create', {
      method: 'POST',
      body: JSON.stringify(customerData)
    }, token)
  }

  // Service endpoints
  async getDashboard(token: string): Promise<DashboardResponse> {
    return this.request<DashboardResponse>('/dashboard', {}, token)
  }

  async createService(token: string, serviceData: CreateServiceData) {
    return this.request('/services/create', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    }, token)
  }

  async updateServiceStatus(token: string, serviceId: string, statusData: UpdateServiceStatusData) {
    return this.request(`/services/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    }, token)
  }

  // User endpoints
  async getUserBusiness(token: string) {
    return this.request('/user/business', {}, token)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export individual functions for easier importing
export const getCustomers = (token: string) => apiClient.getCustomers(token)
export const createCustomer = (token: string, data: CreateCustomerData) => apiClient.createCustomer(token, data)
export const getDashboard = (token: string) => apiClient.getDashboard(token)
export const createService = (token: string, data: CreateServiceData) => apiClient.createService(token, data)
export const updateServiceStatus = (token: string, serviceId: string, data: UpdateServiceStatusData) => apiClient.updateServiceStatus(token, serviceId, data)
export const getUserBusiness = (token: string) => apiClient.getUserBusiness(token)