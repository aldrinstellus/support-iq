// Standardized Ticket Database for Support IQ
// TICK-001 through TICK-010 with full details
// Pattern: TICK-XXX where XXX is a 3-digit number

import type { TicketDetailData } from '@/types/widget';

// ============================================================================
// TICKET DATABASE - 10 Standardized Tickets
// ============================================================================

export const ticketDatabase: Record<string, TicketDetailData> = {
  // TICK-001: Authentication Failures (Critical)
  'TICK-001': {
    ticketId: 'TICK-001',
    priority: 'critical',
    status: 'in-progress',
    subject: 'Authentication failures affecting 200+ users',
    customer: {
      name: 'Acme Corporation',
      id: 'CUST-001',
      plan: 'Enterprise Plus',
      arr: '$450,000',
      contactName: 'John Smith',
      contactEmail: 'john.smith@acmecorp.com',
      contactPhone: '+1 (555) 123-4567',
      riskScore: 82,
      riskLevel: 'critical',
    },
    metadata: {
      created: '2025-09-24 09:15 AM',
      createdBy: 'John Smith (Customer)',
      assignedTo: 'Mike Johnson',
      assignedAt: '2025-09-24 09:22 AM',
      lastUpdated: '2 hours ago',
      tags: ['authentication', 'production-down', 'p0'],
      category: 'Security & Access',
      product: 'Platform Core',
    },
    sla: {
      responseTime: { target: '1 hour', actual: '7 minutes', status: 'met' },
      resolutionTime: { target: '4 hours', deadline: 'Today 1:15 PM', elapsed: '6d 14h', status: 'breached', breachedBy: '6d 10h' },
    },
    description: 'Our users are experiencing intermittent authentication failures when trying to log into the platform. This started approximately 6 days ago and is affecting approximately 200+ users across multiple departments. The issue appears to be random - some users can log in successfully while others receive "Invalid credentials" errors even with correct passwords.',
    timeline: [
      { timestamp: '2025-09-24 09:15 AM', type: 'created', actor: 'John Smith', action: 'Ticket created' },
      { timestamp: '2025-09-24 09:22 AM', type: 'assigned', actor: 'System', action: 'Assigned to Mike Johnson' },
      { timestamp: '2025-09-24 09:30 AM', type: 'response', actor: 'Mike Johnson', action: 'Acknowledged ticket', content: 'Thank you for reporting this issue. Escalated to authentication team.' },
    ],
    relatedTickets: [
      { id: 'TICK-003', subject: 'Dashboard loading extremely slow', customer: 'Global Dynamics', status: 'in-progress', priority: 'high' },
      { id: 'TICK-005', subject: 'Admin users getting "Access Denied"', customer: 'Nexus Financial', status: 'in-progress', priority: 'high' },
    ],
    attachments: [
      { name: 'error_logs.txt', size: '2.3 MB', type: 'text/plain', uploadedBy: 'John Smith', uploadedAt: '2025-09-24 09:16 AM' },
    ],
  },

  // TICK-002: Password Reset Issues (High)
  'TICK-002': {
    ticketId: 'TICK-002',
    priority: 'high',
    status: 'open',
    subject: 'Password reset emails not being delivered',
    customer: {
      name: 'TechStart Inc',
      id: 'CUST-002',
      plan: 'Professional',
      arr: '$125,000',
      contactName: 'Sarah Miller',
      contactEmail: 'sarah.miller@techstart.io',
      contactPhone: '+1 (555) 234-5678',
      riskScore: 45,
      riskLevel: 'medium',
    },
    metadata: {
      created: '2025-09-25 11:30 AM',
      createdBy: 'Sarah Miller (Customer)',
      assignedTo: 'Jennifer Lee',
      assignedAt: '2025-09-25 11:45 AM',
      lastUpdated: '4 hours ago',
      tags: ['password-reset', 'email', 'p1'],
      category: 'Account Management',
      product: 'Identity Services',
    },
    sla: {
      responseTime: { target: '2 hours', actual: '15 minutes', status: 'met' },
      resolutionTime: { target: '8 hours', deadline: 'Today 7:30 PM', elapsed: '5h 30m', status: 'at-risk' },
    },
    description: 'Multiple users in our organization are not receiving password reset emails. They click "Forgot Password", enter their email, but never receive the reset link. Checked spam folders - nothing there. This is blocking new employee onboarding.',
    timeline: [
      { timestamp: '2025-09-25 11:30 AM', type: 'created', actor: 'Sarah Miller', action: 'Ticket created' },
      { timestamp: '2025-09-25 11:45 AM', type: 'assigned', actor: 'System', action: 'Assigned to Jennifer Lee' },
    ],
    relatedTickets: [
      { id: 'TICK-007', subject: 'Email notifications delayed by 2-3 hours', customer: 'Velocity Marketing', status: 'open', priority: 'medium' },
    ],
    attachments: [],
  },

  // TICK-003: Performance/Slow Loading (High)
  'TICK-003': {
    ticketId: 'TICK-003',
    priority: 'high',
    status: 'in-progress',
    subject: 'Dashboard loading extremely slow - 30+ seconds',
    customer: {
      name: 'Global Dynamics',
      id: 'CUST-003',
      plan: 'Enterprise',
      arr: '$320,000',
      contactName: 'Robert Chen',
      contactEmail: 'robert.chen@globaldynamics.com',
      contactPhone: '+1 (555) 345-6789',
      riskScore: 58,
      riskLevel: 'medium',
    },
    metadata: {
      created: '2025-09-23 02:00 PM',
      createdBy: 'Robert Chen (Customer)',
      assignedTo: 'David Park',
      assignedAt: '2025-09-23 02:15 PM',
      lastUpdated: '1 hour ago',
      tags: ['performance', 'slow-loading', 'dashboard', 'p1'],
      category: 'Performance',
      product: 'Analytics Dashboard',
    },
    sla: {
      responseTime: { target: '2 hours', actual: '15 minutes', status: 'met' },
      resolutionTime: { target: '24 hours', deadline: 'Tomorrow 2:00 PM', elapsed: '22h', status: 'at-risk' },
    },
    description: 'The main analytics dashboard is taking 30+ seconds to load, sometimes timing out completely. This started after the recent update. Our team relies on this dashboard for daily operations and this is causing significant productivity loss.',
    timeline: [
      { timestamp: '2025-09-23 02:00 PM', type: 'created', actor: 'Robert Chen', action: 'Ticket created' },
      { timestamp: '2025-09-23 02:15 PM', type: 'assigned', actor: 'System', action: 'Assigned to David Park' },
      { timestamp: '2025-09-23 03:00 PM', type: 'internal-note', actor: 'David Park', action: 'Added internal note', content: 'Investigating database query performance. Found slow query in dashboard aggregation.' },
    ],
    relatedTickets: [
      { id: 'TICK-001', subject: 'Authentication failures affecting 200+ users', customer: 'Acme Corporation', status: 'in-progress', priority: 'critical' },
    ],
    attachments: [
      { name: 'performance_trace.har', size: '1.8 MB', type: 'application/har+json', uploadedBy: 'Robert Chen', uploadedAt: '2025-09-23 02:05 PM' },
    ],
  },

  // TICK-004: Data Sync Issues (Medium)
  'TICK-004': {
    ticketId: 'TICK-004',
    priority: 'medium',
    status: 'open',
    subject: 'CRM data not syncing to platform - 24 hour delay',
    customer: {
      name: 'Pinnacle Solutions',
      id: 'CUST-004',
      plan: 'Professional',
      arr: '$95,000',
      contactName: 'Maria Garcia',
      contactEmail: 'maria.garcia@pinnaclesolutions.com',
      contactPhone: '+1 (555) 456-7890',
      riskScore: 35,
      riskLevel: 'low',
    },
    metadata: {
      created: '2025-09-26 09:00 AM',
      createdBy: 'Maria Garcia (Customer)',
      assignedTo: 'Alex Thompson',
      assignedAt: '2025-09-26 09:30 AM',
      lastUpdated: '6 hours ago',
      tags: ['integration', 'sync', 'crm', 'salesforce', 'p2'],
      category: 'Integrations',
      product: 'Data Sync Engine',
    },
    sla: {
      responseTime: { target: '4 hours', actual: '30 minutes', status: 'met' },
      resolutionTime: { target: '48 hours', deadline: 'Sep 28 9:00 AM', elapsed: '12h', status: 'on-track' },
    },
    description: 'Our Salesforce data is not syncing properly to the platform. New contacts added in Salesforce are taking 24+ hours to appear in the system, when it used to be near real-time (within minutes). This is affecting our sales team\'s ability to see updated customer information.',
    timeline: [
      { timestamp: '2025-09-26 09:00 AM', type: 'created', actor: 'Maria Garcia', action: 'Ticket created' },
      { timestamp: '2025-09-26 09:30 AM', type: 'assigned', actor: 'System', action: 'Assigned to Alex Thompson' },
    ],
    relatedTickets: [],
    attachments: [],
  },

  // TICK-005: Permission/Access Denied (High)
  'TICK-005': {
    ticketId: 'TICK-005',
    priority: 'high',
    status: 'in-progress',
    subject: 'Admin users getting "Access Denied" on settings page',
    customer: {
      name: 'Nexus Financial',
      id: 'CUST-005',
      plan: 'Enterprise Plus',
      arr: '$380,000',
      contactName: 'James Wilson',
      contactEmail: 'james.wilson@nexusfinancial.com',
      contactPhone: '+1 (555) 567-8901',
      riskScore: 72,
      riskLevel: 'high',
    },
    metadata: {
      created: '2025-09-25 04:30 PM',
      createdBy: 'James Wilson (Customer)',
      assignedTo: 'Mike Johnson',
      assignedAt: '2025-09-25 04:45 PM',
      lastUpdated: '30 minutes ago',
      tags: ['permissions', 'access-denied', 'admin', 'p1'],
      category: 'Security & Access',
      product: 'Admin Console',
    },
    sla: {
      responseTime: { target: '1 hour', actual: '15 minutes', status: 'met' },
      resolutionTime: { target: '8 hours', deadline: 'Today 12:30 AM', elapsed: '7h 30m', status: 'at-risk' },
    },
    description: 'All admin users in our organization are receiving "Access Denied" errors when trying to access the Settings page. This happened after we upgraded to the latest version yesterday. We cannot manage user permissions or configure system settings.',
    timeline: [
      { timestamp: '2025-09-25 04:30 PM', type: 'created', actor: 'James Wilson', action: 'Ticket created' },
      { timestamp: '2025-09-25 04:45 PM', type: 'assigned', actor: 'System', action: 'Assigned to Mike Johnson' },
      { timestamp: '2025-09-25 05:00 PM', type: 'response', actor: 'Mike Johnson', action: 'Acknowledged ticket', content: 'Investigating permission configuration after recent update.' },
    ],
    relatedTickets: [
      { id: 'TICK-001', subject: 'Authentication failures affecting 200+ users', customer: 'Acme Corporation', status: 'in-progress', priority: 'critical' },
    ],
    attachments: [
      { name: 'access_denied_screenshot.png', size: '245 KB', type: 'image/png', uploadedBy: 'James Wilson', uploadedAt: '2025-09-25 04:32 PM' },
    ],
  },

  // TICK-006: API Integration Failures (Critical)
  'TICK-006': {
    ticketId: 'TICK-006',
    priority: 'critical',
    status: 'escalated',
    subject: 'REST API returning 500 errors on all endpoints',
    customer: {
      name: 'DataFlow Systems',
      id: 'CUST-006',
      plan: 'Enterprise',
      arr: '$275,000',
      contactName: 'Emily Chang',
      contactEmail: 'emily.chang@dataflowsystems.com',
      contactPhone: '+1 (555) 678-9012',
      riskScore: 88,
      riskLevel: 'critical',
    },
    metadata: {
      created: '2025-09-26 06:00 AM',
      createdBy: 'Emily Chang (Customer)',
      assignedTo: 'Senior Engineering Team',
      assignedAt: '2025-09-26 06:05 AM',
      lastUpdated: '15 minutes ago',
      tags: ['api', '500-error', 'integration', 'production-down', 'p0'],
      category: 'API & Integrations',
      product: 'REST API',
    },
    sla: {
      responseTime: { target: '30 minutes', actual: '5 minutes', status: 'met' },
      resolutionTime: { target: '2 hours', deadline: 'Today 8:00 AM', elapsed: '3h', status: 'breached', breachedBy: '1h' },
    },
    description: 'Our entire integration pipeline is down. All REST API calls are returning HTTP 500 Internal Server Error. This is affecting our production systems and we have customer-facing services that depend on this API. Need immediate attention.',
    timeline: [
      { timestamp: '2025-09-26 06:00 AM', type: 'created', actor: 'Emily Chang', action: 'Ticket created' },
      { timestamp: '2025-09-26 06:05 AM', type: 'escalated', actor: 'System', action: 'Auto-escalated to Senior Engineering Team' },
      { timestamp: '2025-09-26 06:10 AM', type: 'response', actor: 'Engineering Lead', action: 'Acknowledged', content: 'All hands on deck. Investigating API gateway.' },
    ],
    relatedTickets: [
      { id: 'TICK-003', subject: 'Dashboard loading extremely slow', customer: 'Global Dynamics', status: 'in-progress', priority: 'high' },
    ],
    attachments: [
      { name: 'api_error_logs.json', size: '4.2 MB', type: 'application/json', uploadedBy: 'Emily Chang', uploadedAt: '2025-09-26 06:02 AM' },
    ],
  },

  // TICK-007: Email Notification Issues (Medium)
  'TICK-007': {
    ticketId: 'TICK-007',
    priority: 'medium',
    status: 'open',
    subject: 'Email notifications delayed by 2-3 hours',
    customer: {
      name: 'Velocity Marketing',
      id: 'CUST-007',
      plan: 'Professional',
      arr: '$85,000',
      contactName: 'Lisa Anderson',
      contactEmail: 'lisa.anderson@velocitymarketing.com',
      contactPhone: '+1 (555) 789-0123',
      riskScore: 28,
      riskLevel: 'low',
    },
    metadata: {
      created: '2025-09-26 10:00 AM',
      createdBy: 'Lisa Anderson (Customer)',
      assignedTo: 'Jennifer Lee',
      assignedAt: '2025-09-26 10:30 AM',
      lastUpdated: '3 hours ago',
      tags: ['email', 'notifications', 'delay', 'p2'],
      category: 'Notifications',
      product: 'Email Service',
    },
    sla: {
      responseTime: { target: '4 hours', actual: '30 minutes', status: 'met' },
      resolutionTime: { target: '48 hours', deadline: 'Sep 28 10:00 AM', elapsed: '8h', status: 'on-track' },
    },
    description: 'Email notifications for ticket updates, comments, and assignments are being delayed by 2-3 hours. This is causing our team to miss important updates and respond late to customer inquiries.',
    timeline: [
      { timestamp: '2025-09-26 10:00 AM', type: 'created', actor: 'Lisa Anderson', action: 'Ticket created' },
      { timestamp: '2025-09-26 10:30 AM', type: 'assigned', actor: 'System', action: 'Assigned to Jennifer Lee' },
    ],
    relatedTickets: [
      { id: 'TICK-002', subject: 'Password reset emails not being delivered', customer: 'TechStart Inc', status: 'open', priority: 'high' },
    ],
    attachments: [],
  },

  // TICK-008: Report Generation Errors (Medium)
  'TICK-008': {
    ticketId: 'TICK-008',
    priority: 'medium',
    status: 'in-progress',
    subject: 'Weekly reports failing to generate - timeout errors',
    customer: {
      name: 'Summit Analytics',
      id: 'CUST-008',
      plan: 'Enterprise',
      arr: '$210,000',
      contactName: 'Michael Brown',
      contactEmail: 'michael.brown@summitanalytics.com',
      contactPhone: '+1 (555) 890-1234',
      riskScore: 42,
      riskLevel: 'medium',
    },
    metadata: {
      created: '2025-09-25 08:00 AM',
      createdBy: 'Michael Brown (Customer)',
      assignedTo: 'David Park',
      assignedAt: '2025-09-25 08:30 AM',
      lastUpdated: '5 hours ago',
      tags: ['reports', 'timeout', 'generation', 'p2'],
      category: 'Reporting',
      product: 'Report Engine',
    },
    sla: {
      responseTime: { target: '4 hours', actual: '30 minutes', status: 'met' },
      resolutionTime: { target: '48 hours', deadline: 'Sep 27 8:00 AM', elapsed: '28h', status: 'on-track' },
    },
    description: 'Our weekly automated reports are failing to generate. When we try to run them manually, we get timeout errors after about 5 minutes. These reports contain critical business metrics we need for our Monday leadership meetings.',
    timeline: [
      { timestamp: '2025-09-25 08:00 AM', type: 'created', actor: 'Michael Brown', action: 'Ticket created' },
      { timestamp: '2025-09-25 08:30 AM', type: 'assigned', actor: 'System', action: 'Assigned to David Park' },
      { timestamp: '2025-09-25 10:00 AM', type: 'internal-note', actor: 'David Park', action: 'Added internal note', content: 'Report query optimization in progress. Large dataset causing timeouts.' },
    ],
    relatedTickets: [
      { id: 'TICK-003', subject: 'Dashboard loading extremely slow', customer: 'Global Dynamics', status: 'in-progress', priority: 'high' },
    ],
    attachments: [
      { name: 'report_config.json', size: '12 KB', type: 'application/json', uploadedBy: 'Michael Brown', uploadedAt: '2025-09-25 08:05 AM' },
    ],
  },

  // TICK-009: Mobile App Crashes (High)
  'TICK-009': {
    ticketId: 'TICK-009',
    priority: 'high',
    status: 'open',
    subject: 'iOS app crashes on startup after latest update',
    customer: {
      name: 'Metro Services',
      id: 'CUST-009',
      plan: 'Professional',
      arr: '$145,000',
      contactName: 'Amanda Torres',
      contactEmail: 'amanda.torres@metroservices.com',
      contactPhone: '+1 (555) 901-2345',
      riskScore: 65,
      riskLevel: 'high',
    },
    metadata: {
      created: '2025-09-26 07:30 AM',
      createdBy: 'Amanda Torres (Customer)',
      assignedTo: 'Mobile Team',
      assignedAt: '2025-09-26 07:45 AM',
      lastUpdated: '2 hours ago',
      tags: ['mobile', 'ios', 'crash', 'app-store', 'p1'],
      category: 'Mobile App',
      product: 'iOS App',
    },
    sla: {
      responseTime: { target: '2 hours', actual: '15 minutes', status: 'met' },
      resolutionTime: { target: '24 hours', deadline: 'Tomorrow 7:30 AM', elapsed: '10h', status: 'on-track' },
    },
    description: 'After updating to version 3.2.1 from the App Store, our iOS app crashes immediately on startup. Tried uninstalling and reinstalling - same issue. This is affecting all 50+ field workers who rely on the mobile app for their daily tasks.',
    timeline: [
      { timestamp: '2025-09-26 07:30 AM', type: 'created', actor: 'Amanda Torres', action: 'Ticket created' },
      { timestamp: '2025-09-26 07:45 AM', type: 'assigned', actor: 'System', action: 'Assigned to Mobile Team' },
    ],
    relatedTickets: [],
    attachments: [
      { name: 'crash_report.ips', size: '156 KB', type: 'text/plain', uploadedBy: 'Amanda Torres', uploadedAt: '2025-09-26 07:35 AM' },
    ],
  },

  // TICK-010: Billing/Payment Issues (Medium)
  'TICK-010': {
    ticketId: 'TICK-010',
    priority: 'medium',
    status: 'open',
    subject: 'Invoice showing incorrect usage charges',
    customer: {
      name: 'Horizon Consulting',
      id: 'CUST-010',
      plan: 'Professional',
      arr: '$78,000',
      contactName: 'Kevin Martinez',
      contactEmail: 'kevin.martinez@horizonconsulting.com',
      contactPhone: '+1 (555) 012-3456',
      riskScore: 22,
      riskLevel: 'low',
    },
    metadata: {
      created: '2025-09-26 11:00 AM',
      createdBy: 'Kevin Martinez (Customer)',
      assignedTo: 'Billing Team',
      assignedAt: '2025-09-26 11:30 AM',
      lastUpdated: '1 hour ago',
      tags: ['billing', 'invoice', 'charges', 'p2'],
      category: 'Billing & Payments',
      product: 'Billing System',
    },
    sla: {
      responseTime: { target: '4 hours', actual: '30 minutes', status: 'met' },
      resolutionTime: { target: '72 hours', deadline: 'Sep 29 11:00 AM', elapsed: '5h', status: 'on-track' },
    },
    description: 'Our September invoice shows API usage charges of $2,450 but according to our tracking, we only used about $800 worth of API calls. There seems to be a discrepancy in the metering. Please review and correct the invoice before the payment due date.',
    timeline: [
      { timestamp: '2025-09-26 11:00 AM', type: 'created', actor: 'Kevin Martinez', action: 'Ticket created' },
      { timestamp: '2025-09-26 11:30 AM', type: 'assigned', actor: 'System', action: 'Assigned to Billing Team' },
    ],
    relatedTickets: [],
    attachments: [
      { name: 'september_invoice.pdf', size: '89 KB', type: 'application/pdf', uploadedBy: 'Kevin Martinez', uploadedAt: '2025-09-26 11:02 AM' },
      { name: 'our_usage_tracking.xlsx', size: '45 KB', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadedBy: 'Kevin Martinez', uploadedAt: '2025-09-26 11:03 AM' },
    ],
  },
};

