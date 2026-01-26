import {
  AlertTriangle,
  Shield,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  User,
  Target,
  FileText,
  Calendar,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { RiskRegisterData } from '@/types/widget';

export function RiskRegisterDashboardWidget({ data }: { data: RiskRegisterData }) {
  // Defensive check
  if (!data || typeof data !== 'object') {
    return (
      <div className="my-4 rounded-lg border border-destructive/30 bg-red-500/20 p-4">
        <p className="text-sm text-destructive">Unable to load risk register data</p>
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-500/20 text-destructive border-destructive/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-chart-4 border-chart-4/30';
      case 'low':
        return 'bg-emerald-500/20 text-success border-success/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500/20 text-destructive border-destructive/30';
      case 'mitigating':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'monitoring':
        return 'bg-amber-500/20 text-chart-4 border-chart-4/30';
      case 'closed':
        return 'bg-emerald-500/20 text-success border-success/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Activity className="h-4 w-4" />;
      case 'schedule':
        return <Clock className="h-4 w-4" />;
      case 'budget':
        return <Target className="h-4 w-4" />;
      case 'resource':
        return <User className="h-4 w-4" />;
      case 'external':
        return <AlertCircle className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'text-blue-500';
      case 'schedule':
        return 'text-chart-4';
      case 'budget':
        return 'text-primary';
      case 'resource':
        return 'text-purple-500';
      case 'external':
        return 'text-orange-500';
      case 'compliance':
        return 'text-cyan-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProbabilityLabel = (probability: string) => {
    switch (probability) {
      case 'very-likely':
        return 'Very Likely';
      case 'likely':
        return 'Likely';
      case 'possible':
        return 'Possible';
      case 'unlikely':
        return 'Unlikely';
      default:
        return probability;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-success" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'new':
        return 'bg-blue-500/20 text-blue-500';
      case 'escalated':
        return 'bg-red-500/20 text-destructive';
      case 'de-escalated':
        return 'bg-emerald-500/20 text-success';
      case 'closed':
        return 'bg-muted text-muted-foreground';
      case 'updated':
        return 'bg-amber-500/20 text-chart-4';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

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
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {data.programName} • {data.programId}
          </p>
          <p className="text-xs text-muted-foreground">Updated: {data.lastUpdated}</p>
        </div>
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-3xl font-bold text-primary">{data.summary.overallRiskScore}</div>
            <div className="text-xs text-muted-foreground">Risk Score</div>
          </div>
          {getTrendIcon(data.summary.trend)}
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <motion.div
            className="p-3 rounded-lg bg-muted/30 border border-border text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-foreground">{data.summary.totalRisks}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-red-500/20 border border-destructive/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-destructive">{data.summary.critical}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-orange-500">{data.summary.high}</div>
            <div className="text-xs text-muted-foreground">High</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-amber-500/20 border border-chart-4/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-chart-4">{data.summary.medium}</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-emerald-500/20 border border-success/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-success">{data.summary.low}</div>
            <div className="text-xs text-muted-foreground">Low</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-blue-500">{data.summary.mitigated}</div>
            <div className="text-xs text-muted-foreground">Mitigated</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-purple-500">{data.summary.newThisWeek}</div>
            <div className="text-xs text-muted-foreground">New This Week</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Risk Matrix Summary */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Risk Matrix Distribution
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <div className="p-2 rounded bg-red-500/30 border border-destructive/30 text-center">
            <div className="text-lg font-bold text-destructive">{data.riskMatrix.criticalHigh}</div>
            <div className="text-xs text-muted-foreground">Critical/High</div>
          </div>
          <div className="p-2 rounded bg-red-500/20 border border-destructive/20 text-center">
            <div className="text-lg font-bold text-destructive/80">{data.riskMatrix.criticalMedium}</div>
            <div className="text-xs text-muted-foreground">Critical/Med</div>
          </div>
          <div className="p-2 rounded bg-orange-500/20 border border-orange-500/30 text-center">
            <div className="text-lg font-bold text-orange-500">{data.riskMatrix.highHigh}</div>
            <div className="text-xs text-muted-foreground">High/High</div>
          </div>
          <div className="p-2 rounded bg-amber-500/20 border border-chart-4/30 text-center">
            <div className="text-lg font-bold text-chart-4">{data.riskMatrix.highMedium}</div>
            <div className="text-xs text-muted-foreground">High/Med</div>
          </div>
          <div className="p-2 rounded bg-yellow-500/20 border border-yellow-500/30 text-center">
            <div className="text-lg font-bold text-yellow-600">{data.riskMatrix.mediumMedium}</div>
            <div className="text-xs text-muted-foreground">Med/Med</div>
          </div>
          <div className="p-2 rounded bg-emerald-500/20 border border-success/30 text-center">
            <div className="text-lg font-bold text-success">{data.riskMatrix.lowLow}</div>
            <div className="text-xs text-muted-foreground">Low/Low</div>
          </div>
        </div>
      </motion.div>

      {/* Active Risks */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-chart-4" />
          Active Risks & Mitigation Plans
        </h4>
        <div className="space-y-3">
          {data.risks.filter(r => r.status !== 'closed').slice(0, 6).map((risk) => (
            <motion.div
              key={risk.id}
              className="p-4 rounded-lg border border-border bg-muted/20"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={getCategoryColor(risk.category)}>
                      {getCategoryIcon(risk.category)}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{risk.title}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getImpactColor(risk.impact)}`}>
                      {risk.impact}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(risk.status)}`}>
                      {risk.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-foreground">{risk.riskScore}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="ml-1 text-foreground">{risk.owner}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Probability:</span>
                  <span className="ml-1 text-foreground">{getProbabilityLabel(risk.probability)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-1 text-foreground capitalize">{risk.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Identified:</span>
                  <span className="ml-1 text-foreground">{risk.identifiedDate}</span>
                </div>
              </div>

              {/* Mitigation Section */}
              <div className="p-3 rounded bg-background/50 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">Mitigation Strategy</span>
                  <span className="text-xs text-muted-foreground">{risk.mitigation.progress}% complete</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{risk.mitigation.strategy}</p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-primary"
                    style={{ width: `${risk.mitigation.progress}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {risk.mitigation.actions.slice(0, 3).map((action, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                    >
                      {action}
                    </span>
                  ))}
                  {risk.mitigation.actions.length > 3 && (
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                      +{risk.mitigation.actions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Affected Areas */}
              {risk.affectedAreas.length > 0 && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Affects:</span>
                  {risk.affectedAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/30"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Changes */}
      {data.recentChanges && data.recentChanges.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Recent Changes
          </h4>
          <div className="space-y-2">
            {data.recentChanges.slice(0, 5).map((change, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-muted/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getChangeTypeColor(change.changeType)}`}>
                    {change.changeType}
                  </span>
                  <div>
                    <span className="text-sm text-foreground">{change.riskTitle}</span>
                    {change.previousState && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        {change.previousState} <ArrowRight className="h-3 w-3" /> {change.newState}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{change.changedBy}</div>
                  <div className="text-xs text-muted-foreground">{change.changedDate}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Reviews */}
      {data.upcomingReviews && data.upcomingReviews.length > 0 && (
        <motion.div variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Upcoming Risk Reviews
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {data.upcomingReviews.map((review, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-primary/10 border border-primary/30"
              >
                <div className="text-sm font-medium text-foreground">{review.riskTitle}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{review.reviewDate}</span>
                  <span className="text-xs text-primary">{review.reviewer}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
