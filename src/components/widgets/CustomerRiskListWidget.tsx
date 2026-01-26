'use client';

import { useState } from 'react';
import {
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertTriangle,
  ChevronRight,
  X,
  Users,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CustomerRiskListData } from '@/types/widget';

type FilterType = 'all' | 'critical' | 'high' | 'critical-tickets' | null;

export function CustomerRiskListWidget({ data }: { data: CustomerRiskListData }) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const riskLevelColors = {
    critical: 'border-l-destructive bg-red-500/20',
    high: 'border-l-chart-4 bg-amber-500/20',
    medium: 'border-l-chart-3 bg-lime-500/20',
    low: 'border-l-success bg-emerald-500/20',
  };

  const riskLevelTextColors = {
    critical: 'text-destructive',
    high: 'text-chart-4',
    medium: 'text-chart-3',
    low: 'text-success',
  };

  const sentimentColors = {
    positive: 'text-success',
    neutral: 'text-muted-foreground',
    negative: 'text-destructive',
    mixed: 'text-chart-4',
  };

  // Calculate stats
  const criticalCount = data.customers.filter(c => c.riskLevel === 'critical').length;
  const highCount = data.customers.filter(c => c.riskLevel === 'high').length;
  const totalArrAtRisk = data.customers.reduce((sum, c) => sum + parseFloat(c.arr.replace(/[$,]/g, '')), 0);
  const criticalTicketsTotal = data.customers.reduce((sum, c) => sum + c.criticalTickets, 0);

  // Filter customers based on selected filter
  const getFilteredCustomers = () => {
    if (!selectedFilter) return [];
    switch (selectedFilter) {
      case 'all':
        return data.customers;
      case 'critical':
        return data.customers.filter(c => c.riskLevel === 'critical');
      case 'high':
        return data.customers.filter(c => c.riskLevel === 'high');
      case 'critical-tickets':
        return data.customers.filter(c => c.criticalTickets > 0);
      default:
        return [];
    }
  };

  const filteredCustomers = getFilteredCustomers();

  const handleCardClick = (filter: FilterType) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
    setExpandedCustomer(null);
  };

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'all': return 'All High-Risk Customers';
      case 'critical': return 'Critical Risk Customers';
      case 'high': return 'High Risk Customers';
      case 'critical-tickets': return 'Customers with Critical Tickets';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">
            {data.count} high-risk customers out of {data.totalCustomers} total
          </p>
        </div>
      </div>

      {/* Interactive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          onClick={() => handleCardClick('critical')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
            selectedFilter === 'critical'
              ? 'border-destructive bg-red-500/30 ring-2 ring-destructive/30'
              : 'border-destructive/30 bg-red-500/20 hover:bg-red-500/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
              <div className="text-xs text-muted-foreground">Critical Risk</div>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'critical' ? 'rotate-90 text-destructive' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('high')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
            selectedFilter === 'high'
              ? 'border-chart-4 bg-amber-500/30 ring-2 ring-chart-4/30'
              : 'border-chart-4/30 bg-amber-500/20 hover:bg-amber-500/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-chart-4">{highCount}</div>
              <div className="text-xs text-muted-foreground">High Risk</div>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'high' ? 'rotate-90 text-chart-4' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('all')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
            selectedFilter === 'all'
              ? 'border-chart-3 bg-lime-500/30 ring-2 ring-chart-3/30'
              : 'border-chart-3/30 bg-lime-500/20 hover:bg-lime-500/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-foreground">
                ${totalArrAtRisk.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total ARR at Risk</div>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'all' ? 'rotate-90 text-chart-3' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Click to view all</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('critical-tickets')}
          className={`glass-card rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
            selectedFilter === 'critical-tickets'
              ? 'border-destructive bg-red-500/30 ring-2 ring-destructive/30'
              : 'border-destructive/30 bg-red-500/20 hover:bg-red-500/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-destructive">{criticalTicketsTotal}</div>
              <div className="text-xs text-muted-foreground">Critical Tickets</div>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'critical-tickets' ? 'rotate-90 text-destructive' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Click to view</div>
        </motion.div>
      </div>

      {/* Filtered Customer Detail Panel */}
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
                  <Users className="h-4 w-4 text-primary" />
                  {getFilterLabel()} ({filteredCustomers.length})
                </h4>
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {filteredCustomers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No customers match this filter</p>
              ) : (
                <div className="space-y-3">
                  {filteredCustomers.map((customer, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-l-4 ${riskLevelColors[customer.riskLevel]} rounded-r p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        expandedCustomer === customer.id ? 'ring-2 ring-primary/30' : ''
                      }`}
                      onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Customer Name & Risk Score */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h5 className="text-sm font-semibold text-foreground">{customer.name}</h5>
                            <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${riskLevelTextColors[customer.riskLevel]} border ${customer.riskLevel === 'critical' ? 'border-destructive' : customer.riskLevel === 'high' ? 'border-chart-4' : 'border-chart-3'}`}>
                              {customer.riskLevel}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{customer.id}</span>
                            <span>•</span>
                            <span>CSM: {customer.csm}</span>
                            <span>•</span>
                            <span>ARR: {customer.arr}</span>
                          </div>
                        </div>

                        {/* Risk Score */}
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <div className={`text-2xl font-bold ${riskLevelTextColors[customer.riskLevel]}`}>
                              {customer.riskScore}
                            </div>
                            <div className="text-xs text-muted-foreground">Risk Score</div>
                          </div>
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedCustomer === customer.id ? 'rotate-180' : ''} text-muted-foreground`} />
                        </div>
                      </div>

                      {/* Expanded Customer Details */}
                      <AnimatePresence>
                        {expandedCustomer === customer.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-border/50"
                          >
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
                              <div className="p-2 rounded bg-muted/20 text-center">
                                <DollarSign className="h-3 w-3 text-success mx-auto mb-1" />
                                <div className="text-sm font-semibold text-foreground">{customer.arr}</div>
                                <div className="text-xs text-muted-foreground">ARR</div>
                              </div>
                              <div className="p-2 rounded bg-muted/20 text-center">
                                <Calendar className="h-3 w-3 text-chart-4 mx-auto mb-1" />
                                <div className="text-sm font-semibold text-foreground">{customer.contractRenewal}</div>
                                <div className="text-xs text-muted-foreground">Renewal</div>
                              </div>
                              <div className="p-2 rounded bg-muted/20 text-center">
                                <AlertCircle className="h-3 w-3 text-chart-3 mx-auto mb-1" />
                                <div className="text-sm font-semibold text-foreground">{customer.openTickets}</div>
                                <div className="text-xs text-muted-foreground">Open Tickets</div>
                              </div>
                              <div className="p-2 rounded bg-red-500/20 text-center">
                                <AlertTriangle className="h-3 w-3 text-destructive mx-auto mb-1" />
                                <div className="text-sm font-semibold text-destructive">{customer.criticalTickets}</div>
                                <div className="text-xs text-muted-foreground">Critical</div>
                              </div>
                              <div className="p-2 rounded bg-muted/20 text-center">
                                <TrendingUp className="h-3 w-3 text-chart-4 mx-auto mb-1" />
                                <div className="text-sm font-semibold text-foreground">{customer.escalations}</div>
                                <div className="text-xs text-muted-foreground">Escalations</div>
                              </div>
                              <div className="p-2 rounded bg-muted/20 text-center">
                                <span className={`inline-block h-2 w-2 rounded-full ${customer.sentiment === 'positive' ? 'bg-success' : customer.sentiment === 'negative' ? 'bg-destructive' : customer.sentiment === 'mixed' ? 'bg-chart-4' : 'bg-muted-foreground'}`}></span>
                                <div className={`text-sm font-semibold capitalize mt-1 ${sentimentColors[customer.sentiment]}`}>
                                  {customer.sentiment}
                                </div>
                                <div className="text-xs text-muted-foreground">Sentiment</div>
                              </div>
                            </div>

                            {/* Primary Issues */}
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <div className="text-xs text-muted-foreground mb-1">Primary Issues:</div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {customer.primaryIssues.map((issue, issueIdx) => (
                                    <span
                                      key={issueIdx}
                                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                                    >
                                      {issue}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs text-muted-foreground mb-1">Last Contact</div>
                                <div className="text-xs font-medium text-foreground">{customer.lastContact}</div>
                              </div>
                            </div>
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

      {/* Customer List (when no filter selected) */}
      {!selectedFilter && (
        <div className="space-y-3">
          {data.customers.map((customer, idx) => (
            <div
              key={idx}
              className={`border-l-4 ${riskLevelColors[customer.riskLevel]} rounded-r glass-card p-4 backdrop-blur-md transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                {/* Customer Name & Risk Score */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-base font-semibold text-foreground">{customer.name}</h4>
                    <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${riskLevelTextColors[customer.riskLevel]} border ${customer.riskLevel === 'critical' ? 'border-destructive' : customer.riskLevel === 'high' ? 'border-chart-4' : 'border-chart-3'}`}>
                      {customer.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{customer.id}</span>
                    <span>•</span>
                    <span>CSM: {customer.csm}</span>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="text-right flex-shrink-0">
                  <div className={`text-3xl font-bold ${riskLevelTextColors[customer.riskLevel]}`}>
                    {customer.riskScore}
                  </div>
                  <div className="text-xs text-muted-foreground">Risk Score</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3 pb-3 border-b border-border/50">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="h-3 w-3 text-success" />
                    <span className="text-xs text-muted-foreground">ARR</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">{customer.arr}</div>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-chart-4" />
                    <span className="text-xs text-muted-foreground">Renewal</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">{customer.contractRenewal}</div>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle className="h-3 w-3 text-chart-3" />
                    <span className="text-xs text-muted-foreground">Open Tickets</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">{customer.openTickets}</div>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                    <span className="text-xs text-muted-foreground">Critical</span>
                  </div>
                  <div className="text-sm font-semibold text-destructive">{customer.criticalTickets}</div>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="h-3 w-3 text-chart-4" />
                    <span className="text-xs text-muted-foreground">Escalations</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">{customer.escalations}</div>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className={`h-2 w-2 rounded-full ${customer.sentiment === 'positive' ? 'bg-success' : customer.sentiment === 'negative' ? 'bg-destructive' : customer.sentiment === 'mixed' ? 'bg-chart-4' : 'bg-muted-foreground'}`}></span>
                    <span className="text-xs text-muted-foreground">Sentiment</span>
                  </div>
                  <div className={`text-sm font-semibold capitalize ${sentimentColors[customer.sentiment]}`}>
                    {customer.sentiment}
                  </div>
                </div>
              </div>

              {/* Details Row */}
              <div className="flex items-start justify-between gap-4">
                {/* Primary Issues */}
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Primary Issues:</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {customer.primaryIssues.map((issue, issueIdx) => (
                      <span
                        key={issueIdx}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Contact */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-muted-foreground mb-1">Last Contact</div>
                  <div className="text-xs font-medium text-foreground">{customer.lastContact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
