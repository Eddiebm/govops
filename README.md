# GovOps: COARE Governance Operations Platform

A comprehensive governance platform for managing board meetings, agendas, action items, recordings, transcriptions, and keeping stakeholders informed across different governance levels.

Built with **Next.js 14**, **Supabase**, **Vercel**, and **React Native** for web and mobile.

## Features

- 📅 **Meeting Management** — Schedule, invite, RSVP, attendee tracking
- 📋 **Agenda Builder** — Drag-drop agendas with time allocations
- 🎯 **Action Items** — Assign tasks, track completion, accountability
- 🎙️ **Recording & Transcription** — Auto-transcription via AssemblyAI
- 📄 **Board Materials** — Document storage with versioning
- 🔔 **Real-time Notifications** — Keep everyone informed
- 👥 **Role-Based Access** — ADMIN, CEO, MEMBER, OBSERVER
- 📊 **Dashboard** — CEO view of all boards, meetings, action items
- 🔐 **Audit Logging** — Full governance compliance tracking
- 📱 **Mobile-Ready** — React Native app (Expo)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend (Web)** | Next.js 14 + React 18 + Tailwind CSS |
| **Frontend (Mobile)** | React Native + Expo |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | Supabase (PostgreSQL with RLS) |
| **Auth** | Supabase Auth (email/password) |
| **Transcription** | AssemblyAI API |
| **Hosting** | Vercel |
| **Storage** | Supabase Storage |

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Supabase account (free tier)
- Vercel account (free tier)
- AssemblyAI API key (free tier)

### Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/govops.git
cd govops

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Add your credentials to .env.local:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# ASSEMBLYAI_API_KEY=your_assemblyai_api_key

# Run development server
npm run dev

# Open http://localhost:3000
```

### Deploy to Vercel

```bash
# One-click deploy
vercel deploy --prod

# Or connect GitHub → Vercel auto-deploys on push
```

## Database Schema

See `govops_schema.sql` for the complete PostgreSQL schema with 11 tables:

- `users` — Authentication + roles
- `boards` — SCAB, BOA, Executive
- `board_members` — Board membership + equity
- `meetings` — Meeting scheduling + recording
- `agendas` — Meeting agendas
- `agenda_items` — Individual agenda topics
- `action_items` — Task tracking
- `board_materials` — Document storage
- `meeting_minutes` — Post-meeting summaries
- `notifications` — Real-time alerts
- `audit_log` — Governance compliance

All tables include RLS (Row-Level Security) policies for data privacy.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # CEO dashboard
│   ├── meetings/          # Meeting management
│   ├── boards/            # Board management
│   ├── action-items/      # Task tracking
│   ├── materials/         # Document storage
│   ├── auth/              # Authentication
│   └── api/               # API routes
├── components/            # Reusable React components
├── lib/                   # Utilities (Supabase, API, etc.)
├── hooks/                 # React hooks
├── types/                 # TypeScript types
└── styles/               # Global CSS + Tailwind
```

## Environment Variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your Vercel domain
```

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start              # Run production build
npm run lint           # Check code quality

# Deployment
vercel deploy          # Deploy to staging
vercel deploy --prod   # Deploy to production
```

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| **ADMIN** | Create boards, manage members, full control |
| **CEO** | Full meeting/action item control, view all boards |
| **MEMBER** | Attend meetings, RSVP, complete tasks |
| **OBSERVER** | Read-only access |

## Features Roadmap

### Phase 1: Core (Week 1-2) ✓
- [x] Authentication
- [x] Dashboard layout
- [x] Landing page
- [ ] Board management
- [ ] Meeting scheduling

### Phase 2: Operations (Week 3-4)
- [ ] Agenda builder
- [ ] Action items
- [ ] Document upload
- [ ] Email notifications

### Phase 3: Intelligence (Week 5-6)
- [ ] Recording integration
- [ ] Transcription
- [ ] Meeting minutes
- [ ] Search

### Phase 4: Optimization (Week 7+)
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] API integrations
- [ ] Advanced reporting

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## Deployment

### Vercel (Recommended)
1. Connect GitHub → Vercel
2. Auto-deploys on push to `main`
3. Environment variables in Vercel Settings

### Docker
```bash
docker build -t govops .
docker run -p 3000:3000 govops
```

## Support

- **Documentation:** See `GovOps_Implementation_Guide.md`
- **Deployment:** See `GovOps_GitHub_Vercel_Deploy.md`
- **Quick Start:** See `GovOps_Quick_Start.md`

## License

Private — COARE Holdings Inc.

## Author

Built for **COARE Holdings Inc.** by Eddie Bannerman-Menson

---

**Status:** ✓ Deployed at https://govops.vercel.app

**Last Updated:** March 31, 2026
