# ServiceTracker Pro - Complete Development Log

## 🎯 PROJECT OVERVIEW
ServiceTracker Pro is a white-label SaaS platform for local service businesses (HVAC, plumbing, computer repair, etc.). It provides customer portals and service management tools.

**Target Market:** Service businesses with 1-20 employees  
**Pricing:** $199-499/month per business  
**Tech Stack:** Next.js 15, TypeScript, Prisma, PostgreSQL, Supabase Auth, Tailwind CSS

---

## 🤖 AI COLLABORATION BEST PRACTICES

*Added based on successful development session - these patterns significantly improve efficiency and reduce errors*

### Core Principles for Working with AI Assistants

**1. Always Ask to See Files First**
- Never let AI guess at your code structure
- Ask: "Can you show me your current [specific file]?" 
- Example: "Show me your dashboard page" instead of assuming the structure

**2. Understand Current Patterns Before Suggesting Changes**
- Look at working code to understand existing patterns
- Match new code to established conventions
- Don't reinvent what's already working

**3. Debug Data Step-by-Step**
- Use console.log to see actual data structures
- Check API responses vs. frontend expectations
- Verify assumptions with real data

**4. Communication Patterns That Work**
- AI: "Before I code this, let me see your [file]"
- Human: "Here's the exact error/file/structure"
- AI: "I can see the issue is X, here's the minimal fix"

