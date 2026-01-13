# Persona & Widget Knowledge Base

**Version**: V20-OP3
**Last Updated**: January 13, 2026
**Status**: Production Ready

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Mode Architecture](#mode-architecture)
3. [Persona Reference](#persona-reference)
4. [Widget Catalog](#widget-catalog)
5. [Query Detection Patterns](#query-detection-patterns)
6. [Quick Actions Reference](#quick-actions-reference)
7. [Cross-Reference Matrix](#cross-reference-matrix)
8. [URL Reference](#url-reference)
9. [Technical Implementation](#technical-implementation)
10. [Troubleshooting](#troubleshooting)

---

## System Overview

### Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                      MODE SWITCHER                          │
│              Government | Project | ATC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PERSONA CONTEXT                          │
│    Each mode contains 3-4 role-specific personas            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   QUERY DETECTION                           │
│    User input → Pattern matching → Widget selection         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   WIDGET RENDERING                          │
│    Persona-aware, dynamic data, role-appropriate view       │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Role-Based Access Control (RBAC)**: Each persona sees only what's relevant to their role
2. **Dynamic Content**: Same query returns different widgets based on persona context
3. **Query Detection**: Pattern matching determines which widget to render
4. **Persistent State**: Conversations persist per-persona in localStorage

---

## Mode Architecture

### Three Operating Modes

| Mode | Purpose | Personas | Primary Focus |
|------|---------|----------|---------------|
| **Government** | Federal contract management | 3 | Contracts, compliance, deliverables |
| **Project** | Software development teams | 3 | Sprints, code quality, team workload |
| **ATC** | Customer support operations | 4 | Tickets, performance, customer success |

### Mode Switching

- Mode switcher located in sidebar header
- Switching mode changes available personas
- Conversation history preserved per-persona
- Quick Actions update based on active persona

---

## Persona Reference

### Government Mode Personas

#### 1. COR (Contracting Officer's Representative)
| Attribute | Value |
|-----------|-------|
| **Name** | Alexa Johnson |
| **Role** | Contracting Officer's Representative |
| **Badge** | COR |
| **URL** | `/demo/cor` |
| **Focus** | Contract oversight, vendor performance, compliance |

**Primary Widgets:**
- Contract Performance Dashboard
- Vendor Performance Metrics
- Compliance Dashboard
- Budget Tracking

**Quick Actions:**
- Contract Status (Active)
- Vendor Performance (92%)
- Compliance Dashboard (✓)
- Budget Tracking ($2.4M)
- Deliverables Review (8)

---

#### 2. Program Manager (Government)
| Attribute | Value |
|-----------|-------|
| **Name** | Jennifer Chen |
| **Role** | Program Manager |
| **Badge** | PM |
| **URL** | `/demo/program-manager` |
| **Focus** | Program execution, milestones, stakeholder management |

**Primary Widgets:**
- Sprint Burndown Chart
- Program Milestones
- Resource Allocation
- Risk Register

**Quick Actions:**
- Program Status (On Track)
- Milestones (Q4)
- Resource Allocation (View)
- Risk Register (3)
- Stakeholder Updates (5)

---

#### 3. Stakeholder Lead
| Attribute | Value |
|-----------|-------|
| **Name** | Jessica Martinez |
| **Role** | Stakeholder Lead |
| **Badge** | LEAD |
| **URL** | `/demo/stakeholder-lead` |
| **Focus** | Stakeholder engagement, communications, sentiment |

**Primary Widgets:**
- Stakeholder Engagement Dashboard
- Communication Tracking
- Sentiment Analysis
- Engagement Metrics

**Quick Actions:**
- Stakeholder Map (View)
- Communications (8/week)
- Engagement Score (85%)
- Pending Approvals (4)
- Meeting Schedule (6)

---

### Project Mode Personas

#### 4. Project Manager (Software)
| Attribute | Value |
|-----------|-------|
| **Name** | Dale Thompson |
| **Role** | Project Manager |
| **Badge** | PM |
| **URL** | `/demo/project-manager` |
| **Focus** | Sprint management, delivery, team coordination |

**Primary Widgets:**
- Sprint Burndown Chart
- Velocity Dashboard
- Blocker Resolution
- Release Planning

**Quick Actions:**
- Sprint Progress (75%)
- Team Velocity (View)
- Blockers (3)
- Release Planning (Q1)
- Retrospective (Scheduled)

---

#### 5. Service Team Lead
| Attribute | Value |
|-----------|-------|
| **Name** | Herbert Roberts |
| **Role** | Service Team Lead |
| **Badge** | LEAD |
| **URL** | `/demo/service-team-lead` |
| **Focus** | Team workload, code quality, deployment |

**Primary Widgets:**
- Team Workload Dashboard
- Code Quality Metrics
- Deployment Status
- Team Performance

**Quick Actions:**
- Team Workload (12 Tasks)
- Code Quality (94%)
- Code Reviews (8)
- Deployment Status (✓)
- Team Performance (View)

---

#### 6. Service Team Member
| Attribute | Value |
|-----------|-------|
| **Name** | Molly Rivera |
| **Role** | Service Team Member |
| **Badge** | DEVELOPER |
| **URL** | `/demo/service-team-member` |
| **Focus** | Personal tasks, performance, blockers |

**Primary Widgets:**
- My Dashboard
- My Sprint Tasks
- My Pull Requests
- My Blockers

**Quick Actions:**
- My Sprint Tasks (7)
- My Pull Requests (3)
- My Performance (Stats)
- Knowledge Base (Search)
- My Blockers (2)

---

### ATC Mode Personas

#### 7. Executive (C-Level)
| Attribute | Value |
|-----------|-------|
| **Name** | Jennifer Anderson |
| **Role** | Chief Executive Officer |
| **Badge** | C-LEVEL |
| **URL** | `/demo/atc-executive` |
| **Focus** | Strategic metrics, revenue, business health |

**Primary Widgets:**
- ATC Executive Summary
- Revenue Dashboard
- Strategic Insights
- Board Metrics

**Quick Actions:**
- Live Tickets Dashboard (New)
- SLA Performance (92%)
- Churn Risk (5)
- Executive Summary (Q4)
- Board Metrics (Ready)
- High-Value Accounts (18)
- Strategic Initiatives (8)

---

#### 8. CS Manager
| Attribute | Value |
|-----------|-------|
| **Name** | David Miller |
| **Role** | Customer Support Operations Manager |
| **Badge** | CS MANAGER |
| **URL** | `/demo/atc-manager` |
| **Focus** | Team performance, agent management, SLA |

**Primary Widgets:**
- Agent Performance Comparison
- Team Workload Dashboard
- SLA Breach Alerts
- Escalation Queue

**Quick Actions:**
- Live Tickets Dashboard (New)
- Priority Customers (12)
- Agent Performance (This Week)
- Most Slacking Agent (!)
- Top Performing Agent (⭐)
- Workload Balance (View)
- SLA Breach Alerts (3)
- Team Capacity (78%)
- Escalation Queue (7)
- Team Budget ($450K)

---

#### 9. Support Agent
| Attribute | Value |
|-----------|-------|
| **Name** | Christopher Hayes |
| **Role** | Senior Support Engineer |
| **Badge** | SUPPORT AGENT |
| **URL** | `/demo/atc-support` |
| **Focus** | Ticket resolution, daily work, escalations |

**Primary Widgets:**
- Live Zoho Desk Tickets
- My Open Tickets
- Escalated Tickets
- Knowledge Base Search

**Quick Actions:**
- Live Tickets Dashboard (New)
- My Open Tickets (18)
- AI-Resolved Today (23)
- Escalated to Me (5)
- Today's Meetings (3)
- Jira Sync Status (✓)
- High-Priority Alerts (7)

---

#### 10. CSM (Customer Success Manager)
| Attribute | Value |
|-----------|-------|
| **Name** | Jordan Taylor |
| **Role** | Customer Success Manager |
| **Badge** | CSM |
| **URL** | `/demo/atc-csm` |
| **Focus** | Customer health, renewals, upsells |

**Primary Widgets:**
- Client Health Dashboard
- Renewal Pipeline
- Upsell Opportunities
- Customer Feedback (NPS)

**Quick Actions:**
- Customer Health Scores (Live)
- Product Adoption (Metrics)
- Renewal Pipeline (12)
- Customer Feedback (NPS)
- Upsell Opportunities ($2.4M)
- Product Roadmap (Q1)
- Customer Meetings (8)

---

## Widget Catalog

### Full Widget List (19 Widgets)

| Widget | Primary Personas | Trigger Queries |
|--------|------------------|-----------------|
| **Executive Summary** | Executive, COR | "executive summary", "key metrics", "overview" |
| **ATC Executive Summary** | Executive | "atc summary", "business metrics" |
| **Agent Performance Stats** | Manager | "agent stats", "performance stats" |
| **Agent Performance Comparison** | Manager | "compare agents", "team performance", "agent comparison" |
| **Team Workload Dashboard** | Manager, Team Lead | "team workload", "workload distribution", "capacity" |
| **Ticket Detail** | Support Agent | "ticket #", "show ticket", "ticket details" |
| **Ticket List** | Support Agent | "my tickets", "open tickets", "ticket list" |
| **Live Zoho Desk Tickets** | Support Agent | "live tickets", "zoho tickets", "desk tickets" |
| **Similar Tickets Analysis** | Support Agent | "similar tickets", "related tickets" |
| **Customer Risk Profile** | CSM, Manager | "customer risk", "risk profile", "churn risk" |
| **Customer Risk List** | CSM, Manager | "at-risk customers", "risk list" |
| **Client Health Dashboard** | CSM | "customer health", "health scores", "client health" |
| **Knowledge Article** | Support Agent | "knowledge base", "kb article", "help article" |
| **Knowledge Base Search** | All | "search kb", "find article", "knowledge search" |
| **Response Composer** | Support Agent | "draft response", "compose reply", "write response" |
| **Message Composer** | Support Agent | "compose message", "write email" |
| **Call Prep Notes** | CSM, Support Agent | "call prep", "meeting prep", "customer call" |
| **SLA Performance Chart** | Manager, Executive | "sla performance", "sla metrics", "compliance" |
| **Sprint Burndown Chart** | PM, Team Lead | "sprint burndown", "sprint status", "burndown" |
| **Stakeholder Engagement Dashboard** | Stakeholder Lead | "stakeholder engagement", "communications", "stakeholder status" |
| **Contract Performance Dashboard** | COR | "contract status", "contract performance", "deliverables" |
| **Meeting Scheduler** | All | "schedule meeting", "book meeting" |
| **My Dashboard** | Individual Contributors | "my dashboard", "my work", "my tasks" |

---

## Query Detection Patterns

### How Query Detection Works

```
User Input → Tokenization → Pattern Matching → Persona Filter → Widget Selection
```

### Pattern Categories

#### Ticket-Related Patterns
```javascript
patterns: [
  /ticket\s*#?\d+/i,           // "ticket #123", "ticket 123"
  /show\s+ticket/i,            // "show ticket"
  /my\s+(open\s+)?tickets/i,   // "my tickets", "my open tickets"
  /ticket\s+list/i,            // "ticket list"
  /live\s+tickets/i,           // "live tickets"
]
```

#### Performance-Related Patterns
```javascript
patterns: [
  /team\s+performance/i,       // "team performance"
  /agent\s+performance/i,      // "agent performance"
  /compare\s+agents/i,         // "compare agents"
  /performance\s+comparison/i, // "performance comparison"
  /workload/i,                 // "workload"
]
```

#### Customer-Related Patterns
```javascript
patterns: [
  /customer\s+health/i,        // "customer health"
  /churn\s+risk/i,             // "churn risk"
  /at.risk\s+customers/i,      // "at-risk customers"
  /renewal/i,                  // "renewal"
  /upsell/i,                   // "upsell"
]
```

#### Sprint/Project Patterns
```javascript
patterns: [
  /sprint\s+(burndown|status)/i,  // "sprint burndown", "sprint status"
  /velocity/i,                     // "velocity"
  /blockers?/i,                    // "blocker", "blockers"
  /release\s+planning/i,           // "release planning"
]
```

#### Contract/Government Patterns
```javascript
patterns: [
  /contract\s+(status|performance)/i,  // "contract status"
  /deliverables?/i,                     // "deliverable", "deliverables"
  /compliance/i,                        // "compliance"
  /vendor\s+performance/i,              // "vendor performance"
]
```

### Sample Queries by Persona

| Persona | Sample Queries That Trigger Widgets |
|---------|-------------------------------------|
| **COR** | "Show contract status", "Deliverables review", "Vendor performance" |
| **Gov PM** | "Sprint burndown", "Program milestones", "Risk register" |
| **Stakeholder Lead** | "Stakeholder engagement", "Communication metrics" |
| **Project PM** | "Sprint status", "Team velocity", "Release planning" |
| **Service Team Lead** | "Team workload", "Code quality", "Deployment status" |
| **Service Team Member** | "My tasks", "My PRs", "My blockers" |
| **Executive** | "Executive summary", "Key metrics", "Revenue" |
| **CS Manager** | "Agent performance", "Team comparison", "SLA breaches" |
| **Support Agent** | "My tickets", "Show ticket #123", "Knowledge base" |
| **CSM** | "Customer health", "Renewal pipeline", "Churn risk" |

---

## Quick Actions Reference

### Quick Actions by Mode

#### Government Mode Quick Actions

| Persona | Quick Actions |
|---------|---------------|
| **COR** | Contract Status, Vendor Performance, Compliance Dashboard, Budget Tracking, Deliverables Review |
| **Program Manager** | Program Status, Milestones, Resource Allocation, Risk Register, Stakeholder Updates |
| **Stakeholder Lead** | Stakeholder Map, Communications, Engagement Score, Pending Approvals, Meeting Schedule |

#### Project Mode Quick Actions

| Persona | Quick Actions |
|---------|---------------|
| **Project Manager** | Sprint Progress, Team Velocity, Blockers, Release Planning, Retrospective |
| **Service Team Lead** | Team Workload, Code Quality, Code Reviews, Deployment Status, Team Performance |
| **Service Team Member** | My Sprint Tasks, My Pull Requests, My Performance, Knowledge Base, My Blockers |

#### ATC Mode Quick Actions

| Persona | Quick Actions |
|---------|---------------|
| **Executive** | Live Tickets Dashboard, SLA Performance, Churn Risk, Executive Summary, Board Metrics, High-Value Accounts, Strategic Initiatives |
| **CS Manager** | Live Tickets Dashboard, Priority Customers, Agent Performance, Most Slacking Agent, Top Performing Agent, Workload Balance, SLA Breach Alerts, Team Capacity, Escalation Queue, Team Budget |
| **Support Agent** | Live Tickets Dashboard, My Open Tickets, AI-Resolved Today, Escalated to Me, Today's Meetings, Jira Sync Status, High-Priority Alerts |
| **CSM** | Customer Health Scores, Product Adoption, Renewal Pipeline, Customer Feedback, Upsell Opportunities, Product Roadmap, Customer Meetings |

---

## Cross-Reference Matrix

### Widget Availability by Persona

| Widget | COR | Gov PM | Stakeholder | Proj PM | Team Lead | Team Member | Exec | Manager | Support | CSM |
|--------|-----|--------|-------------|---------|-----------|-------------|------|---------|---------|-----|
| Executive Summary | ✓ | - | - | - | - | - | ✓ | - | - | - |
| Contract Dashboard | ✓ | - | - | - | - | - | - | - | - | - |
| Sprint Burndown | - | ✓ | - | ✓ | ✓ | - | - | - | - | - |
| Stakeholder Engagement | - | - | ✓ | - | - | - | - | - | - | - |
| Team Workload | - | - | - | - | ✓ | - | - | ✓ | - | - |
| My Dashboard | - | - | - | - | - | ✓ | - | - | - | - |
| Agent Performance | - | - | - | - | - | - | - | ✓ | - | - |
| Live Tickets | - | - | - | - | - | - | - | - | ✓ | - |
| Client Health | - | - | - | - | - | - | - | - | - | ✓ |
| Knowledge Base | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## URL Reference

### Demo Page URLs

```
Base URL: http://localhost:3030

Government Mode:
├── /demo/cor                    → COR (Alexa Johnson)
├── /demo/program-manager        → Program Manager (Jennifer Chen)
└── /demo/stakeholder-lead       → Stakeholder Lead (Jessica Martinez)

Project Mode:
├── /demo/project-manager        → Project Manager (Dale Thompson)
├── /demo/service-team-lead      → Service Team Lead (Herbert Roberts)
└── /demo/service-team-member    → Service Team Member (Molly Rivera)

ATC Mode:
├── /demo/atc-executive          → Executive (Jennifer Anderson)
├── /demo/atc-manager            → Manager (David Miller)
├── /demo/atc-support            → Support Agent (Christopher Hayes)
└── /demo/atc-csm                → CSM (Jordan Taylor)
```

### API Endpoints

```
/api/health          → Health check
/api/chat            → Claude AI streaming endpoint
```

---

## Technical Implementation

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/query-detection.ts` | Query pattern matching and widget selection |
| `src/config/personas.ts` | Persona definitions and configurations |
| `src/components/widgets/WidgetRenderer.tsx` | Dynamic widget loading |
| `src/data/demo-widget-data.ts` | Mock data for widgets |
| `src/contexts/PersonaContext.tsx` | Persona state management |
| `src/contexts/ConversationContext.tsx` | Conversation persistence |

### Data Flow

```
1. User types query in chat input
2. Query sent to detection system (query-detection.ts)
3. Patterns matched against query text
4. Persona context filters available widgets
5. Best matching widget selected
6. Widget component rendered with demo data
7. Response streamed with typewriter effect
```

### LocalStorage Keys

```javascript
// Conversation history per persona
localStorage.setItem('eas-conversations', JSON.stringify({
  'cor': [...messages],
  'program-manager': [...messages],
  // ... other personas
}));

// Current persona
localStorage.setItem('eas-current-persona', 'atc-executive');

// Mode preference
localStorage.setItem('eas-current-mode', 'atc');
```

---

## Troubleshooting

### Common Issues

#### Widget Not Appearing

1. **Check query pattern**: Ensure query matches detection patterns
2. **Verify persona context**: Some widgets are persona-specific
3. **Clear localStorage**: Reset state if corrupted
4. **Check console logs**: Look for `[InteractiveChat]` messages

#### Wrong Widget Displayed

1. **More specific query**: Add keywords that match desired widget
2. **Check persona**: Ensure correct persona is active
3. **Review pattern priority**: Some patterns have higher priority

#### Persona Not Loading

1. **Check URL**: Ensure correct demo URL
2. **Wait for context**: Persona context may need time to sync
3. **Refresh page**: Hard refresh clears cached state

### Debug Commands

```javascript
// In browser console:

// Check current persona
console.log(localStorage.getItem('eas-current-persona'));

// View all conversations
console.log(JSON.parse(localStorage.getItem('eas-conversations')));

// Reset all data
localStorage.clear();
location.reload();
```

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-13 | V20-OP3 | Initial knowledge base creation |
| 2026-01-13 | V20-OP3 | Teal color migration (WCAG 2.1 AA) |
| 2026-01-13 | V20-OP3 | All 10 personas tested and verified |

---

**Document Author**: Claude Code
**Last Verified**: January 13, 2026
**Status**: ✅ All systems operational
