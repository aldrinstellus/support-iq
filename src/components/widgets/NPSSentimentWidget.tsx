'use client';

import { useState } from 'react';
import {
  Smile,
  Meh,
  Frown,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  Building2,
  Phone,
  Mail,
  BarChart3,
  Target,
  MessageSquare,
  Clock,
  Award,
  Filter,
} from 'lucide-react';

type DrillDownType = 'promoters' | 'passives' | 'detractors' | 'positive' | 'neutral' | 'negative' | null;

interface NPSCustomer {
  id: string;
  name: string;
  npsScore: number;
  category: 'promoter' | 'passive' | 'detractor';
  sentiment: 'positive' | 'neutral' | 'negative';
  lastSurveyDate: string;
  responseRate: number;
  arr: string;
  csm: string;
  recentFeedback: string;
  feedbackThemes: string[];
  trendDirection: 'up' | 'down' | 'stable';
  previousScore: number;
}

interface NPSSentimentData {
  title: string;
  period: string;
  nps: {
    overall: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    responses: number;
    responseRate: number;
    promoters: number;
    passives: number;
    detractors: number;
  };
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    score: number;
    breakdown: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  trendingTopics: Array<{
    topic: string;
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    trend: 'up' | 'down' | 'stable';
  }>;
  customers: NPSCustomer[];
}

