import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  TrendingUp,
  Flag,
  ArrowRight,
  CircleDot,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { MilestoneTrackingData } from '@/types/widget';

export function MilestoneTrackingDashboardWidget({ data }: { data: MilestoneTrackingData }) {
  // Defensive check
  if (!data || typeof data !== 'object') {
    return (
      <div className="my-4 rounded-lg border border-destructive/30 bg-red-500/20 p-4">
        <p className="text-sm text-destructive">Unable to load milestone tracking data</p>
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
      case 'completed':
        return 'bg-emerald-500/20 text-success border-success/30';
      case 'on-track':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'at-risk':
        return 'bg-amber-500/20 text-chart-4 border-chart-4/30';
      case 'delayed':
        return 'bg-red-500/20 text-destructive border-destructive/30';
      case 'upcoming':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'on-track':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'at-risk':
        return <AlertTriangle className="h-4 w-4 text-chart-4" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'upcoming':
        return <CircleDot className="h-4 w-4 text-muted-foreground" />;
      default:
        return <CircleDot className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-l-success';
      case 'in-progress':
        return 'border-l-blue-500';
      case 'at-risk':
        return 'border-l-chart-4';
      case 'delayed':
        return 'border-l-destructive';
      case 'upcoming':
        return 'border-l-muted-foreground';
      default:
        return 'border-l-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-500/20 text-destructive border-destructive/30';
      case 'medium':
        return 'bg-amber-500/20 text-chart-4 border-chart-4/30';
      case 'low':
        return 'bg-emerald-500/20 text-success border-success/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
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
            <Flag className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {data.programName} • {data.programId}
          </p>
          <p className="text-xs text-muted-foreground">Updated: {data.lastUpdated}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{data.summary.overallProgress}%</div>
          <div className="text-xs text-muted-foreground">Overall Progress</div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <motion.div
            className="p-3 rounded-lg bg-muted/30 border border-border text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-foreground">{data.summary.totalMilestones}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-emerald-500/20 border border-success/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-success">{data.summary.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-blue-500">{data.summary.onTrack}</div>
            <div className="text-xs text-muted-foreground">On Track</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-amber-500/20 border border-chart-4/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-chart-4">{data.summary.atRisk}</div>
            <div className="text-xs text-muted-foreground">At Risk</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-red-500/20 border border-destructive/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-destructive">{data.summary.delayed}</div>
            <div className="text-xs text-muted-foreground">Delayed</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Next Milestone Alert */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-medium text-foreground">Next Milestone</div>
              <div className="text-xs text-muted-foreground">{data.summary.nextMilestoneName}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">{data.summary.daysToNextMilestone} days</div>
            <div className="text-xs text-muted-foreground">remaining</div>
          </div>
        </div>
      </motion.div>

      {/* Phase Timeline */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Phase Progress
        </h4>
        <div className="space-y-4">
          {data.phases.map((phase, idx) => (
            <div
              key={phase.id}
              className={`border-l-4 ${getPhaseStatusColor(phase.status)} rounded-r-lg p-4 bg-muted/20`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(phase.status)}
                    <span className="text-sm font-semibold text-foreground">{phase.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {phase.startDate} → {phase.endDate}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(phase.status)}`}>
                    {phase.status.replace('-', ' ')}
                  </span>
                  <span className="text-sm font-bold text-foreground">{phase.progress}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    phase.status === 'completed' ? 'bg-success' :
                    phase.status === 'at-risk' ? 'bg-chart-4' :
                    phase.status === 'delayed' ? 'bg-destructive' :
                    'bg-primary'
                  }`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>

              {/* Milestones within phase */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {phase.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="p-2 rounded bg-background/50 border border-border/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getStatusIcon(milestone.status)}
                      <span className="text-xs text-foreground truncate">{milestone.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                      {milestone.deliverablesCompleted}/{milestone.deliverables}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Milestones */}
      {data.upcomingMilestones && data.upcomingMilestones.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-chart-4" />
            Upcoming Milestones
          </h4>
          <div className="space-y-2">
            {data.upcomingMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(milestone.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{milestone.name}</span>
                      {milestone.criticalPath && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-destructive/20 text-destructive border border-destructive/30">
                          Critical Path
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{milestone.phase}</div>
                    {milestone.blockers && milestone.blockers.length > 0 && (
                      <div className="text-xs text-destructive mt-1">
                        ⚠ {milestone.blockers.length} blocker(s)
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    milestone.daysRemaining <= 7 ? 'text-destructive' :
                    milestone.daysRemaining <= 14 ? 'text-chart-4' :
                    'text-foreground'
                  }`}>
                    {milestone.daysRemaining} days
                  </div>
                  <div className="text-xs text-muted-foreground">{milestone.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recently Completed */}
      {data.recentlyCompleted && data.recentlyCompleted.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Recently Completed
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {data.recentlyCompleted.map((milestone) => (
              <div
                key={milestone.id}
                className="p-3 rounded-lg bg-emerald-500/10 border border-success/20"
              >
                <div className="text-sm font-medium text-foreground">{milestone.name}</div>
                <div className="text-xs text-muted-foreground">{milestone.phase}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{milestone.completedDate}</span>
                  <span className={`text-xs font-medium ${
                    milestone.daysEarlyOrLate < 0 ? 'text-success' :
                    milestone.daysEarlyOrLate > 0 ? 'text-chart-4' :
                    'text-muted-foreground'
                  }`}>
                    {milestone.daysEarlyOrLate < 0 ? `${Math.abs(milestone.daysEarlyOrLate)}d early` :
                     milestone.daysEarlyOrLate > 0 ? `${milestone.daysEarlyOrLate}d late` :
                     'On time'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Critical Path Items */}
      {data.criticalPathItems && data.criticalPathItems.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-chart-4" />
            Critical Path Items
          </h4>
          <div className="space-y-2">
            {data.criticalPathItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-muted/20 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{item.milestone}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(item.risk)}`}>
                      {item.risk} risk
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.impact}</p>
                </div>
                <div className="text-xs text-muted-foreground ml-4">{item.dueDate}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Forecast */}
      {data.forecast && (
        <motion.div variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Completion Forecast
          </h4>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Projected Completion</div>
                <div className="text-lg font-semibold text-foreground">{data.forecast.projectedCompletionDate}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Original Target</div>
                <div className="text-lg font-semibold text-foreground">{data.forecast.originalTargetDate}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Variance</div>
                <div className={`text-lg font-semibold ${
                  data.forecast.varianceDays > 0 ? 'text-destructive' :
                  data.forecast.varianceDays < 0 ? 'text-success' :
                  'text-foreground'
                }`}>
                  {data.forecast.varianceDays > 0 ? '+' : ''}{data.forecast.varianceDays} days
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Confidence</div>
                <div className={`text-lg font-semibold ${
                  data.forecast.confidence >= 80 ? 'text-success' :
                  data.forecast.confidence >= 60 ? 'text-chart-4' :
                  'text-destructive'
                }`}>
                  {data.forecast.confidence}%
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
