// Test script for team-reported issues
import { detectWidgetQuery } from './src/lib/query-detection.ts';

const teamQueries = [
  // GOV 1.8
  { persona: 'cor', query: 'Show me contract deliverables status', expected: 'deliverable-review-list', issue: 'GOV 1.8' },

  // GOV 1.9, 1.10 - Should be budget-utilization-dashboard
  { persona: 'cor', query: 'Show me budget tracking dashboard', expected: 'budget-utilization-dashboard', issue: 'GOV 1.9' },
  { persona: 'cor', query: 'Budget remaining for contracts', expected: 'budget-utilization-dashboard', issue: 'GOV 1.10' },

  // GOV 2.1
  { persona: 'program-manager', query: 'Show program overview', expected: 'program-health-dashboard', issue: 'GOV 2.1' },

  // GOV 2.4, 2.5 - Should be milestone-tracking-dashboard
  { persona: 'program-manager', query: 'Show milestone status', expected: 'milestone-tracking-dashboard', issue: 'GOV 2.4' },
  { persona: 'program-manager', query: 'Milestone status', expected: 'milestone-tracking-dashboard', issue: 'GOV 2.5' },

  // GOV 2.6 - Should be risk-register-dashboard
  { persona: 'program-manager', query: 'Show risk register', expected: 'risk-register-dashboard', issue: 'GOV 2.6' },

  // GOV 3.5
  { persona: 'stakeholder-lead', query: 'Show change requests', expected: 'change-request-dashboard', issue: 'GOV 3.5' },
];

console.log('=== Testing Team-Reported Query Issues ===\n');

let passed = 0;
let failed = 0;

for (const test of teamQueries) {
  const result = detectWidgetQuery(test.query, test.persona);
  const actual = result?.widgetType || 'NO_MATCH';
  const status = actual === test.expected ? '✅' : '❌';

  if (actual === test.expected) {
    passed++;
  } else {
    failed++;
  }

  console.log(status + ' ' + test.issue + ': "' + test.query + '"');
  console.log('   Persona: ' + test.persona);
  console.log('   Expected: ' + test.expected);
  console.log('   Actual: ' + actual);
  if (actual !== test.expected) {
    console.log('   ⚠️  MISMATCH!');
  }
  console.log('');
}

console.log('\nResults: ' + passed + '/' + (passed + failed) + ' passed');
