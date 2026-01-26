'use client';

import { useState } from 'react';
import { BarChart3, ChevronRight, Clock, CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';

interface AnalyticsDashboardData {
  ticketVolume: Array<{ date: string; tickets: number }>;
  responseTime: Array<{ hour: string; avgMinutes: number }>;
  resolution: {
    resolved: number;
    pending: number;
    escalated: number;
  };
}

type FilterType = 'resolved' | 'pending' | 'escalated' | 'volume' | 'response-time' | null;

// Mock detailed data for drill-down
const mockResolvedTickets = [
  { id: 'TKT-1234', subject: 'API Integration timeout issue', resolvedBy: 'Sarah Chen', resolvedAt: '2h ago', satisfaction: 5 },
  { id: 'TKT-1230', subject: 'Dashboard loading slowly', resolvedBy: 'Mike Johnson', resolvedAt: '3h ago', satisfaction: 4 },
  { id: 'TKT-1228', subject: 'Login authentication failed', resolvedBy: 'Sarah Chen', resolvedAt: '4h ago', satisfaction: 5 },
  { id: 'TKT-1225', subject: 'Report export not working', resolvedBy: 'Alex Rivera', resolvedAt: '5h ago', satisfaction: 4 },
  { id: 'TKT-1222', subject: 'Email notifications delayed', resolvedBy: 'Sarah Chen', resolvedAt: '6h ago', satisfaction: 5 },
];

const mockPendingTickets = [
  { id: 'TKT-1240', subject: 'Custom field configuration needed', assignedTo: 'Mike Johnson', waitingFor: 'Customer response', age: '2d' },
  { id: 'TKT-1238', subject: 'SSO setup assistance', assignedTo: 'Alex Rivera', waitingFor: 'IT approval', age: '1d' },
  { id: 'TKT-1236', subject: 'Bulk import issues', assignedTo: 'Sarah Chen', waitingFor: 'Data file', age: '3h' },
  { id: 'TKT-1235', subject: 'API rate limiting concern', assignedTo: 'Mike Johnson', waitingFor: 'Engineering review', age: '4h' },
];

const mockEscalatedTickets = [
  { id: 'TKT-1241', subject: 'Production data loss incident', priority: 'critical', escalatedTo: 'Engineering Lead', escalatedAt: '30m ago', reason: 'Data integrity issue' },
  { id: 'TKT-1239', subject: 'Service outage affecting enterprise', priority: 'critical', escalatedTo: 'VP Engineering', escalatedAt: '1h ago', reason: 'Multiple customers impacted' },
  { id: 'TKT-1237', subject: 'Security vulnerability reported', priority: 'high', escalatedTo: 'Security Team', escalatedAt: '2h ago', reason: 'Potential security risk' },
];

export function AnalyticsDashboardWidget({ data }: { data: AnalyticsDashboardData }) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const total = data.resolution.resolved + data.resolution.pending + data.resolution.escalated;
  const resolvedPercent = Math.round((data.resolution.resolved / total) * 100);
  const pendingPercent = Math.round((data.resolution.pending / total) * 100);
  const escalatedPercent = Math.round((data.resolution.escalated / total) * 100);

  // Calculate chart stats
  const avgTickets = Math.round(data.ticketVolume.reduce((sum, d) => sum + d.tickets, 0) / data.ticketVolume.length);
  const maxTickets = Math.max(...data.ticketVolume.map(d => d.tickets));
  const avgResponseTime = Math.round(data.responseTime.reduce((sum, d) => sum + d.avgMinutes, 0) / data.responseTime.length);
  const peakResponseTime = Math.max(...data.responseTime.map(d => d.avgMinutes));

  // Chart colors
  const chartColors = {
    primary: '#14b8a6', // teal-500
    secondary: '#06b6d4', // cyan-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Analytics Dashboard</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Total: {total} tickets</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Resolution Stats - Interactive Cards */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            Resolution Status
            {selectedFilter && ['resolved', 'pending', 'escalated'].includes(selectedFilter) && (
              <button
                onClick={() => setSelectedFilter(null)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              onClick={() => setSelectedFilter(selectedFilter === 'resolved' ? null : 'resolved')}
              className={`bg-emerald-500/20 border border-success/30 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFilter === 'resolved' ? 'ring-2 ring-primary/50' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'resolved' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="text-2xl font-semibold text-success">
                {data.resolution.resolved}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">Resolved</span>
                <span className="text-xs font-medium text-success">{resolvedPercent}%</span>
              </div>
            </motion.div>
            <motion.div
              onClick={() => setSelectedFilter(selectedFilter === 'pending' ? null : 'pending')}
              className={`bg-amber-500/20 border border-chart-4/30 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFilter === 'pending' ? 'ring-2 ring-primary/50' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-4 w-4 text-chart-4" />
                <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'pending' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="text-2xl font-semibold text-chart-4">
                {data.resolution.pending}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">Pending</span>
                <span className="text-xs font-medium text-chart-4">{pendingPercent}%</span>
              </div>
            </motion.div>
            <motion.div
              onClick={() => setSelectedFilter(selectedFilter === 'escalated' ? null : 'escalated')}
              className={`bg-red-500/20 border border-destructive/30 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFilter === 'escalated' ? 'ring-2 ring-primary/50' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'escalated' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="text-2xl font-semibold text-destructive">
                {data.resolution.escalated}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">Escalated</span>
                <span className="text-xs font-medium text-destructive">{escalatedPercent}%</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Drill-down panels for resolution status */}
        <AnimatePresence>
          {selectedFilter === 'resolved' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg border border-success/30 bg-emerald-500/10 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-medium text-foreground">Recently Resolved Tickets</h5>
                <span className="text-xs text-muted-foreground">{mockResolvedTickets.length} shown</span>
              </div>
              <div className="space-y-2">
                {mockResolvedTickets.map((ticket, idx) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                    className="p-3 rounded-lg bg-card/50 border border-border/50 cursor-pointer hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-primary">{ticket.id}</span>
                        <span className="text-sm text-foreground">{ticket.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(ticket.satisfaction)].map((_, i) => (
                            <span key={i} className="text-xs text-chart-4">★</span>
                          ))}
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${expandedTicket === ticket.id ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedTicket === ticket.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-border/30 grid grid-cols-2 gap-2 text-xs"
                        >
                          <div><span className="text-muted-foreground">Resolved by:</span> <span className="text-foreground">{ticket.resolvedBy}</span></div>
                          <div><span className="text-muted-foreground">Time:</span> <span className="text-foreground">{ticket.resolvedAt}</span></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedFilter === 'pending' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg border border-chart-4/30 bg-amber-500/10 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-medium text-foreground">Pending Tickets</h5>
                <span className="text-xs text-muted-foreground">{mockPendingTickets.length} shown</span>
              </div>
              <div className="space-y-2">
                {mockPendingTickets.map((ticket, idx) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                    className="p-3 rounded-lg bg-card/50 border border-border/50 cursor-pointer hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-primary">{ticket.id}</span>
                        <span className="text-sm text-foreground">{ticket.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-chart-4/20 text-chart-4 border border-chart-4/30">{ticket.age}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${expandedTicket === ticket.id ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedTicket === ticket.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-border/30 grid grid-cols-2 gap-2 text-xs"
                        >
                          <div><span className="text-muted-foreground">Assigned to:</span> <span className="text-foreground">{ticket.assignedTo}</span></div>
                          <div><span className="text-muted-foreground">Waiting for:</span> <span className="text-chart-4">{ticket.waitingFor}</span></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedFilter === 'escalated' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg border border-destructive/30 bg-red-500/10 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-medium text-foreground">Escalated Tickets</h5>
                <span className="text-xs text-muted-foreground">{mockEscalatedTickets.length} shown</span>
              </div>
              <div className="space-y-2">
                {mockEscalatedTickets.map((ticket, idx) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                    className="p-3 rounded-lg bg-card/50 border border-border/50 cursor-pointer hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-primary">{ticket.id}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded uppercase font-semibold ${
                          ticket.priority === 'critical'
                            ? 'bg-red-500/20 text-destructive border border-destructive/30'
                            : 'bg-amber-500/20 text-chart-4 border border-chart-4/30'
                        }`}>{ticket.priority}</span>
                        <span className="text-sm text-foreground">{ticket.subject}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${expandedTicket === ticket.id ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <AnimatePresence>
                      {expandedTicket === ticket.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-border/30 space-y-1 text-xs"
                        >
                          <div><span className="text-muted-foreground">Escalated to:</span> <span className="text-foreground">{ticket.escalatedTo}</span></div>
                          <div><span className="text-muted-foreground">Reason:</span> <span className="text-destructive">{ticket.reason}</span></div>
                          <div><span className="text-muted-foreground">Time:</span> <span className="text-foreground">{ticket.escalatedAt}</span></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ticket Volume Chart - Interactive Header */}
        <div>
          <motion.div
            onClick={() => setSelectedFilter(selectedFilter === 'volume' ? null : 'volume')}
            className={`flex items-center justify-between mb-3 p-2 -mx-2 rounded-lg cursor-pointer transition-all hover:bg-muted/30 ${
              selectedFilter === 'volume' ? 'bg-primary/10' : ''
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Ticket Volume (Last 7 Days)
            </h4>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">{avgTickets}</div>
                <div className="text-xs text-muted-foreground">avg/day</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-chart-4">{maxTickets}</div>
                <div className="text-xs text-muted-foreground">peak</div>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'volume' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
            </div>
          </motion.div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.ticketVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Bar
                dataKey="tickets"
                radius={[4, 4, 0, 0]}
              >
                {data.ticketVolume.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.tickets >= maxTickets ? chartColors.warning : chartColors.primary}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Volume drill-down */}
          <AnimatePresence>
            {selectedFilter === 'volume' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg border border-primary/30 bg-primary/5"
              >
                <h5 className="text-xs font-medium text-muted-foreground mb-2">Daily Breakdown</h5>
                <div className="grid grid-cols-7 gap-2">
                  {data.ticketVolume.map((day, idx) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`text-center p-2 rounded-lg border ${
                        day.tickets >= maxTickets
                          ? 'bg-chart-4/20 border-chart-4/30'
                          : 'bg-card/50 border-border/50'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">{day.date}</div>
                      <div className={`text-lg font-semibold ${day.tickets >= maxTickets ? 'text-chart-4' : 'text-foreground'}`}>
                        {day.tickets}
                      </div>
                      <div className={`text-xs ${day.tickets > avgTickets ? 'text-chart-4' : 'text-success'}`}>
                        {day.tickets > avgTickets ? '+' : ''}{day.tickets - avgTickets}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Response Time Chart - Interactive Header */}
        <div>
          <motion.div
            onClick={() => setSelectedFilter(selectedFilter === 'response-time' ? null : 'response-time')}
            className={`flex items-center justify-between mb-3 p-2 -mx-2 rounded-lg cursor-pointer transition-all hover:bg-muted/30 ${
              selectedFilter === 'response-time' ? 'bg-primary/10' : ''
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Avg Response Time by Hour
            </h4>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">{avgResponseTime}m</div>
                <div className="text-xs text-muted-foreground">average</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-chart-4">{peakResponseTime}m</div>
                <div className="text-xs text-muted-foreground">peak</div>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'response-time' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
            </div>
          </motion.div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.responseTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value) => [`${value} min`, 'Response Time']}
              />
              <Line
                type="monotone"
                dataKey="avgMinutes"
                stroke={chartColors.secondary}
                strokeWidth={2}
                dot={{ fill: chartColors.secondary, r: 4 }}
                activeDot={{ fill: chartColors.primary, r: 6, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Response time drill-down */}
          <AnimatePresence>
            {selectedFilter === 'response-time' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg border border-primary/30 bg-primary/5"
              >
                <h5 className="text-xs font-medium text-muted-foreground mb-2">Hourly Analysis</h5>
                <div className="grid grid-cols-5 gap-2">
                  {data.responseTime.map((hour, idx) => (
                    <motion.div
                      key={hour.hour}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`text-center p-2 rounded-lg border ${
                        hour.avgMinutes >= peakResponseTime
                          ? 'bg-chart-4/20 border-chart-4/30'
                          : hour.avgMinutes < avgResponseTime
                            ? 'bg-emerald-500/10 border-success/30'
                            : 'bg-card/50 border-border/50'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">{hour.hour}</div>
                      <div className={`text-lg font-semibold ${
                        hour.avgMinutes >= peakResponseTime
                          ? 'text-chart-4'
                          : hour.avgMinutes < avgResponseTime
                            ? 'text-success'
                            : 'text-foreground'
                      }`}>
                        {hour.avgMinutes}m
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {hour.avgMinutes >= peakResponseTime ? (
                          <>
                            <TrendingUp className="h-3 w-3 text-chart-4" />
                            <span className="text-xs text-chart-4">Peak</span>
                          </>
                        ) : hour.avgMinutes < avgResponseTime ? (
                          <>
                            <TrendingDown className="h-3 w-3 text-success" />
                            <span className="text-xs text-success">Good</span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Normal</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
