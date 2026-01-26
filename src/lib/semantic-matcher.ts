// Semantic Query Matcher - Enhanced text similarity with improved accuracy
// Uses advanced text processing for fuzzy matching with collision prevention

import type { SemanticPattern } from './semantic-query-patterns';
import { getPatternsForPersona } from './semantic-query-patterns';
import type { QueryMatch, PersonaId } from './query-detection';

// Stop words to remove for better matching
// NOTE: Removed 'show', 'me' from stop words to prevent over-normalization
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
  'and', 'but', 'if', 'or', 'because', 'until', 'while',
  'please', 'display', 'give', 'get', 'what',
  'i', 'we', 'our', 'you', 'your',
]);

// Common variations to normalize
const WORD_NORMALIZATIONS: Record<string, string> = {
  // Burndown variations
  'burn': 'burn',
  'down': 'down',
  'burndown': 'burndown',
  'burn-down': 'burndown',
  // Ticket variations
  'tix': 'ticket',
  'tickets': 'ticket',
  // Dashboard variations
  'dash': 'dashboard',
  'board': 'dashboard',
  // Performance variations
  'perf': 'performance',
  'perfs': 'performance',
  // Status variations
  'stat': 'status',
  'stats': 'status',
  // Metrics variations
  'kpi': 'metric',
  'kpis': 'metric',
  'metrics': 'metric',
  // Common abbreviations
  'sla': 'sla',
  'kb': 'knowledge',
  'ci': 'cicd',
  'cd': 'cicd',
  'ci/cd': 'cicd',
  'pr': 'pullrequest',
  'prs': 'pullrequest',
  'qbr': 'businessreview',
  'nps': 'nps',
  'dora': 'dora',
  // Workload variations
  'load': 'workload',
  // Sprint variations
  'iteration': 'sprint',
  'cycle': 'sprint',
  // Budget variations
  'spending': 'budget',
  'expenditure': 'budget',
  'costs': 'budget',
  'financials': 'budget',
};

// Compound word patterns that should stay together
// IMPORTANT: These are matched BEFORE tokenization to preserve meaning
const COMPOUND_WORDS: Record<string, string> = {
  // Budget-related compounds (PRIORITY - to prevent collision with analytics)
  'team budget': 'teambudget',
  'budget overview': 'budgetoverview',
  'budget allocation': 'budgetallocation',
  'budget status': 'budgetstatus',
  'budget utilization': 'budgetutilization',
  'budget tracking': 'budgettracking',
  'department budget': 'departmentbudget',
  'budget burn': 'budgetburn',
  'burn rate': 'burnrate',
  // Burndown variations
  'burn down': 'burndown',
  'top performers': 'topperformers',
  'bottom performers': 'bottomperformers',
  'team workload': 'teamworkload',
  'sprint burndown': 'sprintburndown',
  'sprint burn down': 'sprintburndown',
  // Code quality
  'code quality': 'codequality',
  'test coverage': 'testcoverage',
  'code coverage': 'codecoverage',
  'technical debt': 'technicaldebt',
  'tech debt': 'technicaldebt',
  'pull request': 'pullrequest',
  'pull requests': 'pullrequest',
  'code review': 'codereview',
  'code reviews': 'codereview',
  // Risk-related
  'customer risk': 'customerrisk',
  'churn risk': 'churnrisk',
  'at risk': 'atrisk',
  'risk analysis': 'riskanalysis',
  'risk register': 'riskregister',
  // Contract/Government
  'contract performance': 'contractperformance',
  'vendor compliance': 'vendorcompliance',
  'deliverable review': 'deliverablereview',
  'program health': 'programhealth',
  'stakeholder engagement': 'stakeholderengagement',
  'requirements tracking': 'requirementstracking',
  'change request': 'changerequest',
  // Resource/Capacity
  'resource capacity': 'resourcecapacity',
  'resource allocation': 'resourceallocation',
  'team velocity': 'teamvelocity',
  'deployment pipeline': 'deploymentpipeline',
  'blocker resolution': 'blockerresolution',
  // Task management
  'task kanban': 'taskkanban',
  'kanban board': 'kanbanboard',
  'milestone tracking': 'milestonetracking',
  'milestone status': 'milestonestatus',
  // Summary/Dashboard
  'executive summary': 'executivesummary',
  'analytics dashboard': 'analyticsdashboard',
  'detailed analytics': 'detailedanalytics',
  // Knowledge
  'knowledge base': 'knowledgebase',
  'knowledge article': 'knowledgearticle',
  'password reset': 'passwordreset',
  // Support
  'call prep': 'callprep',
  'call preparation': 'callprep',
  'similar tickets': 'similartickets',
  'ticket detail': 'ticketdetail',
  'ticket list': 'ticketlist',
  // Personal
  'my performance': 'myperformance',
  'my stats': 'mystats',
  'my dashboard': 'mydashboard',
  'my tickets': 'mytickets',
  'my workload': 'myworkload',
  // Updates
  'daily update': 'dailyupdate',
  'morning update': 'morningupdate',
  'status update': 'statusupdate',
  // Business
  'business review': 'businessreview',
  'product adoption': 'productadoption',
  'feature usage': 'featureusage',
  'sentiment analysis': 'sentimentanalysis',
  // SLA
  'sla performance': 'slaperformance',
  'sla compliance': 'slacompliance',
  'sla status': 'slastatus',
  // DORA
  'dora metrics': 'dorametrics',
  // Zoho
  'zoho tickets': 'zohotickets',
  'zoho desk': 'zohodesk',
  // User
  'end user': 'enduser',
  'user request': 'userrequest',
  // Agent
  'agent performance': 'agentperformance',
  'agent dashboard': 'agentdashboard',
  'agent comparison': 'agentcomparison',
  // Customer
  'customer health': 'customerhealth',
  'customer success': 'customersuccess',
};

