'use client';

import { useState } from 'react';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
  Users,
  Activity,
  MessageSquare,
  Clock,
  Target,
  BarChart3,
  Phone,
  Mail,
  FileText,
  Star,
  Zap,
} from 'lucide-react';
import type { RenewalPipelineData } from '@/types/widget';

type DrillDownType = 'next-30' | 'next-90' | 'at-risk' | 'high-value' | null;

export function RenewalPipelineWidget({ data }: { data: RenewalPipelineData }) {
  const [activeDrillDown, setActiveDrillDown] = useState<DrillDownType>(null);
  const [expandedRenewal, setExpandedRenewal] = useState<string | null>(null);

  const toggleDrillDown = (type: DrillDownType) => {
    setActiveDrillDown(activeDrillDown === type ? null : type);
  };

  const toggleRenewalExpand = (customerId: string) => {
    setExpandedRenewal(expandedRenewal === customerId ? null : customerId);
  };

  // Mock detailed data for drill-downs
  const renewalDetails: Record<string, {
    healthScore: number;
    healthFactors: { factor: string; score: number; trend: 'up' | 'down' | 'stable' }[];
    stakeholders: { name: string; role: string; sentiment: 'positive' | 'neutral' | 'negative'; lastContact: string }[];
    engagementHistory: { date: string; type: string; summary: string }[];
    productUsage: { feature: string; adoption: number; trend: 'up' | 'down' | 'stable' }[];
    supportHistory: { ticketCount: number; avgResolution: string; openTickets: number; satisfaction: number };
    previousRenewals: { year: string; outcome: string; change: string }[];
    competitorMentions: string[];
    keyRisks: string[];
    opportunities: string[];
  }> = {
    'CUST-004': {
      healthScore: 42,
      healthFactors: [
        { factor: 'Product Adoption', score: 35, trend: 'down' },
        { factor: 'Engagement', score: 40, trend: 'down' },
        { factor: 'Support Satisfaction', score: 55, trend: 'stable' },
        { factor: 'Executive Relationship', score: 38, trend: 'down' },
      ],
      stakeholders: [
        { name: 'Michael Chen', role: 'CTO', sentiment: 'negative', lastContact: '3 weeks ago' },
        { name: 'Sarah Williams', role: 'VP Engineering', sentiment: 'neutral', lastContact: '1 week ago' },
        { name: 'David Kim', role: 'IT Director', sentiment: 'negative', lastContact: '2 days ago' },
      ],
      engagementHistory: [
        { date: '2024-11-15', type: 'Escalation Call', summary: 'Discussed ongoing performance issues' },
        { date: '2024-11-01', type: 'QBR', summary: 'Quarterly review - concerns raised about ROI' },
        { date: '2024-10-15', type: 'Support Ticket', summary: 'Critical outage - 4 hour resolution' },
      ],
      productUsage: [
        { feature: 'Core Platform', adoption: 45, trend: 'down' },
        { feature: 'Analytics', adoption: 20, trend: 'down' },
        { feature: 'Integrations', adoption: 60, trend: 'stable' },
        { feature: 'API', adoption: 75, trend: 'up' },
      ],
      supportHistory: { ticketCount: 24, avgResolution: '18 hours', openTickets: 5, satisfaction: 3.2 },
      previousRenewals: [
        { year: '2023', outcome: 'Renewed', change: '+15%' },
        { year: '2022', outcome: 'Renewed', change: '+25%' },
      ],
      competitorMentions: ['Competitor A mentioned in QBR', 'Evaluating alternatives'],
      keyRisks: ['Executive sponsor leaving', 'Budget cuts announced', 'Low adoption rates'],
      opportunities: ['API usage growing', 'New department interested'],
    },
    'CUST-003': {
      healthScore: 58,
      healthFactors: [
        { factor: 'Product Adoption', score: 55, trend: 'stable' },
        { factor: 'Engagement', score: 60, trend: 'up' },
        { factor: 'Support Satisfaction', score: 62, trend: 'up' },
        { factor: 'Executive Relationship', score: 55, trend: 'stable' },
      ],
      stakeholders: [
        { name: 'Jennifer Lopez', role: 'COO', sentiment: 'neutral', lastContact: '2 weeks ago' },
        { name: 'Robert Brown', role: 'Director of Ops', sentiment: 'positive', lastContact: '3 days ago' },
      ],
      engagementHistory: [
        { date: '2024-11-10', type: 'Training Session', summary: 'Advanced features workshop' },
        { date: '2024-10-25', type: 'Check-in Call', summary: 'Discussed expansion opportunities' },
      ],
      productUsage: [
        { feature: 'Core Platform', adoption: 65, trend: 'up' },
        { feature: 'Analytics', adoption: 40, trend: 'up' },
        { feature: 'Integrations', adoption: 55, trend: 'stable' },
      ],
      supportHistory: { ticketCount: 12, avgResolution: '6 hours', openTickets: 2, satisfaction: 4.1 },
      previousRenewals: [
        { year: '2023', outcome: 'Renewed', change: '+10%' },
      ],
      competitorMentions: [],
      keyRisks: ['New stakeholder unfamiliar with platform', 'Budget review pending'],
      opportunities: ['ROI analysis shows strong value', 'Team expansion planned'],
    },
    'CUST-001': {
      healthScore: 85,
      healthFactors: [
        { factor: 'Product Adoption', score: 88, trend: 'up' },
        { factor: 'Engagement', score: 82, trend: 'stable' },
        { factor: 'Support Satisfaction', score: 90, trend: 'up' },
        { factor: 'Executive Relationship', score: 80, trend: 'stable' },
      ],
      stakeholders: [
        { name: 'Amanda Foster', role: 'CEO', sentiment: 'positive', lastContact: '1 month ago' },
        { name: 'Chris Martinez', role: 'VP Product', sentiment: 'positive', lastContact: '1 week ago' },
        { name: 'Lisa Chen', role: 'Director of Engineering', sentiment: 'positive', lastContact: '3 days ago' },
      ],
      engagementHistory: [
        { date: '2024-11-18', type: 'Executive Dinner', summary: 'Strategic partnership discussion' },
        { date: '2024-11-05', type: 'Product Roadmap Review', summary: 'Shared 2025 roadmap' },
        { date: '2024-10-20', type: 'Case Study Interview', summary: 'Customer success story' },
      ],
      productUsage: [
        { feature: 'Core Platform', adoption: 92, trend: 'up' },
        { feature: 'Analytics', adoption: 85, trend: 'up' },
        { feature: 'Integrations', adoption: 78, trend: 'up' },
        { feature: 'API', adoption: 88, trend: 'stable' },
      ],
      supportHistory: { ticketCount: 8, avgResolution: '2 hours', openTickets: 0, satisfaction: 4.8 },
      previousRenewals: [
        { year: '2023', outcome: 'Renewed', change: '+30%' },
        { year: '2022', outcome: 'Renewed', change: '+20%' },
        { year: '2021', outcome: 'Renewed', change: '+15%' },
      ],
      competitorMentions: [],
      keyRisks: [],
      opportunities: ['Enterprise expansion ready', 'Multi-year deal interest', 'Referral program candidate'],
    },
    'CUST-002': {
      healthScore: 72,
      healthFactors: [
        { factor: 'Product Adoption', score: 70, trend: 'stable' },
        { factor: 'Engagement', score: 75, trend: 'up' },
        { factor: 'Support Satisfaction', score: 68, trend: 'stable' },
        { factor: 'Executive Relationship', score: 75, trend: 'up' },
      ],
      stakeholders: [
        { name: 'Mark Thompson', role: 'CIO', sentiment: 'positive', lastContact: '2 weeks ago' },
        { name: 'Emily Davis', role: 'IT Manager', sentiment: 'neutral', lastContact: '4 days ago' },
      ],
      engagementHistory: [
        { date: '2024-11-12', type: 'Check-in Call', summary: 'Discussed support improvements' },
        { date: '2024-10-28', type: 'Training Session', summary: 'New feature onboarding' },
      ],
      productUsage: [
        { feature: 'Core Platform', adoption: 75, trend: 'stable' },
        { feature: 'Analytics', adoption: 60, trend: 'up' },
        { feature: 'Integrations', adoption: 70, trend: 'stable' },
      ],
      supportHistory: { ticketCount: 15, avgResolution: '8 hours', openTickets: 3, satisfaction: 3.9 },
      previousRenewals: [
        { year: '2023', outcome: 'Renewed', change: '+5%' },
      ],
      competitorMentions: [],
      keyRisks: ['Open support tickets need resolution'],
      opportunities: ['Training completion will boost adoption', 'New team onboarding'],
    },
    'CUST-005': {
      healthScore: 82,
      healthFactors: [
        { factor: 'Product Adoption', score: 80, trend: 'up' },
        { factor: 'Engagement', score: 85, trend: 'up' },
        { factor: 'Support Satisfaction', score: 82, trend: 'stable' },
        { factor: 'Executive Relationship', score: 81, trend: 'up' },
      ],
      stakeholders: [
        { name: 'Rachel Green', role: 'VP Operations', sentiment: 'positive', lastContact: '1 week ago' },
        { name: 'Tom Wilson', role: 'Product Manager', sentiment: 'positive', lastContact: '2 days ago' },
      ],
      engagementHistory: [
        { date: '2024-11-15', type: 'Strategy Call', summary: 'Discussed enterprise tier benefits' },
        { date: '2024-11-01', type: 'Product Demo', summary: 'Showcased new features' },
      ],
      productUsage: [
        { feature: 'Core Platform', adoption: 85, trend: 'up' },
        { feature: 'Analytics', adoption: 78, trend: 'up' },
        { feature: 'Integrations', adoption: 72, trend: 'up' },
      ],
      supportHistory: { ticketCount: 6, avgResolution: '3 hours', openTickets: 1, satisfaction: 4.5 },
      previousRenewals: [
        { year: '2023', outcome: 'Renewed', change: '+20%' },
      ],
      competitorMentions: [],
      keyRisks: [],
      opportunities: ['Ready for enterprise tier', 'Additional departments interested'],
    },
  };

  const statusColors = {
    'on-track': 'border-l-success bg-emerald-500/20',
    'at-risk': 'border-l-chart-4 bg-amber-500/20',
    critical: 'border-l-destructive bg-red-500/20',
  };

  const statusTextColors = {
    'on-track': 'text-success',
    'at-risk': 'text-chart-4',
    critical: 'text-destructive',
  };

  const statusIcons = {
    'on-track': <CheckCircle className="h-4 w-4 text-success" />,
    'at-risk': <AlertCircle className="h-4 w-4 text-chart-4" />,
    critical: <AlertTriangle className="h-4 w-4 text-destructive" />,
  };

  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood >= 80) return 'text-success';
    if (likelihood >= 60) return 'text-chart-3';
    if (likelihood >= 40) return 'text-chart-4';
    return 'text-destructive';
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-chart-3';
    if (score >= 40) return 'text-chart-4';
    return 'text-destructive';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter renewals for drill-downs
  const next30Renewals = data.renewals.filter(r => r.daysUntilRenewal <= 30);
  const next90Renewals = data.renewals.filter(r => r.daysUntilRenewal <= 90);
  const atRiskRenewals = data.renewals.filter(r => r.status === 'at-risk' || r.status === 'critical');
  const highValueRenewals = data.renewals.filter(r => r.currentArr >= 500000);

  return (
    <div className="space-y-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">
            {data.renewalCount} renewals | {data.period}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{formatCurrency(data.totalArr)}</div>
          <div className="text-xs text-muted-foreground">Total ARR at Renewal</div>
        </div>
      </div>

      {/* Interactive Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Next 30 Days - Clickable */}
        <div
          onClick={() => toggleDrillDown('next-30')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md ${
            activeDrillDown === 'next-30'
              ? 'border-chart-4 ring-1 ring-chart-4/30 bg-amber-500/30'
              : 'border-chart-4/30 bg-amber-500/20 hover:border-chart-4/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">Next 30 Days</div>
            {activeDrillDown === 'next-30' ? (
              <ChevronUp className="h-3 w-3 text-chart-4" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <div className="text-2xl font-bold text-chart-4">{data.summary.upcomingMonth}</div>
          <div className="text-xs text-muted-foreground mt-1">Click for details</div>
        </div>

        {/* Next 90 Days - Clickable */}
        <div
          onClick={() => toggleDrillDown('next-90')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md ${
            activeDrillDown === 'next-90'
              ? 'border-chart-3 ring-1 ring-chart-3/30 bg-lime-500/30'
              : 'border-chart-3/30 bg-lime-500/20 hover:border-chart-3/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">Next 90 Days</div>
            {activeDrillDown === 'next-90' ? (
              <ChevronUp className="h-3 w-3 text-chart-3" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <div className="text-2xl font-bold text-chart-3">{data.summary.upcomingQuarter}</div>
          <div className="text-xs text-muted-foreground mt-1">Click for details</div>
        </div>

        {/* At Risk - Clickable */}
        <div
          onClick={() => toggleDrillDown('at-risk')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md ${
            activeDrillDown === 'at-risk'
              ? 'border-destructive ring-1 ring-destructive/30 bg-red-500/30'
              : 'border-destructive/30 bg-red-500/20 hover:border-destructive/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">At Risk</div>
            {activeDrillDown === 'at-risk' ? (
              <ChevronUp className="h-3 w-3 text-destructive" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <div className="text-2xl font-bold text-destructive">{data.summary.atRisk}</div>
          <div className="text-xs text-muted-foreground mt-1">Click for details</div>
        </div>

        {/* High Value - Clickable */}
        <div
          onClick={() => toggleDrillDown('high-value')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md ${
            activeDrillDown === 'high-value'
              ? 'border-success ring-1 ring-success/30 bg-emerald-500/30'
              : 'border-success/30 bg-emerald-500/20 hover:border-success/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">High Value (&gt;$500K)</div>
            {activeDrillDown === 'high-value' ? (
              <ChevronUp className="h-3 w-3 text-success" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <div className="text-2xl font-bold text-success">{data.summary.highValue}</div>
          <div className="text-xs text-muted-foreground mt-1">Click for details</div>
        </div>
      </div>

      {/* Drill-Down Panel: Next 30 Days */}
      {activeDrillDown === 'next-30' && (
        <div className="glass-card rounded-lg border border-chart-4/30 bg-amber-500/10 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-chart-4" />
              Renewals Due in Next 30 Days - Urgent Attention Required
            </h5>
            <button onClick={() => setActiveDrillDown(null)} className="text-muted-foreground hover:text-foreground">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          {next30Renewals.length > 0 ? (
            <div className="space-y-2">
              {next30Renewals.map((renewal, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${renewal.status === 'critical' ? 'bg-destructive' : renewal.status === 'at-risk' ? 'bg-chart-4' : 'bg-success'}`} />
                    <div>
                      <div className="font-medium text-foreground">{renewal.customerName}</div>
                      <div className="text-xs text-muted-foreground">{renewal.daysUntilRenewal} days remaining</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{formatCurrency(renewal.currentArr)}</div>
                    <div className={`text-xs ${getLikelihoodColor(renewal.renewalLikelihood)}`}>{renewal.renewalLikelihood}% likelihood</div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border/50 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total ARR at stake:</span>
                  <span className="font-bold text-chart-4">{formatCurrency(next30Renewals.reduce((sum, r) => sum + r.currentArr, 0))}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">No renewals due in the next 30 days</div>
          )}
        </div>
      )}

      {/* Drill-Down Panel: Next 90 Days */}
      {activeDrillDown === 'next-90' && (
        <div className="glass-card rounded-lg border border-chart-3/30 bg-lime-500/10 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-chart-3" />
              Renewals Due in Next 90 Days - Plan Engagement Strategy
            </h5>
            <button onClick={() => setActiveDrillDown(null)} className="text-muted-foreground hover:text-foreground">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {next90Renewals.map((renewal, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded bg-background/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${renewal.status === 'critical' ? 'bg-destructive' : renewal.status === 'at-risk' ? 'bg-chart-4' : 'bg-success'}`} />
                  <div>
                    <div className="font-medium text-foreground">{renewal.customerName}</div>
                    <div className="text-xs text-muted-foreground">{renewal.daysUntilRenewal} days • {renewal.renewalDate}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{formatCurrency(renewal.currentArr)}</div>
                  <div className={`text-xs ${getLikelihoodColor(renewal.renewalLikelihood)}`}>{renewal.renewalLikelihood}% likelihood</div>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-border/50 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total ARR at stake:</span>
                <span className="font-bold text-chart-3">{formatCurrency(next90Renewals.reduce((sum, r) => sum + r.currentArr, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drill-Down Panel: At Risk */}
      {activeDrillDown === 'at-risk' && (
        <div className="glass-card rounded-lg border border-destructive/30 bg-red-500/10 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              At-Risk Renewals - Immediate Intervention Required
            </h5>
            <button onClick={() => setActiveDrillDown(null)} className="text-muted-foreground hover:text-foreground">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          {atRiskRenewals.length > 0 ? (
            <div className="space-y-3">
              {atRiskRenewals.map((renewal, idx) => {
                const details = renewalDetails[renewal.customerId];
                return (
                  <div key={idx} className="p-3 rounded bg-background/50 border border-destructive/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${renewal.status === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-chart-4/20 text-chart-4'}`}>
                          {renewal.status.toUpperCase()}
                        </span>
                        <span className="font-medium text-foreground">{renewal.customerName}</span>
                      </div>
                      <span className="font-semibold text-foreground">{formatCurrency(renewal.currentArr)}</span>
                    </div>
                    {details && (
                      <>
                        <div className="text-xs text-muted-foreground mb-2">Key Risks:</div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {details.keyRisks.map((risk, rIdx) => (
                            <span key={rIdx} className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive border border-destructive/20">
                              {risk}
                            </span>
                          ))}
                        </div>
                        {details.competitorMentions.length > 0 && (
                          <div className="text-xs text-chart-4 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {details.competitorMentions[0]}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total ARR at risk:</span>
                  <span className="font-bold text-destructive">{formatCurrency(atRiskRenewals.reduce((sum, r) => sum + r.currentArr, 0))}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">No at-risk renewals - great job!</div>
          )}
        </div>
      )}

      {/* Drill-Down Panel: High Value */}
      {activeDrillDown === 'high-value' && (
        <div className="glass-card rounded-lg border border-success/30 bg-emerald-500/10 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-success" />
              High-Value Renewals (&gt;$500K) - Strategic Accounts
            </h5>
            <button onClick={() => setActiveDrillDown(null)} className="text-muted-foreground hover:text-foreground">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          {highValueRenewals.length > 0 ? (
            <div className="space-y-3">
              {highValueRenewals.map((renewal, idx) => {
                const details = renewalDetails[renewal.customerId];
                return (
                  <div key={idx} className="p-3 rounded bg-background/50 border border-success/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-foreground">{renewal.customerName}</div>
                        <div className="text-xs text-muted-foreground">{renewal.daysUntilRenewal} days until renewal</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-success">{formatCurrency(renewal.currentArr)}</div>
                        {renewal.expansionOpportunity > 0 && (
                          <div className="text-xs text-success">+{formatCurrency(renewal.expansionOpportunity)} expansion</div>
                        )}
                      </div>
                    </div>
                    {details && details.opportunities.length > 0 && (
                      <>
                        <div className="text-xs text-muted-foreground mb-1">Opportunities:</div>
                        <div className="flex flex-wrap gap-1">
                          {details.opportunities.map((opp, oIdx) => (
                            <span key={oIdx} className="text-xs px-2 py-1 rounded bg-success/10 text-success border border-success/20">
                              {opp}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total high-value ARR:</span>
                  <span className="font-bold text-success">{formatCurrency(highValueRenewals.reduce((sum, r) => sum + r.currentArr, 0))}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">No high-value renewals in this period</div>
          )}
        </div>
      )}

      {/* Renewal Cards */}
      <div className="space-y-3">
        {data.renewals.map((renewal, idx) => {
          const isExpanded = expandedRenewal === renewal.customerId;
          const details = renewalDetails[renewal.customerId];

          return (
            <div
              key={idx}
              className={`border-l-4 ${statusColors[renewal.status]} rounded-r glass-card backdrop-blur-md transition-all duration-200 ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}`}
            >
              {/* Main Card Content - Clickable */}
              <div
                onClick={() => toggleRenewalExpand(renewal.customerId)}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  {/* Customer Name & Status */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-semibold text-foreground">{renewal.customerName}</h4>
                      <span className={`flex items-center gap-1 text-xs font-semibold uppercase px-2 py-1 rounded ${statusTextColors[renewal.status]} border ${renewal.status === 'critical' ? 'border-destructive' : renewal.status === 'at-risk' ? 'border-chart-4' : 'border-success'}`}>
                        {statusIcons[renewal.status]}
                        {renewal.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{renewal.customerId}</span>
                      <span>|</span>
                      <span>CSM: {renewal.csm}</span>
                      <span className="text-xs text-primary ml-2">Click to expand</span>
                    </div>
                  </div>

                  {/* Renewal Likelihood */}
                  <div className="text-right flex-shrink-0">
                    <div className={`text-3xl font-bold ${getLikelihoodColor(renewal.renewalLikelihood)}`}>
                      {renewal.renewalLikelihood}%
                    </div>
                    <div className="text-xs text-muted-foreground">Likelihood</div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3 pb-3 border-b border-border/50">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="h-3 w-3 text-success" />
                      <span className="text-xs text-muted-foreground">Current ARR</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{formatCurrency(renewal.currentArr)}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3 text-chart-4" />
                      <span className="text-xs text-muted-foreground">Renewal Date</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{renewal.renewalDate}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3 text-chart-3" />
                      <span className="text-xs text-muted-foreground">Days Until</span>
                    </div>
                    <div className={`text-sm font-semibold ${renewal.daysUntilRenewal <= 30 ? 'text-destructive' : renewal.daysUntilRenewal <= 60 ? 'text-chart-4' : 'text-foreground'}`}>
                      {renewal.daysUntilRenewal} days
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-xs text-muted-foreground">Expansion Opp</span>
                    </div>
                    <div className="text-sm font-semibold text-success">
                      {renewal.expansionOpportunity > 0 ? `+${formatCurrency(renewal.expansionOpportunity)}` : '-'}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Last Contact</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{renewal.lastEngagement}</div>
                  </div>
                </div>

                {/* Action Items */}
                {renewal.actionItems.length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Action Items:</div>
                    <div className="flex flex-wrap gap-2">
                      {renewal.actionItems.map((item, itemIdx) => (
                        <span key={itemIdx} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && details && (
                <div className="border-t border-border/50 p-4 bg-background/30 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Health Score */}
                    <div className="p-3 rounded border border-border/50 bg-background/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Health Score</span>
                        <span className={`ml-auto text-xl font-bold ${getHealthColor(details.healthScore)}`}>
                          {details.healthScore}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {details.healthFactors.map((factor, fIdx) => (
                          <div key={fIdx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{factor.factor}</span>
                            <div className="flex items-center gap-2">
                              <span className={getHealthColor(factor.score)}>{factor.score}</span>
                              {factor.trend === 'up' && <TrendingUp className="h-3 w-3 text-success" />}
                              {factor.trend === 'down' && <TrendingUp className="h-3 w-3 text-destructive rotate-180" />}
                              {factor.trend === 'stable' && <span className="text-muted-foreground">—</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Stakeholders */}
                    <div className="p-3 rounded border border-border/50 bg-background/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Key Stakeholders</span>
                      </div>
                      <div className="space-y-2">
                        {details.stakeholders.map((person, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between text-xs">
                            <div>
                              <div className="font-medium text-foreground">{person.name}</div>
                              <div className="text-muted-foreground">{person.role}</div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                person.sentiment === 'positive' ? 'bg-success/20 text-success' :
                                person.sentiment === 'negative' ? 'bg-destructive/20 text-destructive' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {person.sentiment}
                              </span>
                              <div className="text-muted-foreground mt-1">{person.lastContact}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Usage */}
                    <div className="p-3 rounded border border-border/50 bg-background/50">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Product Adoption</span>
                      </div>
                      <div className="space-y-2">
                        {details.productUsage.map((usage, uIdx) => (
                          <div key={uIdx}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{usage.feature}</span>
                              <div className="flex items-center gap-1">
                                <span className={getHealthColor(usage.adoption)}>{usage.adoption}%</span>
                                {usage.trend === 'up' && <TrendingUp className="h-3 w-3 text-success" />}
                                {usage.trend === 'down' && <TrendingUp className="h-3 w-3 text-destructive rotate-180" />}
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${usage.adoption >= 80 ? 'bg-success' : usage.adoption >= 60 ? 'bg-chart-3' : usage.adoption >= 40 ? 'bg-chart-4' : 'bg-destructive'}`}
                                style={{ width: `${usage.adoption}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Support History */}
                    <div className="p-3 rounded border border-border/50 bg-background/50">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Support History</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground">Total Tickets</div>
                          <div className="font-semibold text-foreground">{details.supportHistory.ticketCount}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Open Tickets</div>
                          <div className={`font-semibold ${details.supportHistory.openTickets > 0 ? 'text-chart-4' : 'text-success'}`}>
                            {details.supportHistory.openTickets}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Resolution</div>
                          <div className="font-semibold text-foreground">{details.supportHistory.avgResolution}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Satisfaction</div>
                          <div className={`font-semibold ${details.supportHistory.satisfaction >= 4 ? 'text-success' : details.supportHistory.satisfaction >= 3 ? 'text-chart-4' : 'text-destructive'}`}>
                            {details.supportHistory.satisfaction}/5
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Timeline */}
                    <div className="p-3 rounded border border-border/50 bg-background/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Recent Engagement</span>
                      </div>
                      <div className="space-y-2">
                        {details.engagementHistory.slice(0, 3).map((engagement, eIdx) => (
                          <div key={eIdx} className="text-xs border-l-2 border-primary/30 pl-2">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{engagement.date}</span>
                              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px]">{engagement.type}</span>
                            </div>
                            <div className="text-muted-foreground mt-0.5">{engagement.summary}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Previous Renewals */}
                    <div className="p-3 rounded border border-border/50 bg-background/50">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Renewal History</span>
                      </div>
                      <div className="space-y-2">
                        {details.previousRenewals.map((prev, prIdx) => (
                          <div key={prIdx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{prev.year}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-success">{prev.outcome}</span>
                              <span className="text-success font-semibold">{prev.change}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Risks & Opportunities */}
                  {(details.keyRisks.length > 0 || details.opportunities.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {details.keyRisks.length > 0 && (
                        <div className="p-3 rounded border border-destructive/30 bg-destructive/5">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-semibold text-destructive">Key Risks</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {details.keyRisks.map((risk, rIdx) => (
                              <span key={rIdx} className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive">
                                {risk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {details.opportunities.length > 0 && (
                        <div className="p-3 rounded border border-success/30 bg-success/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-success" />
                            <span className="text-sm font-semibold text-success">Opportunities</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {details.opportunities.map((opp, oIdx) => (
                              <span key={oIdx} className="text-xs px-2 py-1 rounded bg-success/10 text-success">
                                {opp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Phone className="h-3 w-3" />
                      Schedule Call
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Mail className="h-3 w-3" />
                      Send Email
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <FileText className="h-3 w-3" />
                      View Full Profile
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Target className="h-3 w-3" />
                      Create Action Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
