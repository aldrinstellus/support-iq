import {
  GitPullRequest,
  GitMerge,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  GitBranch,
  FileCode,
  Plus,
  Minus,
  RefreshCw,
  User,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { CodeReviewDashboardData } from '@/types/widget';

export function CodeReviewDashboardWidget({ data }: { data: CodeReviewDashboardData }) {
  // Defensive check
  if (!data || typeof data !== 'object') {
    return (
      <div className="my-4 rounded-lg border border-destructive/30 bg-red-500/20 p-4">
        <p className="text-sm text-destructive">Unable to load code review data</p>
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
      case 'approved':
        return 'bg-emerald-500/20 text-success border-success/30';
      case 'pending':
        return 'bg-amber-500/20 text-chart-4 border-chart-4/30';
      case 'changes-requested':
        return 'bg-red-500/20 text-destructive border-destructive/30';
      case 'needs-rebase':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'commented':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-chart-4" />;
      case 'changes-requested':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'needs-rebase':
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      case 'commented':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <Eye className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-destructive border-destructive/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'normal':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getChecksColor = (status: string) => {
    switch (status) {
      case 'passing':
        return 'text-success';
      case 'failing':
        return 'text-destructive';
      case 'pending':
        return 'text-chart-4';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'approval':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'merge':
        return <GitMerge className="h-4 w-4 text-purple-500" />;
      case 'request-changes':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'push':
        return <GitBranch className="h-4 w-4 text-chart-4" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays}d ago`;
  };

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case 'fast':
        return 'text-success';
      case 'normal':
        return 'text-blue-500';
      case 'slow':
        return 'text-chart-4';
      default:
        return 'text-muted-foreground';
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
            <GitPullRequest className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{data.lastUpdated}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getVelocityColor(data.summary.reviewVelocity)}`}>
            {data.summary.reviewVelocity} velocity
          </span>
          <TrendingUp className={`h-4 w-4 ${getVelocityColor(data.summary.reviewVelocity)}`} />
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div className="mb-6" variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <motion.div
            className="p-3 rounded-lg bg-amber-500/20 border border-chart-4/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-chart-4">{data.summary.needsYourReview}</div>
            <div className="text-xs text-muted-foreground">Needs Your Review</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-red-500/20 border border-destructive/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-destructive">{data.summary.awaitingYourChanges}</div>
            <div className="text-xs text-muted-foreground">Awaiting Changes</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-muted/30 border border-border text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-foreground">{data.summary.totalPending}</div>
            <div className="text-xs text-muted-foreground">Total Pending</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-emerald-500/20 border border-success/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-success">{data.summary.approved}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-purple-500">{data.summary.merged}</div>
            <div className="text-xs text-muted-foreground">Merged (Week)</div>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-lg font-bold text-blue-500">{data.summary.averageReviewTime}</div>
            <div className="text-xs text-muted-foreground">Avg Review Time</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Pending Reviews */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
          <Eye className="h-4 w-4 text-chart-4" />
          Pending Reviews
        </h4>
        <div className="space-y-3">
          {data.pendingReviews.slice(0, 5).map((pr) => (
            <motion.div
              key={pr.id}
              className="p-4 rounded-lg border border-border bg-muted/20"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-primary">{pr.id}</span>
                    <span className="text-sm font-medium text-foreground">{pr.title}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{pr.author}</span>
                    <span>•</span>
                    <span>{pr.repository}</span>
                    <span>•</span>
                    <GitBranch className="h-3 w-3" />
                    <span>{pr.branch}</span>
                    <span>→</span>
                    <span>{pr.targetBranch}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(pr.priority)}`}>
                    {pr.priority}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(pr.status)}`}>
                    {pr.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-success">
                    <Plus className="h-3 w-3" /> {pr.linesAdded}
                  </span>
                  <span className="flex items-center gap-1 text-destructive">
                    <Minus className="h-3 w-3" /> {pr.linesRemoved}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <FileCode className="h-3 w-3" /> {pr.filesChanged} files
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-3 w-3" /> {pr.comments}
                  </span>
                  <span className={`flex items-center gap-1 ${getChecksColor(pr.checksStatus)}`}>
                    {pr.checksStatus === 'passing' ? <CheckCircle2 className="h-3 w-3" /> :
                     pr.checksStatus === 'failing' ? <XCircle className="h-3 w-3" /> :
                     <Clock className="h-3 w-3" />}
                    {pr.checksStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {pr.reviewers.map((reviewer, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      {getStatusIcon(reviewer.status)}
                      <span className="text-xs text-muted-foreground">{reviewer.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pr.labels.length > 0 && (
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {pr.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/30"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Your Pull Requests */}
      {data.yourPullRequests && data.yourPullRequests.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-primary" />
            Your Pull Requests
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.yourPullRequests.map((pr) => (
              <div
                key={pr.id}
                className="p-3 rounded-lg border border-border bg-muted/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary">{pr.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(pr.reviewStatus)}`}>
                      {pr.reviewStatus.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {pr.comments}
                  </span>
                </div>
                <div className="text-sm text-foreground mt-1 truncate">{pr.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {pr.repository} • {pr.reviewers.length} reviewer(s)
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      {data.recentActivity && data.recentActivity.length > 0 && (
        <motion.div className="mb-6" variants={itemVariants}>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {data.recentActivity.slice(0, 5).map((activity, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-muted/10 border border-border/50 flex items-start gap-3"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{activity.user}</span>
                    <span className="text-xs text-muted-foreground">
                      {activity.type === 'comment' ? 'commented on' :
                       activity.type === 'approval' ? 'approved' :
                       activity.type === 'merge' ? 'merged' :
                       activity.type === 'request-changes' ? 'requested changes on' :
                       activity.type === 'push' ? 'pushed to' : ''}
                    </span>
                    <span className="text-xs font-mono text-primary">{activity.pullRequestId}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{activity.pullRequestTitle}</div>
                  {activity.content && (
                    <div className="text-xs text-foreground mt-1 p-2 bg-background/50 rounded border border-border/30">
                      "{activity.content}"
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Metrics */}
      <motion.div variants={itemVariants}>
        <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Review Metrics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
            <div className="text-xl font-bold text-primary">{data.metrics.reviewsCompletedThisWeek}</div>
            <div className="text-xs text-muted-foreground">Reviews This Week</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
            <div className="text-xl font-bold text-blue-500">{data.metrics.averageCommentsPerReview}</div>
            <div className="text-xs text-muted-foreground">Avg Comments/PR</div>
          </div>
          <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/30 text-center">
            <div className="text-xl font-bold text-chart-4">{data.metrics.firstResponseTime}</div>
            <div className="text-xs text-muted-foreground">First Response</div>
          </div>
          <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-center">
            <div className="text-xl font-bold text-success">{data.metrics.approvalRate}%</div>
            <div className="text-xs text-muted-foreground">Approval Rate</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