// High-priority key terms that significantly affect matching
// These terms are domain-specific and should carry more weight
const KEY_TERMS = [
  // Core entities
  'ticket', 'dashboard', 'performance', 'sprint', 'burndown',
  'status', 'team', 'workload', 'risk', 'compliance',
  // Integrations
  'zoho', 'desk',
  // Government/Contract
  'contract', 'deliverable', 'vendor', 'stakeholder', 'velocity',
  // Budget-specific (added to prevent analytics collision)
  'budget', 'allocation', 'utilization', 'spending', 'burn', 'rate',
  // Metrics
  'sla', 'dora', 'metric', 'kpi',
  // Support
  'agent', 'customer', 'escalation', 'resolution',
  // Project
  'milestone', 'blocker', 'kanban', 'velocity',
  // Code
  'code', 'review', 'quality', 'coverage', 'deployment',
  // Analytics - but lower priority than specific terms
  'analytics', 'summary', 'executive',
];

/**
 * Normalize a query string for better matching
 */
function normalizeQuery(query: string): string {
  let normalized = query.toLowerCase().trim();

  // Pre-process: normalize hyphens to spaces for compound matching
  normalized = normalized.replace(/-/g, ' ');

  // Replace compound words first (before splitting) - ORDER MATTERS
  // Sort by length descending to match longer phrases first
  const sortedCompounds = Object.entries(COMPOUND_WORDS)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [compound, replacement] of sortedCompounds) {
    normalized = normalized.replace(new RegExp(compound, 'gi'), replacement);
  }

  // Split into tokens
  const tokens = normalized.split(/\s+/);

  // Process each token
  const processedTokens = tokens
    .map(token => {
      // Remove punctuation
      token = token.replace(/[^\w]/g, '');
      // Apply normalizations
      return WORD_NORMALIZATIONS[token] || token;
    })
    .filter(token => token.length > 0 && !STOP_WORDS.has(token));

  return processedTokens.join(' ');
}

/**
 * Calculate similarity between two normalized strings
 * Uses multiple algorithms and returns weighted score
 */