// Comprehensive mock data for NPS & Sentiment
const npsCustomerDetails: Record<string, {
  surveyHistory: Array<{ date: string; score: number; feedback: string }>;
  engagementMetrics: { emailOpenRate: number; loginFrequency: string; supportTickets: number; featureRequests: number };
  sentimentTrend: Array<{ month: string; score: number }>;
  keyContacts: Array<{ name: string; role: string; sentiment: 'positive' | 'neutral' | 'negative'; lastInteraction: string }>;
  feedbackCategories: Array<{ category: string; count: number; sentiment: 'positive' | 'neutral' | 'negative' }>;
  actionItems: Array<{ action: string; priority: 'high' | 'medium' | 'low'; status: 'pending' | 'in-progress' | 'completed' }>;
}> = {
  'NPS-001': {
    surveyHistory: [
      { date: '2026-01-15', score: 9, feedback: 'Excellent platform! The new analytics features are game-changing.' },
      { date: '2025-10-20', score: 9, feedback: 'Great support team, always responsive.' },
      { date: '2025-07-12', score: 8, feedback: 'Good product, would like more integrations.' },
    ],
    engagementMetrics: { emailOpenRate: 78, loginFrequency: 'Daily', supportTickets: 2, featureRequests: 5 },
    sentimentTrend: [
      { month: 'Oct', score: 72 },
      { month: 'Nov', score: 78 },
      { month: 'Dec', score: 82 },
      { month: 'Jan', score: 88 },
    ],
    keyContacts: [
      { name: 'Sarah Chen', role: 'VP Operations', sentiment: 'positive', lastInteraction: '2 days ago' },
      { name: 'Mike Johnson', role: 'IT Director', sentiment: 'positive', lastInteraction: '1 week ago' },
    ],
    feedbackCategories: [
      { category: 'Product Features', count: 8, sentiment: 'positive' },
      { category: 'Support Quality', count: 5, sentiment: 'positive' },
      { category: 'Pricing', count: 2, sentiment: 'neutral' },
    ],
    actionItems: [
      { action: 'Schedule quarterly business review', priority: 'medium', status: 'pending' },
      { action: 'Share product roadmap preview', priority: 'low', status: 'completed' },
    ],
  },
  'NPS-002': {
    surveyHistory: [
      { date: '2026-01-18', score: 10, feedback: 'Best decision we made this year! ROI exceeded expectations.' },
      { date: '2025-11-05', score: 9, feedback: 'The team loves the new dashboard.' },
      { date: '2025-08-22', score: 8, feedback: 'Solid platform with room for growth.' },
    ],
    engagementMetrics: { emailOpenRate: 85, loginFrequency: 'Daily', supportTickets: 1, featureRequests: 3 },
    sentimentTrend: [
      { month: 'Oct', score: 75 },
      { month: 'Nov', score: 80 },
      { month: 'Dec', score: 85 },
      { month: 'Jan', score: 92 },
    ],
    keyContacts: [
      { name: 'Jennifer Lee', role: 'CEO', sentiment: 'positive', lastInteraction: '3 days ago' },
      { name: 'David Park', role: 'CTO', sentiment: 'positive', lastInteraction: '1 day ago' },
    ],
    feedbackCategories: [
      { category: 'ROI/Value', count: 6, sentiment: 'positive' },
      { category: 'Ease of Use', count: 4, sentiment: 'positive' },
      { category: 'Performance', count: 3, sentiment: 'positive' },
    ],
    actionItems: [
      { action: 'Request case study participation', priority: 'high', status: 'in-progress' },
      { action: 'Discuss expansion opportunities', priority: 'medium', status: 'pending' },
    ],
  },
  'NPS-003': {
    surveyHistory: [
      { date: '2026-01-10', score: 7, feedback: 'Good product but onboarding was challenging.' },
      { date: '2025-10-15', score: 7, feedback: 'Would like more training resources.' },
      { date: '2025-07-30', score: 6, feedback: 'Implementation took longer than expected.' },
    ],
    engagementMetrics: { emailOpenRate: 52, loginFrequency: 'Weekly', supportTickets: 8, featureRequests: 2 },
    sentimentTrend: [
      { month: 'Oct', score: 55 },
      { month: 'Nov', score: 58 },
      { month: 'Dec', score: 60 },
      { month: 'Jan', score: 62 },
    ],
    keyContacts: [
      { name: 'Robert Wilson', role: 'Operations Manager', sentiment: 'neutral', lastInteraction: '5 days ago' },
      { name: 'Lisa Thompson', role: 'Team Lead', sentiment: 'neutral', lastInteraction: '2 weeks ago' },
    ],
    feedbackCategories: [
      { category: 'Onboarding', count: 5, sentiment: 'negative' },
      { category: 'Training', count: 4, sentiment: 'neutral' },
      { category: 'Core Features', count: 3, sentiment: 'positive' },
    ],
    actionItems: [
      { action: 'Schedule dedicated training session', priority: 'high', status: 'in-progress' },
      { action: 'Assign dedicated onboarding specialist', priority: 'high', status: 'pending' },
      { action: 'Follow up on support tickets', priority: 'medium', status: 'in-progress' },
    ],
  },
  'NPS-004': {
    surveyHistory: [
      { date: '2026-01-20', score: 4, feedback: 'Experiencing frequent downtime and slow performance.' },
      { date: '2025-11-10', score: 5, feedback: 'Support response times are too long.' },
      { date: '2025-08-15', score: 6, feedback: 'Missing critical features we were promised.' },
    ],
    engagementMetrics: { emailOpenRate: 35, loginFrequency: 'Rarely', supportTickets: 15, featureRequests: 0 },
    sentimentTrend: [
      { month: 'Oct', score: 48 },
      { month: 'Nov', score: 42 },
      { month: 'Dec', score: 38 },
      { month: 'Jan', score: 32 },
    ],
    keyContacts: [
      { name: 'James Anderson', role: 'VP Technology', sentiment: 'negative', lastInteraction: '1 day ago' },
      { name: 'Emily Davis', role: 'Project Manager', sentiment: 'negative', lastInteraction: '3 days ago' },
    ],
    feedbackCategories: [
      { category: 'Performance', count: 8, sentiment: 'negative' },
      { category: 'Support', count: 6, sentiment: 'negative' },
      { category: 'Missing Features', count: 4, sentiment: 'negative' },
    ],
    actionItems: [
      { action: 'Executive escalation call', priority: 'high', status: 'pending' },
      { action: 'Technical deep-dive on performance issues', priority: 'high', status: 'in-progress' },
      { action: 'Create retention action plan', priority: 'high', status: 'pending' },
      { action: 'Assign senior support engineer', priority: 'high', status: 'completed' },
    ],
  },
  'NPS-005': {
    surveyHistory: [
      { date: '2026-01-12', score: 8, feedback: 'Great improvements this quarter! Keep it up.' },
      { date: '2025-10-25', score: 7, feedback: 'Good progress on our feature requests.' },
      { date: '2025-07-18', score: 6, feedback: 'API documentation needs improvement.' },
    ],
    engagementMetrics: { emailOpenRate: 68, loginFrequency: 'Daily', supportTickets: 4, featureRequests: 8 },
    sentimentTrend: [
      { month: 'Oct', score: 58 },
      { month: 'Nov', score: 65 },
      { month: 'Dec', score: 72 },
      { month: 'Jan', score: 78 },
    ],
    keyContacts: [
      { name: 'Alex Martinez', role: 'Head of Engineering', sentiment: 'positive', lastInteraction: '4 days ago' },
      { name: 'Rachel Kim', role: 'Product Owner', sentiment: 'neutral', lastInteraction: '1 week ago' },
    ],
    feedbackCategories: [
      { category: 'Product Improvements', count: 5, sentiment: 'positive' },
      { category: 'API/Integration', count: 4, sentiment: 'neutral' },
      { category: 'Documentation', count: 3, sentiment: 'neutral' },
    ],
    actionItems: [
      { action: 'Share updated API documentation', priority: 'medium', status: 'completed' },
      { action: 'Discuss advanced integration options', priority: 'medium', status: 'pending' },
    ],
  },
  'NPS-006': {
    surveyHistory: [
      { date: '2026-01-08', score: 3, feedback: 'Considering alternatives. Too many issues unresolved.' },
      { date: '2025-10-30', score: 4, feedback: 'Data export still broken after 3 months.' },
      { date: '2025-08-05', score: 5, feedback: 'Support escalations not being handled properly.' },
    ],
    engagementMetrics: { emailOpenRate: 22, loginFrequency: 'Monthly', supportTickets: 22, featureRequests: 0 },
    sentimentTrend: [
      { month: 'Oct', score: 40 },
      { month: 'Nov', score: 35 },
      { month: 'Dec', score: 28 },
      { month: 'Jan', score: 22 },
    ],
    keyContacts: [
      { name: 'Chris Brown', role: 'CIO', sentiment: 'negative', lastInteraction: 'Declined meeting' },
      { name: 'Patricia White', role: 'Director of Ops', sentiment: 'negative', lastInteraction: '2 days ago' },
    ],
    feedbackCategories: [
      { category: 'Bugs/Issues', count: 12, sentiment: 'negative' },
      { category: 'Support Escalation', count: 8, sentiment: 'negative' },
      { category: 'Data Export', count: 5, sentiment: 'negative' },
    ],
    actionItems: [
      { action: 'CEO-to-CEO call', priority: 'high', status: 'pending' },
      { action: 'Dedicated engineering sprint for fixes', priority: 'high', status: 'in-progress' },
      { action: 'Service credit proposal', priority: 'high', status: 'pending' },
      { action: 'Weekly status updates to customer', priority: 'high', status: 'in-progress' },
    ],
  },
};

