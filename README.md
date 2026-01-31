# Demo Admin ID and Password
- Email - adminpanel@canteen.on
- Password - Meow<3@@
- Demo - https://canteen-swift.vercel.app

# 🍽️ CampusBites - Smart Canteen Ordering System

A modern, full-stack digital canteen ordering platform designed to streamline college cafeteria operations with real-time order tracking, secure customer data handling, and role-based admin access.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)

## ✨ Features

### 👤 Customer Experience
- **Digital Menu** - Browse categorized food items with images, descriptions, and pricing
- **Smart Cart** - Add items, adjust quantities, and view real-time totals
- **Quick Checkout** - Simple order placement with name and phone number
- **Order Tracking** - Real-time status updates from pending to ready for pickup

### 🔐 Security & Privacy
- **PII Encryption** - Customer names and phone numbers are encrypted at rest using PGP symmetric encryption
- **Role-Based Access Control** - Admin/staff roles with secure authentication
- **RLS Policies** - Row-level security ensures data protection at the database level
- **Secure API** - Edge functions validate JWT tokens and user roles before exposing sensitive data

### 👨‍💼 Admin Dashboard
- **Order Management** - View all orders with decrypted customer information
- **Status Updates** - Progress orders through workflow (Pending → Confirmed → Preparing → Ready → Completed)
- **Real-time Sync** - Live updates across all connected clients via Supabase Realtime

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| State | React Context, TanStack Query |
| Backend | Supabase (Lovable Cloud) |
| Database | PostgreSQL with RLS |
| Auth | Supabase Auth with RBAC |
| Functions | Deno Edge Functions |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── MenuCard.tsx    # Food item display
│   ├── CartItem.tsx    # Cart line items
│   └── AdminOrderCard.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── CartContext.tsx # Shopping cart state
│   └── OrderContext.tsx # Order management
├── pages/              # Route pages
│   ├── Index.tsx       # Menu/home page
│   ├── Cart.tsx        # Shopping cart
│   ├── Track.tsx       # Order tracking
│   └── Admin.tsx       # Admin dashboard
├── data/               # Static data
│   └── menuData.ts     # Menu items
├── types/              # TypeScript definitions
│   └── canteen.ts      # Domain types
└── integrations/       # External integrations
    └── supabase/       # Auto-generated client

supabase/
├── functions/          # Edge Functions
│   ├── get-admin-orders/   # Fetch orders with decrypted PII
│   └── admin-update-order/ # Update order status
└── migrations/         # Database migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Lovable account (backend is auto-provisioned)

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔑 Admin Access Setup

1. **Sign up** at `/admin` with your email
2. **Verify** your email address
3. **Grant admin role** via SQL (one-time setup):

```sql
-- Find your user ID from auth.users, then:
INSERT INTO user_roles (user_id, role) 
VALUES ('your-user-id', 'admin');
```

## 📊 Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `orders` | Core orders with encrypted customer data |
| `user_roles` | RBAC role assignments |

### Views

| View | Purpose |
|------|---------|
| `orders_public` | Public tracking (no PII) |
| `orders_admin` | Admin view with decrypted PII |

### Security Functions

- `encrypt_text(text)` - PGP encryption for PII
- `decrypt_text(text)` - PGP decryption (requires vault key)
- `has_role(role, user_id)` - Role verification

## 🔒 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  Public Views          │  Admin Views                   │
│  - Menu browsing       │  - Requires authentication     │
│  - Order placement     │  - Role validation (JWT)       │
│  - Status tracking     │  - Decrypted PII access        │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   Edge Functions                         │
│  - JWT verification                                      │
│  - Role-based access control                            │
│  - Service role for sensitive operations                │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL + RLS                       │
│  - Row-level security policies                          │
│  - Encrypted PII columns                                │
│  - Secure views for data access                         │
└─────────────────────────────────────────────────────────┘
```

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Menu browsing with category filters |
| `/cart` | Shopping cart and checkout |
| `/track` | Order status tracking |
| `/admin` | Staff dashboard (protected) |

## 🎨 Design System

The project uses a custom design system built on Tailwind CSS with semantic color tokens:

- `--primary` / `--primary-foreground` - Brand colors
- `--secondary` / `--muted` - Supporting colors  
- `--destructive` - Error states
- `--success` - Success states

All colors support light and dark mode.

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using [Lovable](https://lovable.dev)
