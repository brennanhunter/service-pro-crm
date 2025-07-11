# ServiceTracker Pro - Development Rules & Architecture Guide

## 🎯 PROJECT OVERVIEW
ServiceTracker Pro is a white-label SaaS platform for local service businesses (HVAC, plumbing, computer repair, etc.). It provides customer portals and service management tools with complete multi-tenant isolation.

**Tech Stack:** Next.js 15, TypeScript, Prisma, PostgreSQL, Supabase Auth, Tailwind CSS  
**Target:** Service businesses with 1-20 employees ($199-499/month)  
**Current Status:** Complete marketing funnel + core service/customer management operational

---

## 🏗️ PROJECT ARCHITECTURE

### Folder Structure (Feature-Based Organization)
```
src/
├── app/                    # Next.js App Router - ROUTING ONLY
│   ├── api/               # API routes (stay here for Next.js routing)
│   ├── customers/         # Customer page route
│   ├── dashboard/         # Dashboard page route
│   ├── login/             # Auth pages
│   ├── signup/            
│   └── page.tsx           # Landing page
├── components/            # Shared UI components
│   └── ui/               # Pure UI components (buttons, modals, etc.)
├── features/             # Feature-based business logic
│   ├── customers/        
│   │   └── components/   # Customer-specific components
│   ├── services/         
│   │   └── components/   # Service-specific components
│   └── dashboard/        
│       └── components/   # Dashboard-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, API clients, database
└── types/                # Centralized TypeScript definitions
```

### Key Architectural Decisions

**1. Feature-Based Organization**
- Business logic lives in `/features/[feature]/components/`
- Shared UI lives in `/components/ui/`
- Pages in `/app/` are thin routing layers that import from features

**2. Multi-Tenant Architecture**
- Every database query filtered by `businessId`
- Users linked to Supabase auth via `user.id` (NOT email)
- Perfect tenant isolation maintained across all operations

**3. Component Hierarchy**
- **UI Components:** Pure, reusable, no business logic (`/components/ui/`)
- **Feature Components:** Business logic, data handling (`/features/`)
- **Page Components:** Routing, layout, orchestration (`/app/`)

---

## 📋 DEVELOPMENT RULES

### 🚨 CRITICAL RULES (Never Break These)

**1. Multi-Tenant Security**
- ALWAYS filter database queries by `businessId`
- NEVER use email for user lookup - use Supabase `user.id`
- Test tenant isolation with multiple businesses in dev

**2. Authentication Pattern**
```typescript
// ✅ CORRECT - Every API route must follow this pattern:
const authHeader = request.headers.get('authorization')
const token = authHeader.split(' ')[1]
const { data: { user }, error } = await supabase.auth.getUser(token)
const dbUser = await prisma.user.findUnique({
  where: { id: user.id }, // ← Use Supabase user.id, NOT email
  include: { business: true }
})
// Use dbUser.businessId for all subsequent queries
```

**3. File Organization Rules**
- API routes stay in `/app/api/` (Next.js requirement)
- Pages stay in `/app/` (Next.js requirement)  
- All other code goes in feature-based folders
- No business logic in page components

**4. Component Rules**
- Use existing UI components before creating new ones
- Feature components go in `/features/[feature]/components/`
- Always use centralized types from `/types/index.ts`

### 🎯 BEST PRACTICES

**1. Custom Hooks Pattern**
- Extract data fetching into custom hooks (`useCustomers`, `useServices`)
- Hooks handle: auth, loading states, error handling, API calls
- Components handle: UI state, event handlers, rendering

**2. Type Safety**
- Import all types from `/types/index.ts`
- Never use `any` - define proper interfaces
- Use type guards for API responses

**3. API Client Usage**
```typescript
// ✅ Use API client for consistency
import { getCustomers, createCustomer } from '@/lib/api'
const data = await getCustomers(token)

// ❌ Don't write manual fetch calls
const response = await fetch('/api/customers', { ... })
```