// Demo data
const npsSentimentDemoData: NPSSentimentData = {
  title: 'NPS & Sentiment Analysis',
  period: 'Last 30 Days',
  nps: {
    overall: 42,
    previous: 38,
    trend: 'up',
    responses: 156,
    responseRate: 68,
    promoters: 45,
    passives: 32,
    detractors: 23,
  },
  sentiment: {
    overall: 'neutral',
    score: 62,
    breakdown: {
      positive: 45,
      neutral: 32,
      negative: 23,
    },
  },
  trendingTopics: [
    { topic: 'Product Performance', mentions: 48, sentiment: 'positive', trend: 'up' },
    { topic: 'Support Response Time', mentions: 35, sentiment: 'neutral', trend: 'stable' },
    { topic: 'Feature Requests', mentions: 28, sentiment: 'neutral', trend: 'up' },
    { topic: 'Onboarding Experience', mentions: 22, sentiment: 'negative', trend: 'down' },
    { topic: 'API Integration', mentions: 18, sentiment: 'positive', trend: 'up' },
  ],
  customers: [
    {
      id: 'NPS-001',
      name: 'Acme Corporation',
      npsScore: 9,
      category: 'promoter',
      sentiment: 'positive',
      lastSurveyDate: '2026-01-15',
      responseRate: 85,
      arr: '$450,000',
      csm: 'Sarah Chen',
      recentFeedback: 'Excellent platform! The new analytics features are game-changing.',
      feedbackThemes: ['Analytics', 'Performance', 'Support'],
      trendDirection: 'up',
      previousScore: 8,
    },
    {
      id: 'NPS-002',
      name: 'TechFlow Industries',
      npsScore: 10,
      category: 'promoter',
      sentiment: 'positive',
      lastSurveyDate: '2026-01-18',
      responseRate: 92,
      arr: '$320,000',
      csm: 'Marcus Johnson',
      recentFeedback: 'Best decision we made this year! ROI exceeded expectations.',
      feedbackThemes: ['ROI', 'Ease of Use', 'Value'],
      trendDirection: 'up',
      previousScore: 9,
    },
    {
      id: 'NPS-003',
      name: 'Global Solutions Ltd',
      npsScore: 7,
      category: 'passive',
      sentiment: 'neutral',
      lastSurveyDate: '2026-01-10',
      responseRate: 65,
      arr: '$275,000',
      csm: 'Emily Rodriguez',
      recentFeedback: 'Good product but onboarding was challenging.',
      feedbackThemes: ['Onboarding', 'Training', 'Documentation'],
      trendDirection: 'stable',
      previousScore: 7,
    },
    {
      id: 'NPS-004',
      name: 'DataDrive Systems',
      npsScore: 4,
      category: 'detractor',
      sentiment: 'negative',
      lastSurveyDate: '2026-01-20',
      responseRate: 45,
      arr: '$180,000',
      csm: 'David Park',
      recentFeedback: 'Experiencing frequent downtime and slow performance.',
      feedbackThemes: ['Performance', 'Downtime', 'Support'],
      trendDirection: 'down',
      previousScore: 5,
    },
    {
      id: 'NPS-005',
      name: 'Innovate Inc',
      npsScore: 8,
      category: 'passive',
      sentiment: 'positive',
      lastSurveyDate: '2026-01-12',
      responseRate: 78,
      arr: '$380,000',
      csm: 'Aisha Williams',
      recentFeedback: 'Great improvements this quarter! Keep it up.',
      feedbackThemes: ['Improvements', 'Features', 'API'],
      trendDirection: 'up',
      previousScore: 6,
    },
    {
      id: 'NPS-006',
      name: 'RetailMax Corp',
      npsScore: 3,
      category: 'detractor',
      sentiment: 'negative',
      lastSurveyDate: '2026-01-08',
      responseRate: 35,
      arr: '$520,000',
      csm: 'James Taylor',
      recentFeedback: 'Considering alternatives. Too many issues unresolved.',
      feedbackThemes: ['Issues', 'Support', 'Reliability'],
      trendDirection: 'down',
      previousScore: 4,
    },
  ],
};