// ============================================================================
// TICKET LOOKUP FUNCTIONS
// ============================================================================

/**
 * Normalize ticket ID to standard format TICK-XXX
 * Handles: "001", "TICK-001", "ticket 001", "TICK001", etc.
 */
export function normalizeTicketId(input: string): string | null {
  // Remove common prefixes and clean up
  const cleaned = input.toUpperCase().trim();

  // Pattern 1: Already in TICK-XXX format
  const tickPattern = cleaned.match(/TICK-?(\d{1,3})/);
  if (tickPattern) {
    const num = tickPattern[1].padStart(3, '0');
    return `TICK-${num}`;
  }

  // Pattern 2: Just numbers (001, 1, 01)
  const numPattern = cleaned.match(/^(\d{1,3})$/);
  if (numPattern) {
    const num = numPattern[1].padStart(3, '0');
    return `TICK-${num}`;
  }

  // Pattern 3: DESK-XXXX format (map to our tickets)
  const deskPattern = cleaned.match(/DESK-?(\d{1,4})/);
  if (deskPattern) {
    // Map DESK-1001 to TICK-001, DESK-1002 to TICK-002, etc.
    const deskNum = parseInt(deskPattern[1], 10);
    if (deskNum >= 1001 && deskNum <= 1010) {
      const tickNum = (deskNum - 1000).toString().padStart(3, '0');
      return `TICK-${tickNum}`;
    }
  }

  return null;
}

