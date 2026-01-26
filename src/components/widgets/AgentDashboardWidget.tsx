'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Clock,
  TrendingUp,
  Calendar,
  Sparkles,
  Target,
  Bell,
  ChevronRight,
  X,
  User,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Timer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgentDashboardData } from '@/types/widget';

type FilterType = 'all' | 'critical' | 'dueSoon' | 'needsResponse' | null;

export function AgentDashboardWidget({ data }: { data: AgentDashboardData }) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);

  const severityColors = {
    high: 'border-destructive/30 bg-destructive/5',
    medium: 'border-chart-4/30 bg-chart-4/5',
    low: 'border-chart-3/30 bg-chart-3/5',
  };

  const severityTextColors = {
    high: 'text-destructive',
    medium: 'text-chart-4',
    low: 'text-chart-3',
  };

  const priorityColors = {
    critical: 'bg-red-500/20 text-destructive border-destructive/30',
    high: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    medium: 'bg-amber-500/20 text-chart-4 border-chart-4/30',
    low: 'bg-emerald-500/20 text-success border-success/30',
  };

  const statusColors = {
    'open': 'bg-blue-500/20 text-blue-500',
    'in-progress': 'bg-purple-500/20 text-purple-500',
    'pending': 'bg-amber-500/20 text-chart-4',
    'waiting': 'bg-muted text-muted-foreground',
  };

  const slaColors = {
    'ok': 'text-success',
    'warning': 'text-chart-4',
    'breached': 'text-destructive',
  };

  const getFilteredTickets = () => {
    if (!data.tickets) return [];

    switch (selectedFilter) {
      case 'all':
        return data.tickets;
      case 'critical':
        return data.tickets.filter(t => t.priority === 'critical');
      case 'dueSoon':
        return data.tickets.filter(t => t.isDueSoon);
      case 'needsResponse':
        return data.tickets.filter(t => t.needsResponse);
      default:
        return [];
    }
  };

  const getFilterTitle = () => {
    switch (selectedFilter) {
      case 'all':
        return 'All Tickets';
      case 'critical':
        return 'Critical Tickets';
      case 'dueSoon':
        return 'Due Soon';
      case 'needsResponse':
        return 'Needs Response';
      default:
        return '';
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

  const filteredTickets = getFilteredTickets();

  return (
    <div className="space-y-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">
            {data.date}
          </p>
        </div>
      </div>

      {/* Summary Cards - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className={`glass-card rounded-lg border bg-card/70 p-4 backdrop-blur-md cursor-pointer transition-all ${
            selectedFilter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setSelectedFilter(selectedFilter === 'all' ? null : 'all')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Total Tickets</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${selectedFilter === 'all' ? 'rotate-90' : ''}`} />
          </div>
          <div className="text-2xl font-bold text-foreground">{data.summary.totalTickets}</div>
          <div className="text-xs text-muted-foreground mt-1">Click to view all</div>
        </motion.div>

        <motion.div
          className={`glass-card rounded-lg border p-4 backdrop-blur-md cursor-pointer transition-all ${
            selectedFilter === 'critical'
              ? 'border-destructive ring-2 ring-destructive/20 bg-destructive/10'
              : 'border-destructive/30 bg-destructive/5 hover:border-destructive/50'
          }`}
          onClick={() => setSelectedFilter(selectedFilter === 'critical' ? null : 'critical')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">Critical</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${selectedFilter === 'critical' ? 'rotate-90' : ''}`} />
          </div>
          <div className="text-2xl font-bold text-destructive">{data.summary.critical}</div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>

        <motion.div
          className={`glass-card rounded-lg border p-4 backdrop-blur-md cursor-pointer transition-all ${
            selectedFilter === 'dueSoon'
              ? 'border-chart-4 ring-2 ring-chart-4/20 bg-chart-4/10'
              : 'border-chart-4/30 bg-chart-4/5 hover:border-chart-4/50'
          }`}
          onClick={() => setSelectedFilter(selectedFilter === 'dueSoon' ? null : 'dueSoon')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-chart-4" />
              <span className="text-xs font-medium text-muted-foreground">Due Soon</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${selectedFilter === 'dueSoon' ? 'rotate-90' : ''}`} />
          </div>
          <div className="text-2xl font-bold text-chart-4">{data.summary.dueSoon}</div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>

        <motion.div
          className={`glass-card rounded-lg border p-4 backdrop-blur-md cursor-pointer transition-all ${
            selectedFilter === 'needsResponse'
              ? 'border-chart-3 ring-2 ring-chart-3/20 bg-chart-3/10'
              : 'border-chart-3/30 bg-chart-3/5 hover:border-chart-3/50'
          }`}
          onClick={() => setSelectedFilter(selectedFilter === 'needsResponse' ? null : 'needsResponse')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-chart-3" />
              <span className="text-xs font-medium text-muted-foreground">Needs Response</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${selectedFilter === 'needsResponse' ? 'rotate-90' : ''}`} />
          </div>
          <div className="text-2xl font-bold text-chart-3">{data.summary.needsResponse}</div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>
      </div>

      {/* Ticket Detail Panel */}
      <AnimatePresence>
        {selectedFilter && filteredTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  {selectedFilter === 'all' && <Target className="h-4 w-4 text-primary" />}
                  {selectedFilter === 'critical' && <AlertCircle className="h-4 w-4 text-destructive" />}
                  {selectedFilter === 'dueSoon' && <Clock className="h-4 w-4 text-chart-4" />}
                  {selectedFilter === 'needsResponse' && <Bell className="h-4 w-4 text-chart-3" />}
                  {getFilterTitle()} ({filteredTickets.length})
                </h4>
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-mono font-semibold text-primary">{ticket.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[ticket.priority]}`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[ticket.status]}`}>
                            {ticket.status}
                          </span>
                          {ticket.needsResponse && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-chart-3/20 text-chart-3 border border-chart-3/30">
                              Needs Response
                            </span>
                          )}
                          {ticket.isDueSoon && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-chart-4/20 text-chart-4 border border-chart-4/30">
                              Due Soon
                            </span>
                          )}
                        </div>
                        <h5 className="text-sm font-medium text-foreground mt-2">{ticket.subject}</h5>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Customer:</span>
                        <span className="text-foreground font-medium truncate">{ticket.customer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Category:</span>
                        <span className="text-foreground">{ticket.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Created:</span>
                        <span className="text-foreground">{formatTimeAgo(ticket.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Timer className={`h-3.5 w-3.5 ${slaColors[ticket.slaStatus]}`} />
                        <span className="text-muted-foreground">SLA:</span>
                        <span className={`font-medium ${slaColors[ticket.slaStatus]}`}>
                          {ticket.slaStatus === 'ok' && 'On Track'}
                          {ticket.slaStatus === 'warning' && 'At Risk'}
                          {ticket.slaStatus === 'breached' && 'Breached'}
                        </span>
                      </div>
                    </div>

                    {ticket.dueAt && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        {ticket.slaStatus === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-chart-4" />
                        ) : ticket.slaStatus === 'breached' ? (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(ticket.dueAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Snapshot */}
      <div className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
          <TrendingUp className="h-4 w-4 text-success" />
          Your Performance This Week
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Resolved Today</div>
            <div className="text-lg font-bold text-foreground">
              {data.performanceSnapshot.ticketsResolvedToday}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Resolved This Week</div>
            <div className="text-lg font-bold text-foreground">
              {data.performanceSnapshot.ticketsResolvedThisWeek}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Avg Response</div>
            <div className="text-lg font-bold text-foreground">
              {data.performanceSnapshot.avgResponseTime}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Satisfaction</div>
            <div className="text-lg font-bold text-success">
              {data.performanceSnapshot.customerSatisfaction.toFixed(1)}/5.0
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Compliance</div>
            <div className="text-lg font-bold text-success">
              {data.performanceSnapshot.slaCompliance}%
            </div>
          </div>
        </div>
      </div>

      {/* Priority Alerts */}
      {data.priorities.length > 0 && (
        <div className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Priority Alerts
          </h4>
          <div className="space-y-3">
            {data.priorities.map((priority, idx) => (
              <div
                key={idx}
                className={`border-l-4 ${severityColors[priority.severity]} rounded-r p-3`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-sm font-medium ${severityTextColors[priority.severity]}`}>
                    {priority.message}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{priority.tickets.length} ticket{priority.tickets.length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span className="font-mono">{priority.tickets.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {data.aiSuggestions.length > 0 && (
        <div className="glass-card rounded-lg border border-primary/30 bg-primary/5 p-4 backdrop-blur-md">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Suggestions
          </h4>
          <div className="space-y-2">
            {data.aiSuggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-foreground/90">{suggestion.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Meetings */}
      {data.upcomingMeetings.length > 0 && (
        <div className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-chart-3" />
            Today&apos;s Meetings
          </h4>
          <div className="space-y-3">
            {data.upcomingMeetings.map((meeting, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="text-sm font-bold text-foreground">{meeting.time}</div>
                  <div className="text-xs text-muted-foreground">{meeting.duration}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground mb-1">{meeting.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {meeting.attendees.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
