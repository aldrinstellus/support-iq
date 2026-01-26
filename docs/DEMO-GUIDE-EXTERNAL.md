# Enterprise AI Support - Demo Guide

**Version**: v1.2.1
**Last Updated**: January 22, 2026
**Live Demo**: https://dsq.digitalworkplace.ai

---

## Quick Overview

This AI-powered support platform adapts to **3 operational modes** with **10 specialized personas**. Each persona receives tailored responses and interactive widgets based on their role.

---

## How to Use

1. Open a demo URL (listed below)
2. Type a question in the chat input
3. Receive an AI response with interactive widgets
4. Try different questions to see role-specific responses

---

## Mode 1: Government Contract Management

For government contractors managing federal contracts and compliance.

### Personas & Demo URLs

| Persona | Name | Role | Demo URL |
|---------|------|------|----------|
| COR | Alexa Johnson | Contract Officer Representative | `/demo/cor` |
| Program Manager | Jennifer Chen | Government Program Manager | `/demo/program-manager` |
| Stakeholder Lead | Jessica Martinez | Stakeholder Engagement Lead | `/demo/stakeholder-lead` |

### Sample Questions & Responses

#### COR (Alexa Johnson)

| Question | Response Widget |
|----------|-----------------|
| "Show me the contract status" | Contract Performance Dashboard |
| "Who are my top performers?" | Contractor Personnel Performance |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

#### Program Manager (Jennifer Chen)

| Question | Response Widget |
|----------|-----------------|
| "Show me the sprint burndown" | Sprint Burndown Chart |
| "Who are my top performers?" | Program Team Performance Comparison |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

#### Stakeholder Lead (Jessica Martinez)

| Question | Response Widget |
|----------|-----------------|
| "Show stakeholder engagement" | Stakeholder Engagement Dashboard |
| "Who are my top performers?" | Stakeholder Contributor Performance |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

---

## Mode 2: Project Management

For internal project teams managing sprints, deployments, and team workload.

### Personas & Demo URLs

| Persona | Name | Role | Demo URL |
|---------|------|------|----------|
| Project Manager | Dale Thompson | Project Manager | `/demo/project-manager` |
| Service Team Lead | Herbert Roberts | Technical Team Lead | `/demo/service-team-lead` |
| Service Team Member | Molly Rivera | Team Member | `/demo/service-team-member` |

### Sample Questions & Responses

#### Project Manager (Dale Thompson)

| Question | Response Widget |
|----------|-----------------|
| "Show sprint burndown" | Sprint 24 Burndown Chart |
| "Who are my top performers?" | Sprint Team Performance Comparison |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

#### Service Team Lead (Herbert Roberts)

| Question | Response Widget |
|----------|-----------------|
| "Show me team status" | Team Workload Dashboard |
| "Show code quality metrics" | Code Quality Dashboard |
| "Who are my top performers?" | Team Member Performance Comparison |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

#### Service Team Member (Molly Rivera)

| Question | Response Widget |
|----------|-----------------|
| "Show my dashboard" | Personal Performance Dashboard |
| "Who are my top performers?" | Personal Performance Stats (vs Team Benchmarks) |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

---

## Mode 3: ATC Customer Support

For ATC customer support operations - executives, managers, agents, and customer success.

### Personas & Demo URLs

| Persona | Name | Role | Demo URL |
|---------|------|------|----------|
| Executive | Jennifer Anderson | C-Level Executive | `/demo/atc-executive` |
| Manager | David Miller | CS Manager | `/demo/atc-manager` |
| Support Agent | Christopher Hayes | Support Agent | `/demo/atc-support` |
| CSM | Jordan Taylor | Customer Success Manager | `/demo/atc-csm` |

### Sample Questions & Responses

#### Executive (Jennifer Anderson)

| Question | Response Widget |
|----------|-----------------|
| "Show executive summary" | ATC Executive Summary |
| "Who are my top performers?" | Support Operations Performance |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

#### Manager (David Miller)

| Question | Response Widget |
|----------|-----------------|
| "Compare agent performance" | Agent Performance Comparison |
| "Show team workload" | Team Workload Dashboard |
| "Who are my top performers?" | Direct Reports Performance |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

#### Support Agent (Christopher Hayes)

