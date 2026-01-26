# 📝 Changelog

**Support IQ (dSQ) - Version History**

---

## [1.1.0] - January 21, 2026 🚀

### ✨ FloatingModeSwitcher & Full Production Deployment

**New Features**:
- **FloatingModeSwitcher**: Top-right dropdown with animated mode switching
- **3 Modes**: Government, Project, ATC (SME)
- **10 Personas**: Role-based interfaces across all modes
- **Theme Toggle**: Dark/light mode with smooth Framer Motion animations

**Database**:
- ✅ 15 DSQ schema tables with complete data
- ✅ 100% vector embedding coverage (374 rows)
- ✅ 6 HNSW indexes for fast semantic search
- ✅ pgvector v0.8.0 with 1536 dimensions (OpenAI text-embedding-3-small)
- ✅ Cross-project knowledge search (348 knowledge_items)

**Infrastructure**:
- ✅ Vercel deployment: https://dsq.digitalworkplace.ai
- ✅ GitHub: https://github.com/aldrinstellus/support-iq
- ✅ Health endpoint returning v1.1.0
- ✅ OpenAI API key configured for embeddings
- ✅ Supabase connected in production

**Code Quality**:
- ✅ TypeScript: 0 errors (strict mode)
- ✅ ESLint: 0 warnings
- ✅ Build: 26 static pages, 47s compile time

**Demo Pages** (All HTTP 200):
- ATC Mode: atc-executive, atc-manager, atc-support, atc-csm
- Government Mode: cor, program-manager, service-team-lead, service-team-member, stakeholder-lead
- Project Mode: project-manager

---

## [1.0.0] - January 2026

### Initial Production Release
- Renamed from atc-support-v20-op3 to support-iq
- Port changed to 3003
- Browser tab: "dSQ | Support Portal"
- Package name: support-iq

---

## [14.0.0] - October 14, 2025 🏆

### ✨ Major Achievement: 100/100 Production Score!

**ESLint Cleanup**:
- Reduced warnings from 73 → 9 (88% reduction)
- Removed unused imports across 27 files
- Added ESLint disable comments for intentional cases

**Infrastructure**:
- ✅ Health check endpoint (\`/api/health\`)
- ✅ Security headers middleware (CSP, HSTS, etc.)
- ✅ Docker containerization (multi-stage build)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Environment validation (Zod)

**Documentation**:
- ✅ Complete SDLC documentation structure
- ✅ 60+ documentation files
- ✅ Professional organization (\`/docs/\` + \`/Aldo/\`)

---

## Previous Versions

See `/Aldo/CHANGELOG.md` for complete version history.

Key milestones:
- **V12**: Zoho Desk webhook integration
- **V11**: Advanced features branch
- **V6**: Fork from V4
- **V4**: Widget system enhancements
- **V3**: Claude SDK integration
