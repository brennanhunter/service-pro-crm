// test.ts
import { 
  prisma, 
  getTenantContext, 
  createBusiness, 
  getBusinessBySubdomain 
} from './src/lib/database'

async function testMultiTenant() {
  console.log('🚀 Starting multi-tenant test...')

  try {
    // 1. Create two test businesses
    const business1 = await createBusiness({
      name: 'Xtremery Computer Repair',
      subdomain: 'xtremery-repair',
      logoUrl: 'https://example.com/xtremery-logo.png',
      brandColors: {
        primary: '#7C3AED',
        secondary: '#1D4ED8',
        accent: '#00FFD1'
      }
    })

    const business2 = await createBusiness({
      name: 'Central Florida HVAC',
      subdomain: 'cf-hvac',
      logoUrl: 'https://example.com/hvac-logo.png',
      brandColors: {
        primary: '#DC2626',
        secondary: '#1F2937'
      }
    })

    console.log('✅ Created businesses:', business1.name, business2.name)

    // 2. Create admin users for each business
    const admin1 = await prisma.user.create({
      data: {
        businessId: business1.id,
        email: 'admin@xtremery-repair.com',
        name: 'Brennan Hunter',
        role: 'ADMIN'
      }
    })

    const admin2 = await prisma.user.create({
      data: {
        businessId: business2.id,
        email: 'admin@cf-hvac.com',
        name: 'HVAC Owner',
        role: 'ADMIN'
      }
    })

    console.log('✅ Created admin users')

    // 3. Create customers for each business
    const tenant1 = getTenantContext(business1.id)
    const tenant2 = getTenantContext(business2.id)

    const customer1 = await tenant1.createCustomer({
      name: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
      address: '123 Main St, DeLand, FL'
    })

    const customer2 = await tenant2.createCustomer({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-5678',
      address: '456 Oak Ave, Orlando, FL'
    })

    console.log('✅ Created customers')

    // 4. Create services for each business
    const service1 = await tenant1.createService({
      customerId: customer1.id,
      title: 'Laptop won\'t boot',
      description: 'Customer laptop shows blue screen on startup',
      technicianId: admin1.id
    })

    const service2 = await tenant2.createService({
      customerId: customer2.id,
      title: 'AC not cooling',
      description: 'Central air conditioning not cooling properly'
    })

    console.log('✅ Created services')

    // 5. Test tenant isolation
    console.log('\n📊 Testing tenant isolation...')
    
    const business1Data = await tenant1.getServices()
    const business2Data = await tenant2.getServices()

    console.log(`Business 1 (${business1.name}) has ${business1Data.length} services`)
    console.log(`Business 2 (${business2.name}) has ${business2Data.length} services`)

    // 6. Test subdomain lookup
    const foundBusiness = await getBusinessBySubdomain('xtremery-repair')
    console.log(`✅ Found business by subdomain: ${foundBusiness?.name}`)

    // 7. Display some data
    console.log('\n📋 Business 1 Services:')
    business1Data.forEach(service => {
      console.log(`  - ${service.title} (${service.status}) - Customer: ${service.customer.name}`)
    })

    console.log('\n📋 Business 2 Services:')
    business2Data.forEach(service => {
      console.log(`  - ${service.title} (${service.status}) - Customer: ${service.customer.name}`)
    })

    console.log('\n🎉 Multi-tenant test completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testMultiTenant()