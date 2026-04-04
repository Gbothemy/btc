# HashVault — Bitcoin Cloud Mining Platform

A professional Next.js 14 Bitcoin mining platform with real-time stats, user dashboard, admin panel, and automated earnings.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your DATABASE_URL, NEXTAUTH_SECRET, email credentials
```

### 3. Set up database
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Default Admin Account
After seeding:
- Email: `admin@hashvault.io`
- Password: `admin123456`

Access admin panel at `/admin`

---

## Project Structure
```
src/
├── app/                  # Next.js App Router pages
│   ├── (public)          # /, /plans, /about, /faq, /contact
│   ├── auth/             # login, register, verify, reset-password
│   ├── dashboard/        # Protected user dashboard
│   ├── admin/            # Admin panel
│   └── api/              # REST API routes
├── components/
│   ├── ui/               # Button, Card, Badge, Skeleton
│   ├── layout/           # Navbar, Footer, DashboardSidebar
│   ├── home/             # Landing page sections
│   ├── dashboard/        # Dashboard-specific components
│   └── admin/            # Admin components
├── lib/                  # prisma, auth, mining engine, email, utils
├── types/                # TypeScript types
└── middleware.ts          # Route protection
```

## Daily Earnings Cron
Trigger daily earnings processing via:
```
POST /api/cron/process-earnings
Header: x-cron-secret: <CRON_SECRET>
```
Configure in `vercel.json` for Vercel Cron (runs at midnight UTC).

## Docker
```bash
docker-compose up -d
```

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v5 (JWT + Credentials)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS v3 (dark theme)
- **Email**: Nodemailer
- **State**: React Server Components + client hooks
- **Deployment**: Vercel / Docker
