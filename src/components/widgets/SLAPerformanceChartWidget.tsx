'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Target,
  ChevronRight,
  X,
  BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SLAPerformanceChartData } from '@/types/widget';

type FilterType = 'on-target' | 'warning' | 'critical' | 'breaches' | 'root-causes' | null;

export function SLAPerformanceChartWidget({ data }: { data: SLAPerformanceChartData }) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [expandedBreach, setExpandedBreach] = useState<string | null>(null);

  const trendIcons = {
    improving: TrendingUp,
    stable: Minus,
    declining: TrendingDown,
  };

  const trendColors = {
    improving: 'text-success',
    stable: 'text-muted-foreground',
    declining: 'text-destructive',
  };

  // Calculate counts by status
  const onTargetCategories = data.byCategory.filter(c => c.compliance >= 90);
  const warningCategories = data.byCategory.filter(c => c.compliance >= 75 && c.compliance < 90);
  const criticalCategories = data.byCategory.filter(c => c.compliance < 75);
  const totalBreaches = data.byCategory.reduce((sum, c) => sum + c.breaches, 0);

  const handleCardClick = (filter: FilterType) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
    setExpandedBreach(null);
  };

  const getFilteredCategories = () => {
    switch (selectedFilter) {
      case 'on-target': return onTargetCategories;
      case 'warning': return warningCategories;
      case 'critical': return criticalCategories;
      default: return [];
    }
  };

  const filteredCategories = getFilteredCategories();

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'on-target': return 'On Target SLAs';
      case 'warning': return 'Warning SLAs';
      case 'critical': return 'Critical SLAs';
      case 'breaches': return 'SLA Breaches';
      case 'root-causes': return 'Root Cause Analysis';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 my-4">
      {/* Header with Overall Compliance */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
          <p className="text-sm text-muted-foreground">Overall SLA performance analysis</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <div
              className={`text-4xl font-bold ${
                data.overallCompliance >= data.target
                  ? 'text-success'
                  : data.overallCompliance >= data.target - 5
                  ? 'text-chart-4'
                  : 'text-destructive'
              }`}
            >
              {data.overallCompliance}%
            </div>
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Overall</div>
              <div className="text-xs text-muted-foreground">
                Target: {data.target}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          onClick={() => handleCardClick('on-target')}
          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md bg-emerald-500/20 border-success/30 ${
            selectedFilter === 'on-target' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'on-target' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-2xl font-bold text-success">{onTargetCategories.length}</div>
          <div className="text-xs text-muted-foreground">On Target</div>
          <div className="text-xs text-muted-foreground mt-1">Click for details</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('warning')}
          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md bg-amber-500/20 border-chart-4/30 ${
            selectedFilter === 'warning' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-4 w-4 text-chart-4" />
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'warning' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-2xl font-bold text-chart-4">{warningCategories.length}</div>
          <div className="text-xs text-muted-foreground">Warning</div>
          <div className="text-xs text-muted-foreground mt-1">Click for details</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('critical')}
          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md bg-red-500/20 border-destructive/30 ${
            selectedFilter === 'critical' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'critical' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-2xl font-bold text-destructive">{criticalCategories.length}</div>
          <div className="text-xs text-muted-foreground">Critical</div>
          <div className="text-xs text-muted-foreground mt-1">Click for details</div>
        </motion.div>

        <motion.div
          onClick={() => handleCardClick('breaches')}
          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md bg-red-500/20 border-destructive/30 ${
            selectedFilter === 'breaches' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-4 w-4 text-destructive" />
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'breaches' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-2xl font-bold text-destructive">{totalBreaches}</div>
          <div className="text-xs text-muted-foreground">Total Breaches</div>
          <div className="text-xs text-muted-foreground mt-1">Click for details</div>
        </motion.div>
      </div>

      {/* Filtered Categories Detail Panel */}
      <AnimatePresence>
        {selectedFilter && (selectedFilter === 'on-target' || selectedFilter === 'warning' || selectedFilter === 'critical') && (
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
                  <Target className="h-4 w-4 text-primary" />
                  {getFilterLabel()} ({filteredCategories.length})
                </h4>
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                {filteredCategories.map((category, idx) => {
                  const TrendIcon = trendIcons[category.trend];
                  const isWarning = category.compliance >= 75 && category.compliance < 90;
                  const isCritical = category.compliance < 75;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-l-4 rounded-r p-3 ${
                        isCritical
                          ? 'border-l-destructive bg-red-500/20'
                          : isWarning
                          ? 'border-l-chart-4 bg-amber-500/20'
                          : 'border-l-success bg-emerald-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-semibold text-foreground">{category.category}</h5>
                            <TrendIcon className={`h-3 w-3 ${trendColors[category.trend]}`} />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Target: {category.target} • Avg Time: {category.avgTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            isCritical ? 'text-destructive' : isWarning ? 'text-chart-4' : 'text-success'
                          }`}>
                            {category.compliance}%
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isCritical ? 'bg-destructive' : isWarning ? 'bg-chart-4' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(category.compliance, 100)}%` }}
                        />
                      </div>
                      {category.breaches > 0 && (
                        <div className="flex items-center gap-1 text-xs mt-2">
                          <AlertTriangle className="h-3 w-3 text-chart-4" />
                          <span className="text-muted-foreground">
                            {category.breaches} breach{category.breaches !== 1 ? 'es' : ''} this period
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breaches Detail Panel */}
      <AnimatePresence>
        {selectedFilter === 'breaches' && data.topBreaches && data.topBreaches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-lg border border-destructive/30 bg-red-500/20 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  SLA Breaches ({data.topBreaches.length})
                </h4>
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-3">
                {data.topBreaches.map((breach, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setExpandedBreach(expandedBreach === breach.ticketId ? null : breach.ticketId)}
                    className="border border-border/50 rounded-lg p-3 bg-card/50 hover:bg-card/70 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-primary font-semibold">{breach.ticketId}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-medium">
                            {breach.priority}
                          </span>
                          <ChevronRight className={`h-3 w-3 transition-transform ${expandedBreach === breach.ticketId ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="text-sm text-foreground font-medium mb-1">{breach.customer}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">SLA Target</div>
                        <div className="text-sm font-semibold text-foreground">{breach.slaTarget}</div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedBreach === breach.ticketId && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-border/50"
                        >
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Assigned to:</span>
                              <span className="ml-1 text-foreground">{breach.assignedTo}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Actual Time:</span>
                              <span className="ml-1 text-destructive font-medium">{breach.actualTime}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 mt-2">
                            <AlertCircle className="h-3 w-3 text-chart-4 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-muted-foreground">{breach.reason}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLA Categories Breakdown - shows when no filter is selected */}
      {!selectedFilter && (
        <div className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Target className="h-4 w-4 text-primary" />
            SLA Categories
          </h4>
          <div className="space-y-3">
            {data.byCategory.map((category, idx) => {
            const TrendIcon = trendIcons[category.trend];
            const isWarning = category.compliance >= 75 && category.compliance < 90;
            const isCritical = category.compliance < 75;

            return (
              <div
                key={idx}
                className={`border-l-4 rounded-r p-3 transition-all duration-200 hover:shadow-sm ${
                  isCritical
                    ? 'border-l-destructive bg-red-500/20'
                    : isWarning
                    ? 'border-l-chart-4 bg-amber-500/20'
                    : 'border-l-success bg-emerald-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-semibold text-foreground">
                        {category.category}
                      </h5>
                      <TrendIcon
                        className={`h-3 w-3 ${trendColors[category.trend]}`}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Target: {category.target} • Avg Time: {category.avgTime}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        isCritical
                          ? 'text-destructive'
                          : isWarning
                          ? 'text-chart-4'
                          : 'text-success'
                      }`}
                    >
                      {category.compliance}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCritical
                          ? 'bg-destructive'
                          : isWarning
                          ? 'bg-chart-4'
                          : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(category.compliance, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Breaches Count */}
                {category.breaches > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3 text-chart-4" />
                    <span className="text-muted-foreground">
                      {category.breaches} breach{category.breaches !== 1 ? 'es' : ''} this period
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Trend Chart Visualization */}
      {data.trendData && data.trendData.labels.length > 0 && (
        <div className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Weekly Trend
          </h4>
          {/* Simple text-based trend visualization (can be replaced with chart library) */}
          <div className="space-y-2">
            {data.trendData.datasets.map((dataset, idx) => (
              <div key={idx} className="border-b border-border/50 pb-2 last:border-b-0">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {dataset.label}
                </div>
                <div className="flex items-center gap-2">
                  {data.trendData.labels.map((label, labelIdx) => (
                    <div key={labelIdx} className="flex-1 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{label}</div>
                      <div
                        className={`text-sm font-semibold ${
                          dataset.data[labelIdx] >= 90
                            ? 'text-success'
                            : dataset.data[labelIdx] >= 75
                            ? 'text-chart-4'
                            : 'text-destructive'
                        }`}
                      >
                        {dataset.data[labelIdx]}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top SLA Breaches - Clickable Card when not expanded */}
      {!selectedFilter && data.topBreaches && data.topBreaches.length > 0 && (
        <motion.div
          onClick={() => handleCardClick('breaches')}
          className="glass-card rounded-lg border border-destructive/30 bg-red-500/20 p-4 backdrop-blur-md cursor-pointer hover:border-destructive/50 transition-all duration-200"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Top SLA Breaches ({data.topBreaches.length})
            </h4>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {data.topBreaches.slice(0, 3).map((breach, idx) => (
              <span key={idx} className="text-xs px-2 py-1 rounded bg-card/50 text-foreground">
                {breach.ticketId}
              </span>
            ))}
            {data.topBreaches.length > 3 && (
              <span className="text-xs text-muted-foreground">+{data.topBreaches.length - 3} more</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Click to view all breaches</div>
        </motion.div>
      )}

      {/* Root Cause Analysis - Clickable expandable card */}
      {data.rootCauses && data.rootCauses.length > 0 && (
        <motion.div
          className={`glass-card rounded-lg border p-4 backdrop-blur-md cursor-pointer transition-all duration-200 ${
            selectedFilter === 'root-causes'
              ? 'border-primary bg-primary/20 ring-2 ring-primary/30'
              : 'border-border bg-card/70 hover:border-primary/50'
          }`}
          onClick={() => handleCardClick('root-causes')}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Root Cause Analysis ({data.rootCauses.length})
            </h4>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedFilter === 'root-causes' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>

          <AnimatePresence>
            {selectedFilter === 'root-causes' ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="space-y-3">
                  {data.rootCauses.map((cause, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-4 pb-3 border-b border-border/50 last:border-b-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h5 className="text-sm font-semibold text-foreground">{cause.cause}</h5>
                          <span className="text-xs font-mono text-muted-foreground">
                            {cause.count} cases
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{cause.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-2xl font-bold text-chart-4">{cause.percentage}%</div>
                        <div className="text-xs text-muted-foreground">of breaches</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Simple pie chart visualization using flex bars */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex h-4 rounded-full overflow-hidden">
                    {data.rootCauses.map((cause, idx) => (
                      <div
                        key={idx}
                        className={`transition-all duration-300 ${
                          idx === 0
                            ? 'bg-destructive'
                            : idx === 1
                            ? 'bg-chart-4'
                            : idx === 2
                            ? 'bg-chart-3'
                            : 'bg-muted'
                        }`}
                        style={{ width: `${cause.percentage}%` }}
                        title={`${cause.cause}: ${cause.percentage}%`}
                      ></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {data.rootCauses.slice(0, 2).map((cause, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded bg-muted/30 text-foreground">
                    {cause.cause}: {cause.percentage}%
                  </span>
                ))}
                <span className="text-xs text-muted-foreground">Click to expand</span>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="glass-card rounded-lg border border-primary/30 bg-primary/20 p-4 backdrop-blur-md">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Recommendations
          </h4>
          <div className="space-y-2">
            {data.recommendations.map((recommendation, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-foreground/90">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
