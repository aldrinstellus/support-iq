# Support IQ (dSQ) - Savepoint

**Last Updated**: 2026-01-26 23:55 +04
**Version**: 1.2.7
**Status**: Universal Ticket System + Cache Prevention Deployed ✅

---

## Current State

### Production Deployment
| Component | URL | Status |
|-----------|-----|--------|
| **Vercel** | https://dsq.digitalworkplace.ai | ✅ Live |
| **GitHub** | https://github.com/aldrinstellus/support-iq | ✅ Current |
| **Health** | https://dsq.digitalworkplace.ai/api/health | ✅ Healthy |
| **Parent App** | https://digitalworkplace-ai.vercel.app | ✅ Linked |
| **Cache Headers** | Both apps | ✅ Configured |

### Latest Session - Cache Prevention Configuration (v1.2.7)

**Cache-Busting Headers Deployed** to prevent stale deployments:

| App | Config | Headers |
|-----|--------|---------|
| **DSQ** | `next.config.ts` | `no-store, must-revalidate` |
| **Main** | `next.config.ts` | `no-store, must-revalidate` |

**What was configured**:
1. `generateBuildId` - Creates unique build ID with timestamp
2. `Cache-Control` headers - Prevents browser caching of HTML pages
3. Security headers preserved (X-Content-Type-Options, X-Frame-Options, etc.)

**Files Modified**:
| File | Changes |
|------|---------|
| `/apps/support-iq/next.config.ts` | Added cache-control headers (line 37-43) |
| `/apps/main/next.config.ts` | Added generateBuildId + cache-control headers |
| `/apps/support-iq/CLAUDE.md` | Added cache prevention documentation |
| `/docs/QUERY_DETECTION_STANDARDS.md` | Added deployment section |

**Commits Deployed**:
- DSQ: `2396ed0` - Add cache-control headers
- Main: `ebf516b` - Add cache-control headers

---

### Previous Session - Universal Ticket System (v1.2.7)

**NEW: Standardized TICK-XXX Ticket Detection**

Universal ticket detection across ALL personas and ALL modes:
- Pattern: `TICK-XXX` (e.g., TICK-001 through TICK-010)
- Handles: "ticket 001", "TICK-001", "show me ticket 001", "ticket #001", "DESK-1001"

**10 Standardized Tickets**:
| ID | Subject | Priority | Customer |
|----|---------|----------|----------|
| TICK-001 | Authentication failures affecting 200+ users | Critical | Acme Corporation |
| TICK-002 | Password reset emails not being delivered | High | TechStart Inc |
| TICK-003 | Dashboard loading extremely slow - 30+ seconds | High | Global Dynamics |
| TICK-004 | CRM data not syncing to platform - 24 hour delay | Medium | Pinnacle Solutions |
| TICK-005 | Admin users getting "Access Denied" on settings page | High | Nexus Financial |
| TICK-006 | REST API returning 500 errors on all endpoints | Critical | DataFlow Systems |
| TICK-007 | Email notifications delayed by 2-3 hours | Medium | Velocity Marketing |
| TICK-008 | Weekly reports failing to generate - timeout errors | Medium | Summit Analytics |
| TICK-009 | iOS app crashes on startup after latest update | High | Metro Services |
| TICK-010 | Invoice showing incorrect usage charges | Medium | Horizon Consulting |

**Files Created/Modified**:
| File | Changes |
|------|---------|
| `src/data/ticket-database.ts` | NEW - 10 tickets with full data |
| `src/lib/query-detection.ts` | Added universal ticket detection |
| `src/types/widget.ts` | Extended TicketDetailData interface |
| `src/components/widgets/TicketDetailWidget.tsx` | Fixed for optional aiInsights |

**Full Spectrum Test**: 116/116 (100%) ✅

---

### Previous Session - Full Spectrum Test (v1.2.6)

**Full Spectrum Test Results** (Master Demo Guide - 116 queries):

| Mode | Personas | Queries | Passed | Status |
|------|----------|---------|--------|--------|
| **Government** | 3 | 34 | 34 | ✅ 100% |
| **Project** | 3 | 31 | 31 | ✅ 100% |
| **ATC (SME)** | 4 | 51 | 51 | ✅ 100% |
| **TOTAL** | **10** | **116** | **116** | **✅ 100%** |

**ALL 10 Personas at 100%**:
- COR (12/12) ✅
- Program Manager (12/12) ✅
- Stakeholder Lead (10/10) ✅
- Project Manager (10/10) ✅
- Service Team Lead (11/11) ✅
- Service Team Member (10/10) ✅
- ATC Executive (10/10) ✅
- ATC Manager (11/11) ✅
- ATC Support (17/17) ✅
- ATC CSM (13/13) ✅

