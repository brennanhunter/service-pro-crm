import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/database'

interface AuthState {
  isLoading: boolean
  isAuthenticated: boolean
  session: import('@supabase/supabase-js').Session | null
  token: string | null
}

export function useAuth(redirectToLogin = true) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    session: null,
    token: null
  })

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          session,
          token: session.access_token
        })
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          session: null,
          token: null
        })
        
        // Redirect to login if not authenticated and redirect is enabled
        if (redirectToLogin) {
          window.location.href = '/login'
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        session: null,
        token: null
      })
      
      if (redirectToLogin) {
        window.location.href = '/login'
      }
    }
  }, [redirectToLogin])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const getAuthHeaders = () => {
    if (!authState.token) {
      throw new Error('No auth token available')
    }
    
    return {
      'Authorization': `Bearer ${authState.token}`,
      'Content-Type': 'application/json'
    }
  }

  return {
    // Expose individual properties for easier destructuring
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    session: authState.session,
    token: authState.token,
    getAuthHeaders,
    refreshAuth: checkAuth
  }
}