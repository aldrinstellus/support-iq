'use client';

import { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TicketListData } from '@/types/widget';

type FilterType = 'all' | 'critical' | 'high' | 'medium' | 'breached' | 'at-risk' | 'on-track' | null;

export function TicketListWidget({ data }: { data: TicketListData }) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const priorityColors = {
    critical: 'border-destructive/30 bg-red-500/20 text-destructive',
    high: 'border-chart-4/30 bg-amber-500/20 text-chart-4',
    medium: 'border-chart-3/30 bg-lime-500/20 text-chart-3',
    low: 'border-muted/50 bg-muted/20 text-muted-foreground',
  };

  const slaStatusIcons = {
    'on-track': CheckCircle2,
    'at-risk': AlertTriangle,
    'breached': XCircle,
  };

  const slaStatusColors = {
    'on-track': 'text-success',
    'at-risk': 'text-chart-4',
    'breached': 'text-destructive',
  };

  const riskBadgeColors = {
    critical: 'bg-red-500/20 text-destructive border-destructive/30',
    high: 'bg-amber-500/20 text-chart-4 border-chart-4/30',
    medium: 'bg-lime-500/20 text-chart-3 border-chart-3/30',
    low: 'bg-muted text-muted-foreground border-muted',
  };

  const getFilteredTickets = () => {
    if (!selectedFilter) return data.tickets;
    switch (selectedFilter) {
      case 'all': return data.tickets;
      case 'critical': return data.tickets.filter(t => t.priority === 'critical');
      case 'high': return data.tickets.filter(t => t.priority === 'high');
      case 'medium': return data.tickets.filter(t => t.priority === 'medium');
      case 'breached': return data.tickets.filter(t => t.slaStatus === 'breached');
      case 'at-risk': return data.tickets.filter(t => t.slaStatus === 'at-risk');
      case 'on-track': return data.tickets.filter(t => t.slaStatus === 'on-track');
      default: return data.tickets;
    }
  };

  const filteredTickets = getFilteredTickets();

  return (
    <div className="space-y-4 my-4">
      {/* Header with Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">{data.count} tickets</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-4">
              <motion.div
                onClick={() => setSelectedFilter(selectedFilter === 'critical' ? null : 'critical')}
                className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-red-500/20 ${
                  selectedFilter === 'critical' ? 'bg-red-500/20 ring-2 ring-primary/50' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-lg font-bold text-destructive">{data.summary.critical}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </motion.div>
              <motion.div
                onClick={() => setSelectedFilter(selectedFilter === 'high' ? null : 'high')}
                className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-amber-500/20 ${
                  selectedFilter === 'high' ? 'bg-amber-500/20 ring-2 ring-primary/50' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-lg font-bold text-chart-4">{data.summary.high}</div>
                <div className="text-xs text-muted-foreground">High</div>
              </motion.div>
              <motion.div
                onClick={() => setSelectedFilter(selectedFilter === 'medium' ? null : 'medium')}
                className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-lime-500/20 ${
                  selectedFilter === 'medium' ? 'bg-lime-500/20 ring-2 ring-primary/50' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-lg font-bold text-chart-3">{data.summary.medium}</div>
                <div className="text-xs text-muted-foreground">Medium</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive SLA Summary Bar */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          onClick={() => setSelectedFilter(selectedFilter === 'breached' ? null : 'breached')}
          className={`glass-card rounded-lg border border-destructive/30 bg-red-500/20 p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFilter === 'breached' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">Breached</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-destructive">{data.summary.breached}</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'breached' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
            </div>
          </div>
        </motion.div>
        <motion.div
          onClick={() => setSelectedFilter(selectedFilter === 'at-risk' ? null : 'at-risk')}
          className={`glass-card rounded-lg border border-chart-4/30 bg-amber-500/20 p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFilter === 'at-risk' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-chart-4" />
              <span className="text-xs font-medium text-muted-foreground">At Risk</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-chart-4">{data.summary.atRisk}</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'at-risk' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
            </div>
          </div>
        </motion.div>
        <motion.div
          onClick={() => setSelectedFilter(selectedFilter === 'on-track' ? null : 'on-track')}
          className={`glass-card rounded-lg border border-success/30 bg-emerald-500/20 p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFilter === 'on-track' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-muted-foreground">On Track</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-success">{data.summary.onTrack}</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'on-track' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Label */}
      <AnimatePresence>
        {selectedFilter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/30"
          >
            <span className="text-sm font-medium text-foreground">
              Showing {filteredTickets.length} {selectedFilter} ticket{filteredTickets.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setSelectedFilter(null)}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket List */}
      <div className="space-y-2">
        {filteredTickets.map((ticket, idx) => {
          const SLAIcon = slaStatusIcons[ticket.slaStatus];
          const isExpanded = expandedTicket === ticket.id;

          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
              className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Priority Badge */}
                <div className={`flex-shrink-0 w-1 h-full rounded-full ${ticket.priority === 'critical' ? 'bg-destructive' : ticket.priority === 'high' ? 'bg-chart-4' : ticket.priority === 'medium' ? 'bg-chart-3' : 'bg-muted-foreground'}`}></div>

                <div className="flex-1 min-w-0">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-mono font-semibold text-primary">
                        {ticket.id}
                      </span>
                      <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded border ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <SLAIcon className={`h-4 w-4 ${slaStatusColors[ticket.slaStatus]}`} />
                      <span className={`text-xs font-medium ${slaStatusColors[ticket.slaStatus]}`}>
                        {ticket.slaStatus === 'breached' && `Breached by ${ticket.slaBreachedBy}`}
                        {ticket.slaStatus === 'at-risk' && `Due in ${ticket.slaRemaining}`}
                        {ticket.slaStatus === 'on-track' && 'On track'}
                      </span>
                    </div>
                  </div>

                  {/* Subject */}
                  <h4 className={`text-sm font-medium text-foreground mb-2 ${isExpanded ? '' : 'line-clamp-1'}`}>
                    {ticket.subject}
                  </h4>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">{ticket.customer}</span>
                      {ticket.customerRisk !== 'low' && (
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${riskBadgeColors[ticket.customerRisk]}`}>
                          {ticket.customerRisk} risk
                        </span>
                      )}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ticket.ageInDays} {ticket.ageInDays === 1 ? 'day' : 'days'} old
                    </div>
                    <span>•</span>
                    <span>Updated by {ticket.lastUpdateBy}</span>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-border/50"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="p-2 rounded bg-muted/30">
                            <span className="text-muted-foreground">Priority</span>
                            <div className={`font-semibold ${ticket.priority === 'critical' ? 'text-destructive' : ticket.priority === 'high' ? 'text-chart-4' : 'text-chart-3'}`}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </div>
                          </div>
                          <div className="p-2 rounded bg-muted/30">
                            <span className="text-muted-foreground">SLA Status</span>
                            <div className={`font-semibold ${slaStatusColors[ticket.slaStatus]}`}>
                              {ticket.slaStatus.replace('-', ' ')}
                            </div>
                          </div>
                          <div className="p-2 rounded bg-muted/30">
                            <span className="text-muted-foreground">Customer Risk</span>
                            <div className="font-semibold text-foreground">
                              {ticket.customerRisk.charAt(0).toUpperCase() + ticket.customerRisk.slice(1)}
                            </div>
                          </div>
                          <div className="p-2 rounded bg-muted/30">
                            <span className="text-muted-foreground">Age</span>
                            <div className="font-semibold text-foreground">
                              {ticket.ageInDays} day{ticket.ageInDays !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {ticket.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="text-xs text-muted-foreground">Tags:</span>
                            {ticket.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tags - show only when not expanded */}
                  {!isExpanded && ticket.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {ticket.tags.slice(0, 3).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {ticket.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{ticket.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