export function NPSSentimentWidget({ data }: { data?: NPSSentimentData }) {
  const [activeDrillDown, setActiveDrillDown] = useState<DrillDownType>(null);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const widgetData = data || npsSentimentDemoData;

  const sentimentConfig = {
    positive: { icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
    neutral: { icon: Meh, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
    negative: { icon: Frown, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  };

  const categoryConfig = {
    promoter: { label: 'Promoter', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
    passive: { label: 'Passive', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
    detractor: { label: 'Detractor', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  };

  const getFilteredCustomers = () => {
    if (!activeDrillDown) return widgetData.customers;

    switch (activeDrillDown) {
      case 'promoters':
        return widgetData.customers.filter(c => c.category === 'promoter');
      case 'passives':
        return widgetData.customers.filter(c => c.category === 'passive');
      case 'detractors':
        return widgetData.customers.filter(c => c.category === 'detractor');
      case 'positive':
        return widgetData.customers.filter(c => c.sentiment === 'positive');
      case 'neutral':
        return widgetData.customers.filter(c => c.sentiment === 'neutral');
      case 'negative':
        return widgetData.customers.filter(c => c.sentiment === 'negative');
      default:
        return widgetData.customers;
    }
  };

  const getDrillDownTitle = () => {
    switch (activeDrillDown) {
      case 'promoters': return 'Promoters (Score 9-10)';
      case 'passives': return 'Passives (Score 7-8)';
      case 'detractors': return 'Detractors (Score 0-6)';
      case 'positive': return 'Positive Sentiment';
      case 'neutral': return 'Neutral Sentiment';
      case 'negative': return 'Negative Sentiment';
      default: return 'All Customers';
    }
  };

  const filteredCustomers = getFilteredCustomers();
  const npsChange = widgetData.nps.overall - widgetData.nps.previous;

  return (
    <div className="space-y-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {widgetData.title}
          </h3>
          <p className="text-sm text-muted-foreground">{widgetData.period} | {widgetData.nps.responses} responses</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{widgetData.nps.responseRate}%</div>
          <div className="text-xs text-muted-foreground">Response Rate</div>
        </div>
      </div>

      {/* NPS Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-lg border border-border bg-card/70 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">NPS Score</div>
              <div className="flex items-center gap-2">
                <span className={`text-4xl font-bold ${widgetData.nps.overall >= 50 ? 'text-emerald-400' : widgetData.nps.overall >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {widgetData.nps.overall}
                </span>
                <div className={`flex items-center gap-1 text-sm ${npsChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {npsChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {npsChange >= 0 ? '+' : ''}{npsChange}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Previous: {widgetData.nps.previous}</div>
            </div>
            <Target className="h-10 w-10 text-primary/50" />
          </div>

          {/* NPS Distribution */}
          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setActiveDrillDown(activeDrillDown === 'promoters' ? null : 'promoters')}
            >
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-foreground">Promoters</span>
                {activeDrillDown === 'promoters' && <ChevronUp className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-400">{widgetData.nps.promoters}%</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${widgetData.nps.promoters}%` }} />
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setActiveDrillDown(activeDrillDown === 'passives' ? null : 'passives')}
            >
              <div className="flex items-center gap-2">
                <Meh className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-foreground">Passives</span>
                {activeDrillDown === 'passives' && <ChevronUp className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-400">{widgetData.nps.passives}%</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${widgetData.nps.passives}%` }} />
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setActiveDrillDown(activeDrillDown === 'detractors' ? null : 'detractors')}
            >
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-red-400" />
                <span className="text-sm text-foreground">Detractors</span>
                {activeDrillDown === 'detractors' && <ChevronUp className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-red-400">{widgetData.nps.detractors}%</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${widgetData.nps.detractors}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Card */}
        <div className="glass-card rounded-lg border border-border bg-card/70 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Overall Sentiment</div>
              <div className="flex items-center gap-2">
                {(() => {
                  const config = sentimentConfig[widgetData.sentiment.overall];
                  const Icon = config.icon;
                  return (
                    <>
                      <Icon className={`h-8 w-8 ${config.color}`} />
                      <span className={`text-2xl font-bold capitalize ${config.color}`}>{widgetData.sentiment.overall}</span>
                    </>
                  );
                })()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Score: {widgetData.sentiment.score}%</div>
            </div>
            <MessageCircle className="h-10 w-10 text-primary/50" />
          </div>

          {/* Sentiment Distribution */}
          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setActiveDrillDown(activeDrillDown === 'positive' ? null : 'positive')}
            >
              <div className="flex items-center gap-2">
                <Smile className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-foreground">Positive</span>
                {activeDrillDown === 'positive' && <ChevronUp className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-400">{widgetData.sentiment.breakdown.positive}%</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${widgetData.sentiment.breakdown.positive}%` }} />
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setActiveDrillDown(activeDrillDown === 'neutral' ? null : 'neutral')}
            >
              <div className="flex items-center gap-2">
                <Meh className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-foreground">Neutral</span>
                {activeDrillDown === 'neutral' && <ChevronUp className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-400">{widgetData.sentiment.breakdown.neutral}%</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${widgetData.sentiment.breakdown.neutral}%` }} />
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setActiveDrillDown(activeDrillDown === 'negative' ? null : 'negative')}
            >
              <div className="flex items-center gap-2">
                <Frown className="h-4 w-4 text-red-400" />
                <span className="text-sm text-foreground">Negative</span>
                {activeDrillDown === 'negative' && <ChevronUp className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-red-400">{widgetData.sentiment.breakdown.negative}%</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${widgetData.sentiment.breakdown.negative}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md">
        <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trending Feedback Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {widgetData.trendingTopics.map((topic, i) => {
            const config = sentimentConfig[topic.sentiment];
            return (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.border} ${config.bg} text-sm`}
              >
                <span className="text-foreground">{topic.topic}</span>
                <span className={`font-semibold ${config.color}`}>{topic.mentions}</span>
                {topic.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                {topic.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-400" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drill-down Panel */}
      {activeDrillDown && (
        <div className="glass-card rounded-lg border border-primary/30 bg-primary/5 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              {getDrillDownTitle()}
            </h5>
            <button
              onClick={() => setActiveDrillDown(null)}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-2">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${categoryConfig[customer.category].bg}`}>
                    <span className={`text-sm font-bold ${categoryConfig[customer.category].color}`}>{customer.npsScore}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.id} | {customer.arr}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${sentimentConfig[customer.sentiment].bg} ${sentimentConfig[customer.sentiment].color}`}>
                    {customer.sentiment}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${categoryConfig[customer.category].bg} ${categoryConfig[customer.category].color}`}>
                    {categoryConfig[customer.category].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer List with Drill-down */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Customer Feedback Details
        </h4>
        {widgetData.customers.map((customer) => {
          const catConfig = categoryConfig[customer.category];
          const sentConfig = sentimentConfig[customer.sentiment];
          const isExpanded = expandedCustomer === customer.id;
          const details = npsCustomerDetails[customer.id];

          return (
            <div
              key={customer.id}
              className={`glass-card rounded-lg border ${catConfig.border} bg-card/70 backdrop-blur-md overflow-hidden transition-all duration-300`}
            >
              {/* Customer Header */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setExpandedCustomer(isExpanded ? null : customer.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${catConfig.bg} border-2 ${catConfig.border}`}>
                      <span className={`text-lg font-bold ${catConfig.color}`}>{customer.npsScore}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{customer.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${catConfig.bg} ${catConfig.color}`}>
                          {catConfig.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${sentConfig.bg} ${sentConfig.color}`}>
                          {customer.sentiment}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {customer.id} | CSM: {customer.csm} | {customer.arr}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {customer.trendDirection === 'up' && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                      {customer.trendDirection === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                      <span className="text-xs text-muted-foreground">
                        Previous: {customer.previousScore}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {customer.lastSurveyDate}
                    </div>
                  </div>
                </div>

                {/* Recent Feedback Preview */}
                <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground italic">&quot;{customer.recentFeedback}&quot;</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customer.feedbackThemes.map((theme, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && details && (
                <div className="border-t border-border/50 p-4 bg-muted/10 space-y-4">
                  {/* Survey History */}
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Survey History
                    </h5>
                    <div className="space-y-2">
                      {details.surveyHistory.map((survey, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-card/50">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            survey.score >= 9 ? 'bg-emerald-500/20 text-emerald-400' :
                            survey.score >= 7 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            <span className="text-sm font-bold">{survey.score}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground">{survey.date}</div>
                            <p className="text-sm text-foreground">{survey.feedback}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Engagement Metrics & Sentiment Trend */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Engagement Metrics
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-card/50 text-center">
                          <div className="text-lg font-bold text-foreground">{details.engagementMetrics.emailOpenRate}%</div>
                          <div className="text-xs text-muted-foreground">Email Open Rate</div>
                        </div>
                        <div className="p-2 rounded-lg bg-card/50 text-center">
                          <div className="text-lg font-bold text-foreground">{details.engagementMetrics.loginFrequency}</div>
                          <div className="text-xs text-muted-foreground">Login Frequency</div>
                        </div>
                        <div className="p-2 rounded-lg bg-card/50 text-center">
                          <div className="text-lg font-bold text-foreground">{details.engagementMetrics.supportTickets}</div>
                          <div className="text-xs text-muted-foreground">Support Tickets</div>
                        </div>
                        <div className="p-2 rounded-lg bg-card/50 text-center">
                          <div className="text-lg font-bold text-foreground">{details.engagementMetrics.featureRequests}</div>
                          <div className="text-xs text-muted-foreground">Feature Requests</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Sentiment Trend
                      </h5>
                      <div className="flex items-end gap-2 h-20">
                        {details.sentimentTrend.map((point, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div
                              className={`w-full rounded-t ${
                                point.score >= 70 ? 'bg-emerald-500' :
                                point.score >= 50 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ height: `${point.score}%` }}
                            />
                            <div className="text-xs text-muted-foreground mt-1">{point.month}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Contacts */}
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Key Contacts
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {details.keyContacts.map((contact, i) => {
                        const contactSentConfig = sentimentConfig[contact.sentiment];
                        return (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-card/50">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${contactSentConfig.bg}`}>
                              <Building2 className={`h-4 w-4 ${contactSentConfig.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-foreground">{contact.name}</div>
                              <div className="text-xs text-muted-foreground">{contact.role}</div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${contactSentConfig.bg} ${contactSentConfig.color}`}>
                                {contact.sentiment}
                              </span>
                              <div className="text-xs text-muted-foreground mt-1">{contact.lastInteraction}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback Categories */}
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      Feedback Categories
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {details.feedbackCategories.map((cat, i) => {
                        const catSentConfig = sentimentConfig[cat.sentiment];
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${catSentConfig.border} ${catSentConfig.bg}`}
                          >
                            <span className="text-sm text-foreground">{cat.category}</span>
                            <span className={`font-semibold ${catSentConfig.color}`}>{cat.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Items */}
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Recommended Actions
                    </h5>
                    <div className="space-y-2">
                      {details.actionItems.map((action, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-card/50">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              action.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {action.priority}
                            </span>
                            <span className="text-sm text-foreground">{action.action}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            action.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                            action.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {action.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">
                      <Phone className="h-4 w-4" />
                      Schedule Call
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">
                      <Mail className="h-4 w-4" />
                      Send Follow-up
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">
                      <Award className="h-4 w-4" />
                      Request Testimonial
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">
                      <AlertTriangle className="h-4 w-4" />
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