**4. Error Handling**
- Always provide user-friendly error messages
- Log technical errors to console
- Use try-catch in hooks, display errors in UI

**5. Loading States**
- Use `LoadingSpinner` component for consistency
- Always show loading states for async operations
- Disable forms during submission

### 🧩 COMPONENT PATTERNS

**1. Modal Pattern**
```typescript
import Modal from '@/components/ui/Modal'

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  size="md"
  disabled={loading}
>
  {/* Modal content */}
</Modal>
```

**2. Status Display Pattern**
```typescript
import StatusBadge from '@/components/ui/StatusBadge'

<StatusBadge status={service.status} size="md" />
```

**3. Hook Usage Pattern**
```typescript
const {
  data,
  loading,
  error,
  createItem,
  refreshData
} = useFeature()

if (loading) return <LoadingSpinner />
if (error) return <div>Error: {error}</div>
```

---

## 🔧 TECHNICAL IMPLEMENTATION

### Database Schema Key Points
```sql
-- Multi-tenant root
Business (id, name, subdomain, subscription_plan)
  ├── Users (id=supabase_user_id, business_id, role)
  ├── Customers (id, business_id, name, email, phone)
  ├── Services (id, business_id, customer_id, status, title)
  └── ServiceUpdates (id, service_id, user_id, message)
```

### Authentication Flow
1. Supabase handles auth (signup/login)
2. API routes validate tokens with Supabase
3. User lookup via `user.id` (Supabase auth ID)
4. All queries scoped to user's `businessId`

### API Route Pattern
```typescript
export async function GET(request: NextRequest) {
  try {
    // 1. Extract and validate auth token
    const authHeader = request.headers.get('authorization')
    const token = authHeader.split(' ')[1]
    
    // 2. Validate with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    
    // 3. Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { business: true }
    })
    
    // 4. Execute business-scoped query
    const data = await prisma.someModel.findMany({
      where: { businessId: dbUser.businessId }
    })
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## 🎨 UI/UX STANDARDS

### Xtremery Brand Colors
```css
/* Primary Colors */
--xtremery-purple: #7C3AED    /* Primary accent, backgrounds */
--xtremery-blue: #1D4ED8      /* Buttons, headings, links */
--aqua-spark: #00FFD1         /* Highlights, hover effects */
--deep-navy: #111827          /* Dark text, overlays */
--off-white: #F9FAFB          /* Section backgrounds */
```

### Component Styling Standards
- Use Tailwind utility classes exclusively
- Follow glassmorphism patterns for modals
- Consistent button styles: `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg`
- Status colors: Yellow (pending), Blue (in progress), Green (completed)

### Typography
- Headlines: `text-lg font-semibold` or `text-xl font-semibold`
- Body text: `text-sm text-gray-900` or `text-gray-600`
- Labels: `text-sm font-medium text-gray-700`

---

## 📊 CURRENT WORKING FEATURES

### ✅ Fully Operational
- **Landing Page:** Hero + Problem/Solution sections with Xtremery branding
- **Auth Flow:** Signup/login with dedicated pages and smooth UX
- **Service Management:** Create, view, update status (PENDING → IN_PROGRESS → COMPLETED)
- **Customer Management:** Create customers, view service history, customer stats
- **Multi-tenant Dashboard:** Business-specific data with perfect isolation
- **Navigation:** Clean flow between services and customers pages

### 🎯 Architecture Wins
- **Component-based:** 9 reusable UI components + feature-specific components
- **Hook-based data layer:** Clean separation of business logic and UI
- **Type-safe:** Centralized TypeScript definitions across entire app
- **API consistency:** Unified API client for all backend calls
- **Scalable patterns:** Ready for rapid feature development

---

## 🚀 DEVELOPMENT WORKFLOW

### For New Features
1. **Plan the feature:** Identify if it needs new UI components or can reuse existing
2. **Update types:** Add any new interfaces to `/types/index.ts`
3. **Create API routes:** Follow the auth + tenant isolation pattern
4. **Build custom hook:** Handle data fetching, error states, loading
5. **Create feature components:** Business logic in `/features/[feature]/components/`
6. **Update page component:** Minimal changes, just import and use new features

### For AI Assistants
1. **Always read this file first** for full context
2. **Ask to see existing code** before suggesting changes
3. **Follow established patterns** - don't reinvent working systems
4. **Test multi-tenant isolation** when touching data queries
5. **Use existing UI components** before creating new ones

### Common Patterns
```typescript
// Hook pattern
const { data, loading, error, createItem } = useFeature()

