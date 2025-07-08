// app/test-services/page.tsx
import { prisma } from '@/lib/database'
import NewServiceButton from './NewServiceButton'

export default async function TestServices() {
  const services = await prisma.service.findMany({
    include: {
      customer: true,
      technician: true
    }
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Test Page</h1>
        <NewServiceButton />
      </div>
      
      {services.length === 0 ? (
        <p>No services found. Run your test script first!</p>
      ) : (
        <div className="space-y-4">
          {services.map(service => (
            <div key={service.id} className="border p-4 rounded">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-sm">Customer: {service.customer.name}</p>
              <p className="text-sm">Status: {service.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}