| Question | Response Widget |
|----------|-----------------|
| "Show my open tickets" | Live Zoho Desk Tickets |
| "Show ticket TICK-001" | Ticket Detail |
| "Who are my top performers?" | Top Agent Benchmarks |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

#### CSM (Jordan Taylor)

| Question | Response Widget |
|----------|-----------------|
| "Show customer health" | Client Health Dashboard |
| "Show at-risk customers" | Customer Risk List |
| "Who are my top performers?" | Top-Performing Customer Accounts |
| "Draft response about the outage" | Response Composer |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) |
| "Show me the latest end user request" | Live Zoho Desk Tickets |

---

## Universal Questions (Work for All Personas)

These 4 questions work across all 10 personas and return **role-appropriate** responses:

| Question | Widget Returned | Description |
|----------|-----------------|-------------|
| "Who are my top performers?" | **Role-Appropriate Performance** | Returns performance data relevant to persona's role (e.g., contractors for COR, customers for CSM, team members for leads) |
| "Draft response about the outage" | Response Composer | AI-generated response template |
| "Open the most urgent access issue" | Ticket Detail (TICK-001) | Critical ticket with full details |
| "Show me the latest end user request" | Live Zoho Desk Tickets | Real-time ticket list from Zoho |

---

## Widget Types Available

| Widget | Description | Best For |
|--------|-------------|----------|
| **Executive Summary** | High-level KPIs and metrics | Executives |
| **Agent Performance Comparison** | Top/bottom performer analysis | Managers, Leads |
| **Team Workload Dashboard** | Task distribution across team | Team Leads |
| **Sprint Burndown Chart** | Sprint progress visualization | Project Managers |
| **Contract Performance Dashboard** | Contract compliance metrics | Government roles |
| **Stakeholder Engagement Dashboard** | Stakeholder tracking | Stakeholder Leads |
| **Personal Performance Dashboard** | Individual metrics | Team Members |
| **Client Health Dashboard** | Customer health scores | CSMs |
| **Customer Risk List** | At-risk customer alerts | CSMs, Managers |
| **Ticket Detail** | Full ticket information | Support Agents |
| **Live Zoho Desk Tickets** | Real-time ticket list | Support Agents |
| **Response Composer** | AI-generated responses | All roles |
| **Code Quality Dashboard** | Code metrics | Technical Leads |
| **SLA Performance Chart** | SLA compliance tracking | Managers |
| **Knowledge Base Search** | Article search | Support Agents |

---

## Quick Demo Script

### 5-Minute Demo Flow

1. **Start**: Open `/demo/atc-support` (Support Agent view)
2. **Ask**: "Show my open tickets" → See live ticket list
3. **Ask**: "Open the most urgent access issue" → See detailed ticket view
4. **Switch**: Navigate to `/demo/atc-manager` (Manager view)
5. **Ask**: "Who are my top performers?" → See performance comparison
6. **Ask**: "Draft response about the outage" → See AI response composer
7. **Switch**: Navigate to `/demo/atc-executive` (Executive view)
8. **Ask**: "Show executive summary" → See executive dashboard

### Key Points to Highlight

- Same question, different widgets based on role
- AI understands context and user needs
- Real-time data integration (Zoho Desk)
- Actionable insights, not just data

---

## Feature Highlights

### Role-Based Intelligence
- Each persona sees information relevant to their role
- No information overload - just what matters

### Interactive Widgets
- Not just text responses - rich, interactive dashboards
- Click-through to details
- Real-time data

### AI-Powered Responses
- Natural language queries
- Context-aware answers
- Draft response generation

### Quick Actions
- Sidebar shows role-specific shortcuts
- One-click access to common tasks

---

## Technical Notes (For IT Teams)

- **Platform**: Next.js 16 with React 19
- **AI Engine**: Claude (Anthropic)
- **Integrations**: Zoho Desk, Jira (mock data in demo)
- **Deployment**: Vercel
- **Authentication**: NextAuth.js (optional)

---

## Contact

For questions about this demo or to schedule a detailed walkthrough:

**Demo URL**: https://dsq.digitalworkplace.ai

---

*This document covers Support IQ v1.2.1 with all 10 personas across 3 modes, verified January 22, 2026.*
*Full relevance audit: 54/54 questions (100%) with role-appropriate responses.*
