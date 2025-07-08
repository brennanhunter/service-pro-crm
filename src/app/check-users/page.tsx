// app/check-users/page.tsx
import { prisma } from '@/lib/database'

export default async function CheckUsers() {
  const users = await prisma.user.findMany({
    include: {
      business: true
    }
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Users Check</h1>
      
      {users.length === 0 ? (
        <p>No users found in database.</p>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="border p-4 rounded">
              <h3 className="font-semibold">{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <p>Business: {user.business.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}