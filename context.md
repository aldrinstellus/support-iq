# Support IQ - Project Context

**Version**: 1.2.0
**Last Updated**: 2026-01-22
**Status**: Production Live

---

## Quick Links

| Resource | URL |
|----------|-----|
| **Production** | https://support-iq-pearl.vercel.app |
| **GitHub** | https://github.com/aldrinstellus/support-iq |
| **Local Dev** | http://localhost:3003 |
| **Parent App** | https://digitalworkplace-ai.vercel.app |

---

## What is Support IQ?

Support IQ (dSQ) is an AI-Enhanced Customer Support module for Digital Workplace AI. It provides intelligent, role-based support interfaces through a multi-persona, multi-mode system.

### Core Capabilities

1. **Multi-Mode System**: 3 distinct operational modes
   - **Government**: Federal & public sector workflows
   - **Project**: Project management & teams
   - **ATC (SME)**: Small & Medium Enterprises

2. **10 Role-Based Personas**: Each with tailored UI and widgets
3. **54 Pre-Configured Demo Queries**: All verified and passing
4. **AI Chat Interface**: Claude-powered responses with widget rendering
5. **Live Integrations**: Zoho Desk, Supabase, real-time tickets

---

## Demo Mode Configuration

**CRITICAL**: Demo mode must be enabled for consistent widget responses.

```env
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

When enabled:
- Queries bypass Claude API
- Pre-configured widgets render instantly
- Consistent, reproducible demo scenarios

---

## Personas by Mode

### Government Mode (5 personas)
| Persona | URL | Role |
|---------|-----|------|
| COR (Alexa Johnson) | `/demo/cor` | Contract Officer Representative |
| Program Manager (Jennifer Chen) | `/demo/program-manager` | Federal Program Management |
| Service Team Lead (Herbert Roberts) | `/demo/service-team-lead` | Team Operations Lead |
| Service Team Member (Molly Rivera) | `/demo/service-team-member` | Individual Contributor |
| Stakeholder Lead (Jessica Martinez) | `/demo/stakeholder-lead` | Stakeholder Management |

### Project Mode (1 persona)
| Persona | URL | Role |
|---------|-----|------|
| Project Manager (Dale Thompson) | `/demo/project-manager` | Agile/Sprint Management |

### ATC Mode (4 personas)
| Persona | URL | Role |
|---------|-----|------|
| Executive (Jennifer Anderson) | `/demo/atc-executive` | C-Level Strategic View |
| Manager (David Miller) | `/demo/atc-manager` | Team & Performance Management |
| Support Agent (Christopher Hayes) | `/demo/atc-support` | Frontline Ticket Handling |
| CSM (Jordan Taylor) | `/demo/atc-csm` | Customer Success Management |

---

## Key Files for Demo

| File | Purpose |
|------|---------|
| `src/lib/query-detection.ts` | Maps queries to widgets per persona |
| `src/lib/atc-csm-conversation.ts` | ATC CSM persona query patterns |
| `src/lib/atc-support-conversation.ts` | ATC Support query patterns |
| `src/components/chat/InteractiveChat.tsx` | Main chat processing logic |
| `src/components/widgets/WidgetRenderer.tsx` | Widget type-to-component mapping |
| `.env.local` | Demo mode & API keys |

---

## Universal Demo Questions

These questions work across ALL personas:

1. **"Who are my top performers?"** → Agent Performance Comparison widget
2. **"Draft response about the outage"** → Response Composer widget
3. **"Open the most urgent access issue"** → Ticket Detail widget (TICK-001)
4. **"Show me the latest end user request"** → Ticket List widget (Live Zoho)

---

## Integration with Digital Workplace AI

Support IQ is one module in the Digital Workplace AI suite:

```
digitalworkplace-ai.vercel.app (Main App)
├── /diq - Intranet IQ (port 3001)
├── /dcq - Chat Core IQ (port 3002)
└── /dsq - Support IQ (port 3003) ← THIS MODULE
```

### Database
- **Supabase Project**: `fhtempgkltrazrgbedrh`
- **Schema**: `dsq` (Support IQ specific tables)
- **Shared Schema**: `public` (cross-module data)

---

## Development Workflow

```bash
# Start development server
cd /Users/aldrin-mac-mini/digitalworkplace.ai/apps/support-iq
npm run dev    # Starts on port 3003

# Or from monorepo root
cd /Users/aldrin-mac-mini/digitalworkplace.ai
npm run dev:support    # If configured
```

### Testing a Demo
1. Ensure `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`
2. Navigate to any persona URL (e.g., `/demo/atc-csm`)
3. Type a demo question (e.g., "Show customer health")
4. Verify widget renders correctly

---

## Recent Updates (v1.2.0)

- **Full-Spectrum Testing**: 54/54 questions verified across all personas
- **ATC CSM Fix**: Added missing "at-risk customers" trigger patterns
- **Demo Mode Verified**: All widgets render correctly in demo mode
- **Documentation Updated**: CLAUDE.md, CHANGELOG.md refreshed

---

## Support & Maintenance

**Maintainer**: Aldo (aldrinstellus)
**Documentation**: See `/docs/` for SDLC-compliant documentation
**Issues**: Report via GitHub Issues

---

*Last verified: 2026-01-22*