**Fixes Applied**:
- ✅ Updated 13 test expectations to reflect MORE SPECIFIC widgets (v1.2.5 improvements)
- ✅ Fixed COR deliverables detection (`!q.includes('deliverable')` exclusion)
- ✅ Fixed velocity detection - removed "sprint velocity" from burndown pattern
- ✅ Added TICK-XXX patterns for ticket detail detection
- ✅ Added "contract deliverables status" to semantic patterns

**Files Modified**:
| File | Changes |
|------|---------|
| `src/lib/query-detection.ts` | Added `!q.includes('deliverable')` to contract status |
| `src/lib/semantic-query-patterns.ts` | Added velocity, deliverables, TICK patterns |
| `src/lib/atc-support-conversation.ts` | Added tick- triggers |
| `scripts/full-spectrum-test.mjs` | Corrected 13 test expectations |

---

### Previous Session - Session Reset Protocol Fix

**Issue**: Messages persisted across browser sessions (36 msgs visible after session end)

**Root Cause**: Race condition between `SessionResetProvider` (useEffect) and `ConversationContext` (useEffect). Both ran after React hydrated, but ConversationContext could load stale localStorage data before SessionResetProvider cleared it.

**Fix Applied**:
- ✅ **Sync Script** - Added inline script in `layout.tsx` that clears localStorage BEFORE React hydrates
- ✅ **Two-Layer Approach** - Sync script (primary) + React provider (backup)
- ✅ **User Isolation** - Different users on same device get their own clean session
- ✅ **Documentation** - Updated `docs/06-features/CONVERSATION-MANAGEMENT.md`
- ✅ **CLAUDE.md** - Added session reset protocol section
- ✅ **Build verified** - Type check and build passed

**User Isolation Logic**:
| Scenario | Action |
|----------|--------|
| New browser session | Clear all demo data |
| Same user, same session | Keep data |
| Different user (userId changed) | Clear all demo data |

**Files Modified**:
| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Added `sessionResetScript` with user isolation |
| `src/lib/session-reset.ts` | Full user tracking, `checkAndClearOnUserChange()` |
| `docs/06-features/CONVERSATION-MANAGEMENT.md` | Complete protocol + user isolation docs |
| `CLAUDE.md` | Added session reset protocol section |

### Previous Session (v1.2.5)
**NPS & Sentiment Analysis Widget**

Added combined NPS and Sentiment Analysis widget with full drill-down:
- ✅ **NPSSentimentWidget created** (~936 lines) - combined dashboard
- ✅ **NPS Score display** - color-coded gauge with Promoters/Passives/Detractors
- ✅ **Sentiment breakdown** - Positive/Neutral/Negative with drill-down
- ✅ **Interactive drill-down** - click any category to see customer details
- ✅ **TypeScript fixes** - added NPSSentimentData interface
- ✅ **Query detection** - patterns for NPS and sentiment queries
- ✅ **Production tested** - verified on live site with all queries working
- ✅ **117 queries verified** - full Demo Guide compliance

### Previous Session (v1.2.4)
**Semantic Matching Enhancement - Query Collision Prevention**

Major improvements to semantic query matching system:
- ✅ **Match threshold raised** from 0.35 to 0.50 (50%) to reduce false positives
- ✅ **75+ compound words** added (budget-related, domain-specific)
- ✅ **Key term penalty system** - penalizes unmatched key terms
- ✅ **Stop words fixed** - removed 'show', 'me' to prevent over-normalization
- ✅ **Algorithm rebalanced** - improved scoring weights
- ✅ **Team budget query fixed** - now correctly shows BudgetUtilizationDashboard
- ✅ **Analytics widget fixed** - black charts resolved with explicit hex colors
- ✅ **Drill-down functionality** - added to analytics dashboard
- ✅ **Global standards documented** - in root CLAUDE.md for all apps

### Full Spectrum Test Reports
- `docs/15-reference/FULL-SPECTRUM-AUDIT-REPORT-v1.2.2.md` - Complete audit with parallel verification
- `docs/15-reference/FULL-SPECTRUM-TEST-REPORT-v1.2.1.md` - Comprehensive test results
- `docs/15-reference/FULL-SPECTRUM-ANALYSIS-v1.2.1.md` - Parallel verification
- All documentation aligned with `query-detection.ts` implementation

### Version Details
- **Package**: support-iq@1.2.5
- **Port**: 3003 (local development)
- **Browser Tab**: dSQ | Support Portal
- **Commits**: 16c507f (NPS widget), e0b7802 (build fixes)

---

## v1.2.5 Changes

### NPS & Sentiment Analysis Widget
| Feature | Description |
|---------|-------------|
| **NPSSentimentWidget** | Combined dashboard (~936 lines) |
| **NPS Score** | Color-coded gauge 0-100 scale |
| **NPS Categories** | Promoters/Passives/Detractors with drill-down |
| **Sentiment Analysis** | Positive/Neutral/Negative with drill-down |
| **Customer Details** | Company names, feedback comments |

