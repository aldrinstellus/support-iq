'use client';

import { useState } from 'react';
import { TrendingUp, Target, Lightbulb, Award, AlertCircle, CheckCircle2, Ticket, ChevronDown, ChevronUp, Clock, XCircle, BarChart3, FileText, ArrowRight } from 'lucide-react';
import type { SimilarTicketsAnalysisData } from '@/types/widget';

type DrillDownType = 'tickets-analyzed' | 'success-rate' | 'resolution-time' | 'pattern' | null;

export function SimilarTicketsAnalysisWidget({ data }: { data: SimilarTicketsAnalysisData }) {
  const [activeDrillDown, setActiveDrillDown] = useState<DrillDownType>(null);
  const [expandedPattern, setExpandedPattern] = useState<number | null>(null);

  const toggleDrillDown = (type: DrillDownType) => {
    setActiveDrillDown(activeDrillDown === type ? null : type);
  };

  const togglePattern = (index: number) => {
    setExpandedPattern(expandedPattern === index ? null : index);
  };

  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Mock detailed data for drill-downs - with KB articles for each ticket
  const ticketsAnalyzedDetails = [
    {
      id: '#001',
      title: 'SSO Integration Failure',
      status: 'Resolved',
      time: '18 min',
      date: '2 days ago',
      customer: 'Acme Corp',
      priority: 'High',
      kbArticles: [
        { id: 'KB-101', title: 'SSO Troubleshooting Guide', used: true },
        { id: 'KB-105', title: 'Token Refresh Procedures', used: true },
      ],
      resolution: 'Refreshed OAuth tokens and updated SSO configuration',
      steps: ['Identified expired token in logs', 'Regenerated OAuth credentials', 'Updated SSO config', 'Verified with customer']
    },
    {
      id: '#002',
      title: 'API Token Expired',
      status: 'Resolved',
      time: '12 min',
      date: '3 days ago',
      customer: 'TechStart Inc',
      priority: 'Medium',
      kbArticles: [
        { id: 'KB-102', title: 'API Token Management', used: true },
        { id: 'KB-110', title: 'Token Expiration Settings', used: false },
      ],
      resolution: 'Generated new API token with extended expiration',
      steps: ['Checked token expiration date', 'Generated new token', 'Updated client integration', 'Confirmed API connectivity']
    },
    {
      id: '#003',
      title: 'OAuth Scope Missing',
      status: 'Resolved',
      time: '25 min',
      date: '4 days ago',
      customer: 'Global Systems',
      priority: 'High',
      kbArticles: [
        { id: 'KB-103', title: 'OAuth Scopes Reference', used: true },
        { id: 'KB-107', title: 'Permission Configuration', used: true },
        { id: 'KB-112', title: 'Admin Console Guide', used: true },
      ],
      resolution: 'Added missing read/write scopes to OAuth application',
      steps: ['Identified missing scopes from error logs', 'Updated OAuth app configuration', 'Re-authorized connection', 'Tested all endpoints']
    },
    {
      id: '#004',
      title: 'Webhook Authentication',
      status: 'Resolved',
      time: '15 min',
      date: '5 days ago',
      customer: 'DataFlow Ltd',
      priority: 'Medium',
      kbArticles: [
        { id: 'KB-108', title: 'Webhook Security Setup', used: true },
      ],
      resolution: 'Configured webhook signature verification',
      steps: ['Verified webhook endpoint', 'Added signature header', 'Updated secret key', 'Tested payload delivery']
    },
    {
      id: '#005',
      title: 'SAML Config Error',
      status: 'In Progress',
      time: '-',
      date: '1 day ago',
      customer: 'Enterprise Co',
      priority: 'Critical',
      kbArticles: [
        { id: 'KB-104', title: 'SAML Configuration Guide', used: true },
        { id: 'KB-109', title: 'Identity Provider Setup', used: false },
      ],
      resolution: null,
      steps: ['Reviewing SAML metadata', 'Checking certificate validity']
    },
  ];

  const successRateDetails = {
    resolved: 45,
    pending: 2,
    escalated: 0,
    avgFirstResponse: '4 min',
    avgResolution: '22 min',
    customerSatisfaction: '4.8/5',
  };

  return (
    <div className="space-y-4 my-4">
      {/* Header with Reference Ticket */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {data.title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {data.category} • {data.ticketsAnalyzed} tickets analyzed
            {(data as Record<string, unknown>).referenceTicket && (
              <span className="ml-2 text-primary font-medium">
                • Reference: {(data as Record<string, unknown>).referenceTicket as string}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Interactive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Tickets Analyzed - Clickable */}
        <div
          onClick={() => toggleDrillDown('tickets-analyzed')}
          className={`glass-card rounded-lg border bg-card/70 p-3 cursor-pointer transition-all hover:border-primary/50 ${
            activeDrillDown === 'tickets-analyzed' ? 'border-primary ring-1 ring-primary/30' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground mb-1">Tickets Analyzed</p>
            {activeDrillDown === 'tickets-analyzed' ? (
              <ChevronUp className="h-3 w-3 text-primary" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-xl font-bold text-foreground">{data.ticketsAnalyzed}</p>
          <p className="text-xs text-muted-foreground mt-1">Click for details</p>
        </div>

        {/* Avg Resolution Time - Clickable */}
        <div
          onClick={() => toggleDrillDown('resolution-time')}
          className={`glass-card rounded-lg border bg-card/70 p-3 cursor-pointer transition-all hover:border-primary/50 ${
            activeDrillDown === 'resolution-time' ? 'border-primary ring-1 ring-primary/30' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground mb-1">Avg Resolution Time</p>
            {activeDrillDown === 'resolution-time' ? (
              <ChevronUp className="h-3 w-3 text-primary" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-xl font-bold text-foreground">{data.avgResolutionTime}</p>
          <p className="text-xs text-muted-foreground mt-1">Click for breakdown</p>
        </div>

        {/* Success Rate - Clickable */}
        <div
          onClick={() => toggleDrillDown('success-rate')}
          className={`glass-card rounded-lg border bg-card/70 p-3 cursor-pointer transition-all hover:border-emerald-500/50 ${
            activeDrillDown === 'success-rate' ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground mb-1">Success Rate</p>
            {activeDrillDown === 'success-rate' ? (
              <ChevronUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-xl font-bold text-emerald-500">{data.successRate}</p>
          <p className="text-xs text-muted-foreground mt-1">Click for metrics</p>
        </div>
      </div>

      {/* Drill-Down Panel: Tickets Analyzed */}
      {activeDrillDown === 'tickets-analyzed' && (
        <div className="glass-card rounded-lg border border-primary/30 bg-primary/5 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Similar Tickets You&apos;ve Resolved - Click to View Details
            </h5>
            <button
              onClick={() => { setActiveDrillDown(null); setSelectedTicket(null); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>

          {/* Ticket List */}
          <div className="space-y-2 mb-4">
            {ticketsAnalyzedDetails.map((ticket, index) => (
              <div
                key={index}
                onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                className={`cursor-pointer p-3 rounded border transition-all ${
                  selectedTicket === ticket.id
                    ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/30'
                    : 'bg-background/50 border-border/50 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">{ticket.id}</span>
                    <span className="text-sm font-medium text-foreground">{ticket.title}</span>
                    <span className="text-xs text-muted-foreground">• {ticket.customer}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      ticket.priority === 'Critical' ? 'bg-red-500/20 text-red-500' :
                      ticket.priority === 'High' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      ticket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{ticket.time}</span>
                    {selectedTicket === ticket.id ? (
                      <ChevronUp className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Ticket Details */}
                {selectedTicket === ticket.id && (
                  <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* KB Articles Used */}
                    <div className="p-3 rounded bg-card/70 border border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        Knowledge Base Articles Used
                      </p>
                      <div className="space-y-2">
                        {ticket.kbArticles.map((kb, kbIndex) => (
                          <div
                            key={kbIndex}
                            className={`flex items-center justify-between p-2 rounded border ${
                              kb.used
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-muted/30 border-border/30'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-primary">{kb.id}</span>
                              <span className="text-sm text-foreground">{kb.title}</span>
                            </div>
                            {kb.used ? (
                              <span className="text-xs text-emerald-500 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Applied
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Referenced</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resolution */}
                    {ticket.resolution && (
                      <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Resolution Applied</p>
                        <p className="text-sm text-foreground font-medium">{ticket.resolution}</p>
                      </div>
                    )}

                    {/* Resolution Steps */}
                    <div className="p-3 rounded bg-card/70 border border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Resolution Steps</p>
                      <ol className="list-decimal list-inside space-y-1">
                        {ticket.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-foreground">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-xs text-primary bg-primary/20 px-3 py-1.5 rounded border border-primary/20 hover:bg-primary/30 transition-all">
                        <Ticket className="h-3 w-3" />
                        View Full Ticket
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/20 px-3 py-1.5 rounded border border-border hover:bg-muted/30 transition-all">
                        <ArrowRight className="h-3 w-3" />
                        Apply This Solution
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drill-Down Panel: Resolution Time */}
      {activeDrillDown === 'resolution-time' && (
        <div className="glass-card rounded-lg border border-primary/30 bg-primary/5 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Resolution Time Breakdown
            </h5>
            <button
              onClick={() => setActiveDrillDown(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground">Fastest</p>
              <p className="text-lg font-bold text-emerald-500">8 min</p>
            </div>
            <div className="p-3 rounded bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-lg font-bold text-foreground">{data.avgResolutionTime}</p>
            </div>
            <div className="p-3 rounded bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground">Slowest</p>
              <p className="text-lg font-bold text-amber-500">45 min</p>
            </div>
            <div className="p-3 rounded bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="text-lg font-bold text-primary">30 min</p>
            </div>
          </div>
          <div className="mt-3 p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Your average is 27% faster than target SLA
            </p>
          </div>
        </div>
      )}

      {/* Drill-Down Panel: Success Rate */}
      {activeDrillDown === 'success-rate' && (
        <div className="glass-card rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              Success Rate Metrics
            </h5>
            <button
              onClick={() => setActiveDrillDown(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-background/50 border border-emerald-500/20">
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-lg font-bold text-emerald-500">{successRateDetails.resolved}</p>
            </div>
            <div className="p-3 rounded bg-background/50 border border-amber-500/20">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold text-amber-500">{successRateDetails.pending}</p>
            </div>
            <div className="p-3 rounded bg-background/50 border border-red-500/20">
              <p className="text-xs text-muted-foreground">Escalated</p>
              <p className="text-lg font-bold text-red-500">{successRateDetails.escalated}</p>
            </div>
            <div className="p-3 rounded bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground">First Response</p>
              <p className="text-lg font-bold text-foreground">{successRateDetails.avgFirstResponse}</p>
            </div>
            <div className="p-3 rounded bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground">Avg Resolution</p>
              <p className="text-lg font-bold text-foreground">{successRateDetails.avgResolution}</p>
            </div>
            <div className="p-3 rounded bg-background/50 border border-primary/20">
              <p className="text-xs text-muted-foreground">CSAT Score</p>
              <p className="text-lg font-bold text-primary">{successRateDetails.customerSatisfaction}</p>
            </div>
          </div>
        </div>
      )}

      {/* Common Patterns - with Expandable Details */}
      <div className="glass-card rounded-lg border border-border bg-card/70 p-4">
        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-primary" />
          Common Patterns & Resolution Strategies
        </h5>
        <div className="space-y-4">
          {data.commonPatterns.map((pattern, index) => (
            <div key={index} className="space-y-2">
              {/* Pattern Header - Clickable */}
              <div
                onClick={() => togglePattern(index)}
                className={`flex items-center justify-between cursor-pointer p-2 rounded transition-all ${
                  expandedPattern === index ? 'bg-primary/10' : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{pattern.pattern}</span>
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                    {pattern.frequency} tickets
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{pattern.percentage}%</span>
                  {expandedPattern === index ? (
                    <ChevronUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${pattern.percentage}%` }}
                />
              </div>

              {/* Expanded Pattern Details */}
              {expandedPattern === index && (
                <div className="animate-in slide-in-from-top-2 duration-200 space-y-3 mt-2 p-4 rounded-lg bg-background/70 border border-border/50">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-2 rounded bg-card/50 border border-border/30">
                      <p className="text-xs text-muted-foreground">Frequency</p>
                      <p className="text-sm font-bold text-foreground">{pattern.frequency} tickets</p>
                    </div>
                    <div className="p-2 rounded bg-card/50 border border-border/30">
                      <p className="text-xs text-muted-foreground">Percentage</p>
                      <p className="text-sm font-bold text-primary">{pattern.percentage}%</p>
                    </div>
                    <div className="p-2 rounded bg-card/50 border border-border/30">
                      <p className="text-xs text-muted-foreground">Avg Resolution</p>
                      <p className="text-sm font-bold text-foreground">{pattern.avgResolutionTime}</p>
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="text-sm font-bold text-emerald-500">98%</p>
                    </div>
                  </div>

                  {/* Typical Solution */}
                  <div className="p-3 rounded bg-primary/5 border border-primary/20">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Recommended Solution</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      {pattern.typicalSolution}
                    </p>
                  </div>

                  {/* Example Tickets */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Related Tickets</p>
                    <div className="flex flex-wrap gap-2">
                      {pattern.examples.map((example, exIndex) => (
                        <button
                          key={exIndex}
                          className="inline-flex items-center gap-1 text-xs text-primary bg-primary/20 px-3 py-1.5 rounded border border-primary/20 hover:bg-primary/30 hover:border-primary/40 transition-all"
                        >
                          <Ticket className="h-3 w-3" />
                          {example}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Steps */}
                  <div className="p-3 rounded bg-muted/30 border border-border/30">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Resolution Steps</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-foreground">
                      <li>Identify the authentication error in logs</li>
                      <li>Verify token expiration settings</li>
                      <li>Apply {pattern.typicalSolution.toLowerCase()}</li>
                      <li>Confirm resolution with customer</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Collapsed View - Basic Details */}
              {expandedPattern !== index && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 p-3 rounded bg-background/50 border border-border/50">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Avg Resolution Time</p>
                    <p className="text-sm font-semibold text-foreground">{pattern.avgResolutionTime}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Typical Solution</p>
                    <p className="text-sm text-foreground">{pattern.typicalSolution}</p>
                  </div>
                </div>
              )}

              {/* Examples - Always visible */}
              {expandedPattern !== index && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Examples:</span>
                  {pattern.examples.map((example, exIndex) => (
                    <span
                      key={exIndex}
                      className="inline-flex items-center gap-1 text-xs text-primary bg-primary/20 px-2 py-0.5 rounded border border-primary/20"
                    >
                      <Ticket className="h-3 w-3" />
                      {example}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Your Strengths */}
      <div className="glass-card rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-emerald-500" />
          Your Strengths
        </h5>
        <div className="space-y-2">
          {data.yourStrengths.map((strength, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{strength}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Opportunities */}
      {data.improvementOpportunities && data.improvementOpportunities.length > 0 && (
        <div className="glass-card rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <h5 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Improvement Opportunities
          </h5>
          <div className="space-y-2">
            {data.improvementOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Practices */}
      <div className="glass-card rounded-lg border border-border bg-card/70 p-4">
        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-primary" />
          Best Practices from Your Resolutions
        </h5>
        <div className="space-y-3">
          {data.bestPractices.map((practice, index) => (
            <div key={index} className="p-3 rounded border border-border/50 bg-background/50">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm font-medium text-foreground flex-1">{practice.practice}</p>
                <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded flex-shrink-0">
                  {practice.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-2 pt-2">
        <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium px-4 py-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/20 hover:border-primary/40 transition-all">
          <Target className="h-4 w-4" />
          Apply These Patterns
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium px-4 py-2 rounded bg-muted/20 hover:bg-muted/30 border border-border hover:border-border/80 transition-all">
          <TrendingUp className="h-4 w-4" />
          View Full Analytics
        </button>
      </div>
    </div>
  );
}
