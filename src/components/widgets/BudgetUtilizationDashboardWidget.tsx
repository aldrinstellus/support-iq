import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PieChart,
  BarChart3,
  Target,
  Wallet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import type { BudgetUtilizationData } from '@/types/widget';
import { CustomTooltip } from './CustomTooltip';

export function BudgetUtilizationDashboardWidget({ data }: { data: BudgetUtilizationData }) {
  // Defensive check
  if (!data || typeof data !== 'object') {
    return (
      <div className="my-4 rounded-lg border border-destructive/30 bg-red-500/20 p-4">
        <p className="text-sm text-destructive">Unable to load budget utilization data</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-success';
      case 'at-risk':
        return 'text-chart-4';
      case 'over-budget':
        return 'text-destructive';
      case 'under-utilized':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-emerald-500/20 border-success/30';
      case 'at-risk':
        return 'bg-amber-500/20 border-chart-4/30';
      case 'over-budget':
        return 'bg-red-500/20 border-destructive/30';
      case 'under-utilized':
        return 'bg-blue-500/20 border-blue-500/30';
      default:
        return 'bg-muted/20 border-border';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-destructive bg-red-500/20';
      case 'high':
        return 'border-l-chart-4 bg-amber-500/20';
      case 'medium':
        return 'border-l-chart-3 bg-lime-500/20';
      case 'low':
        return 'border-l-muted-foreground/50 bg-muted/20';
      default:
        return 'border-l-border bg-muted/20';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  // Category data for bar chart
  const categoryData = data.categories.map(cat => ({
    name: cat.name.length > 12 ? cat.name.substring(0, 12) + '...' : cat.name,
    fullName: cat.name,
    utilization: cat.utilizationRate,
    color: cat.status === 'on-track' ? '#10b981' : cat.status === 'at-risk' ? '#f59e0b' : '#ef4444',
    gradient: cat.status === 'on-track' ? 'url(#colorOnTrack)' : cat.status === 'at-risk' ? 'url(#colorAtRisk)' : 'url(#colorOverBudget)',
  }));

  return (
    <motion.div
      className="rounded-lg border border-border bg-card p-6 my-4 shadow-lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {data.fiscalYear} • Updated: {data.lastUpdated}
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBg(data.summary.status)}`}>
          <span className={getStatusColor(data.summary.status)}>
            {data.summary.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            className="p-3 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <DollarSign className="h-4 w-4 text-muted-foreground mb-1" />
            <div className="text-lg font-semibold text-foreground">
              {formatCurrency(data.summary.totalBudget)}
            </div>
            <div className="text-xs text-muted-foreground">Total Budget</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-shadow cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="h-4 w-4 text-blue-500 mb-1" />
            <div className="text-lg font-semibold text-blue-500">
              {formatCurrency(data.summary.spent)}
            </div>
            <div className="text-xs text-muted-foreground">Spent to Date</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 shadow-sm hover:shadow-md hover:shadow-amber-500/20 transition-shadow cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Clock className="h-4 w-4 text-amber-500 mb-1" />
            <div className="text-lg font-semibold text-amber-500">
              {formatCurrency(data.summary.committed)}
            </div>
            <div className="text-xs text-muted-foreground">Committed</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 shadow-sm hover:shadow-md hover:shadow-green-500/20 transition-shadow cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle2 className="h-4 w-4 text-green-500 mb-1" />
            <div className="text-lg font-semibold text-green-500">
              {formatCurrency(data.summary.remaining)}
            </div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Utilization & Burn Rate */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Utilization Rate</span>
            </div>
            <div className="text-2xl font-bold text-primary">{data.summary.utilizationRate}%</div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${data.summary.utilizationRate}%` }}
              />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-chart-4" />
              <span className="text-sm font-medium text-foreground">Monthly Burn Rate</span>
            </div>
            <div className="text-2xl font-bold text-chart-4">
              {formatCurrency(data.summary.burnRate)}/mo
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Average monthly expenditure
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-foreground">Projected End</span>
            </div>
            <div className="text-2xl font-bold text-success">{data.summary.projectedEndDate}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on current burn rate
            </div>
          </div>
        </div>
      </motion.div>

      {/* Budget Burndown Chart */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h4 className="text-sm font-medium mb-3 text-foreground">Budget Burndown</h4>
        <div className="rounded-lg border border-border bg-gradient-to-br from-card to-muted/20 p-4 shadow-inner">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.monthlyBurndown}>
              <defs>
                <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `$${(value / 1000)}K`}
              />
              <Tooltip
                content={<CustomTooltip formatter={(value) => formatCurrency(Number(value))} />}
                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="planned"
                name="Planned"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#colorPlanned)"
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorActual)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Utilization */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h4 className="text-sm font-medium mb-3 text-foreground">Category Utilization</h4>
        <div className="rounded-lg border border-border bg-gradient-to-br from-card to-muted/20 p-4 shadow-inner">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical">
              <defs>
                <linearGradient id="colorOnTrack" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.85}/>
                </linearGradient>
                <linearGradient id="colorAtRisk" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.85}/>
                </linearGradient>
                <linearGradient id="colorOverBudget" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.85}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                width={100}
              />
              <Tooltip
                content={<CustomTooltip formatter={(value) => `${value}%`} />}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
              />
              <Bar dataKey="utilization" radius={[0, 4, 4, 0]} animationDuration={1000}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.gradient} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Contracts */}
      {data.contracts && data.contracts.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground">Contract Budget Allocation</h4>
          <div className="space-y-2">
            {data.contracts.map((contract, idx) => {
              const utilizationPct = Math.round((contract.spent / contract.allocated) * 100);
              return (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border bg-muted/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{contract.name}</p>
                      <p className="text-xs text-muted-foreground">{contract.vendor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      contract.status === 'active' ? 'bg-success/20 text-success' :
                      contract.status === 'pending' ? 'bg-amber-500/20 text-chart-4' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Allocated: {formatCurrency(contract.allocated)}</span>
                    <span>Spent: {formatCurrency(contract.spent)}</span>
                    <span>Remaining: {formatCurrency(contract.remaining)}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        utilizationPct > 90 ? 'bg-destructive' :
                        utilizationPct > 75 ? 'bg-chart-4' :
                        'bg-success'
                      }`}
                      style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-chart-4" />
            Budget Alerts ({data.alerts.length})
          </h4>
          <div className="space-y-2">
            {data.alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`border-l-4 p-3 rounded-r-lg ${getSeverityColor(alert.severity)}`}
              >
                <p className="text-sm font-medium text-foreground">{alert.message}</p>
                {alert.category && (
                  <p className="text-xs text-muted-foreground mt-1">Category: {alert.category}</p>
                )}
                {alert.action && (
                  <p className="text-xs text-primary mt-1 font-medium">{alert.action}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Forecast */}
      {data.forecast && (
        <motion.div variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-primary" />
            Year-End Forecast
          </h4>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Projected Spend</div>
                <div className="text-lg font-semibold text-foreground">
                  {formatCurrency(data.forecast.projectedSpend)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Variance</div>
                <div className={`text-lg font-semibold ${
                  data.forecast.variance > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {data.forecast.variance > 0 ? '+' : ''}{formatCurrency(Math.abs(data.forecast.variance))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Variance %</div>
                <div className={`text-lg font-semibold ${
                  data.forecast.variancePercentage >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {data.forecast.variancePercentage >= 0 ? '+' : ''}{data.forecast.variancePercentage}%
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{data.forecast.recommendation}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