// Component pattern  
if (loading) return <LoadingSpinner />
if (error) return <div>Error: {error}</div>

// Modal pattern
<Modal isOpen={show} onClose={handleClose} title="Title">
  {/* content */}
</Modal>

// API pattern
const result = await apiFunction(token, data)
```

---

## 🔍 DEBUGGING GUIDE

### Common Issues & Solutions

**1. Authentication Errors**
- Check: Is token being passed correctly?
- Check: Is user lookup using `user.id` not email?
- Debug: Log Supabase user object in API route

**2. Empty Data/Wrong Business Data**
- Check: Is query filtered by `businessId`?
- Debug: Log `dbUser.businessId` in API route
- Test: Use different business accounts

**3. Component Not Updating**
- Check: Is hook dependency array correct?
- Check: Is state being updated properly?
- Debug: Add console.log in useEffect

**4. Modal/UI Issues**
- Check: Are you using existing UI components?
- Check: Is disabled state being handled?
- Debug: Check component props

### Test Data Access
```bash
npx ts-node test.ts        # Recreate test data
npx prisma studio          # Database admin
npm run dev               # Start development server
```

**Test Credentials:**
- Email: brennan@xtremery-repair.com
- Password: password123
- Business: Xtremery Computer Repair

---

## 🎯 NEXT DEVELOPMENT PRIORITIES

### Immediate (1-2 weeks)
1. **Customer editing:** Add edit functionality to customer details modal
2. **Service notes:** Add notes when updating service status
3. **Enhanced service details:** Show costs, priorities, assignments

### Short-term (1-2 months)
1. **Invoice generation:** Create and manage service invoices
2. **File uploads:** Photos and documents for service requests
3. **Team management:** Add/manage technicians and roles
4. **Basic reporting:** Service analytics and business metrics

### Long-term (3+ months)
1. **Customer portal:** Separate login for customers to track services
2. **Business onboarding:** Self-service business setup flow
3. **Subscription billing:** Stripe integration for monthly billing
4. **Mobile app:** React Native customer and technician apps

---

## 💡 SUCCESS METRICS

### Code Quality Metrics
- Component reusability across features
- Lines of duplicate code (minimize)
- TypeScript strict mode compliance
- Test coverage (when implemented)

### Performance Metrics
- Page load times < 2 seconds
- API response times < 500ms
- Mobile responsiveness score
- Lighthouse performance score

### Business Metrics
- Customer signup conversion rate
- Feature adoption rates
- Support ticket volume
- User session duration

---

## 🔗 QUICK REFERENCE

### Key Imports
```typescript
// Types
import { Customer, Service, Business } from '@/types'

// UI Components
import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Hooks
import { useAuth } from '@/hooks/useAuth'
import { useCustomers } from '@/hooks/useCustomers'

// API
import { getCustomers, createCustomer } from '@/lib/api'
```

### Environment Variables Required
```env
DATABASE_URL=
DIRECT_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Useful Commands
```bash
npm run dev                # Development server
npx prisma studio         # Database admin
npx prisma generate       # Update Prisma client
npx ts-node test.ts       # Create test data
vercel deploy             # Deploy to production
```

---

**Last Updated:** After complete refactoring to feature-based architecture  
**Status:** Production-ready with scalable patterns established  
**Next Session:** Customer editing functionality or service enhancements