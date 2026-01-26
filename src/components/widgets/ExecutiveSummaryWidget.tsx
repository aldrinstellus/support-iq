'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Activity,
  ChevronRight,
  X,
  Lightbulb,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExecutiveSummaryData } from '@/types/widget';

type FilterType = 'success' | 'warning' | 'critical' | 'info' | 'insights' | 'actions' | null;

export function ExecutiveSummaryWidget({ data }: { data: ExecutiveSummaryData }) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);

  // Defensive check for malformed data
  if (!data || typeof data !== 'object') {
    console.error('[ExecutiveSummaryWidget] Invalid data received:', data);
    return (
      <div className="my-4 rounded-lg border border-destructive/30 bg-red-500/20 p-4">
        <p className="text-sm text-destructive">Unable to load executive summary: Invalid data</p>
      </div>
    );
  }

  if (!data.sections || !Array.isArray(data.sections)) {
    console.error('[ExecutiveSummaryWidget] Missing or invalid sections:', data);
    return (
      <div className="my-4 rounded-lg border border-destructive/30 bg-red-500/20 p-4">
        <p className="text-sm text-destructive">Unable to load executive summary: Missing sections data</p>
      </div>
    );
  }

  const statusIcons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    critical: AlertCircle,
    info: Activity,
  };

  const statusColors = {
    success: 'border-success/30 bg-emerald-500/20',
    warning: 'border-chart-4/30 bg-amber-500/20',
    critical: 'border-destructive/30 bg-red-500/20',
    info: 'border-chart-3/30 bg-lime-500/20',
  };

  const statusTextColors = {
    success: 'text-success',
    warning: 'text-chart-4',
    critical: 'text-destructive',
    info: 'text-chart-3',
  };

  const priorityColors = {
    critical: 'border-l-destructive bg-red-500/20',
    high: 'border-l-chart-4 bg-amber-500/20',
    medium: 'border-l-chart-3 bg-lime-500/20',
    low: 'border-l-muted-foreground/50 bg-muted/20',
  };

  // Calculate counts for each status
  const statusCounts = {
    success: data.sections.filter(s => s.status === 'success').length,
    warning: data.sections.filter(s => s.status === 'warning').length,
    critical: data.sections.filter(s => s.status === 'critical').length,
    info: data.sections.filter(s => s.status === 'info').length,
  };

  // Filter sections based on selected filter
  const getFilteredSections = () => {
    if (!selectedFilter || selectedFilter === 'insights' || selectedFilter === 'actions') return [];
    return data.sections.filter(s => s.status === selectedFilter);
  };

  const filteredSections = getFilteredSections();

  const handleCardClick = (filter: FilterType) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'success': return 'Metrics On Target';
      case 'warning': return 'Metrics Needing Attention';
      case 'critical': return 'Critical Metrics';
      case 'info': return 'Informational Metrics';
      case 'insights': return 'Key Insights';
      case 'actions': return 'Recommended Actions';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">{data.date}</p>
        </div>
      </div>

      {/* Interactive Summary Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.sections.map((section, idx) => {
          const StatusIcon = statusIcons[section.status];
          const changeIsPositive = section.change.startsWith('+');
          const changeIsNegative = section.change.startsWith('-');
          const isSelected = selectedFilter === section.status;

          return (
            <motion.div
              key={idx}
              onClick={() => handleCardClick(section.status)}
              className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${statusColors[section.status]} ${
                isSelected ? 'ring-2 ring-primary/50' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-3">
                <StatusIcon className={`h-5 w-5 ${statusTextColors[section.status]}`} />
                <div className="flex items-center gap-1">
                  {section.change && (
                    <div className="flex items-center gap-1">
                      {changeIsPositive && <TrendingUp className="h-3.5 w-3.5 text-success" />}
                      {changeIsNegative && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                      <span
                        className={`text-xs font-medium ${
                          changeIsPositive
                            ? 'text-success'
                            : changeIsNegative
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {section.change}
                      </span>
                    </div>
                  )}
                  <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${isSelected ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                </div>
              </div>

              <div className="text-2xl font-bold mb-1 text-foreground">{section.value}</div>
              <div className="text-xs font-medium text-foreground/80 mb-2">{section.title}</div>
              <p className="text-xs text-muted-foreground">{section.description}</p>
              <div className="text-xs text-muted-foreground mt-2">Click for details</div>
            </motion.div>
          );
        })}
      </div>

      {/* Filtered Sections Detail Panel */}
      <AnimatePresence>
        {selectedFilter && selectedFilter !== 'insights' && selectedFilter !== 'actions' && (
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
                  {statusIcons[selectedFilter] && (() => {
                    const Icon = statusIcons[selectedFilter];
                    return <Icon className={`h-4 w-4 ${statusTextColors[selectedFilter]}`} />;
                  })()}
                  {getFilterLabel()} ({filteredSections.length})
                </h4>
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                {filteredSections.map((section, idx) => {
                  const StatusIcon = statusIcons[section.status];
                  const changeIsPositive = section.change.startsWith('+');
                  const changeIsNegative = section.change.startsWith('-');

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`rounded-lg border p-4 ${statusColors[section.status]}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-5 w-5 ${statusTextColors[section.status]}`} />
                          <span className="text-sm font-semibold text-foreground">{section.title}</span>
                        </div>
                        {section.change && (
                          <div className="flex items-center gap-1">
                            {changeIsPositive && <TrendingUp className="h-3.5 w-3.5 text-success" />}
                            {changeIsNegative && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                            <span
                              className={`text-xs font-medium ${
                                changeIsPositive
                                  ? 'text-success'
                                  : changeIsNegative
                                  ? 'text-destructive'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {section.change}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-2">{section.value}</div>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Insights */}
      {data.keyInsights && Array.isArray(data.keyInsights) && data.keyInsights.length > 0 && (
        <motion.div
          className={`glass-card rounded-lg border p-4 backdrop-blur-md cursor-pointer transition-all duration-200 ${
            selectedFilter === 'insights'
              ? 'border-primary bg-primary/20 ring-2 ring-primary/30'
              : 'border-border bg-card/70 hover:border-primary/50'
          }`}
          onClick={() => handleCardClick('insights')}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Lightbulb className="h-4 w-4 text-primary" />
              Key Insights ({data.keyInsights.length})
            </h4>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'insights' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>

          <AnimatePresence>
            {selectedFilter === 'insights' ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <ul className="space-y-2">
                  {data.keyInsights.map((insight, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-2 p-2 rounded bg-muted/30"
                    >
                      <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                      <span className="text-sm text-foreground/90 leading-relaxed">{insight}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <p className="text-xs text-muted-foreground">Click to view all insights</p>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Recommended Actions */}
      {data.recommendedActions && Array.isArray(data.recommendedActions) && data.recommendedActions.length > 0 && (
        <motion.div
          className={`glass-card rounded-lg border p-4 backdrop-blur-md cursor-pointer transition-all duration-200 ${
            selectedFilter === 'actions'
              ? 'border-primary bg-primary/20 ring-2 ring-primary/30'
              : 'border-border bg-card/70 hover:border-primary/50'
          }`}
          onClick={() => handleCardClick('actions')}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <AlertCircle className="h-4 w-4 text-primary" />
              Recommended Actions ({data.recommendedActions.length})
            </h4>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'actions' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>

          <AnimatePresence>
            {selectedFilter === 'actions' ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {data.recommendedActions.map((action, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`border-l-4 ${priorityColors[action.priority]} rounded-r p-3 transition-all duration-200 hover:shadow-sm`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {action.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{action.action}</p>
                    <p className="text-xs text-muted-foreground">{action.reason}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                {data.recommendedActions.slice(0, 3).map((action, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      action.priority === 'critical' ? 'bg-red-500/20 text-destructive' :
                      action.priority === 'high' ? 'bg-amber-500/20 text-chart-4' :
                      'bg-muted text-muted-foreground'
                    }`}
                  >
                    {action.priority}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground">Click to view all</span>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
