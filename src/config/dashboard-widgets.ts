import { WidgetType } from '@/types/widget';
import { PersonaType } from '@/types/persona';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  query: string;
  icon?: string;
  link?: string;
}

export const dashboardWidgets: Record<PersonaType, DashboardWidget[]> = {
  'cor': [
    {
      id: 'live-tickets',
      type: 'ticket-list',
      title: 'Live Tickets Dashboard',
      description: 'View real-time Zoho Desk tickets',
      query: 'Show me all my current tickets from Zoho Desk',
    },
    {
      id: 'executive-summary',
      type: 'executive-summary',
      title: 'Executive Summary',
      description: 'High-level overview of all key metrics',
      query: 'Generate comprehensive executive dashboard summary',
    },
    {
      id: 'sla-performance',
      type: 'sla-performance-chart',
      title: 'SLA Performance',
      description: 'Service level agreement compliance trends',
      query: 'Show me SLA performance dashboard for this quarter',
    },
    {
      id: 'customer-risk',
      type: 'customer-risk-list',
      title: 'Customer Risk Analysis',
      description: 'Accounts at risk of churning',
      query: 'Which customers are at highest risk of churning?',
    },
    {
      id: 'analytics-dashboard',
      type: 'analytics-dashboard',
      title: 'Analytics Overview',
      description: 'Detailed analytics and insights',
      query: 'Show me detailed analytics dashboard',
    },
    {
      id: 'agent-performance',
      type: 'agent-performance-stats',
      title: 'Agent Performance',
      description: 'Team productivity and efficiency metrics',
      query: 'Show me agent performance metrics overview',
    },
    {
      id: 'team-workload',
      type: 'team-workload-dashboard',
      title: 'Team Workload',
      description: 'Current team capacity and distribution',
      query: 'Show me team workload distribution',
    },
  ],

  'program-manager': [
    {
      id: 'live-tickets',
      type: 'ticket-list',
      title: 'Live Tickets Dashboard',
      description: 'View real-time Zoho Desk tickets',
      query: 'Show me all my current tickets from Zoho Desk',
    },
    {
      id: 'team-workload',
      type: 'team-workload-dashboard',
      title: 'Team Workload',
      description: 'Agent assignments and capacity',
      query: 'Show me team workload distribution and recommend reassignments',
    },
    {
      id: 'agent-comparison',
      type: 'agent-performance-comparison',
      title: 'Agent Performance',
      description: 'Compare team member metrics',
      query: 'Show me agent performance metrics for this week',
    },
    {
      id: 'sla-alerts',
      type: 'sla-performance-chart',
      title: 'SLA Status',
      description: 'Service level compliance and alerts',
      query: 'Show me tickets at risk of SLA breach',
    },
    {
      id: 'priority-customers',
      type: 'customer-risk-list',
      title: 'Priority Customers',
      description: 'High-value accounts needing attention',
      query: 'Show me all high-priority customers needing attention',
    },
    {
      id: 'escalations',
      type: 'escalation-path',
      title: 'Escalation Queue',
      description: 'Tickets requiring manager intervention',
      query: 'Show me all escalated tickets requiring manager attention',
    },
    {
      id: 'agent-dashboard',
      type: 'agent-dashboard',
      title: 'Agent Overview',
      description: 'Individual agent status and metrics',
      query: 'Show me comprehensive agent dashboard',
    },
  ],

  'service-team-member': [
    {
      id: 'live-tickets',
      type: 'ticket-list',
      title: 'Live Tickets Dashboard',
      description: 'View real-time Zoho Desk tickets',
      query: 'Show me all my current tickets from Zoho Desk',
    },
    {
      id: 'my-dashboard',
      type: 'agent-dashboard',
      title: 'My Dashboard',
      description: 'Your personal ticket queue and stats',
      query: 'Show me all my currently open support tickets',
    },
    {
      id: 'my-tickets',
      type: 'ticket-list',
      title: 'My Open Tickets',
      description: 'Currently assigned support tickets',
      query: 'Show me my ticket queue prioritized by urgency',
    },
    {
      id: 'todays-meetings',
      type: 'meeting-scheduler',
      title: "Today's Meetings",
      description: 'Scheduled customer calls and meetings',
      query: 'Show me my scheduled customer meetings for today',
    },
    {
      id: 'knowledge-search',
      type: 'knowledge-base-search',
      title: 'Knowledge Base',
      description: 'Quick access to documentation',
      query: 'Search knowledge base for common issues',
    },
    {
      id: 'response-templates',
      type: 'response-composer',
      title: 'Response Templates',
      description: 'Pre-written responses and drafts',
      query: 'Show me response templates for common scenarios',
    },
    {
      id: 'call-prep',
      type: 'call-prep-notes',
      title: 'Call Preparation',
      description: 'Notes for upcoming customer calls',
      query: 'Prep notes for my next customer call',
    },
  ],

  'stakeholder-lead': [
    {
      id: 'executive-summary',
      type: 'executive-summary',
      title: 'Executive Summary',
      description: 'High-level overview of department metrics',
      query: 'Generate comprehensive executive dashboard summary',
    },
    {
      id: 'analytics-dashboard',
      type: 'analytics-dashboard',
      title: 'Analytics Overview',
      description: 'Detailed analytics and insights',
      query: 'Show me detailed analytics dashboard',
    },
    {
      id: 'customer-risk',
      type: 'customer-risk-list',
      title: 'Stakeholder Risk Analysis',
      description: 'Departments and stakeholders needing attention',
      query: 'Which stakeholders are at highest risk?',
    },
    {
      id: 'sla-performance',
      type: 'sla-performance-chart',
      title: 'SLA Performance',
      description: 'Service level agreement compliance trends',
      query: 'Show me SLA performance dashboard for this quarter',
    },
    {
      id: 'team-workload',
      type: 'team-workload-dashboard',
      title: 'Team Workload',
      description: 'Current team capacity and distribution',
      query: 'Show me team workload distribution',
    },
  ],

  'project-manager': [
    {
      id: 'live-tickets',
      type: 'ticket-list',
      title: 'Live Tickets Dashboard',
      description: 'View real-time project tickets',
      query: 'Show me all current project tickets',
    },
    {
      id: 'team-workload',
      type: 'team-workload-dashboard',
      title: 'Team Workload',
      description: 'Project team assignments and capacity',
      query: 'Show me team workload distribution and recommend reassignments',
    },
    {
      id: 'agent-comparison',
      type: 'agent-performance-comparison',
      title: 'Team Performance',
      description: 'Compare team member metrics',
      query: 'Show me team performance metrics for this sprint',
    },
    {
      id: 'sla-alerts',
      type: 'sla-performance-chart',
      title: 'Milestone Status',
      description: 'Project milestones and deadlines',
      query: 'Show me tickets at risk of missing deadline',
    },
    {
      id: 'escalations',
      type: 'escalation-path',
      title: 'Escalation Queue',
      description: 'Issues requiring project manager intervention',
      query: 'Show me all escalated issues requiring attention',
    },
    {
      id: 'analytics-dashboard',
      type: 'analytics-dashboard',
      title: 'Project Analytics',
      description: 'Project progress and metrics',
      query: 'Show me project analytics dashboard',
    },
  ],

  'service-team-lead': [
    {
      id: 'live-tickets',
      type: 'ticket-list',
      title: 'Live Tickets Dashboard',
      description: 'View real-time service team tickets',
      query: 'Show me all my team tickets from Zoho Desk',
    },
    {
      id: 'team-workload',
      type: 'team-workload-dashboard',
      title: 'Team Workload',
      description: 'Service team assignments and capacity',
      query: 'Show me service team workload distribution',
    },
    {
      id: 'agent-comparison',
      type: 'agent-performance-comparison',
      title: 'Team Performance',
      description: 'Compare service team member metrics',
      query: 'Show me team performance metrics for this week',
    },
    {
      id: 'sla-alerts',
      type: 'sla-performance-chart',
      title: 'SLA Status',
      description: 'Service level compliance and alerts',
      query: 'Show me tickets at risk of SLA breach',
    },
    {
      id: 'priority-customers',
      type: 'customer-risk-list',
      title: 'Priority Customers',
      description: 'High-priority customers needing attention',
      query: 'Show me all high-priority customers needing attention',
    },
    {
      id: 'escalations',
      type: 'escalation-path',
      title: 'Escalation Queue',
      description: 'Tickets requiring team lead intervention',
      query: 'Show me all escalated tickets requiring my attention',
    },
    {
      id: 'agent-dashboard',
      type: 'agent-dashboard',
      title: 'Team Overview',
      description: 'Service team status and metrics',
      query: 'Show me comprehensive team dashboard',
    },
  ],

  // ATC Mode Personas
  'atc-executive': [
    {
      id: 'live-tickets',
      type: 'ticket-list',
      title: 'Live Tickets Dashboard',
      description: 'View real-time Zoho Desk tickets',
      query: 'Show me all my current tickets from Zoho Desk',
    },
    {
      id: 'sla-performance',
      type: 'sla-performance-chart',
      title: 'SLA Performance',
      description: 'Service level agreement compliance trends',
      query: 'Show me SLA performance dashboard for this quarter',
    },
    {
      id: 'churn-risk',
      type: 'customer-risk-list',
      title: 'Churn Risk Analysis',
      description: 'Customers at highest risk of churning',
      query: 'Which customers are at highest risk of churning?',
    },
    {
      id: 'exec-summary',
      type: 'executive-summary',
      title: 'Executive Summary',
      description: 'Comprehensive executive dashboard',
      query: 'Generate comprehensive executive dashboard summary',
    },
    {
      id: 'board-metrics',
      type: 'analytics-dashboard',
      title: 'Board Metrics',
      description: 'Metrics for board presentation',
      query: 'Prepare metrics for board meeting presentation',
    },
    {
      id: 'high-value',
      type: 'customer-risk-profile',
      title: 'High-Value Accounts',
      description: 'Status of top customer accounts',
      query: 'Show me status of top 20 high-value customer accounts',
    },
  ],
  'atc-manager': [
    {
      id: 'live-tickets',
      type: 'ticket-list',
      title: 'Live Tickets Dashboard',
      description: 'View real-time Zoho Desk tickets',
      query: 'Show me all my current tickets from Zoho Desk',
    },
    {
      id: 'priority-customers',
      type: 'customer-risk-list',
      title: 'Priority Customers',
      description: 'High-priority customers needing attention',
      query: 'Show me all high-priority customers needing attention',
    },
    {
      id: 'agent-performance',
      type: 'agent-performance-comparison',
      title: 'Agent Performance',
      description: 'Agent performance metrics for this week',
      query: 'Show me agent performance metrics for this week',
    },
    {
      id: 'top-performer',
      type: 'agent-performance-stats',
      title: 'Top Performing Agent',
      description: 'Identify top performing team member',
      query: 'Who is my top performing agent this week?',
    },
    {
      id: 'workload-balance',
      type: 'team-workload-dashboard',
      title: 'Workload Balance',
      description: 'Agent workload distribution',
      query: 'Show me agent workload distribution and recommend reassignments',
    },
    {
      id: 'sla-breach',
      type: 'sla-performance-chart',
      title: 'SLA Breach Alerts',
      description: 'Tickets at risk of SLA breach',
      query: 'Show me tickets at risk of SLA breach',
    },
    {
      id: 'escalations',
      type: 'escalation-path',
      title: 'Escalation Queue',
      description: 'Escalated tickets requiring attention',
      query: 'Show me all escalated tickets requiring manager attention',
    },
  ],
  'atc-support': [
    {
      id: 'live-tickets',
      type: 'ticket-list',
      title: 'Live Tickets Dashboard',
      description: 'View real-time Zoho Desk tickets',
      query: 'Show me all my current tickets from Zoho Desk',
    },
    {
      id: 'my-tickets',
      type: 'agent-dashboard',
      title: 'My Open Tickets',
      description: 'Your assigned support tickets',
      query: 'Show me all my currently open support tickets',
    },
    {
      id: 'ai-resolved',
      type: 'agent-performance-stats',
      title: 'AI-Resolved Today',
      description: 'Tickets resolved by AI assistance',
      query: 'How many tickets did AI resolve for me today?',
    },
    {
      id: 'escalated-to-me',
      type: 'ticket-list',
      title: 'Escalated to Me',
      description: 'Tickets escalated to you',
      query: 'Show me tickets escalated to me that need my attention',
    },
    {
      id: 'todays-meetings',
      type: 'meeting-scheduler',
      title: "Today's Meetings",
      description: 'Scheduled customer meetings',
      query: 'Show me my scheduled customer meetings for today',
    },
    {
      id: 'urgent-alerts',
      type: 'ticket-detail',
      title: 'High-Priority Alerts',
      description: 'Urgent tickets and critical alerts',
      query: 'Show me my urgent tickets and critical alerts',
    },
  ],
  'atc-csm': [
    {
      id: 'customer-health',
      type: 'customer-risk-list',
      title: 'Customer Health Scores',
      description: 'Health scores for assigned customers',
      query: 'Show me health scores for my assigned customers',
    },
    {
      id: 'product-adoption',
      type: 'analytics-dashboard',
      title: 'Product Adoption',
      description: 'Product adoption metrics and feature usage',
      query: 'Show product adoption metrics and feature usage across customers',
    },
    {
      id: 'renewal-pipeline',
      type: 'customer-risk-profile',
      title: 'Renewal Pipeline',
      description: 'Upcoming renewals and contract status',
      query: 'Show upcoming renewals and contract status',
    },
    {
      id: 'customer-feedback',
      type: 'executive-summary',
      title: 'Customer Feedback',
      description: 'Recent customer feedback and NPS scores',
      query: 'Show recent customer feedback and NPS scores',
    },
    {
      id: 'upsell-opportunities',
      type: 'customer-risk-list',
      title: 'Upsell Opportunities',
      description: 'Identify expansion opportunities',
      query: 'Identify upsell and cross-sell opportunities',
    },
    {
      id: 'customer-meetings',
      type: 'meeting-scheduler',
      title: 'Customer Meetings',
      description: 'Business reviews and customer meetings',
      query: 'Schedule and manage customer business reviews',
    },
  ],
};

export function getDashboardWidgets(persona: PersonaType): DashboardWidget[] {
  return dashboardWidgets[persona] || [];
}
