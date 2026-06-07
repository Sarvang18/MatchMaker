# TDC Matchmaker Dashboard

An internal CRM tool for The Date Crew (TDC), a professional matchmaking company. This system enables human matchmakers to manage client profiles, run AI-powered matching algorithms, and facilitate meaningful connections.

## Overview

TDC Matchmaker is **not a dating app**. It's a professional tool used exclusively by matchmakers to:
- Manage client profiles (manually added or via public onboarding form)
- Run weighted scoring algorithms to find compatible matches
- Use AI (Gemini 2.0 Flash) to rank and explain matches
- Send personalized match introductions via email
- Track client responses through magic link portals
- Manage the entire matchmaking pipeline via Kanban board

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: NextAuth.js with JWT strategy
- **ORM**: Prisma
- **Database**: PostgreSQL (AWS RDS)
- **Cache**: Redis (AWS ElastiCache)
- **File Storage**: AWS S3 (profile photos)
- **AI**: Google Gemini 2.0 Flash API (@google/generative-ai)
- **Email**: Resend API
- **Deployment**: Vercel

## Project Structure

```
/app
  /dashboard          ← Matchmaker home (protected)
  /client/[id]        ← Client detail + matches (protected)
  /onboard            ← Public client self-fill form
  /match/[token]      ← Public magic link portal
  /login              ← Matchmaker login
  /api
    /auth/[...nextauth]
    /clients          ← GET all, POST create
    /clients/[id]     ← GET one, PATCH update
    /matches          ← POST trigger matching
    /matches/[id]/send ← POST send match email
    /matches/[token]/respond ← POST client response

/components
  /ui                 ← shadcn components
  /dashboard          ← ClientTable, KanbanBoard, StatsCards
  /client             ← BiodataCard, MatchCard, NotesPanel
  /match              ← MatchPortal, ResponseButtons

/lib
  /db.ts              ← Prisma client singleton
  /auth.ts            ← NextAuth config
  /matching-engine.ts ← Pure TS scoring logic
  /gemini.ts          ← Gemini API wrapper
  /resend.ts          ← Email sender
  /token.ts           ← Magic link JWT generator/verifier

/prisma
  schema.prisma       ← Database schema
  seed.ts             ← 100 dummy profiles script
```

## Database Schema

**Models:**
- **Matchmaker**: Admin users who manage the system
- **Client**: Male/Female profiles with 30+ biodata fields
- **Match**: AI-scored matches with explanations and magic links
- **Note**: Internal notes by matchmakers on clients

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (AWS RDS recommended)
- Redis instance (AWS ElastiCache recommended)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd tdc-matchmaker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Then edit `.env` with your actual credentials:
- PostgreSQL connection string
- NextAuth secret (generate with: `openssl rand -base64 32`)
- Google Gemini API key
- Gmail SMTP credentials (get app password from: https://myaccount.google.com/apppasswords)
- Magic link secret (generate with: `openssl rand -hex 32`)
- AWS credentials and S3 bucket
- Redis connection URL

### Database Setup

1. Generate Prisma client
```bash
npx prisma generate
```

2. Run database migrations
```bash
npx prisma migrate dev --name init
```

3. Seed the database with sample data
```bash
npx prisma db seed
```

This will create:
- 1 matchmaker account (admin@tdc.com / tdc@2025)
- 50 male profiles with realistic Indian data
- 50 female profiles with realistic Indian data

### Verify Setup

1. Check database records
```bash
npx prisma studio
```

Open http://localhost:5555 and verify:
- 1 record in Matchmaker table
- 100 records in Client table

2. Verify TypeScript compilation
```bash
npx tsc --noEmit
```

Should complete with zero errors.

3. Start development server
```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing (32+ chars) | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `GMAIL_USER` | Gmail address for sending emails | Yes |
| `GMAIL_APP_PASSWORD` | Gmail app password (16 chars) | Yes |
| `MAGIC_LINK_SECRET` | Secret for magic link tokens | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | Yes |
| `AWS_S3_BUCKET` | S3 bucket name for photos | Yes |
| `AWS_REGION` | AWS region (e.g., ap-south-1) | Yes |
| `REDIS_URL` | Redis connection URL | Yes |

## Features

### Core Features
- ✅ **Authentication**: NextAuth.js with credential-based login
- ✅ **Client Management**: Full CRUD operations for client profiles
- ✅ **Dashboard**: Kanban board with client status tracking
- ✅ **AI-Powered Matching**: Gemini 2.0 Flash for match ranking and explanations
- ✅ **Weighted Scoring**: Multi-dimensional compatibility algorithm
- ✅ **Email System**: Automated match notifications via email
- ✅ **Magic Links**: Secure, token-based client portal access
- ✅ **Response Tracking**: Real-time match status updates
- ✅ **Public Onboarding**: Self-service client registration form
- ✅ **Profile Photos**: AWS S3 integration for photo storage
- ✅ **Notes System**: Internal matchmaker notes on clients

## Default Credentials

After running the seed script:

**Matchmaker Login**
- Email: admin@tdc.com
- Password: tdc@2025

## License

Private and confidential. For internal use by The Date Crew only.
