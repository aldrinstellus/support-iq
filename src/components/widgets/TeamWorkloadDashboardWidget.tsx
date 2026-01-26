'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  X,
  Clock,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TeamWorkloadDashboardData } from '@/types/widget';

type FilterType = 'all' | 'overloaded' | 'critical-tickets' | 'sla-risk' | null;

export function TeamWorkloadDashboardWidget({ data }: { data: TeamWorkloadDashboardData }) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const statusColors = {
    online: 'border-success/30 bg-emerald-500/20 text-success',
    busy: 'border-chart-4/30 bg-amber-500/20 text-chart-4',
    offline: 'border-muted/30 bg-muted/20 text-muted-foreground',
    overloaded: 'border-destructive/30 bg-red-500/20 text-destructive',
  };

  const loadStatusColors = {
    low: 'bg-chart-3',
    moderate: 'bg-chart-4',
    high: 'bg-chart-4',
    overloaded: 'bg-destructive',
    offline: 'bg-muted',
  };

  const performanceColors = {
    excellent: 'text-success',
    good: 'text-chart-3',
    'needs-attention': 'text-chart-4',
  };

  // Filter agents based on selected filter
  const getFilteredAgents = () => {
    if (!selectedFilter) return [];
    switch (selectedFilter) {
      case 'all':
        return data.agents;
      case 'overloaded':
        return data.agents.filter(a => a.loadStatus === 'overloaded' || a.loadPercentage > 90);
      case 'critical-tickets':
        return data.agents.filter(a => a.activeTickets.critical > 0);
      case 'sla-risk':
        return data.agents.filter(a => a.slaCompliance < 85);
      default:
        return [];
    }
  };

  const filteredAgents = getFilteredAgents();

  // Calculate stats for summary cards
  const overloadedCount = data.agents.filter(a => a.loadStatus === 'overloaded' || a.loadPercentage > 90).length;
  const criticalTicketAgents = data.agents.filter(a => a.activeTickets.critical > 0).length;
  const slaRiskCount = data.agents.filter(a => a.slaCompliance < 85).length;

  const handleCardClick = (filter: FilterType) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
    setExpandedAgent(null);
  };

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'all': return 'All Agents';
      case 'overloaded': return 'Overloaded Agents';
      case 'critical-tickets': return 'Agents with Critical Tickets';
      case 'sla-risk': return 'Agents at SLA Risk';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 my-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">Last updated: {data.lastUpdated}</p>
        </div>
      </div>

      {/* Interactive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          onClick={() => handleCardClick('all')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
            selectedFilter === 'all'
              ? 'border-primary bg-primary/20 ring-2 ring-primary/30'
              : 'border-border bg-card/70 hover:border-primary/50 hover:bg-primary/10'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">{data.agentsOnline}/{data.teamSize}</div>
              <div className="text-xs text-muted-foreground">Agents Online</div>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'all' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Click to view all</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('overloaded')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
            selectedFilter === 'overloaded'
              ? 'border-destructive bg-red-500/30 ring-2 ring-destructive/30'
              : 'border-destructive/30 bg-red-500/20 hover:bg-red-500/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-destructive">{overloadedCount}</div>
              <div className="text-xs text-muted-foreground">Overloaded</div>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'overloaded' ? 'rotate-90 text-destructive' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('critical-tickets')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
            selectedFilter === 'critical-tickets'
              ? 'border-chart-4 bg-amber-500/30 ring-2 ring-chart-4/30'
              : 'border-chart-4/30 bg-amber-500/20 hover:bg-amber-500/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-chart-4">{criticalTicketAgents}</div>
              <div className="text-xs text-muted-foreground">With Critical</div>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'critical-tickets' ? 'rotate-90 text-chart-4' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('sla-risk')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
            selectedFilter === 'sla-risk'
              ? 'border-chart-3 bg-lime-500/30 ring-2 ring-chart-3/30'
              : 'border-chart-3/30 bg-lime-500/20 hover:bg-lime-500/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-chart-3">{slaRiskCount}</div>
              <div className="text-xs text-muted-foreground">SLA at Risk</div>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'sla-risk' ? 'rotate-90 text-chart-3' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>
      </div>

      {/* Filtered Agent Detail Panel */}
      <AnimatePresence>
        {selectedFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-lg border border-border bg-card/70 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {getFilterLabel()} ({filteredAgents.length})
                </h4>
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {filteredAgents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No agents match this filter</p>
              ) : (
                <div className="space-y-3">
                  {filteredAgents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        expandedAgent === agent.id
                          ? 'border-primary bg-primary/10'
                          : agent.loadStatus === 'overloaded'
                          ? 'border-destructive/30 bg-red-500/20 hover:bg-red-500/30'
                          : 'border-border bg-card/50 hover:bg-card/80'
                      }`}
                      onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-chart-2 to-primary shadow-md ring-2 ring-primary/30">
                            <span className="text-xs font-bold text-primary-foreground">{agent.avatar}</span>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-foreground">{agent.name}</h5>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${statusColors[agent.status]}`}>
                                {agent.status}
                              </span>
                              <span className="text-xs text-muted-foreground">{agent.ticketCount} tickets</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              agent.loadPercentage > 100 ? 'text-destructive' :
                              agent.loadPercentage > 80 ? 'text-chart-4' :
                              'text-success'
                            }`}>
                              {agent.loadPercentage}%
                            </div>
                            <div className="text-xs text-muted-foreground">workload</div>
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-transform ${expandedAgent === agent.id ? 'rotate-90' : ''} text-muted-foreground`} />
                        </div>
                      </div>

                      {/* Expanded Agent Details */}
                      <AnimatePresence>
                        {expandedAgent === agent.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-border/50"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              {agent.activeTickets.critical > 0 && (
                                <div className="text-center p-2 rounded bg-red-500/20 border border-destructive/30">
                                  <div className="text-lg font-bold text-destructive">{agent.activeTickets.critical}</div>
                                  <div className="text-xs text-muted-foreground">Critical</div>
                                </div>
                              )}
                              {agent.activeTickets.high > 0 && (
                                <div className="text-center p-2 rounded bg-amber-500/20 border border-chart-4/30">
                                  <div className="text-lg font-bold text-chart-4">{agent.activeTickets.high}</div>
                                  <div className="text-xs text-muted-foreground">High</div>
                                </div>
                              )}
                              {agent.activeTickets.medium > 0 && (
                                <div className="text-center p-2 rounded bg-lime-500/20 border border-chart-3/30">
                                  <div className="text-lg font-bold text-chart-3">{agent.activeTickets.medium}</div>
                                  <div className="text-xs text-muted-foreground">Medium</div>
                                </div>
                              )}
                              {agent.activeTickets.low > 0 && (
                                <div className="text-center p-2 rounded bg-muted/30 border border-border">
                                  <div className="text-lg font-bold text-muted-foreground">{agent.activeTickets.low}</div>
                                  <div className="text-xs text-muted-foreground">Low</div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div className="p-2 rounded bg-muted/20">
                                <div className="flex items-center justify-center gap-1">
                                  <Clock className="h-3 w-3 text-primary" />
                                  <span className="text-sm font-semibold text-foreground">{agent.avgResponseTime}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Avg Response</div>
                              </div>
                              <div className="p-2 rounded bg-muted/20">
                                <div className={`text-sm font-semibold ${agent.slaCompliance >= 90 ? 'text-success' : agent.slaCompliance >= 75 ? 'text-chart-4' : 'text-destructive'}`}>
                                  {agent.slaCompliance}%
                                </div>
                                <div className="text-xs text-muted-foreground">SLA Compliance</div>
                              </div>
                              <div className="p-2 rounded bg-muted/20">
                                <div className={`text-sm font-semibold capitalize ${performanceColors[agent.performance]}`}>
                                  {agent.performance.replace('-', ' ')}
                                </div>
                                <div className="text-xs text-muted-foreground">Performance</div>
                              </div>
                            </div>

                            {agent.alerts.length > 0 && (
                              <div className="mt-3 space-y-1">
                                {agent.alerts.map((alert, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs">
                                    <AlertTriangle className="h-3 w-3 text-chart-4 flex-shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{alert}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Recommendation */}
      {data.aiRecommendation && (
        <div className={`glass-card rounded-lg border p-4 backdrop-blur-md ${
          data.aiRecommendation.severity === 'critical'
            ? 'border-destructive/50 bg-red-500/20'
            : data.aiRecommendation.severity === 'high'
            ? 'border-chart-4/50 bg-amber-500/20'
            : 'border-primary/30 bg-primary/20'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
              data.aiRecommendation.severity === 'critical'
                ? 'text-destructive'
                : data.aiRecommendation.severity === 'high'
                ? 'text-chart-4'
                : 'text-primary'
            }`} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                {data.aiRecommendation.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h4>
              <p className="text-sm text-foreground/90 mb-3">{data.aiRecommendation.message}</p>
              {data.aiRecommendation.suggestedActions.map((action, idx) => (
                <div key={idx} className="mb-2 last:mb-0 pl-4 border-l-2 border-primary/30">
                  <p className="text-xs font-medium text-foreground mb-1">{action.action}</p>
                  <p className="text-xs text-muted-foreground">{action.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Agent Cards Grid (when no filter selected) */}
      {!selectedFilter && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.agents.map((agent) => (
            <div
              key={agent.id}
              className={`glass-card rounded-lg border p-4 backdrop-blur-md transition-all duration-200 hover:shadow-md ${
                agent.loadStatus === 'overloaded'
                  ? 'border-destructive/30 bg-red-500/20'
                  : 'border-border bg-card/70'
              }`}
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-chart-2 to-primary shadow-md ring-2 ring-primary/30">
                    <span className="text-xs font-bold text-primary-foreground">{agent.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{agent.name}</h4>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border inline-block ${statusColors[agent.status]}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Load Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Workload</span>
                  <span className={`text-xs font-bold ${
                    agent.loadPercentage > 100 ? 'text-destructive' :
                    agent.loadPercentage > 80 ? 'text-chart-4' :
                    'text-success'
                  }`}>
                    {agent.loadPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${loadStatusColors[agent.loadStatus]} transition-all duration-300`}
                    style={{ width: `${Math.min(agent.loadPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>{agent.ticketCount} tickets</span>
                  <span>{agent.capacity} capacity</span>
                </div>
              </div>

              {/* Tickets Breakdown */}
              <div className="grid grid-cols-4 gap-1 mb-3">
                {agent.activeTickets.critical > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-destructive">{agent.activeTickets.critical}</div>
                    <div className="text-xs text-muted-foreground">Crit</div>
                  </div>
                )}
                {agent.activeTickets.high > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-chart-4">{agent.activeTickets.high}</div>
                    <div className="text-xs text-muted-foreground">High</div>
                  </div>
                )}
                {agent.activeTickets.medium > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-chart-3">{agent.activeTickets.medium}</div>
                    <div className="text-xs text-muted-foreground">Med</div>
                  </div>
                )}
                {agent.activeTickets.low > 0 && (
                  <div className="text-center">
                    <div className="text-sm font-bold text-muted-foreground">{agent.activeTickets.low}</div>
                    <div className="text-xs text-muted-foreground">Low</div>
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Avg Response</span>
                  <span className="font-medium text-foreground">{agent.avgResponseTime}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Compliance</span>
                  <span className={`font-medium ${agent.slaCompliance >= 90 ? 'text-success' : agent.slaCompliance >= 75 ? 'text-chart-4' : 'text-destructive'}`}>
                    {agent.slaCompliance}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Performance</span>
                  <span className={`font-medium capitalize ${performanceColors[agent.performance]}`}>
                    {agent.performance}
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {agent.alerts.length > 0 && (
                <div className="mt-3 pt-2 border-t border-border/50 space-y-1">
                  {agent.alerts.map((alert, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <AlertTriangle className="h-3 w-3 text-chart-4 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">{alert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
