'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Award, Star, Clock, Target, ThumbsUp, Calendar, Trophy, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgentPerformanceStatsData } from '@/types/widget';

type DetailType = 'tickets' | 'resolution' | 'response' | 'compliance' | 'satisfaction' | 'categories' | 'achievements' | 'feedback' | null;

export function AgentPerformanceStatsWidget({ data }: { data: AgentPerformanceStatsData }) {
  const [selectedDetail, setSelectedDetail] = useState<DetailType>(null);
  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) {
      return <TrendingUp className="h-3 w-3 text-chart-2" />;
    } else if (trend.startsWith('-') && trend.includes('hours')) {
      // Negative time trend is good (faster)
      return <TrendingUp className="h-3 w-3 text-chart-2" />;
    } else if (trend.startsWith('-')) {
      return <TrendingDown className="h-3 w-3 text-destructive" />;
    }
    return null;
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) {
      return 'text-chart-2';
    } else if (trend.startsWith('-') && trend.includes('hours')) {
      return 'text-chart-2'; // Negative time is good
    } else if (trend.startsWith('-')) {
      return 'text-destructive';
    }
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-4 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            {data.title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {data.period}
          </p>
        </div>
      </div>

      {/* Interactive Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Tickets Resolved */}
        <motion.div
          onClick={() => setSelectedDetail(selectedDetail === 'tickets' ? null : 'tickets')}
          className={`glass-card rounded-lg border border-border bg-card/70 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedDetail === 'tickets' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Tickets Resolved</p>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedDetail === 'tickets' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{data.keyMetrics.ticketsResolved.value}</p>
            <div className="flex items-center gap-2 text-xs">
              {getTrendIcon(data.keyMetrics.ticketsResolved.trend)}
              <span className={getTrendColor(data.keyMetrics.ticketsResolved.trend)}>
                {data.keyMetrics.ticketsResolved.trend}
              </span>
              <span className="text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {data.keyMetrics.ticketsResolved.percentile} percentile
              </span>
            </div>
          </div>
        </motion.div>

        {/* Avg Resolution Time */}
        <motion.div
          onClick={() => setSelectedDetail(selectedDetail === 'resolution' ? null : 'resolution')}
          className={`glass-card rounded-lg border border-border bg-card/70 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedDetail === 'resolution' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Avg Resolution Time</p>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedDetail === 'resolution' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{data.keyMetrics.avgResolutionTime.value}</p>
            <div className="flex items-center gap-2 text-xs">
              {getTrendIcon(data.keyMetrics.avgResolutionTime.trend)}
              <span className={getTrendColor(data.keyMetrics.avgResolutionTime.trend)}>
                {data.keyMetrics.avgResolutionTime.trend}
              </span>
              <span className="text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {data.keyMetrics.avgResolutionTime.percentile} percentile
              </span>
            </div>
          </div>
        </motion.div>

        {/* First Response Time */}
        <motion.div
          onClick={() => setSelectedDetail(selectedDetail === 'response' ? null : 'response')}
          className={`glass-card rounded-lg border border-border bg-card/70 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedDetail === 'response' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">First Response Time</p>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedDetail === 'response' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{data.keyMetrics.firstResponseTime.value}</p>
            <div className="flex items-center gap-2 text-xs">
              {getTrendIcon(data.keyMetrics.firstResponseTime.trend)}
              <span className={getTrendColor(data.keyMetrics.firstResponseTime.trend)}>
                {data.keyMetrics.firstResponseTime.trend}
              </span>
              <span className="text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {data.keyMetrics.firstResponseTime.percentile} percentile
              </span>
            </div>
          </div>
        </motion.div>

        {/* SLA Compliance */}
        <motion.div
          onClick={() => setSelectedDetail(selectedDetail === 'compliance' ? null : 'compliance')}
          className={`glass-card rounded-lg border border-border bg-card/70 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedDetail === 'compliance' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Compliance</p>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedDetail === 'compliance' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{data.keyMetrics.slaCompliance.value}</p>
            <div className="flex items-center gap-2 text-xs">
              {getTrendIcon(data.keyMetrics.slaCompliance.trend)}
              <span className={getTrendColor(data.keyMetrics.slaCompliance.trend)}>
                {data.keyMetrics.slaCompliance.trend}
              </span>
              <span className="text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {data.keyMetrics.slaCompliance.percentile} percentile
              </span>
            </div>
          </div>
        </motion.div>

        {/* Customer Satisfaction */}
        <motion.div
          onClick={() => setSelectedDetail(selectedDetail === 'satisfaction' ? null : 'satisfaction')}
          className={`glass-card rounded-lg border border-border bg-card/70 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedDetail === 'satisfaction' ? 'ring-2 ring-primary/50' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Customer Satisfaction</p>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedDetail === 'satisfaction' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{data.keyMetrics.customerSatisfaction.value}</p>
            <div className="flex items-center gap-2 text-xs">
              {getTrendIcon(data.keyMetrics.customerSatisfaction.trend)}
              <span className={getTrendColor(data.keyMetrics.customerSatisfaction.trend)}>
                {data.keyMetrics.customerSatisfaction.trend}
              </span>
              <span className="text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {data.keyMetrics.customerSatisfaction.percentile} percentile
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Metric Detail Panel */}
      <AnimatePresence>
        {selectedDetail && (selectedDetail === 'tickets' || selectedDetail === 'resolution' || selectedDetail === 'response' || selectedDetail === 'compliance' || selectedDetail === 'satisfaction') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-lg border border-primary/30 bg-primary/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {selectedDetail === 'tickets' && <><Target className="h-4 w-4 text-primary" /> Tickets Resolved Details</>}
                  {selectedDetail === 'resolution' && <><Clock className="h-4 w-4 text-primary" /> Resolution Time Details</>}
                  {selectedDetail === 'response' && <><TrendingUp className="h-4 w-4 text-primary" /> First Response Details</>}
                  {selectedDetail === 'compliance' && <><Target className="h-4 w-4 text-primary" /> SLA Compliance Details</>}
                  {selectedDetail === 'satisfaction' && <><Star className="h-4 w-4 text-primary" /> Customer Satisfaction Details</>}
                </h5>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedDetail === 'tickets' && (
                  <>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Value</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.ticketsResolved.value}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Trend</div>
                      <div className={`text-lg font-bold ${getTrendColor(data.keyMetrics.ticketsResolved.trend)}`}>{data.keyMetrics.ticketsResolved.trend}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Percentile</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.ticketsResolved.percentile}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">vs Team Avg</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.ticketsResolved.comparison}</div>
                    </div>
                  </>
                )}
                {selectedDetail === 'resolution' && (
                  <>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Value</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.avgResolutionTime.value}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Trend</div>
                      <div className={`text-lg font-bold ${getTrendColor(data.keyMetrics.avgResolutionTime.trend)}`}>{data.keyMetrics.avgResolutionTime.trend}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Percentile</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.avgResolutionTime.percentile}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">vs Team Avg</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.avgResolutionTime.comparison}</div>
                    </div>
                  </>
                )}
                {selectedDetail === 'response' && (
                  <>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Value</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.firstResponseTime.value}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Trend</div>
                      <div className={`text-lg font-bold ${getTrendColor(data.keyMetrics.firstResponseTime.trend)}`}>{data.keyMetrics.firstResponseTime.trend}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Percentile</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.firstResponseTime.percentile}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">vs Team Avg</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.firstResponseTime.comparison}</div>
                    </div>
                  </>
                )}
                {selectedDetail === 'compliance' && (
                  <>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Value</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.slaCompliance.value}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Trend</div>
                      <div className={`text-lg font-bold ${getTrendColor(data.keyMetrics.slaCompliance.trend)}`}>{data.keyMetrics.slaCompliance.trend}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Percentile</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.slaCompliance.percentile}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">vs Team Avg</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.slaCompliance.comparison}</div>
                    </div>
                  </>
                )}
                {selectedDetail === 'satisfaction' && (
                  <>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Value</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.customerSatisfaction.value}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Trend</div>
                      <div className={`text-lg font-bold ${getTrendColor(data.keyMetrics.customerSatisfaction.trend)}`}>{data.keyMetrics.customerSatisfaction.trend}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">Percentile</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.customerSatisfaction.percentile}</div>
                    </div>
                    <div className="p-3 rounded bg-background/50">
                      <div className="text-xs text-muted-foreground">vs Team Avg</div>
                      <div className="text-lg font-bold text-foreground">{data.keyMetrics.customerSatisfaction.comparison}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Breakdown - Expandable */}
      <motion.div
        onClick={() => setSelectedDetail(selectedDetail === 'categories' ? null : 'categories')}
        className={`glass-card rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedDetail === 'categories' ? 'border-primary bg-primary/10 ring-2 ring-primary/30' : 'border-border bg-card/70'
        }`}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Category Breakdown ({data.categoryBreakdown.length})
          </h5>
          <ChevronRight className={`h-4 w-4 transition-transform ${selectedDetail === 'categories' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
        </div>
        <AnimatePresence>
          {selectedDetail === 'categories' ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              {data.categoryBreakdown.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{category.category}</span>
                      <span className="text-xs text-muted-foreground">{category.count} tickets • Avg {category.avgTime}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground min-w-[3rem] text-right">
                    {category.percentage}%
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {data.categoryBreakdown.slice(0, 3).map((category, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded bg-muted/30 text-foreground">
                  {category.category}: {category.percentage}%
                </span>
              ))}
              <span className="text-xs text-muted-foreground">Click to expand</span>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Achievements - Expandable */}
      {data.achievements && data.achievements.length > 0 && (
        <motion.div
          onClick={() => setSelectedDetail(selectedDetail === 'achievements' ? null : 'achievements')}
          className={`glass-card rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedDetail === 'achievements' ? 'border-primary bg-primary/10 ring-2 ring-primary/30' : 'border-border bg-card/70'
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              Achievements ({data.achievements.length})
            </h5>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedDetail === 'achievements' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <AnimatePresence>
            {selectedDetail === 'achievements' ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                {data.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded border border-border/50 bg-background/50"
                  >
                    <p className="text-sm font-semibold text-foreground mb-1">{achievement.badge}</p>
                    <p className="text-xs text-muted-foreground mb-1">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground">Earned {achievement.dateEarned}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {data.achievements.slice(0, 3).map((achievement, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded bg-amber-500/20 text-chart-4 border border-chart-4/30">
                    {achievement.badge}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground">Click to view all</span>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Recent Customer Feedback - Expandable */}
      {data.feedback && data.feedback.length > 0 && (
        <motion.div
          onClick={() => setSelectedDetail(selectedDetail === 'feedback' ? null : 'feedback')}
          className={`glass-card rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedDetail === 'feedback' ? 'border-primary bg-primary/10 ring-2 ring-primary/30' : 'border-border bg-card/70'
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-primary" />
              Recent Customer Feedback ({data.feedback.length})
            </h5>
            <ChevronRight className={`h-4 w-4 transition-transform ${selectedDetail === 'feedback' ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
          </div>
          <AnimatePresence>
            {selectedDetail === 'feedback' ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                {data.feedback.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded border border-border/50 bg-background/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{item.customer}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < item.rating ? 'text-chart-4 fill-chart-4' : 'text-muted stroke-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic">&quot;{item.comment}&quot;</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => {
                    const avgRating = data.feedback.reduce((sum, f) => sum + f.rating, 0) / data.feedback.length;
                    return (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.round(avgRating) ? 'text-chart-4 fill-chart-4' : 'text-muted stroke-muted'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs text-muted-foreground">
                  {data.feedback.length} reviews • Click to view all
                </span>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