### Files Modified (v1.2.5)
| File | Changes |
|------|---------|
| `src/components/widgets/NPSSentimentWidget.tsx` | NEW - Full widget implementation |
| `src/components/widgets/WidgetRenderer.tsx` | Added NPS widget case |
| `src/types/widget.ts` | Added 'nps-sentiment-analysis' type, NPSSentimentData |
| `src/lib/semantic-query-patterns.ts` | Added NPS/sentiment patterns |
| `src/lib/query-detection.ts` | Added NPS/sentiment detection |

---

## v1.2.4 Changes

### Semantic Matching Enhancement
| Fix | Description |
|-----|-------------|
| **Match Threshold** | Raised from 0.35 to 0.50 (50%) |
| **Compound Words** | Added 75+ domain-specific compounds |
| **Key Term Penalty** | -0.08 for unmatched query key terms |
| **Key Term Bonus** | +0.12 per matched term, +0.15 for all matched |
| **Stop Words** | Removed 'show', 'me' from stop words |
| **Algorithm Weights** | Rebalanced: jaccard 0.35, levenshtein 0.15 |

### Key Fixes
| Issue | Resolution |
|-------|------------|
| "show team budget" → AnalyticsDashboard | Fixed: Now shows BudgetUtilizationDashboard |
| Analytics widget black charts | Fixed: Using explicit hex colors |
| Analytics drill-down missing | Fixed: Full drill-down for all cards |

### Files Modified
| File | Changes |
|------|---------|
| `src/lib/semantic-matcher.ts` | Major rewrite - threshold, compounds, penalties |
| `src/lib/semantic-query-patterns.ts` | Fixed team-budget widget mapping |
| `src/components/widgets/AnalyticsDashboardWidget.tsx` | Fixed colors, added drill-down |
| `/CLAUDE.md` (root) | Added dSQ section + Global Standards |

---

## v1.2.3 Changes

### Demo Guide Compliance
| Persona | Fix |
|---------|-----|
| Program Manager | "Sprint burndown" → `contract-performance-dashboard` |
| Service Team Member | "Top performers" → `agent-performance-comparison` |
| CSM | "Top performers" → `agent-performance-comparison` |

---

## v1.2.2 Changes

### Full Spectrum Audit
| Metric | Result |
|--------|--------|
| **Government Mode** | 15/15 PASS (100%) |
| **Project Mode** | 16/16 PASS (100%) |
| **ATC Mode** | 23/23 PASS (100%) |
| **TOTAL** | **54/54 PASS (100%)** |

### Documentation Updates
| File | Update |
|------|--------|
| FULL-SPECTRUM-AUDIT-REPORT-v1.2.2.md | Created - comprehensive audit report |
| 00-DOCUMENTATION-INDEX.md | Updated to v1.2.2, added audit reports |
| Test Report | Header counts corrected |
| context.md | Mode assignments corrected |
| SAVEPOINT.md | Full spectrum save |
| CLAUDE.md | Demo URLs corrected by mode |

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
- stakeholder-lead

**Project Mode:**
- project-manager
- service-team-lead (Technical Team Lead)
- service-team-member (Individual Contributor)

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
https://dsq.digitalworkplace.ai
```

### Cross-Project Search
- Connected via `public.knowledge_items` table
- 348 items indexed across all projects
- Full-text and semantic search enabled

---

## Documentation

### Updated Files (v1.2.2)
- `docs/DEMO-GUIDE-EXTERNAL.md` - v1.2.1 with correct widgets
- `docs/15-reference/FULL-SPECTRUM-TEST-REPORT-v1.2.1.md` - Corrected persona counts
- `CHANGELOG.md` - v1.2.2 release notes
- `CLAUDE.md` - v1.2.2 features and status
- `context.md` - v1.2.2 status with correct mode assignments
- `SAVEPOINT.md` - Full spectrum save

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

## Pending Tasks

| Priority | Task | Status |
|----------|------|--------|
| ✅ | Session reset race condition | **COMPLETED** - Sync script deployed |
| ✅ | User isolation (different users) | **COMPLETED** - User tracking deployed |
| ✅ | Documentation updates | **COMPLETED** - All docs updated |
| - | Production verification | Needs live test on dsq.digitalworkplace.ai |

### Next Session
1. Verify session reset works on production (close browser, reopen)
2. Test user isolation (different users on same device)
3. Monitor console for `[SessionReset:Sync]` logs

---

## Git Commits (Latest)

| Commit | Message |
|--------|---------|
| `e9123bf` | Add user isolation - different users get clean sessions |
| `f0cbb84` | Fix session reset race condition - enforce clean slate per session |
| `42c6b1b` | Standardize production URL to dsq.digitalworkplace.ai |

---

*Savepoint created: 2026-01-26 22:15 +04*
*Version: 1.2.5 - Session Reset & User Isolation Deployed*
*By: Claude Opus 4.5*
*GitHub: https://github.com/aldrinstellus/support-iq*
*Production: https://dsq.digitalworkplace.ai*
