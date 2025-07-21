'use client';

import React from 'react';

interface AuthErrorBoundaryState {
  hasError: boolean;
}

class AuthErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AuthErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    console.log('Error caught by AuthErrorBoundary:', error.message);
    
    // Only handle specific Supabase auth errors
    const authErrorPatterns = [
      'Invalid login credentials',
      'Email not confirmed',
      'Token has expired',
      'Invalid JWT',
      'User not found',
      'Session not found',
      'AuthSession'
    ];
    
    const isAuthError = authErrorPatterns.some(pattern => 
      error.message.includes(pattern)
    );
    
    if (isAuthError) {
      console.log('Detected auth error, clearing session...');
      // Clear auth state and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        window.location.replace('/login');
      }
      return { hasError: true };
    }
    
    // For non-auth errors, just log and don't redirect
    console.log('Non-auth error, not redirecting');
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Redirecting to login...
            </h2>
            <p className="text-gray-600">
              Please wait while we redirect you to the login page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
