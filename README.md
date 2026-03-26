# ClinHelp

**AI-powered clinical documentation and workflow platform**
Built by [Norax Solutions, LLC](https://noraxsolutions.com)

ClinHelp reduces documentation time for behavioral health and psychiatric practices by automating note drafting, screening scoring, coding suggestions, and follow-up task generation — while keeping clinicians in full control of every clinical decision.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm workspaces |
| Web App | Next.js 14 (App Router), Tailwind CSS, shadcn/ui |
| API | NestJS, Prisma 5, PostgreSQL |
| Mobile | Expo (React Native) |
| Database | PostgreSQL + Redis |
| Queue | BullMQ + Redis |
| File Storage | S3-compatible |
| AI | Abstracted provider (mock / OpenAI / Anthropic) |
| Speech-to-Text | Abstracted provider (mock / Deepgram / AssemblyAI) |
| Auth | JWT + bcryptjs |
| Shared Packages | @clinhelp/types, @clinhelp/config, @clinhelp/ai |

---

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your local database credentials
```

### 3. Start database and Redis

```bash
# Using Docker (recommended)
docker-compose up -d

# Or ensure local PostgreSQL (port 5432) and Redis (port 6379) are running
```

### 4. Set up the database

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Sync schema to database
pnpm db:seed        # Load demo data
```

### 5. Start all apps

```bash
pnpm dev
```

| App | URL |
|-----|-----|
| Web (clinician UI) | http://localhost:3000 |
| API | http://localhost:3001 |
| API Docs (Swagger) | http://localhost:3001/api/docs |
| Mobile (Expo) | http://localhost:8081 |
| Prisma Studio | `pnpm db:studio` → http://localhost:5555 |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `AI_MODE` | No | `mock` (default), `openai`, or `anthropic` |
| `STT_PROVIDER` | No | `mock` (default), `deepgram`, or `assembly` |
| `OPENAI_API_KEY` | If openai | OpenAI API key |
| `ANTHROPIC_API_KEY` | If anthropic | Anthropic API key |
| `DEEPGRAM_API_KEY` | If deepgram | Deepgram API key |
| `NEXT_PUBLIC_API_URL` | Yes | API base URL used by the web app |
| `S3_BUCKET` | No | S3 bucket for file storage |

See `.env.example` for the full list with descriptions.

---

## Demo Credentials

After running `pnpm db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Org Admin | admin@clinhelpdemo.com | ClinHelp2024! |
| Provider (Psychiatrist MD) | dr.chen@clinhelpdemo.com | ClinHelp2024! |
| Therapist (LCSW) | j.washington@clinhelpdemo.com | ClinHelp2024! |
| Care Coordinator | care@clinhelpdemo.com | ClinHelp2024! |

The seed creates a demo organization ("ClinHelp Demo") with 3 patients, diagnoses, medications, completed encounters, a finalized SOAP note, screenings, tasks, and audit log entries.

---

## Repository Structure

```
clinhelp/
├── apps/
│   ├── web/                  # Next.js 14 clinician web app
│   ├── api/                  # NestJS REST API (14 modules)
│   └── mobile/               # Expo React Native app
├── packages/
│   ├── types/                # @clinhelp/types — shared TypeScript types
│   ├── config/               # @clinhelp/config — constants, screening configs, labels
│   └── ai/                   # @clinhelp/ai — AI provider abstraction layer
├── prisma/
│   ├── schema.prisma         # Full database schema (18 models)
│   └── seed.ts               # Demo data seed script
├── docs/
│   ├── architecture.md       # System architecture and module reference
│   ├── prd.md                # Product Requirements Document (MVP)
│   └── setup.md              # Local development setup guide
├── .env.example              # Environment variable template
├── .gitignore
├── .prettierrc
├── package.json              # Root workspace config
├── tsconfig.base.json        # Shared TypeScript base config
└── turbo.json                # Turborepo pipeline config
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all workspaces |
| `pnpm type-check` | TypeScript type check across all workspaces |
| `pnpm format` | Format all files with Prettier |
| `pnpm db:generate` | Generate Prisma client from schema |
| `pnpm db:migrate` | Create and apply a new database migration |
| `pnpm db:push` | Push schema changes to database (no migration file) |
| `pnpm db:seed` | Seed the database with demo data |
| `pnpm db:studio` | Open Prisma Studio database GUI |

---

## Documentation

- [Architecture](./docs/architecture.md) — System design, module reference, database schema, AI layer, auth
- [PRD](./docs/prd.md) — Product vision, feature set, pricing, launch roadmap
- [Setup Guide](./docs/setup.md) — Step-by-step local development setup with troubleshooting

---

## AI Safety Notice

All AI-generated content in ClinHelp includes a mandatory disclaimer and requires clinician review before finalization. The system does not autonomously diagnose, prescribe, or make clinical decisions. See [docs/architecture.md](./docs/architecture.md) for the full AI safety and compliance framework.

---

## License

Proprietary — Norax Solutions, LLC. All rights reserved.