**5. What to Share With New AI Assistants**
- This development log (provides full context)
- Specific error messages (copy/paste verbatim)
- Exact file contents (don't paraphrase)
- Current working state vs. desired state

**6. Red Flags to Avoid**
- AI jumping straight to coding without seeing existing code
- Making assumptions about file structure or naming
- Suggesting complex solutions without understanding simple fixes
- Not asking follow-up questions about unclear requirements

### When AI Should Slow Down and Ask Questions
- "What does your current [component] look like?"
- "Can you show me the API response structure?"
- "How do you envision this working?"
- "Do you have any existing [related] components?"

### Development Session Structure That Works
1. **Context**: Share development log and current goal
2. **Discovery**: AI asks to see relevant files
3. **Understanding**: AI explains what they see and proposes approach
4. **Implementation**: Minimal changes that fit existing patterns
5. **Testing**: Verify changes work with real data

*This approach reduced debugging time by ~80% and eliminated multiple revision cycles.*

---

## ✅ CURRENT WORKING STATE (As of Latest Development Session)

### Authentication System ✅
- **Supabase Auth** integrated and working
- Users can sign up and log in
- Email confirmations disabled for development
- Auth state properly tracked across pages
- Automatic redirect to login when not authenticated

### Multi-Tenant Database ✅
- **Prisma ORM** with PostgreSQL via Supabase
- Complete database schema with proper relationships
- **Tenant isolation** - each business only sees their own data
- Test data successfully created for two businesses

### Component-Based Dashboard System ✅
- **Modular component architecture** for maintainability and reusability
- **Complete component library** with 9 custom components:
  - **StatusBadge** - Reusable status indicators with proper colors
  - **LoadingSpinner** - Professional loading states with multiple sizes
  - **EmptyState** - Empty states with actionable CTAs and icons
  - **StatsGrid** - Dashboard statistics cards with icons and light branding
  - **ServiceCard** - Individual service row with accessibility features
  - **ServicesList** - Services container with header and empty state handling
  - **DashboardHeader** - Navigation header with business name and CTAs
  - **NewServiceModal** - Service creation modal with validation
  - **ServiceDetailsModal** - Service viewing/editing with status updates
- **Light Xtremery branding** throughout dashboard components
- **Professional UI/UX** with hover states, focus management, and transitions
- **Mobile responsive** design across all components
- **Accessibility features** - ARIA labels, keyboard navigation, semantic HTML

### Business Dashboard ✅
- **Rebuilt with component architecture** - clean, maintainable code
- Secure dashboard at `/dashboard` 
- Shows business-specific data (Xtremery Computer Repair)
- **Professional stats display** with real-time calculations
- **Service creation fully functional** with enhanced modal UX ✅
- **Navigation to customer management** ✅
- **Better error handling** and loading states throughout

### Service Management ✅
- **Enhanced service creation** with improved modal component
- **Professional service cards** with click indicators and accessibility
- **Real-time status updates** with better user feedback
- **Clickable service cards with enhanced details modal** ✅
- **Service status updates working** ✅
  - PENDING → IN_PROGRESS → COMPLETED
  - Professional dropdown interface with loading states
  - Service update history tracking
- **Consistent data calculations** across dashboard and customers pages
- Proper multi-tenant isolation maintained

### Customer Management ✅
- **Dedicated customers page** at `/customers` ✅
- **Enhanced navigation** between Services and Customers pages ✅
- **Fixed customer statistics** - active services count now accurate ✅
- **Professional customer list** with table design ✅
- **Clickable customer rows with service history modal** ✅
  - Shows all services for selected customer
  - Displays service status and dates with proper badges
  - Professional modal design with customer contact info
- **Add Customer functionality** ✅
  - Independent customer creation (not tied to services)
  - Full customer form (name, email, phone, address, notes)
  - Dedicated customers API endpoint
  - Real-time customer list updates
- **Consistent stats calculations** - "New This Month" and "Active Services" working

### Landing Page & Marketing ✅
- **Hero Section** ✅
  - Compelling headline with Xtremery branding
  - Purple/blue/cyan color scheme (#7C3AED, #1D4ED8, #00FFD1)
  - Clear CTAs: "Start Free Trial" → `/signup`, "Login" → `/login`
  - Feature highlights with animations
  - Professional gradient background
- **Problem/Solution Section** ✅
  - Emotional problem hook: "Your customers are frustrated, and you don't even know it"
  - Three specific pain points: lost customers, manual chaos, unprofessional image
  - Realistic cost agitation (3-5 lost customers, 5-8 hours weekly on calls)
  - Solution introduction with VIP positioning
  - Xtremery success story with specific results
- **Dedicated Signup Page** ✅
  - Conversion-focused design with Xtremery branding
  - Benefit-driven copy and trust signals
  - Form validation and auto-redirect to dashboard
  - Link back to login for existing users
- **Updated Login Page** ✅
  - Simplified login-only functionality (removed signup toggle)
  - Matching Xtremery brand aesthetic
  - Professional glassmorphism design
  - Link to signup page for new users

### Deployment ✅
- **Successfully deployed to Vercel**
- All environment variables configured
- Prisma generation working in production
- Live URL functional with authentication

---

## 🗂️ KEY FILES & ARCHITECTURE

### Database Layer
- **`prisma/schema.prisma`** - Complete database schema
  - Business table (multi-tenant root)
  - Users table (linked to businesses via Supabase user.id)
  - Customers table (business-specific)
  - Services table (service tickets)
  - ServiceUpdates table (ticket communication using userId field)
  - Invoices table (billing)

- **`lib/database.ts`** - Database utilities
  - Prisma client singleton
  - Supabase client setup (server + admin)
  - TenantContext class for business-isolated queries
  - Helper functions for multi-tenant operations

### Authentication
- **`lib/auth.ts`** - Client-side auth functions
  - signInWithEmail() - Login functionality
  - signUpWithEmail() - Registration + database user creation
  - signOut() - Logout functionality
  - Uses NEXT_PUBLIC_ environment variables for client-side

### API Routes
- **`app/api/auth/signup/route.ts`** - Creates users in database after Supabase signup
- **`app/api/dashboard/route.ts`** - Returns business data for authenticated users
- **`app/api/user/business/route.ts`** - Gets current user's business info
- **`app/api/services/create/route.ts`** - Creates new service tickets ✅
- **`app/api/services/[id]/route.ts`** - Updates service status and creates update records ✅
- **`app/api/customers/route.ts`** - Returns all customers and services for business ✅
- **`app/api/customers/create/route.ts`** - Creates new customers independently ✅

### Frontend Pages
- **`app/page.tsx`** - Landing page with Hero and ProblemSolution components ✅
- **`app/signup/page.tsx`** - Dedicated conversion-focused signup page ✅
- **`app/login/page.tsx`** - Simplified login page with Xtremery branding ✅
- **`app/dashboard/page.tsx`** - Main business dashboard with working service creation, navigation, and service status management
- **`app/customers/page.tsx`** - Customer management with service history ✅
- **`app/auth-test/page.tsx`** - Authentication status checker
- **`app/test-business/page.tsx`** - Business info display (debug)
- **`app/test-services/page.tsx`** - Service list display (debug)

### Components ✅
- **`app/components/Hero.tsx`** - Landing page hero section with Xtremery branding
- **`app/components/ProblemSolution.tsx`** - Emotional problem/solution section with Xtremery proof
- **`app/dashboard/components/StatusBadge.tsx`** - Reusable status indicators with colors and sizes
- **`app/dashboard/components/LoadingSpinner.tsx`** - Professional loading states for various sizes
- **`app/dashboard/components/EmptyState.tsx`** - Empty state component with icons and actions
- **`app/dashboard/components/StatsGrid.tsx`** - Dashboard statistics cards with icons and branding
- **`app/dashboard/components/ServiceCard.tsx`** - Individual service row with accessibility features
- **`app/dashboard/components/ServicesList.tsx`** - Services container with header and empty state
- **`app/dashboard/components/DashboardHeader.tsx`** - Navigation header with business name and CTAs
- **`app/dashboard/components/NewServiceModal.tsx`** - Service creation modal with validation
- **`app/dashboard/components/ServiceDetailsModal.tsx`** - Service viewing/editing modal with status updates

### Test Data
- **`test.ts`** - Creates sample businesses and data
  - Xtremery Computer Repair (subdomain: xtremery-repair)
  - Central Florida HVAC (subdomain: cf-hvac)
  - Sample customers and service tickets

---

## 🔐 AUTHENTICATION FLOW

### User Registration Process
1. User fills out form at `/signup` (dedicated signup page)
2. `signUpWithEmail()` creates user in Supabase Auth
3. API call to `/api/auth/signup` creates user in Prisma database
4. User assigned to business (currently hardcoded to Xtremery)
5. User given ADMIN role by default

### Login Process
1. User enters credentials at `/login`
2. `signInWithEmail()` authenticates with Supabase
3. Session token stored in browser
4. Dashboard redirects to login if no valid session

### Security Model
- **Client-side:** Uses session tokens for API calls
- **Server-side:** Validates tokens with Supabase service role
- **Database:** All queries filtered by businessId (tenant isolation)
- **Pages:** Automatic redirect to login for unauthenticated users

### Key Pattern for API Routes
```typescript
// 1. Get auth token from headers
const authHeader = request.headers.get('authorization')
const token = authHeader.split(' ')[1]

// 2. Validate with Supabase  
const { data: { user }, error } = await supabase.auth.getUser(token)

// 3. Find user in database using Supabase user.id (NOT email compound key)
const dbUser = await prisma.user.findUnique({
  where: { id: user.id },  // ← This is the key pattern
  include: { business: true }
})

// 4. Use dbUser.businessId for tenant isolation
```

---

## 💾 DATABASE SCHEMA DETAILS

### Core Tables Structure
```sql
Business (Multi-tenant root)
├── Users (Business employees/admins) - Primary key: user.id (Supabase auth ID)
├── Customers (Business clients)
├── Services (Service tickets)
│   ├── ServiceUpdates (Uses userId field, tracks status changes and notes)
│   └── Invoices (Billing)
```

### Key Relationships
- Every table has `businessId` foreign key
- Users linked to Supabase auth via `user.id` primary key
- Customers belong to one business  
- Services belong to customer + business
- ServiceUpdates track all changes to services
- Perfect tenant isolation maintained

### Sample Data Created
**Xtremery Computer Repair:**
- Admin: Brennan Hunter (brennan@xtremery-repair.com)
- Customer: John Smith, Hunter
- Services: "Laptop won't boot", "Test" (various statuses)

**Central Florida HVAC:**
- Admin: HVAC Owner
- Customer: Jane Doe  
- Service: "AC not cooling" (PENDING status)

---

## 🎨 CURRENT UI/UX STATE

### Landing Page ✅
- **Hero Section:** Compelling headline, Xtremery branding, clear CTAs
- **Problem/Solution:** Emotional journey from frustration to transformation
- **Xtremery Brand Colors:** Purple (#7C3AED), Blue (#1D4ED8), Aqua (#00FFD1)
- **Professional Design:** Gradients, glassmorphism, subtle animations
- **Conversion Focused:** Multiple signup opportunities, trust signals

### Authentication Pages ✅
- **Signup Page:** Conversion-optimized with benefits, trust signals, Xtremery branding
- **Login Page:** Clean, professional, consistent with brand
- **Unified Experience:** Both pages feel cohesive and premium

### Dashboard Features Working ✅
- **Header:** Business name display + navigation + "New Service" button
- **Navigation:** Clean links between Services and Customers pages
- **Stats Cards:** Total/Active/Completed service counts
- **Service List:** Real service tickets with status badges
- **Clickable Services:** Modal with service details and status updates
- **Status Management:** Dropdown to change PENDING → IN_PROGRESS → COMPLETED
- **Status Colors:** Yellow (pending), Blue (in progress), Green (completed)
- **Responsive Design:** Mobile-friendly layout

### Customer Management Features Working ✅
- **Customer List:** Table with name, email, phone, date added
- **Customer Stats:** Total customers with placeholders for more metrics
- **Clickable Customers:** Modal showing customer details and service history
- **Service History:** Shows all services for selected customer with status
- **Navigation:** Smooth flow between customers and services pages
- **Empty States:** Helpful messages when no customers exist

### Forms Working ✅
- **Landing Page CTAs:** Direct to appropriate signup/login pages
- **Signup Form:** Email + password + full name with Xtremery branding
- **Login Form:** Email + password with professional design
- **New Service Form:** All fields functional, creates real tickets
- **Status Updates:** Dropdown with immediate feedback and persistence

### Navigation Flow ✅
- `/` → Landing page with Hero and Problem/Solution sections
- `/signup` → Conversion-focused signup page
- `/login` → Professional login page
- `/dashboard` → Main business interface (auth required)
- `/customers` → Customer management page (auth required)
- Smooth navigation between pages with consistent branding

---

## 🔧 DEVELOPMENT ENVIRONMENT

### Local Setup
```bash
npm run dev          # Start development server
npx prisma studio    # Database admin interface  
npx ts-node test.ts  # Create test data
```

### Environment Variables Required
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase (Server-side)
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Supabase (Client-side)
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# Email (Future)
SENDGRID_API_KEY="SG..."
```

### Test Credentials
- **Email:** brennan@xtremery-repair.com
- **Password:** password123
- **Business:** Xtremery Computer Repair
- **Role:** ADMIN

---

## 🚀 DEPLOYMENT STATUS

### Vercel Configuration
- **Build Command:** `prisma generate && next build`
- **Environment Variables:** All properly configured
- **Domain:** Auto-generated Vercel URL
- **Status:** Fully functional in production

### Common Deployment Issues Solved
1. **Prisma Generation:** Added to build script
2. **Environment Variables:** Separated client/server vars
3. **Database Connection:** Using pooled connection URLs
4. **Next.js 15 Compatibility:** Updated API route patterns for async params

---

## 📋 WHAT'S WORKING vs WHAT'S NOT

### ✅ Fully Functional
- **Complete landing page** with Hero and Problem/Solution sections ✅
- **Professional auth flow** with dedicated signup and login pages ✅
- **Xtremery branding** consistently applied across all pages ✅
- User registration and login
- Multi-tenant data isolation
- Business dashboard display
- **Service ticket creation and management** ✅
- **Service status updates (PENDING → IN_PROGRESS → COMPLETED)** ✅
- **Complete customer management system** ✅
  - Independent customer creation
  - Customer list with service history
  - Customer-service relationship tracking
- **Navigation between Services and Customers pages** ✅
- **Clickable interfaces for both services and customers** ✅
- Authentication protection
- Production deployment
- Database queries and relationships

### 🔄 Next Priority: Enhanced Features
- **Customer editing** - update customer info, phone numbers, addresses
- **Service notes/updates** - add notes when changing status
- **Enhanced service details** - show costs, priorities, assignments
- **Service creation from customer page** - "Create Service" button in customer modal
- **Features preview section** - show dashboard screenshots when functionality is more complete

### ❌ Not Started Yet
- Customer portal (separate login for customers)
- Invoice generation and management
- File uploads for service requests
- SMS notifications for customers
- Advanced reporting and analytics
- Subscription billing integration
- Business onboarding flow
- Team member management

---

## 🎯 IMMEDIATE NEXT STEPS

### Priority 1: Enhanced Customer & Service Management
1. **Customer editing capabilities**
   - Edit existing customer information
   - Update contact details, addresses, and notes
   - Delete customers (with confirmation)

2. **Service creation from customers**
   - "Create Service" button in customer modal
   - Pre-populate customer info when creating from customer page
   - Streamlined workflow for existing customers

3. **Enhanced service management**
   - Add notes when changing status
   - Show service priority, costs, dates in details
   - Assign technicians to services

### Priority 2: Enhanced Service Management  
1. **Service notes and updates**
   - Add notes when changing status
   - Show update history with timestamps
   - Technician comments and internal notes

2. **Better service details**
   - Show service priority, costs, dates
   - Assign technicians to services
   - Upload photos and documents

### Priority 3: Business Polish
1. **Xtremery Branding Enhancement**
   - Further refine color scheme and consistency
   - Custom logo integration when available
   - Professional styling throughout dashboard

2. **User Experience Improvements**
   - Better loading states and transitions
   - Toast notifications for successful actions
   - Keyboard shortcuts and accessibility

### Priority 4: Landing Page Completion (When Ready)
1. **Features Preview Section**
   - Dashboard screenshots showing real functionality
   - Interactive demo or video
   - Feature callouts with benefits
   
2. **Pricing Section**
   - Clear pricing tiers ($199-499/month)
   - Feature comparison table
   - Final conversion push

3. **Footer Section**
   - Contact information
   - Company details
   - Additional links and social proof

---

## 🐛 KNOWN ISSUES & SOLUTIONS

### Issue: Next.js 15 API Route Compatibility
**Solution:** Use async params pattern: `context: { params: Promise<{ id: string }> }` and `await context.params`

### Issue: TypeScript Strict Mode Errors
**Solution:** Define proper types instead of using `any`, remove unused variables

### Issue: Brief UI hang during status updates
**Status:** Acceptable for MVP - prevents race conditions and provides user feedback
**Future:** Could add optimistic updates or loading spinners

### Issue: No real-time updates between pages
**Status:** Manual refresh required when data changes
**Future:** Consider WebSocket updates or polling

---

## 🔄 DEVELOPMENT PATTERNS ESTABLISHED

### API Route Pattern ✅
```typescript
// 1. Extract auth token from headers
// 2. Validate with Supabase using service role key
// 3. Get user from database using user.id (Supabase auth ID)
// 4. Execute business-scoped query using user's businessId
// 5. Return filtered results with proper error handling
```

### Component Pattern ✅
```typescript
// 1. Client component with 'use client'
// 2. State management with useState for UI and data
// 3. Auth check with useEffect and session validation
// 4. API calls with fetch + auth headers
// 5. Error handling and loading states
// 6. Modal patterns for detailed views
```

### Landing Page Component Pattern ✅
```typescript
// 1. Modular components in /app/components/
// 2. Xtremery brand colors and styling
// 3. Consistent gradient backgrounds and glassmorphism
// 4. Proper Link components for navigation
// 5. Responsive design with mobile-first approach
```

### Database Query Pattern ✅
```typescript
// 1. Use user.id to find user record (NOT compound key)
// 2. Always include businessId in where clauses for tenant isolation
// 3. Include necessary relations for full data
// 4. Handle errors gracefully with meaningful messages
```

### Navigation Pattern ✅
```typescript
// 1. Consistent header with business name and navigation
// 2. Simple anchor links for page navigation
// 3. Active state indicators for current page
// 4. Consistent button styling and placement
```

---

## 📚 KEY LEARNINGS & DECISIONS

### Why This Tech Stack
- **Next.js 15:** Latest features, great developer experience, excellent API routes
- **Supabase:** Managed PostgreSQL + built-in auth, perfect for multi-tenant
- **Prisma:** Type-safe database queries, excellent developer experience
- **Vercel:** Easy deployment, great Next.js integration

### Architecture Decisions
- **Multi-tenancy:** Business-scoped data isolation at database level
- **Authentication:** Supabase Auth + custom user records linked by user.id
- **API Design:** RESTful routes with proper error handling and validation
- **Frontend:** React components with TypeScript, modal-based detail views
- **Navigation:** Simple page-based routing, not complex SPA state management
- **Landing Page:** Modular component approach for maintainability

### UI/UX Decisions
- **Modal-based details:** Quick access without losing context
- **Consistent patterns:** Same header, navigation, and styling across pages
- **Progressive disclosure:** Show overview first, details on demand
- **Status-driven design:** Visual indicators for service and customer states
- **Emotional marketing:** Problem/solution flow that connects before selling
- **Brand consistency:** Xtremery colors and aesthetic throughout

### Marketing/Landing Page Decisions
- **Separate signup page:** Better conversion focus than combined login/signup
- **Problem-first approach:** Emotional connection before solution presentation
- **Realistic numbers:** Credible cost agitation vs. hyperbolic claims
- **Xtremery as proof:** Real customer success story for authenticity
- **Component-based:** Easier to iterate and A/B test individual sections

### Security Considerations
- All API routes validate authentication with Supabase
- Database queries always filtered by business for tenant isolation
- Environment variables properly separated between client and server
- No sensitive data exposed in client code
- Proper error handling without information leakage

---

## 🎪 DEMO SCRIPT

### For Showing the Working App
1. **Landing Page:** Show Hero section and Problem/Solution flow with Xtremery branding
2. **Signup Flow:** Demonstrate conversion-focused signup page and auth flow
3. **Login:** Show simplified login page with brand consistency
4. **Dashboard Overview:** Point out business name, service counts, navigation
5. **Service Management:** 
   - Create new service (show form, customer creation)
   - Click existing service to show details modal
   - Update service status (PENDING → IN_PROGRESS → COMPLETED)
6. **Customer Management:**
   - Navigate to customers page
   - Click customer to show service history
   - Demonstrate navigation between pages
7. **Data Persistence:** Show that changes are saved and persist across page refreshes

### Key Points to Highlight
- "Complete marketing + service management system working in production"
- "Professional landing page that converts visitors to trial users"
- "Multi-tenant - each business only sees their data with perfect isolation"
- "Real business workflow: create services, update status, manage customers"
- "Consistent Xtremery branding throughout entire user journey"
- "Built with modern tech stack, fully deployed and scalable"

---

## 🔮 FUTURE ROADMAP

### Phase 1: Complete MVP Service Management (Next 2-4 weeks)
- Enhanced customer editing and service management
- Service notes and update history
- Better service details with costs and priorities
- Refined Xtremery branding throughout

### Phase 2: Business Features (1-2 months)
- Invoice generation and management
- File uploads for service requests
- Team member management
- Basic reporting and analytics

### Phase 3: Customer Portal (2-3 months)
- Separate customer login system
- Customer-facing service tracking
- Email notifications for status updates
- Customer feedback and ratings

### Phase 4: Scale Features (3-6 months)
- Business onboarding flow
- Subscription billing with Stripe
- Advanced analytics and reporting
- Mobile app (React Native)
- SMS notification system

### Phase 5: Growth Features (6+ months)
- API for integrations
- White-label mobile apps
- Franchise/multi-location support
- Advanced workflow automation
- Third-party service integrations

---

## 💡 TIPS FOR FUTURE DEVELOPMENT

### Working with This Codebase
1. **Always test locally first** before deploying
2. **Use the test data** to verify functionality
3. **Check authentication** on every new page/feature
4. **Maintain tenant isolation** in all database queries
5. **Follow established patterns** for consistency
6. **Use TypeScript properly** with defined types, avoid `any`
7. **Keep components modular** for easier iteration and testing

### When Talking to New AI Assistants
1. **Share this document first** for full context
2. **Ask them to see specific files** before they code
3. **Include error messages verbatim** with full stack traces
4. **Specify whether you want to test locally or deploy**
5. **Ask for small, incremental changes** that build on existing patterns
6. **Use the established patterns** shown in this document

### Development Best Practices
- Commit frequently with descriptive messages
- Test authentication edge cases and tenant isolation
- Keep components small and focused on single responsibilities
- Document complex business logic in comments
- Follow the AI collaboration patterns for efficient development
- Always verify multi-tenant isolation in new features
- Test landing page conversion flow regularly

### Code Organization Principles
- Keep API routes simple and focused on single operations
- Use consistent naming conventions across files
- Separate concerns: UI components, business logic, data access
- Maintain clear separation between client and server code
- Use TypeScript interfaces for consistent data structures
- Keep landing page components modular for easy A/B testing

---

## 📞 EMERGENCY CONTACT INFO

### If Everything Breaks
1. **Database Issues:** Check Supabase dashboard for connection problems
2. **Auth Issues:** Verify environment variables in Vercel dashboard
3. **Build Issues:** Check Vercel deployment logs for errors
4. **Local Issues:** Delete .next folder and restart dev server
5. **API Issues:** Check browser network tab for failed requests
6. **Landing Page Issues:** Check console for component errors

### Key URLs
- **Landing Page:** http://localhost:3000/
- **Signup:** http://localhost:3000/signup
- **Login:** http://localhost:3000/login
- **Local Dashboard:** http://localhost:3000/dashboard
- **Local Customers:** http://localhost:3000/customers
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard

### Test Data Access
- Run `npx ts-node test.ts` to recreate test data
- Use Prisma Studio (`npx prisma studio`) for database inspection
- Check browser console for API call debugging

### Common Troubleshooting
- **"No services yet":** Check if user is associated with correct business
- **Authentication redirects:** Verify session token and user.id lookup
- **Modal not opening:** Check console for JavaScript errors
- **Status not updating:** Verify API route is receiving correct service ID
- **Landing page not loading:** Check component imports and syntax errors

---

**Last Updated:** After implementing complete landing page with Hero and Problem/Solution sections
**Next Session Goal:** Enhanced customer editing and service management features  
**Status:** Ready for continued development - complete marketing funnel + core service management operational.