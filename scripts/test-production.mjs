#!/usr/bin/env node
/**
 * Production Build Test
 * Tests all 54 demo questions against the live Vercel deployment
 */

const PRODUCTION_URL = process.argv[2] || 'https://dsq.digitalworkplace.ai';

// All 54 demo questions with expected widgets (from Demo Guide)
const demoGuideSpec = {
  // MODE 1: Government Contract Management
  'cor': {
    name: 'COR (Alexa Johnson)',
    mode: 'Government',
    questions: [
      { q: 'Show me the contract status', expected: 'contract-performance-dashboard' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
  'program-manager': {
    name: 'Program Manager (Jennifer Chen)',
    mode: 'Government',
    questions: [
      { q: 'Show me the sprint burndown', expected: 'contract-performance-dashboard' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
  'stakeholder-lead': {
    name: 'Stakeholder Lead (Jessica Martinez)',
    mode: 'Government',
    questions: [
      { q: 'Show stakeholder engagement', expected: 'stakeholder-engagement-dashboard' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },

  // MODE 2: Project Management
  'project-manager': {
    name: 'Project Manager (Dale Thompson)',
    mode: 'Project',
    questions: [
      { q: 'Show sprint burndown', expected: 'sprint-burndown-chart' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
  'service-team-lead': {
    name: 'Service Team Lead (Herbert Roberts)',
    mode: 'Project',
    questions: [
      { q: 'Show me team status', expected: 'team-workload-dashboard' },
      { q: 'Show code quality metrics', expected: 'code-quality-dashboard' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
  'service-team-member': {
    name: 'Service Team Member (Molly Rivera)',
    mode: 'Project',
    questions: [
      { q: 'Show my dashboard', expected: 'agent-performance-stats' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },

  // MODE 3: ATC Customer Support
  'atc-executive': {
    name: 'Executive (Jennifer Anderson)',
    mode: 'ATC',
    questions: [
      { q: 'Show executive summary', expected: 'executive-summary' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
  'atc-manager': {
    name: 'Manager (David Miller)',
    mode: 'ATC',
    questions: [
      { q: 'Compare agent performance', expected: 'agent-performance-comparison' },
      { q: 'Show team workload', expected: 'team-workload-dashboard' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
  'atc-support': {
    name: 'Support Agent (Christopher Hayes)',
    mode: 'ATC',
    questions: [
      { q: 'Show my open tickets', expected: 'ticket-list' },
      { q: 'Show ticket TICK-001', expected: 'ticket-detail' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
  'atc-csm': {
    name: 'CSM (Jordan Taylor)',
    mode: 'ATC',
    questions: [
      { q: 'Show customer health', expected: 'client-health-dashboard' },
      { q: 'Show at-risk customers', expected: 'customer-risk-list' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
};

// Normalize widget types
function normalizeWidget(widget) {
  if (!widget) return null;
  const mappings = {
    'live-ticket-detail': 'ticket-detail',
    'live-zoho-tickets': 'ticket-list',
  };
  return mappings[widget] || widget;
}

// Test a single query
async function testQuery(baseUrl, personaId, question) {
  const url = `${baseUrl}/api/test-query?persona=${personaId}&query=${encodeURIComponent(question)}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const data = await response.json();
    return data.widgetType || null;
  } catch (e) {
    return 'ERROR: ' + e.message;
  }
}

// Main test runner
async function runProductionTests() {
  console.log('='.repeat(100));
  console.log(`PRODUCTION BUILD TEST: ${PRODUCTION_URL}`);
  console.log('='.repeat(100));
  console.log('');

  // First check if production is reachable
  console.log('Checking production health...');
  try {
    const healthResponse = await fetch(`${PRODUCTION_URL}/api/health`, { timeout: 10000 });
    const health = await healthResponse.json();
    console.log(`✅ Production is healthy: ${JSON.stringify(health)}\n`);
  } catch (e) {
    console.log(`⚠️  Health check failed: ${e.message}`);
    console.log('Continuing with tests anyway...\n');
  }

  const results = {
    total: 0,
    passed: 0,
    failed: [],
  };

  for (const [personaId, persona] of Object.entries(demoGuideSpec)) {
    console.log(`\n## ${persona.name} (${persona.mode} Mode)`);
    console.log('-'.repeat(80));

    for (const { q, expected } of persona.questions) {
      results.total++;

      const actual = await testQuery(PRODUCTION_URL, personaId, q);
      const normalizedActual = normalizeWidget(actual);
      const normalizedExpected = normalizeWidget(expected);

      const passed = normalizedActual === normalizedExpected;

      if (passed) {
        results.passed++;
        console.log(`  ✅ "${q}"`);
        console.log(`     → ${actual}`);
      } else {
        results.failed.push({
          persona: persona.name,
          personaId,
          question: q,
          expected,
          actual
        });
        console.log(`  ❌ "${q}"`);
        console.log(`     Expected: ${expected}`);
        console.log(`     Actual:   ${actual}`);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(100));
  console.log('PRODUCTION TEST SUMMARY');
  console.log('='.repeat(100));
  console.log(`URL: ${PRODUCTION_URL}`);
  console.log(`Total Questions: ${results.total}`);
  console.log(`Passed: ${results.passed}/${results.total} (${Math.round(results.passed/results.total*100)}%)`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n## FAILURES:');
    for (const f of results.failed) {
      console.log(`  [${f.personaId}] "${f.question}"`);
      console.log(`     Expected: ${f.expected}, Got: ${f.actual}`);
    }
  }

  return results;
}

runProductionTests().then(results => {
  const exitCode = results.failed.length > 0 ? 1 : 0;
  console.log(`\nExit code: ${exitCode}`);
  process.exit(exitCode);
});
