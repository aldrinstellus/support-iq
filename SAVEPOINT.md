# Support IQ (dSQ) - Savepoint

**Last Updated**: 2026-01-22 19:15 +04
**Version**: 1.2.1
**Status**: Production Live - Full Spectrum Verified ✅

---

## Current State

### Production Deployment
| Component | URL | Status |
|-----------|-----|--------|
| **Vercel** | https://support-iq-pearl.vercel.app | ✅ Live |
| **GitHub** | https://github.com/aldrinstellus/support-iq | ✅ Current |
| **Health** | https://support-iq-pearl.vercel.app/api/health | ✅ Healthy |

### Latest Session (v1.2.1)
**Full Spectrum Analysis Completed - 100% Verified**

All 54 demo questions across 10 personas and 3 modes verified via parallel analysis:
- ✅ ICs get personal benchmarks, not team management views
- ✅ CSMs see customer data, not agent data
- ✅ Government personas see contractor/program terminology
- ✅ Project personas see sprint/team terminology
- ✅ ATC personas see support operations terminology

### Full Spectrum Analysis Report
- `docs/15-reference/FULL-SPECTRUM-ANALYSIS-v1.2.1.md` - Comprehensive verification
- 3 parallel agents analyzed Government/Project/ATC modes simultaneously
- All 54 questions verified semantically correct

### Version Details
- **Package**: support-iq@1.2.1
- **Port**: 3003 (local development)
- **Browser Tab**: dSQ | Support Portal

---

## v1.2.1 Changes

### Code Fixes (src/lib/query-detection.ts)
| Persona | Change |
|---------|--------|
| Service Team Member | Changed to `agent-performance-stats` (IC-appropriate) |
| Support Agent | Updated response text for IC context |
| CSM | Changed to `customer-risk-list` (manages customers, not agents) |
| COR | "Contractor personnel performance" terminology |
| Program Manager | "Program team performance" terminology |
| Stakeholder Lead | "Stakeholder contributor performance" terminology |
| Project Manager | "Sprint team performance" terminology |
| Service Team Lead | "Team member performance" terminology |
| ATC Executive | "Support operations performance" terminology |
| ATC Manager | "Direct reports performance" terminology |

### Documentation Updates
- `docs/DEMO-GUIDE-EXTERNAL.md` - Widget names corrected
- `docs/15-reference/FULL-RELEVANCE-AUDIT-REPORT.md` - Created comprehensive audit report
- `CHANGELOG.md` - v1.2.1 entry added
- `context.md` - Updated version and status
- `CLAUDE.md` - Updated version and features

---

## Features (v1.2.1)

### 100% Semantic Relevance
- Full audit of all 54 questions across 10 personas
- Role-appropriate responses for every query
- IC vs Manager role distinction implemented
- Mode-specific terminology throughout

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
OPENAI_API_KEY=***
DATABASE_URL=***
NEXT_PUBLIC_WS_URL=***
NEXT_PUBLIC_SUPABASE_URL=***
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_PUBLISHABLE_KEY=***
NEXT_PUBLIC_DEMO_MODE=true
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

### Updated Files (v1.2.1)
- `docs/DEMO-GUIDE-EXTERNAL.md` - v1.2.1 with correct widgets
- `docs/15-reference/FULL-RELEVANCE-AUDIT-REPORT.md` - NEW comprehensive audit
- `CHANGELOG.md` - v1.2.1 release notes
- `CLAUDE.md` - v1.2.1 features and status
- `context.md` - v1.2.1 status

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

*Savepoint created: 2026-01-22 18:30 +04*
*By: Claude Opus 4.5*
