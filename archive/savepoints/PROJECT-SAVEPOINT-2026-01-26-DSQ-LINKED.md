# PROJECT SAVEPOINT - DSQ Linked to Digital Workplace AI

**Date**: 2026-01-26
**Version**: 1.2.3
**Status**: Production Live - Linked to Digital Workplace AI
**Commit**: dcadba6

---

## Summary

Support IQ (dSQ) is now fully linked to the main Digital Workplace AI platform with `/dsq` basePath, matching the pattern used by dIQ and dCQ.

---

## Integration Status

| Module | basePath | Production URL | Status |
|--------|----------|----------------|--------|
| **dIQ** (Intranet IQ) | `/diq` | intranet-iq.vercel.app/diq | ✅ Linked |
| **dCQ** (Chat Core IQ) | `/dcq` | chat-core-iq.vercel.app/dcq | ✅ Linked |
| **dSQ** (Support IQ) | `/dsq` | support-iq-pearl.vercel.app/dsq | ✅ **NOW Linked** |

---

## What Was Done

### 1. Added basePath to Support IQ
- File: `next.config.ts`
- Added: `basePath: "/dsq"`
- All routes now prefixed with `/dsq`

### 2. Updated Main App Dashboard
- File: `apps/main/src/app/dashboard/page.tsx`
- Changed Support IQ link from standalone URL to include `/dsq` path
- Old: `https://support-iq-pearl.vercel.app`
- New: `https://support-iq-pearl.vercel.app/dsq/demo/cor`

### 3. Updated Comparison Script
- File: `scripts/full-spectrum-comparison.mjs`
- Updated OUR_DSQ URL to use `/dsq` prefix

---

## Verification Results

### Full Spectrum Test: 54/54 PASS (100%)

| Mode | Personas | Questions | Status |
|------|----------|-----------|--------|
| **Government** | 3 | 15 | ✅ 15/15 |
| **Project** | 3 | 16 | ✅ 16/16 |
| **ATC (SME)** | 4 | 23 | ✅ 23/23 |
| **TOTAL** | **10** | **54** | **✅ 54/54** |

### API Endpoints Verified

| Endpoint | Status |
|----------|--------|
| `/dsq/api/health` | ✅ healthy, v1.2.3 |
| `/dsq/api/test-query` | ✅ Working |
| `/dsq/demo/cor` | ✅ HTTP 200 |

---

## Git Commits

### Support IQ (support-iq)
```
dcadba6 fix: update comparison script to use /dsq basePath
052f32d feat: add basePath /dsq for Digital Workplace AI integration
c8bfc3f docs: add full spectrum verification savepoint
bfd403b feat: add full-spectrum-comparison script
```

### Main App (digitalworkplace.ai)
```
2a8aa70 fix: update Support IQ link to use /dsq basePath
```

---

## Production URLs

| Route | URL |
|-------|-----|
| **Health** | https://support-iq-pearl.vercel.app/dsq/api/health |
| **Test Query** | https://support-iq-pearl.vercel.app/dsq/api/test-query |
| **COR Demo** | https://support-iq-pearl.vercel.app/dsq/demo/cor |
| **Program Manager** | https://support-iq-pearl.vercel.app/dsq/demo/program-manager |
| **ATC Support** | https://support-iq-pearl.vercel.app/dsq/demo/atc-support |
| **ATC CSM** | https://support-iq-pearl.vercel.app/dsq/demo/atc-csm |

---

## Quick Start

```bash
cd /Users/aldrin-mac-mini/digitalworkplace.ai/apps/support-iq
npm run dev              # Start on port 3003 → http://localhost:3003/dsq
npm run type-check       # Verify TypeScript
node scripts/full-spectrum-comparison.mjs  # Run full spectrum test
```

---

**Savepoint Created By**: Claude Opus 4.5
**Session**: Digital Workplace AI Integration
