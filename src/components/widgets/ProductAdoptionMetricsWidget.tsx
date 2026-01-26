'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Clock,
  Target,
  Zap,
  BookOpen,
  Phone,
  Mail,
  Calendar,
  FileText,
  PlayCircle,
  Award,
} from 'lucide-react';
import type { ProductAdoptionMetricsData } from '@/types/widget';

type DrillDownType = 'avg-adoption' | 'declining' | 'high-risk' | 'improving' | null;

export function ProductAdoptionMetricsWidget({ data }: { data: ProductAdoptionMetricsData }) {
  const [activeDrillDown, setActiveDrillDown] = useState<DrillDownType>(null);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const toggleDrillDown = (type: DrillDownType) => {
    setActiveDrillDown(activeDrillDown === type ? null : type);
  };

  const toggleCustomerExpand = (customerId: string) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  // Mock detailed data for drill-downs
  const customerDetails: Record<string, {
    featureBreakdown: { feature: string; adoption: number; sessions: number; trend: 'up' | 'down' | 'stable'; lastUsed: string }[];
    userEngagement: { segment: string; activeUsers: number; totalUsers: number; avgSessionTime: string; trend: 'up' | 'down' | 'stable' }[];
    trainingStatus: { module: string; completionRate: number; avgScore: number; status: 'completed' | 'in-progress' | 'not-started' }[];
    sessionAnalytics: { metric: string; current: string; previous: string; change: string }[];
    keyContacts: { name: string; role: string; engagement: 'high' | 'medium' | 'low'; lastActive: string }[];
    actionItems: string[];
    successMetrics: string[];
    riskFactors: string[];
  }> = {
    'CUST-2001': {
      featureBreakdown: [
        { feature: 'Dashboard', adoption: 92, sessions: 1250, trend: 'up', lastUsed: '2 hours ago' },
        { feature: 'Reports', adoption: 78, sessions: 890, trend: 'stable', lastUsed: '1 day ago' },
        { feature: 'Analytics', adoption: 65, sessions: 420, trend: 'up', lastUsed: '3 hours ago' },
        { feature: 'Integrations', adoption: 45, sessions: 180, trend: 'down', lastUsed: '1 week ago' },
        { feature: 'API', adoption: 88, sessions: 2100, trend: 'up', lastUsed: '30 min ago' },
      ],
      userEngagement: [
        { segment: 'Power Users', activeUsers: 15, totalUsers: 18, avgSessionTime: '45 min', trend: 'up' },
        { segment: 'Regular Users', activeUsers: 28, totalUsers: 35, avgSessionTime: '22 min', trend: 'stable' },
        { segment: 'Occasional Users', activeUsers: 12, totalUsers: 25, avgSessionTime: '8 min', trend: 'down' },
        { segment: 'New Users', activeUsers: 8, totalUsers: 10, avgSessionTime: '15 min', trend: 'up' },
      ],
      trainingStatus: [
        { module: 'Getting Started', completionRate: 100, avgScore: 92, status: 'completed' },
        { module: 'Advanced Features', completionRate: 75, avgScore: 85, status: 'in-progress' },
        { module: 'API Training', completionRate: 60, avgScore: 78, status: 'in-progress' },
        { module: 'Best Practices', completionRate: 0, avgScore: 0, status: 'not-started' },
      ],
      sessionAnalytics: [
        { metric: 'Daily Active Users', current: '63', previous: '58', change: '+8.6%' },
        { metric: 'Avg Session Duration', current: '28 min', previous: '24 min', change: '+16.7%' },
        { metric: 'Feature Discovery', current: '4.2', previous: '3.8', change: '+10.5%' },
        { metric: 'Return Rate', current: '78%', previous: '72%', change: '+8.3%' },
      ],
      keyContacts: [
        { name: 'Sarah Mitchell', role: 'Product Champion', engagement: 'high', lastActive: '2 hours ago' },
        { name: 'James Wong', role: 'IT Admin', engagement: 'high', lastActive: '1 day ago' },
        { name: 'Emily Davis', role: 'Team Lead', engagement: 'medium', lastActive: '3 days ago' },
      ],
      actionItems: ['Schedule advanced training session', 'Enable API access for more users', 'Review integration setup'],
      successMetrics: ['High API adoption', 'Strong power user engagement', 'Improving session times'],
      riskFactors: ['Integration usage declining', 'Occasional users dropping off'],
    },
    'CUST-2002': {
      featureBreakdown: [
        { feature: 'Dashboard', adoption: 45, sessions: 320, trend: 'down', lastUsed: '3 days ago' },
        { feature: 'Reports', adoption: 35, sessions: 180, trend: 'down', lastUsed: '1 week ago' },
        { feature: 'Analytics', adoption: 20, sessions: 85, trend: 'down', lastUsed: '2 weeks ago' },
        { feature: 'Integrations', adoption: 15, sessions: 42, trend: 'down', lastUsed: '3 weeks ago' },
        { feature: 'API', adoption: 10, sessions: 28, trend: 'stable', lastUsed: '1 month ago' },
      ],
      userEngagement: [
        { segment: 'Power Users', activeUsers: 2, totalUsers: 8, avgSessionTime: '15 min', trend: 'down' },
        { segment: 'Regular Users', activeUsers: 8, totalUsers: 20, avgSessionTime: '8 min', trend: 'down' },
        { segment: 'Occasional Users', activeUsers: 5, totalUsers: 18, avgSessionTime: '3 min', trend: 'down' },
        { segment: 'New Users', activeUsers: 0, totalUsers: 4, avgSessionTime: '0 min', trend: 'down' },
      ],
      trainingStatus: [
        { module: 'Getting Started', completionRate: 40, avgScore: 65, status: 'in-progress' },
        { module: 'Advanced Features', completionRate: 10, avgScore: 55, status: 'in-progress' },
        { module: 'API Training', completionRate: 0, avgScore: 0, status: 'not-started' },
        { module: 'Best Practices', completionRate: 0, avgScore: 0, status: 'not-started' },
      ],
      sessionAnalytics: [
        { metric: 'Daily Active Users', current: '15', previous: '28', change: '-46.4%' },
        { metric: 'Avg Session Duration', current: '8 min', previous: '18 min', change: '-55.6%' },
        { metric: 'Feature Discovery', current: '1.8', previous: '3.2', change: '-43.8%' },
        { metric: 'Return Rate', current: '35%', previous: '58%', change: '-39.7%' },
      ],
      keyContacts: [
        { name: 'Mike Johnson', role: 'Account Owner', engagement: 'low', lastActive: '2 weeks ago' },
        { name: 'Lisa Chen', role: 'IT Admin', engagement: 'low', lastActive: '3 weeks ago' },
      ],
      actionItems: ['Urgent: Schedule executive check-in', 'Assign dedicated CSM', 'Offer re-onboarding program', 'Investigate root cause of drop-off'],
      successMetrics: [],
      riskFactors: ['Dramatic decline in all metrics', 'Key users disengaged', 'Training incomplete', 'No new user activation'],
    },
    'CUST-2003': {
      featureBreakdown: [
        { feature: 'Dashboard', adoption: 85, sessions: 980, trend: 'stable', lastUsed: '1 hour ago' },
        { feature: 'Reports', adoption: 72, sessions: 650, trend: 'stable', lastUsed: '4 hours ago' },
        { feature: 'Analytics', adoption: 68, sessions: 520, trend: 'up', lastUsed: '2 hours ago' },
        { feature: 'Integrations', adoption: 55, sessions: 280, trend: 'stable', lastUsed: '1 day ago' },
        { feature: 'API', adoption: 40, sessions: 150, trend: 'up', lastUsed: '2 days ago' },
      ],
      userEngagement: [
        { segment: 'Power Users', activeUsers: 12, totalUsers: 15, avgSessionTime: '35 min', trend: 'stable' },
        { segment: 'Regular Users', activeUsers: 22, totalUsers: 28, avgSessionTime: '18 min', trend: 'stable' },
        { segment: 'Occasional Users', activeUsers: 10, totalUsers: 15, avgSessionTime: '6 min', trend: 'stable' },
        { segment: 'New Users', activeUsers: 5, totalUsers: 7, avgSessionTime: '12 min', trend: 'up' },
      ],
      trainingStatus: [
        { module: 'Getting Started', completionRate: 95, avgScore: 88, status: 'completed' },
        { module: 'Advanced Features', completionRate: 70, avgScore: 82, status: 'in-progress' },
        { module: 'API Training', completionRate: 45, avgScore: 75, status: 'in-progress' },
        { module: 'Best Practices', completionRate: 30, avgScore: 80, status: 'in-progress' },
      ],
      sessionAnalytics: [
        { metric: 'Daily Active Users', current: '49', previous: '47', change: '+4.3%' },
        { metric: 'Avg Session Duration', current: '22 min', previous: '21 min', change: '+4.8%' },
        { metric: 'Feature Discovery', current: '3.5', previous: '3.4', change: '+2.9%' },
        { metric: 'Return Rate', current: '72%', previous: '70%', change: '+2.9%' },
      ],
      keyContacts: [
        { name: 'David Park', role: 'Product Champion', engagement: 'high', lastActive: '1 hour ago' },
        { name: 'Amy Wilson', role: 'Team Lead', engagement: 'medium', lastActive: '1 day ago' },
        { name: 'Robert Taylor', role: 'IT Admin', engagement: 'medium', lastActive: '2 days ago' },
      ],
      actionItems: ['Continue API training rollout', 'Promote best practices module', 'Share success stories'],
      successMetrics: ['Stable engagement across segments', 'Good training progression', 'Consistent usage patterns'],
      riskFactors: ['API adoption could be higher', 'Some occasional users at risk'],
    },
    'CUST-2004': {
      featureBreakdown: [
        { feature: 'Dashboard', adoption: 95, sessions: 1580, trend: 'up', lastUsed: '30 min ago' },
        { feature: 'Reports', adoption: 88, sessions: 1200, trend: 'up', lastUsed: '1 hour ago' },
        { feature: 'Analytics', adoption: 82, sessions: 950, trend: 'up', lastUsed: '2 hours ago' },
        { feature: 'Integrations', adoption: 75, sessions: 680, trend: 'up', lastUsed: '4 hours ago' },
        { feature: 'API', adoption: 92, sessions: 2800, trend: 'up', lastUsed: '15 min ago' },
      ],
      userEngagement: [
        { segment: 'Power Users', activeUsers: 25, totalUsers: 28, avgSessionTime: '55 min', trend: 'up' },
        { segment: 'Regular Users', activeUsers: 42, totalUsers: 45, avgSessionTime: '32 min', trend: 'up' },
        { segment: 'Occasional Users', activeUsers: 18, totalUsers: 22, avgSessionTime: '15 min', trend: 'up' },
        { segment: 'New Users', activeUsers: 12, totalUsers: 12, avgSessionTime: '25 min', trend: 'up' },
      ],
      trainingStatus: [
        { module: 'Getting Started', completionRate: 100, avgScore: 95, status: 'completed' },
        { module: 'Advanced Features', completionRate: 95, avgScore: 92, status: 'completed' },
        { module: 'API Training', completionRate: 88, avgScore: 90, status: 'completed' },
        { module: 'Best Practices', completionRate: 80, avgScore: 88, status: 'in-progress' },
      ],
      sessionAnalytics: [
        { metric: 'Daily Active Users', current: '97', previous: '85', change: '+14.1%' },
        { metric: 'Avg Session Duration', current: '38 min', previous: '32 min', change: '+18.8%' },
        { metric: 'Feature Discovery', current: '4.8', previous: '4.2', change: '+14.3%' },
        { metric: 'Return Rate', current: '92%', previous: '85%', change: '+8.2%' },
      ],
      keyContacts: [
        { name: 'Jennifer Lee', role: 'Executive Sponsor', engagement: 'high', lastActive: '1 hour ago' },
        { name: 'Chris Martin', role: 'Product Champion', engagement: 'high', lastActive: '30 min ago' },
        { name: 'Nicole Brown', role: 'IT Admin', engagement: 'high', lastActive: '2 hours ago' },
        { name: 'Alex Kim', role: 'Team Lead', engagement: 'high', lastActive: '3 hours ago' },
      ],
      actionItems: ['Nominate for customer success story', 'Invite to beta program', 'Schedule reference call'],
      successMetrics: ['Exceptional adoption across all features', '100% new user activation', 'Executive engagement', 'All training completed'],
      riskFactors: [],
    },
  };

  const trendColors = {
    improving: 'border-l-success bg-emerald-500/20',
    stable: 'border-l-chart-3 bg-lime-500/20',
    declining: 'border-l-destructive bg-red-500/20',
  };

  const trendTextColors = {
    improving: 'text-success',
    stable: 'text-chart-3',
    declining: 'text-destructive',
  };

  const trendIcons = {
    improving: <TrendingUp className="h-4 w-4 text-success" />,
    stable: <Minus className="h-4 w-4 text-chart-3" />,
    declining: <TrendingDown className="h-4 w-4 text-destructive" />,
  };

  const riskLevelColors = {
    low: 'text-success',
    medium: 'text-chart-3',
    high: 'text-chart-4',
    critical: 'text-destructive',
  };

  const riskLevelIcons = {
    low: <CheckCircle className="h-4 w-4 text-success" />,
    medium: <AlertCircle className="h-4 w-4 text-chart-3" />,
    high: <AlertTriangle className="h-4 w-4 text-chart-4" />,
    critical: <XCircle className="h-4 w-4 text-destructive" />,
  };

  const getAdoptionColor = (rate: number) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-chart-3';
    if (rate >= 40) return 'text-chart-4';
    return 'text-destructive';
  };

  const getAdoptionBgColor = (rate: number) => {
    if (rate >= 80) return 'bg-success';
    if (rate >= 60) return 'bg-chart-3';
    if (rate >= 40) return 'bg-chart-4';
    return 'bg-destructive';
  };

  const FeatureTrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success bg-emerald-500/20';
      case 'in-progress': return 'text-chart-4 bg-amber-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'text-success';
      case 'medium': return 'text-chart-4';
      default: return 'text-destructive';
    }
  };

  // Calculate summary stats
  const decliningCount = data.metrics.filter(m => m.trend === 'declining').length;
  const criticalCount = data.metrics.filter(m => m.riskLevel === 'critical' || m.riskLevel === 'high').length;
  const improvingCount = data.metrics.filter(m => m.trend === 'improving').length;
  const avgAdoption = Math.round(data.metrics.reduce((sum, m) => sum + m.currentAdoptionRate, 0) / data.metrics.length);

  // Filter customers based on drill-down
  const getFilteredCustomers = () => {
    switch (activeDrillDown) {
      case 'declining':
        return data.metrics.filter(m => m.trend === 'declining');
      case 'high-risk':
        return data.metrics.filter(m => m.riskLevel === 'critical' || m.riskLevel === 'high');
      case 'improving':
        return data.metrics.filter(m => m.trend === 'improving');
      default:
        return data.metrics;
    }
  };

  const filteredCustomers = getFilteredCustomers();

  return (
    <div className="space-y-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">
            {data.customersTracked} customers tracked | {data.period}
          </p>
        </div>
      </div>

      {/* Summary Stats - Clickable Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => toggleDrillDown('avg-adoption')}
          className={`glass-card rounded-lg border border-chart-3/30 bg-lime-500/20 p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${activeDrillDown === 'avg-adoption' ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">Avg Adoption Rate</div>
            {activeDrillDown === 'avg-adoption' ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className={`text-2xl font-bold ${getAdoptionColor(avgAdoption)}`}>{avgAdoption}%</div>
          <div className="text-xs text-muted-foreground">Click for details</div>
        </div>
        <div
          onClick={() => toggleDrillDown('declining')}
          className={`glass-card rounded-lg border border-destructive/30 bg-red-500/20 p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${activeDrillDown === 'declining' ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">Declining Adoption</div>
            {activeDrillDown === 'declining' ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className="text-2xl font-bold text-destructive">{decliningCount}</div>
          <div className="text-xs text-muted-foreground">Click for details</div>
        </div>
        <div
          onClick={() => toggleDrillDown('high-risk')}
          className={`glass-card rounded-lg border border-chart-4/30 bg-amber-500/20 p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${activeDrillDown === 'high-risk' ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">High Risk Accounts</div>
            {activeDrillDown === 'high-risk' ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className="text-2xl font-bold text-chart-4">{criticalCount}</div>
          <div className="text-xs text-muted-foreground">Click for details</div>
        </div>
        <div
          onClick={() => toggleDrillDown('improving')}
          className={`glass-card rounded-lg border border-success/30 bg-emerald-500/20 p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${activeDrillDown === 'improving' ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">Improving</div>
            {activeDrillDown === 'improving' ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className="text-2xl font-bold text-success">{improvingCount}</div>
          <div className="text-xs text-muted-foreground">Click for details</div>
        </div>
      </div>

      {/* Drill-Down Panel */}
      {activeDrillDown && (
        <div className="glass-card rounded-lg border border-border p-4 bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-foreground flex items-center gap-2">
              {activeDrillDown === 'declining' && <><TrendingDown className="h-4 w-4 text-destructive" /> Customers with Declining Adoption</>}
              {activeDrillDown === 'high-risk' && <><AlertTriangle className="h-4 w-4 text-chart-4" /> High Risk Accounts</>}
              {activeDrillDown === 'improving' && <><TrendingUp className="h-4 w-4 text-success" /> Customers with Improving Adoption</>}
              {activeDrillDown === 'avg-adoption' && <><BarChart3 className="h-4 w-4 text-chart-3" /> Overall Adoption Overview</>}
            </h5>
            <button onClick={() => setActiveDrillDown(null)} className="p-1 hover:bg-muted rounded">
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-2">
            {filteredCustomers.map((customer) => (
              <div key={customer.customerId} className="flex items-center justify-between p-3 rounded bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${customer.trend === 'declining' ? 'bg-destructive' : customer.trend === 'improving' ? 'bg-success' : 'bg-chart-3'}`} />
                  <div>
                    <div className="font-medium text-foreground">{customer.customerName}</div>
                    <div className="text-xs text-muted-foreground">{customer.customerId} | {customer.activeUsers}/{customer.totalLicenses} active users</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getAdoptionColor(customer.currentAdoptionRate)}`}>{customer.currentAdoptionRate}%</div>
                  <div className={`text-xs ${trendTextColors[customer.trend]}`}>
                    {customer.trendPercentage > 0 ? '+' : ''}{customer.trendPercentage}% {customer.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Adoption Cards */}
      <div className="space-y-3">
        {data.metrics.map((customer) => {
          const details = customerDetails[customer.customerId];
          const isExpanded = expandedCustomer === customer.customerId;

          return (
            <div key={customer.customerId}>
              {/* Main Card - Clickable */}
              <div
                onClick={() => toggleCustomerExpand(customer.customerId)}
                className={`border-l-4 ${trendColors[customer.trend]} rounded-r glass-card p-4 backdrop-blur-md transition-all duration-200 hover:shadow-md cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  {/* Customer Name & Trend */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-semibold text-foreground">{customer.customerName}</h4>
                      <span className={`flex items-center gap-1 text-xs font-semibold uppercase px-2 py-1 rounded ${trendTextColors[customer.trend]} border`}>
                        {trendIcons[customer.trend]}
                        {customer.trend} ({customer.trendPercentage > 0 ? '+' : ''}{customer.trendPercentage}%)
                      </span>
                      <span className={`flex items-center gap-1 text-xs font-semibold uppercase px-2 py-1 rounded ${riskLevelColors[customer.riskLevel]} border`}>
                        {riskLevelIcons[customer.riskLevel]}
                        {customer.riskLevel} risk
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{customer.customerId}</span>
                      <span className="text-xs">Click to expand</span>
                    </div>
                  </div>

                  {/* Adoption Rate */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-2 justify-end">
                      <div className={`text-3xl font-bold ${getAdoptionColor(customer.currentAdoptionRate)}`}>
                        {customer.currentAdoptionRate}%
                      </div>
                      {trendIcons[customer.trend]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Previous: {customer.previousAdoptionRate}%
                    </div>
                  </div>
                </div>

                {/* Usage Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 pb-3 border-b border-border/50">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="h-3 w-3 text-chart-3" />
                      <span className="text-xs text-muted-foreground">Logins/Month</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{customer.loginsPerMonth}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground">Active Users</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {customer.activeUsers} / {customer.totalLicenses}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="h-3 w-3 text-success" />
                      <span className="text-xs text-muted-foreground">Utilization</span>
                    </div>
                    <div className={`text-sm font-semibold ${getAdoptionColor(customer.utilizationRate)}`}>
                      {customer.utilizationRate}%
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3 text-chart-4" />
                      <span className="text-xs text-muted-foreground">Risk Level</span>
                    </div>
                    <div className={`text-sm font-semibold capitalize ${riskLevelColors[customer.riskLevel]}`}>
                      {customer.riskLevel}
                    </div>
                  </div>
                </div>

                {/* Feature Usage */}
                <div className="mb-3 pb-3 border-b border-border/50">
                  <div className="text-xs text-muted-foreground mb-2">Feature Usage:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {customer.featureUsage.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <span className="text-xs text-muted-foreground">{feature.feature}</span>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-semibold ${getAdoptionColor(feature.usageRate)}`}>
                            {feature.usageRate}%
                          </span>
                          <FeatureTrendIcon trend={feature.trend} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {customer.recommendations.length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Recommendations:</div>
                    <div className="flex flex-wrap gap-2">
                      {customer.recommendations.map((rec, recIdx) => (
                        <span key={recIdx} className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Detail View */}
              {isExpanded && details && (
                <div className="mt-2 p-4 rounded-lg border border-border bg-card/80 backdrop-blur-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Feature Breakdown */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Feature Breakdown</span>
                      </div>
                      <div className="space-y-2">
                        {details.featureBreakdown.map((feature, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{feature.feature}</span>
                              <span className="flex items-center gap-1">
                                {feature.adoption}%
                                <FeatureTrendIcon trend={feature.trend} />
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getAdoptionBgColor(feature.adoption)}`}
                                style={{ width: `${feature.adoption}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">{feature.sessions} sessions | Last: {feature.lastUsed}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* User Engagement */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-chart-4" />
                        <span className="font-medium text-sm">User Engagement</span>
                      </div>
                      <div className="space-y-2">
                        {details.userEngagement.map((segment, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium">{segment.segment}</div>
                              <div className="text-xs text-muted-foreground">{segment.activeUsers}/{segment.totalUsers} active</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{segment.avgSessionTime}</div>
                              <FeatureTrendIcon trend={segment.trend} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Session Analytics */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-4 w-4 text-success" />
                        <span className="font-medium text-sm">Session Analytics</span>
                      </div>
                      <div className="space-y-2">
                        {details.sessionAnalytics.map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{stat.metric}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground line-through">{stat.previous}</span>
                              <span className="font-medium text-foreground">{stat.current}</span>
                              <span className={stat.change.startsWith('+') ? 'text-success font-bold' : 'text-destructive font-bold'}>{stat.change}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Training Status */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-chart-3" />
                        <span className="font-medium text-sm">Training Progress</span>
                      </div>
                      <div className="space-y-2">
                        {details.trainingStatus.map((module, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between items-center text-xs mb-1">
                              <span className="text-muted-foreground">{module.module}</span>
                              <span className={`px-2 py-0.5 rounded ${getStatusColor(module.status)}`}>{module.status}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${module.completionRate >= 80 ? 'bg-success' : module.completionRate >= 40 ? 'bg-chart-4' : 'bg-muted-foreground'}`}
                                style={{ width: `${module.completionRate}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">{module.completionRate}% complete {module.avgScore > 0 && `| Avg score: ${module.avgScore}`}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Contacts */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Key Contacts</span>
                      </div>
                      <div className="space-y-2">
                        {details.keyContacts.map((contact, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium">{contact.name}</div>
                              <div className="text-xs text-muted-foreground">{contact.role}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs font-medium ${getEngagementColor(contact.engagement)}`}>{contact.engagement}</div>
                              <div className="text-xs text-muted-foreground">{contact.lastActive}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Success & Risks */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="space-y-3">
                        {details.successMetrics.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="h-4 w-4 text-success" />
                              <span className="font-medium text-sm">Success Metrics</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {details.successMetrics.map((metric, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-success">
                                  {metric}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {details.riskFactors.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              <span className="font-medium text-sm">Risk Factors</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {details.riskFactors.map((risk, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">
                                  {risk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Items */}
                  {details.actionItems.length > 0 && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm text-primary">Recommended Actions</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {details.actionItems.map((item, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium transition-colors">
                      <Phone className="h-4 w-4" />
                      Schedule Check-in
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-chart-3/20 hover:bg-chart-3/30 text-chart-3 text-sm font-medium transition-colors">
                      <PlayCircle className="h-4 w-4" />
                      Start Training
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-chart-4/20 hover:bg-chart-4/30 text-chart-4 text-sm font-medium transition-colors">
                      <Mail className="h-4 w-4" />
                      Send Adoption Tips
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-medium transition-colors">
                      <FileText className="h-4 w-4" />
                      Generate Report
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
