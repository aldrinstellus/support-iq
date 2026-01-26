'use client';

import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Target,
  ArrowUpRight,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  Users,
  BarChart3,
  Activity,
  Phone,
  Mail,
  FileText,
  Calendar,
  XCircle,
  Zap,
  Shield,
  Star,
  MessageSquare,
} from 'lucide-react';
import type { UpsellOpportunitiesData } from '@/types/widget';

type DrillDownType = 'tier-upgrade' | 'add-on' | 'cross-sell' | 'new-product' | null;

export function UpsellOpportunitiesWidget({ data }: { data: UpsellOpportunitiesData }) {
  const [activeDrillDown, setActiveDrillDown] = useState<DrillDownType>(null);
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(null);

  const toggleDrillDown = (type: DrillDownType) => {
    setActiveDrillDown(activeDrillDown === type ? null : type);
  };

  const toggleOpportunityExpand = (customerId: string) => {
    setExpandedOpportunity(expandedOpportunity === customerId ? null : customerId);
  };

  // Mock detailed data for drill-downs
  const opportunityDetails: Record<string, {
    usageAnalytics: { feature: string; currentUsage: number; capacity: number; trend: 'up' | 'down' | 'stable' }[];
    engagementHistory: { date: string; type: string; summary: string; sentiment: 'positive' | 'neutral' | 'negative' }[];
    decisionMakers: { name: string; role: string; influence: 'high' | 'medium' | 'low'; lastContact: string; sentiment: 'champion' | 'neutral' | 'blocker' }[];
    competitiveIntel: { competitor: string; status: string; notes: string }[];
    roiProjection: { metric: string; current: string; projected: string; improvement: string }[];
    successIndicators: string[];
    potentialBlockers: string[];
    recommendedApproach: string;
  }> = {
    'CUST-001': {
      usageAnalytics: [
        { feature: 'Core Platform', currentUsage: 92, capacity: 100, trend: 'up' },
        { feature: 'API Calls', currentUsage: 85, capacity: 100, trend: 'up' },
        { feature: 'User Seats', currentUsage: 48, capacity: 50, trend: 'stable' },
        { feature: 'Storage', currentUsage: 78, capacity: 100, trend: 'up' },
      ],
      engagementHistory: [
        { date: '2024-11-18', type: 'QBR', summary: 'Discussed scaling needs for Q1', sentiment: 'positive' },
        { date: '2024-11-10', type: 'Product Demo', summary: 'Showcased enterprise features', sentiment: 'positive' },
        { date: '2024-10-28', type: 'Support Call', summary: 'Resolved API rate limiting concern', sentiment: 'neutral' },
      ],
      decisionMakers: [
        { name: 'Jennifer Walsh', role: 'VP Engineering', influence: 'high', lastContact: '1 week ago', sentiment: 'champion' },
        { name: 'Robert Chen', role: 'CTO', influence: 'high', lastContact: '2 weeks ago', sentiment: 'champion' },
        { name: 'Lisa Park', role: 'Finance Director', influence: 'medium', lastContact: '3 weeks ago', sentiment: 'neutral' },
      ],
      competitiveIntel: [
        { competitor: 'None active', status: 'Exclusive', notes: 'No competitive evaluation in progress' },
      ],
      roiProjection: [
        { metric: 'Time to Value', current: '45 days', projected: '15 days', improvement: '-67%' },
        { metric: 'Team Productivity', current: '100%', projected: '140%', improvement: '+40%' },
        { metric: 'Cost per Transaction', current: '$2.50', projected: '$1.50', improvement: '-40%' },
      ],
      successIndicators: ['High feature adoption', 'Executive sponsorship', 'Budget approved for Q1', 'Positive NPS (72)'],
      potentialBlockers: ['Q4 budget freeze ending Dec 31'],
      recommendedApproach: 'Schedule executive briefing with CTO to present enterprise ROI analysis',
    },
    'CUST-002': {
      usageAnalytics: [
        { feature: 'Core Platform', currentUsage: 75, capacity: 100, trend: 'up' },
        { feature: 'Analytics Module', currentUsage: 45, capacity: 100, trend: 'up' },
        { feature: 'User Seats', currentUsage: 28, capacity: 30, trend: 'up' },
        { feature: 'Integrations', currentUsage: 3, capacity: 5, trend: 'stable' },
      ],
      engagementHistory: [
        { date: '2024-11-12', type: 'Training Session', summary: 'Analytics deep-dive with team', sentiment: 'positive' },
        { date: '2024-11-05', type: 'Check-in Call', summary: 'Discussed adding new department', sentiment: 'positive' },
        { date: '2024-10-22', type: 'Support Ticket', summary: 'Integration setup assistance', sentiment: 'neutral' },
      ],
      decisionMakers: [
        { name: 'Michael Torres', role: 'IT Director', influence: 'high', lastContact: '5 days ago', sentiment: 'champion' },
        { name: 'Sarah Kim', role: 'Operations Manager', influence: 'medium', lastContact: '1 week ago', sentiment: 'champion' },
        { name: 'David Lee', role: 'CFO', influence: 'high', lastContact: '1 month ago', sentiment: 'neutral' },
      ],
      competitiveIntel: [
        { competitor: 'Competitor B', status: 'Evaluated', notes: 'Looked at for analytics but chose us' },
      ],
      roiProjection: [
        { metric: 'Reporting Time', current: '8 hours/week', projected: '2 hours/week', improvement: '-75%' },
        { metric: 'Data Accuracy', current: '85%', projected: '98%', improvement: '+15%' },
        { metric: 'Decision Speed', current: '5 days', projected: '1 day', improvement: '-80%' },
      ],
      successIndicators: ['Growing user base', 'Department expansion planned', 'Positive testimonial shared'],
      potentialBlockers: ['CFO approval needed for >$50K spend'],
      recommendedApproach: 'Prepare ROI case study for CFO presentation',
    },
    'CUST-003': {
      usageAnalytics: [
        { feature: 'Core Platform', currentUsage: 60, capacity: 100, trend: 'stable' },
        { feature: 'Collaboration Tools', currentUsage: 88, capacity: 100, trend: 'up' },
        { feature: 'User Seats', currentUsage: 45, capacity: 50, trend: 'up' },
        { feature: 'Custom Reports', currentUsage: 12, capacity: 20, trend: 'up' },
      ],
      engagementHistory: [
        { date: '2024-11-15', type: 'Executive Meeting', summary: 'Discussed multi-region expansion', sentiment: 'positive' },
        { date: '2024-11-08', type: 'Product Roadmap', summary: 'Shared upcoming features', sentiment: 'positive' },
        { date: '2024-10-30', type: 'Security Review', summary: 'Completed compliance audit', sentiment: 'positive' },
      ],
      decisionMakers: [
        { name: 'Amanda Wright', role: 'CEO', influence: 'high', lastContact: '1 week ago', sentiment: 'champion' },
        { name: 'James Miller', role: 'CIO', influence: 'high', lastContact: '1 week ago', sentiment: 'champion' },
        { name: 'Rachel Green', role: 'Legal Counsel', influence: 'medium', lastContact: '2 weeks ago', sentiment: 'neutral' },
      ],
      competitiveIntel: [
        { competitor: 'None', status: 'Locked In', notes: '3-year strategic partnership discussed' },
      ],
      roiProjection: [
        { metric: 'Global Collaboration', current: 'Limited', projected: 'Full', improvement: 'N/A' },
        { metric: 'Compliance Score', current: '92%', projected: '99%', improvement: '+8%' },
        { metric: 'Support Response', current: '4 hours', projected: '1 hour', improvement: '-75%' },
      ],
      successIndicators: ['Executive sponsorship at CEO level', 'Multi-year commitment interest', 'Compliance requirements met'],
      potentialBlockers: ['Legal review for new contract terms'],
      recommendedApproach: 'Fast-track legal review and prepare enterprise agreement',
    },
    'CUST-004': {
      usageAnalytics: [
        { feature: 'Core Platform', currentUsage: 70, capacity: 100, trend: 'up' },
        { feature: 'API Integration', currentUsage: 95, capacity: 100, trend: 'up' },
        { feature: 'User Seats', currentUsage: 18, capacity: 20, trend: 'stable' },
        { feature: 'Webhooks', currentUsage: 8, capacity: 10, trend: 'up' },
      ],
      engagementHistory: [
        { date: '2024-11-14', type: 'Technical Review', summary: 'API architecture discussion', sentiment: 'positive' },
        { date: '2024-11-01', type: 'Product Feedback', summary: 'Requested additional endpoints', sentiment: 'neutral' },
        { date: '2024-10-20', type: 'Support Call', summary: 'Performance optimization tips', sentiment: 'positive' },
      ],
      decisionMakers: [
        { name: 'Kevin Zhang', role: 'Head of Engineering', influence: 'high', lastContact: '3 days ago', sentiment: 'champion' },
        { name: 'Emily Davis', role: 'Product Manager', influence: 'medium', lastContact: '1 week ago', sentiment: 'champion' },
      ],
      competitiveIntel: [
        { competitor: 'Build vs Buy', status: 'Evaluated', notes: 'Considered building in-house, chose us for speed' },
      ],
      roiProjection: [
        { metric: 'Development Time', current: '6 months', projected: '2 months', improvement: '-67%' },
        { metric: 'API Reliability', current: '99.5%', projected: '99.99%', improvement: '+0.49%' },
        { metric: 'Integration Cost', current: '$150K', projected: '$50K', improvement: '-67%' },
      ],
      successIndicators: ['High API usage', 'Technical champion identified', 'Development team engaged'],
      potentialBlockers: ['Budget cycle ends in 30 days'],
      recommendedApproach: 'Expedite proposal before budget cycle ends',
    },
  };

  const opportunityTypeColors = {
    'tier-upgrade': 'border-l-primary bg-primary/20',
    'add-on': 'border-l-chart-3 bg-lime-500/20',
    'cross-sell': 'border-l-chart-4 bg-amber-500/20',
    'new-product': 'border-l-success bg-emerald-500/20',
  };

  const opportunityTypeTextColors = {
    'tier-upgrade': 'text-primary',
    'add-on': 'text-chart-3',
    'cross-sell': 'text-chart-4',
    'new-product': 'text-success',
  };

  const opportunityTypeLabels = {
    'tier-upgrade': 'Tier Upgrade',
    'add-on': 'Add-On',
    'cross-sell': 'Cross-Sell',
    'new-product': 'New Product',
  };

  const summaryCardConfigs = {
    'tier-upgrade': { label: 'Tier Upgrades', count: data.byType.tierUpgrade, color: 'border-primary/30 bg-primary/20', textColor: 'text-primary' },
    'add-on': { label: 'Add-Ons', count: data.byType.addOn, color: 'border-chart-3/30 bg-lime-500/20', textColor: 'text-chart-3' },
    'cross-sell': { label: 'Cross-Sell', count: data.byType.crossSell, color: 'border-chart-4/30 bg-amber-500/20', textColor: 'text-chart-4' },
    'new-product': { label: 'New Product', count: data.byType.newProduct, color: 'border-success/30 bg-emerald-500/20', textColor: 'text-success' },
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-chart-3';
    if (confidence >= 40) return 'text-chart-4';
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
      case 'champion':
        return 'text-success';
      case 'neutral':
        return 'text-chart-4';
      case 'negative':
      case 'blocker':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getInfluenceIcon = (influence: string) => {
    switch (influence) {
      case 'high':
        return <Star className="h-3 w-3 text-chart-4" />;
      case 'medium':
        return <Star className="h-3 w-3 text-muted-foreground" />;
      default:
        return null;
    }
  };

  // Filter opportunities by type for drill-down
  const filteredOpportunities = activeDrillDown
    ? data.opportunities.filter(opp => opp.opportunityType === activeDrillDown)
    : data.opportunities;

  // Calculate total revenue by type
  const getTypeRevenue = (type: string) => {
    return data.opportunities
      .filter(opp => opp.opportunityType === type)
      .reduce((sum, opp) => sum + opp.estimatedRevenue, 0);
  };

  return (
    <div className="space-y-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">
            {data.totalOpportunities} opportunities identified
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-success">{formatCurrency(data.totalPotentialRevenue)}</div>
          <div className="text-xs text-muted-foreground">Total Potential Revenue</div>
        </div>
      </div>

      {/* Summary by Type - Clickable Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.entries(summaryCardConfigs) as [DrillDownType, typeof summaryCardConfigs['tier-upgrade']][]).map(([type, config]) => (
          <div
            key={type}
            onClick={() => toggleDrillDown(type)}
            className={`glass-card rounded-lg border ${config.color} p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${activeDrillDown === type ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-muted-foreground">{config.label}</div>
              {activeDrillDown === type ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className={`text-2xl font-bold ${config.textColor}`}>{config.count}</div>
            <div className="text-xs text-muted-foreground">Click for details</div>
          </div>
        ))}
      </div>

      {/* Drill-Down Panel */}
      {activeDrillDown && (
        <div className="glass-card rounded-lg border border-border p-4 bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              {summaryCardConfigs[activeDrillDown].label} - {formatCurrency(getTypeRevenue(activeDrillDown))} Potential
            </h5>
            <button onClick={() => setActiveDrillDown(null)} className="p-1 hover:bg-muted rounded">
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-3">
            {filteredOpportunities.map((opp) => (
              <div key={opp.customerId} className="flex items-center justify-between p-3 rounded bg-muted/30 border border-border/50">
                <div>
                  <div className="font-medium text-foreground">{opp.customerName}</div>
                  <div className="text-xs text-muted-foreground">{opp.customerId} | {opp.suggestedProduct}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">+{formatCurrency(opp.estimatedRevenue)}</div>
                  <div className={`text-xs ${getConfidenceColor(opp.confidence)}`}>{opp.confidence}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunity Cards */}
      <div className="space-y-3">
        {data.opportunities.map((opp) => {
          const details = opportunityDetails[opp.customerId];
          const isExpanded = expandedOpportunity === opp.customerId;

          return (
            <div key={opp.customerId}>
              {/* Main Card - Clickable */}
              <div
                onClick={() => toggleOpportunityExpand(opp.customerId)}
                className={`border-l-4 ${opportunityTypeColors[opp.opportunityType]} rounded-r glass-card p-4 backdrop-blur-md transition-all duration-200 hover:shadow-md cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  {/* Customer Name & Type */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-semibold text-foreground">{opp.customerName}</h4>
                      <span className={`flex items-center gap-1 text-xs font-semibold uppercase px-2 py-1 rounded ${opportunityTypeTextColors[opp.opportunityType]} border`}>
                        <ArrowUpRight className="h-3 w-3" />
                        {opportunityTypeLabels[opp.opportunityType]}
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{opp.customerId}</span>
                      <span>|</span>
                      <span>Current ARR: {formatCurrency(opp.currentArr)}</span>
                      <span className="text-xs">Click to expand</span>
                    </div>
                  </div>

                  {/* Revenue & Confidence */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="text-2xl font-bold text-success">+{formatCurrency(opp.estimatedRevenue)}</div>
                    </div>
                    <div className={`text-sm font-semibold ${getConfidenceColor(opp.confidence)}`}>
                      {opp.confidence}% confidence
                    </div>
                  </div>
                </div>

                {/* Product & Timeline */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 pb-3 border-b border-border/50">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground">Suggested Product</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{opp.suggestedProduct}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3 text-chart-3" />
                      <span className="text-xs text-muted-foreground">Timeline to Close</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{opp.timelineToClose}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="h-3 w-3 text-success" />
                      <span className="text-xs text-muted-foreground">Potential Growth</span>
                    </div>
                    <div className="text-sm font-semibold text-success">
                      +{Math.round((opp.estimatedRevenue / opp.currentArr) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Reasons & Buying Signals */}
                <div className="space-y-3">
                  {/* Reasons */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <TrendingUp className="h-3 w-3 text-chart-3" />
                      <span className="text-xs text-muted-foreground">Opportunity Drivers:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opp.reasons.map((reason, reasonIdx) => (
                        <span key={reasonIdx} className="text-xs px-2 py-1 rounded bg-lime-500/20 text-chart-3">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buying Signals */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <Sparkles className="h-3 w-3 text-success" />
                      <span className="text-xs text-muted-foreground">Buying Signals:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opp.buyingSignals.map((signal, signalIdx) => (
                        <span key={signalIdx} className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-success">
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Next Steps:</div>
                    <div className="flex flex-wrap gap-2">
                      {opp.nextSteps.map((step, stepIdx) => (
                        <span key={stepIdx} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Detail View */}
              {isExpanded && details && (
                <div className="mt-2 p-4 rounded-lg border border-border bg-card/80 backdrop-blur-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Usage Analytics */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Usage Analytics</span>
                      </div>
                      <div className="space-y-2">
                        {details.usageAnalytics.map((usage, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{usage.feature}</span>
                              <span className="flex items-center gap-1">
                                {usage.currentUsage}%
                                {usage.trend === 'up' && <TrendingUp className="h-3 w-3 text-success" />}
                                {usage.trend === 'down' && <TrendingUp className="h-3 w-3 text-destructive rotate-180" />}
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${usage.currentUsage >= 80 ? 'bg-success' : usage.currentUsage >= 50 ? 'bg-chart-3' : 'bg-muted-foreground'}`}
                                style={{ width: `${usage.currentUsage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decision Makers */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-chart-4" />
                        <span className="font-medium text-sm">Decision Makers</span>
                      </div>
                      <div className="space-y-2">
                        {details.decisionMakers.map((dm, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium">{dm.name}</span>
                                {getInfluenceIcon(dm.influence)}
                              </div>
                              <div className="text-xs text-muted-foreground">{dm.role}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs font-medium ${getSentimentColor(dm.sentiment)}`}>{dm.sentiment}</div>
                              <div className="text-xs text-muted-foreground">{dm.lastContact}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ROI Projection */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-medium text-sm">ROI Projection</span>
                      </div>
                      <div className="space-y-2">
                        {details.roiProjection.map((roi, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{roi.metric}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground line-through">{roi.current}</span>
                              <span className="font-medium text-foreground">{roi.projected}</span>
                              <span className="text-success font-bold">{roi.improvement}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Engagement History */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-4 w-4 text-chart-3" />
                        <span className="font-medium text-sm">Recent Engagement</span>
                      </div>
                      <div className="space-y-2">
                        {details.engagementHistory.map((eng, idx) => (
                          <div key={idx} className="border-l-2 border-border pl-2">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">{eng.date}</span>
                              <span className="font-medium text-foreground">{eng.type}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{eng.summary}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Success Indicators & Blockers */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-success" />
                            <span className="font-medium text-sm">Success Indicators</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {details.successIndicators.map((indicator, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-success">
                                {indicator}
                              </span>
                            ))}
                          </div>
                        </div>
                        {details.potentialBlockers.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-4 w-4 text-destructive" />
                              <span className="font-medium text-sm">Potential Blockers</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {details.potentialBlockers.map((blocker, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">
                                  {blocker}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Competitive Intel */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-4 w-4 text-chart-4" />
                        <span className="font-medium text-sm">Competitive Intel</span>
                      </div>
                      <div className="space-y-2">
                        {details.competitiveIntel.map((intel, idx) => (
                          <div key={idx}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{intel.competitor}</span>
                              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{intel.status}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{intel.notes}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Approach */}
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm text-primary">Recommended Approach</span>
                    </div>
                    <p className="text-sm text-foreground">{details.recommendedApproach}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium transition-colors">
                      <Phone className="h-4 w-4" />
                      Schedule Call
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-chart-3/20 hover:bg-chart-3/30 text-chart-3 text-sm font-medium transition-colors">
                      <Mail className="h-4 w-4" />
                      Send Proposal
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-chart-4/20 hover:bg-chart-4/30 text-chart-4 text-sm font-medium transition-colors">
                      <Calendar className="h-4 w-4" />
                      Book Demo
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-medium transition-colors">
                      <FileText className="h-4 w-4" />
                      Generate ROI Report
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
