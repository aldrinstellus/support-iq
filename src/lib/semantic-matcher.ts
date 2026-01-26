// Semantic Query Matcher - Vector-free semantic matching using text similarity
// Uses advanced text processing for fuzzy matching without API calls

import type { SemanticPattern } from './semantic-query-patterns';
import { getPatternsForPersona } from './semantic-query-patterns';
import type { QueryMatch, PersonaId } from './query-detection';

// Stop words to remove for better matching
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
  'show', 'me', 'please', 'display', 'give', 'get', 'what',
  'i', 'my', 'we', 'our', 'you', 'your',
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
};

// Compound word patterns that should stay together
const COMPOUND_WORDS: Record<string, string> = {
  'burn down': 'burndown',
  'top performers': 'topperformers',
  'bottom performers': 'bottomperformers',
  'team workload': 'teamworkload',
  'sprint burndown': 'sprintburndown',
  'sprint burn down': 'sprintburndown',
  'code quality': 'codequality',
  'test coverage': 'testcoverage',
  'code coverage': 'codecoverage',
  'technical debt': 'technicaldebt',
  'tech debt': 'technicaldebt',
  'pull request': 'pullrequest',
  'pull requests': 'pullrequest',
  'customer risk': 'customerrisk',
  'churn risk': 'churnrisk',
  'at risk': 'atrisk',
  'risk analysis': 'riskanalysis',
  'contract performance': 'contractperformance',
  'vendor compliance': 'vendorcompliance',
  'deliverable review': 'deliverablereview',
  'program health': 'programhealth',
  'stakeholder engagement': 'stakeholderengagement',
  'requirements tracking': 'requirementstracking',
  'change request': 'changerequest',
  'resource capacity': 'resourcecapacity',
  'resource allocation': 'resourceallocation',
  'team velocity': 'teamvelocity',
  'deployment pipeline': 'deploymentpipeline',
  'blocker resolution': 'blockerresolution',
  'task kanban': 'taskkanban',
  'kanban board': 'kanbanboard',
  'executive summary': 'executivesummary',
  'analytics dashboard': 'analyticsdashboard',
  'knowledge base': 'knowledgebase',
  'password reset': 'passwordreset',
  'call prep': 'callprep',
  'call preparation': 'callprep',
  'similar tickets': 'similartickets',
  'my performance': 'myperformance',
  'my stats': 'mystats',
  'my dashboard': 'mydashboard',
  'daily update': 'dailyupdate',
  'morning update': 'morningupdate',
  'business review': 'businessreview',
  'product adoption': 'productadoption',
  'feature usage': 'featureusage',
  'sentiment analysis': 'sentimentanalysis',
  'sla performance': 'slaperformance',
  'sla compliance': 'slacompliance',
  'dora metrics': 'dorametrics',
  'zoho tickets': 'zohotickets',
  'zoho desk': 'zohodesk',
  'end user': 'enduser',
  'user request': 'userrequest',
};

/**
 * Normalize a query string for better matching
 */
function normalizeQuery(query: string): string {
  let normalized = query.toLowerCase().trim();

  // Replace compound words first (before splitting)
  for (const [compound, replacement] of Object.entries(COMPOUND_WORDS)) {
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

  if (normalizedQuery === normalizedTarget) {
    return 1.0;
  }

  // Token-based Jaccard similarity
  const queryTokens = new Set(normalizedQuery.split(' '));
  const targetTokens = new Set(normalizedTarget.split(' '));

  const intersection = new Set([...queryTokens].filter(x => targetTokens.has(x)));
  const union = new Set([...queryTokens, ...targetTokens]);

  const jaccardScore = intersection.size / union.size;

  // Substring containment bonus
  let containmentBonus = 0;
  const queryStr = normalizedQuery.replace(/\s+/g, '');
  const targetStr = normalizedTarget.replace(/\s+/g, '');

  if (targetStr.includes(queryStr) || queryStr.includes(targetStr)) {
    containmentBonus = 0.3;
  }

  // Key term matching bonus
  let keyTermBonus = 0;
  const keyTerms = ['ticket', 'dashboard', 'performance', 'sprint', 'burndown',
                    'status', 'team', 'workload', 'risk', 'compliance', 'zoho',
                    'contract', 'deliverable', 'vendor', 'stakeholder', 'velocity'];

  for (const term of keyTerms) {
    if (normalizedQuery.includes(term) && normalizedTarget.includes(term)) {
      keyTermBonus += 0.15;
    }
  }
  keyTermBonus = Math.min(keyTermBonus, 0.3); // Cap bonus

  // Levenshtein distance for partial matches
  const levenshteinScore = 1 - (levenshteinDistance(queryStr, targetStr) / Math.max(queryStr.length, targetStr.length));

  // Weighted combination
  const finalScore = (jaccardScore * 0.4) +
                     (levenshteinScore * 0.2) +
                     containmentBonus +
                     keyTermBonus;

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
 */
export function findSemanticMatch(
  query: string,
  personaId: PersonaId
): QueryMatch | null {
  const patterns = getPatternsForPersona(personaId);

  let bestMatch: SemanticPattern | null = null;
  let bestScore = 0;

  for (const pattern of patterns) {
    // Check each example query for this pattern
    for (const exampleQuery of pattern.exampleQueries) {
      const score = calculateSimilarity(query, exampleQuery);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = pattern;
      }
    }
  }

  // Threshold for accepting a match
  const MATCH_THRESHOLD = 0.35;

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
): { pattern: string; score: number; example: string }[] {
  const patterns = getPatternsForPersona(personaId);
  const results: { pattern: string; score: number; example: string }[] = [];

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
    });
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
