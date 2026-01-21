# Support IQ (dSQ) - Savepoint

**Last Updated**: 2026-01-21 11:54 +04
**Version**: 1.1.0
**Status**: Production - Live on Vercel

---

## Current State

### Production Deployment
| Component | URL | Status |
|-----------|-----|--------|
| **Vercel** | https://support-iq-pearl.vercel.app | ✅ Live |
| **GitHub** | https://github.com/aldrinstellus/support-iq | ✅ Current |
| **Health** | https://support-iq-pearl.vercel.app/api/health | ✅ Healthy |

### Latest Commit
```
2efccab docs: update documentation for v1.1.0 production release
dd0d4d3 fix: resolve ESLint warnings for unused variables
9c6ba5f fix: read version from package.json in health check
88638d0 feat: add FloatingModeSwitcher component (v1.1.0)
```

### Version Details
- **Package**: support-iq@1.1.0
- **Port**: 3003 (local development)
- **Browser Tab**: dSQ | Support Portal

---

## Features (v1.1.0)

### FloatingModeSwitcher
- Top-right dropdown with animated mode switching
- Framer Motion animations
- 3 Modes: Government, Project, ATC (SME)

### Personas (10 total)
**ATC Mode:**
- atc-executive (C-Level)
- atc-manager (CS Manager)
- atc-support (Support Agent)
- atc-csm (Customer Success Manager)

**Government Mode:**
- cor (Contract Officer Representative)
- program-manager
- service-team-lead
- service-team-member
- stakeholder-lead

**Project Mode:**
- project-manager

### Theme System
- Dark/Light mode toggle
- Smooth Framer Motion animations
- Persisted in localStorage

---

## Database Status

### Supabase Connection
- **Project ID**: fhtempgkltrazrgbedrh
- **Schema**: dsq (Support IQ specific)
- **Status**: Connected

### DSQ Tables (15 total)
| Table | Rows | Embeddings |
|-------|------|------------|
| customers | 8 | - |
| agents | 7 | - |
| tickets | 8 | 8 (100%) |
| ticket_messages | 6 | - |
| kb_categories | 7 | - |
| kb_articles | 10 | 10 (100%) |
| sla_policies | 5 | - |
| tags | 10 | - |
| canned_responses | 8 | 8 (100%) |
| conversations | 0 | - |
| conversation_messages | 0 | - |
| escalations | 0 | - |
| agent_metrics | 0 | - |
| analytics | 0 | - |
| activity_log | 0 | - |

### Cross-Project Knowledge
| Table | Rows | Embeddings |
|-------|------|------------|
| public.knowledge_items | 348 | 348 (100%) |

### Vector Configuration
- **pgvector**: v0.8.0
- **Dimensions**: 1536 (OpenAI text-embedding-3-small)
- **HNSW Indexes**: 6 for DSQ schema
- **Embedding Coverage**: 100%

---

## Code Quality

### Build Status
- **TypeScript**: 0 errors (strict mode)
- **ESLint**: 0 warnings
- **Build**: 26 static pages, 47s compile time
- **Next.js**: 16.1.3 (Turbopack)

### API Endpoints (All Working)
- `/api/health` - Health check
- `/api/tickets` - Ticket operations
- `/api/chat` - Claude AI integration
- `/api/drafts/*` - Draft management
- `/api/feedback` - User feedback
- `/api/zoho/*` - Zoho integration

---

## Environment Variables

### Required (.env.local)
```
AUTH_SECRET=***
OPENAI_API_KEY=*** (added 2026-01-21)
DATABASE_URL=***
NEXT_PUBLIC_WS_URL=***
NEXT_PUBLIC_SUPABASE_URL=***
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_PUBLISHABLE_KEY=***
```

---

## Integration with Digital Workplace AI

### Dashboard Button
The Support IQ product card in Digital Workplace dashboard (`apps/main/src/app/dashboard/page.tsx`) links to:
```
https://support-iq-pearl.vercel.app
```

### Cross-Project Search
- Connected via `public.knowledge_items` table
- 348 items indexed across all projects
- Full-text and semantic search enabled

---

## Documentation

### Updated Files
- `docs/00-DOCUMENTATION-INDEX.md` - v1.1.0, production URLs
- `docs/15-reference/CHANGELOG.md` - v1.1.0 release notes
- `CLAUDE.md` - v1.1.0 features and status
- `context.md` (global) - Support IQ section current

### Documentation Structure
```
docs/
├── 00-DOCUMENTATION-INDEX.md
├── 01-getting-started/
├── 02-architecture/
├── 03-api/
├── 04-database/
├── 05-integrations/
├── 06-features/
├── 07-components/
├── 08-development/
├── 09-testing/
├── 10-deployment/
├── 11-operations/
├── 12-security/
├── 13-performance/
├── 14-workflows/
└── 15-reference/
```

---

## Next Steps (Optional)

- [ ] Add more demo data for testing
- [ ] Implement real-time WebSocket features
- [ ] Add Prisma database connection
- [ ] Enable additional personas
- [ ] Add more AI workflows

---

## Quick Commands

```bash
# Start development server
cd /Users/aldrin-mac-mini/digitalworkplace.ai/apps/support-iq
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Check health
curl http://localhost:3003/api/health
```

---

*Savepoint created: 2026-01-21 11:54 +04*
*By: Claude Opus 4.5*
