// lib/user-helpers.ts
import { createClient } from '@supabase/supabase-js'
import { prisma } from './database'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getCurrentUserBusiness() {
  // Get current user from Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Not authenticated')
  }

  // Get user's business info from our database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      business: true
    }
  })

  if (!dbUser) {
    throw new Error('User not found in database')
  }

  return {
    user: dbUser,
    business: dbUser.business
  }
}