/**
 * Get ticket by ID (handles various input formats)
 */
export function getTicketById(input: string): TicketDetailData | null {
  const ticketId = normalizeTicketId(input);
  if (!ticketId) return null;
  return ticketDatabase[ticketId] || null;
}

/**
 * Extract ticket ID from a query string
 * Handles: "show me ticket 001", "open TICK-001", "ticket details for 003", etc.
 */
export function extractTicketIdFromQuery(query: string): string | null {
  const q = query.toLowerCase();

  // Pattern 1: TICK-XXX or TICK XXX
  const tickMatch = q.match(/tick[- ]?(\d{1,3})/i);
  if (tickMatch) {
    return normalizeTicketId(tickMatch[1]);
  }

  // Pattern 2: DESK-XXXX
  const deskMatch = q.match(/desk[- ]?(\d{1,4})/i);
  if (deskMatch) {
    return normalizeTicketId(`DESK-${deskMatch[1]}`);
  }

  // Pattern 3: "ticket XXX" or "ticket #XXX"
  const ticketNumMatch = q.match(/ticket\s*#?\s*(\d{1,3})/i);
  if (ticketNumMatch) {
    return normalizeTicketId(ticketNumMatch[1]);
  }

  // Pattern 4: Just a 3-digit number at the end (e.g., "show me 001")
  const endNumMatch = q.match(/\b(\d{3})\b/);
  if (endNumMatch) {
    return normalizeTicketId(endNumMatch[1]);
  }

  return null;
}

/**
 * Get all tickets as an array
 */
export function getAllTickets(): TicketDetailData[] {
  return Object.values(ticketDatabase);
}

/**
 * Get ticket summary for ticket list widget
 */
export function getTicketSummaries() {
  return Object.values(ticketDatabase).map(ticket => ({
    id: ticket.ticketId,
    subject: ticket.subject,
    priority: ticket.priority,
    status: ticket.status,
    customer: ticket.customer.name,
    assignedTo: ticket.metadata.assignedTo,
    lastUpdated: ticket.metadata.lastUpdated,
    slaStatus: ticket.sla.resolutionTime.status,
  }));
}

// ============================================================================
// TICKET ID CONSTANTS
// ============================================================================

export const VALID_TICKET_IDS = [
  'TICK-001', 'TICK-002', 'TICK-003', 'TICK-004', 'TICK-005',
  'TICK-006', 'TICK-007', 'TICK-008', 'TICK-009', 'TICK-010',
] as const;

export type ValidTicketId = typeof VALID_TICKET_IDS[number];

// Summary of all tickets for reference
export const TICKET_SUMMARY = {
  'TICK-001': 'Authentication failures affecting 200+ users',
  'TICK-002': 'Password reset emails not being delivered',
  'TICK-003': 'Dashboard loading extremely slow - 30+ seconds',
  'TICK-004': 'CRM data not syncing to platform - 24 hour delay',
  'TICK-005': 'Admin users getting "Access Denied" on settings page',
  'TICK-006': 'REST API returning 500 errors on all endpoints',
  'TICK-007': 'Email notifications delayed by 2-3 hours',
  'TICK-008': 'Weekly reports failing to generate - timeout errors',
  'TICK-009': 'iOS app crashes on startup after latest update',
  'TICK-010': 'Invoice showing incorrect usage charges',
} as const;
