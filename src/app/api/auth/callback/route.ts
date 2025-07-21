import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Callback received with code:', code ? 'YES' : 'NO')
  console.log('Full URL:', requestUrl.toString())

  if (!code) {
    console.error('No auth code provided to callback')
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
  }

  // For now, let's always redirect to onboarding to test the flow
  // We'll check the database later in the onboarding page
  console.log('Redirecting to onboarding with code:', code)
  return NextResponse.redirect(`${requestUrl.origin}/onboarding?code=${code}`)
}