function calculateSimilarity(query: string, target: string): number {
  const normalizedQuery = normalizeQuery(query);
  const normalizedTarget = normalizeQuery(target);

  // Exact match after normalization
  if (normalizedQuery === normalizedTarget) {
    return 1.0;
  }

  // Token-based Jaccard similarity
  const queryTokens = new Set(normalizedQuery.split(' ').filter(t => t.length > 0));
  const targetTokens = new Set(normalizedTarget.split(' ').filter(t => t.length > 0));

  if (queryTokens.size === 0 || targetTokens.size === 0) {
    return 0;
  }

  const intersection = new Set([...queryTokens].filter(x => targetTokens.has(x)));
  const union = new Set([...queryTokens, ...targetTokens]);

  const jaccardScore = intersection.size / union.size;

  // Substring containment bonus
  let containmentBonus = 0;
  const queryStr = normalizedQuery.replace(/\s+/g, '');
  const targetStr = normalizedTarget.replace(/\s+/g, '');

  if (targetStr.includes(queryStr) || queryStr.includes(targetStr)) {
    containmentBonus = 0.25;
  }

  // Key term matching bonus - ENHANCED
  let keyTermBonus = 0;
  let queryKeyTerms = 0;
  let matchedKeyTerms = 0;

  for (const term of KEY_TERMS) {
    const queryHasTerm = normalizedQuery.includes(term);
    const targetHasTerm = normalizedTarget.includes(term);

    if (queryHasTerm) {
      queryKeyTerms++;
      if (targetHasTerm) {
        matchedKeyTerms++;
        keyTermBonus += 0.12;
      } else {
        // PENALTY: Query has a key term that target doesn't have
        keyTermBonus -= 0.08;
      }
    }
  }

  // Bonus for matching ALL key terms in query
  if (queryKeyTerms > 0 && matchedKeyTerms === queryKeyTerms) {
    keyTermBonus += 0.15;
  }

  keyTermBonus = Math.max(0, Math.min(keyTermBonus, 0.4)); // Clamp between 0 and 0.4

  // Levenshtein distance for partial matches
  const levenshteinScore = 1 - (levenshteinDistance(queryStr, targetStr) / Math.max(queryStr.length, targetStr.length, 1));

  // Token coverage bonus - what percentage of query tokens are in target
  const tokenCoverage = intersection.size / queryTokens.size;
  const coverageBonus = tokenCoverage * 0.15;

  // Weighted combination - REBALANCED
  const finalScore = (jaccardScore * 0.35) +
                     (levenshteinScore * 0.15) +
                     containmentBonus +
                     keyTermBonus +
                     coverageBonus;

  return Math.min(finalScore, 1.0);
}

/**
 * Levenshtein distance for fuzzy string matching
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Find the best matching pattern for a query
 * IMPROVED: Higher threshold and better scoring
 */
export function findSemanticMatch(
  query: string,
  personaId: PersonaId
): QueryMatch | null {
  const patterns = getPatternsForPersona(personaId);

  let bestMatch: SemanticPattern | null = null;
  let bestScore = 0;
  let bestExample = '';

  for (const pattern of patterns) {
    // Check each example query for this pattern
    for (const exampleQuery of pattern.exampleQueries) {
      const score = calculateSimilarity(query, exampleQuery);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = pattern;
        bestExample = exampleQuery;
      }
    }
  }

  // INCREASED THRESHOLD: from 0.35 to 0.50 to reduce false positives
  const MATCH_THRESHOLD = 0.50;

  // Debug logging for development (can be disabled in production)
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SEMANTIC_MATCH === 'true') {
    console.log(`[SemanticMatch] Query: "${query}" → Best: "${bestExample}" (${bestMatch?.id}) Score: ${bestScore.toFixed(3)}`);
  }

  if (bestMatch && bestScore >= MATCH_THRESHOLD) {
    return {
      widgetType: bestMatch.widgetType,
      widgetData: bestMatch.widgetData,
      responseText: bestMatch.responseText,
    };
  }

  return null;
}

/**
 * Debug function to show match scores for all patterns
 */
export function debugSemanticMatch(
  query: string,
  personaId: PersonaId
): { pattern: string; score: number; example: string; widgetType: string }[] {
  const patterns = getPatternsForPersona(personaId);
  const results: { pattern: string; score: number; example: string; widgetType: string }[] = [];

  for (const pattern of patterns) {
    let bestExampleScore = 0;
    let bestExample = '';

    for (const exampleQuery of pattern.exampleQueries) {
      const score = calculateSimilarity(query, exampleQuery);
      if (score > bestExampleScore) {
        bestExampleScore = score;
        bestExample = exampleQuery;
      }
    }

    results.push({
      pattern: pattern.id,
      score: bestExampleScore,
      example: bestExample,
      widgetType: pattern.widgetType,
    });
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Test utility to validate pattern matching
 * Returns true if query matches expected pattern
 */
export function validateMatch(
  query: string,
  personaId: PersonaId,
  expectedWidgetType: string
): { success: boolean; actualWidgetType: string | null; score: number } {
  const match = findSemanticMatch(query, personaId);
  const debug = debugSemanticMatch(query, personaId);
  const topMatch = debug[0];

  return {
    success: match?.widgetType === expectedWidgetType,
    actualWidgetType: match?.widgetType || null,
    score: topMatch?.score || 0,
  };
}
