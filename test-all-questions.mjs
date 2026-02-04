#!/usr/bin/env node
/**
 * Full Spectrum Demo Questions Test
 * Tests all 54 questions from DEMO-GUIDE-EXTERNAL.md
 */

// Demo Guide Questions by Persona
const demoQuestions = {
  // MODE 1: Government Contract Management
  'cor': {
    name: 'COR (Alexa Johnson)',
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
    questions: [
      { q: 'Show me the sprint burndown', expected: 'sprint-burndown-chart' },
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
  'stakeholder-lead': {
    name: 'Stakeholder Lead (Jessica Martinez)',
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
    questions: [
      { q: 'Show my dashboard', expected: 'agent-performance-stats' },
      // Demo Guide: "Personal Performance Stats (vs Team Benchmarks)" - IC sees their own stats
      { q: 'Who are my top performers?', expected: 'agent-performance-stats' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },

  // MODE 3: ATC Customer Support
  'atc-executive': {
    name: 'Executive (Jennifer Anderson)',
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
    questions: [
      { q: 'Show customer health', expected: 'client-health-dashboard' },
      { q: 'Show at-risk customers', expected: 'customer-risk-list' },
      // Demo Guide: "Top-Performing Customer Accounts" - CSM manages customers, not agents
      { q: 'Who are my top performers?', expected: 'customer-risk-list' },
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
};

// Test via HTTP to the running server
async function testQuestion(personaId, question) {
  const url = `http://localhost:3003/api/test-query?persona=${personaId}&query=${encodeURIComponent(question)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.widgetType || null;
  } catch (e) {
    return null;
  }
}

// Main test runner
async function runTests() {
  console.log('='.repeat(80));
  console.log('FULL SPECTRUM DEMO QUESTIONS TEST');
  console.log('='.repeat(80));
  console.log('');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = [];

  for (const [personaId, persona] of Object.entries(demoQuestions)) {
    console.log(`\n## ${persona.name} (/demo/${personaId})`);
    console.log('-'.repeat(60));

    for (const { q, expected } of persona.questions) {
      totalTests++;
      const actual = await testQuestion(personaId, q);

      // Check if actual matches expected (allow for variations like live-ticket-detail vs ticket-detail)
      const matches = actual === expected ||
                      (expected === 'ticket-detail' && actual === 'live-ticket-detail') ||
                      (expected === 'ticket-list' && actual === 'live-zoho-tickets');

      if (matches) {
        passedTests++;
        console.log(`  ✅ "${q}"`);
        console.log(`     → ${actual}`);
      } else {
        failedTests.push({ personaId, persona: persona.name, question: q, expected, actual });
        console.log(`  ❌ "${q}"`);
        console.log(`     Expected: ${expected}`);
        console.log(`     Actual:   ${actual || 'NULL (no match)'}`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests.length}`);
  console.log(`Score: ${Math.round((passedTests / totalTests) * 100)}%`);

  if (failedTests.length > 0) {
    console.log('\n## FAILED TESTS:');
    for (const f of failedTests) {
      console.log(`  - [${f.personaId}] "${f.question}"`);
      console.log(`    Expected: ${f.expected}, Got: ${f.actual || 'NULL'}`);
    }
  }

  return { totalTests, passedTests, failedTests };
}

// Run if executed directly
runTests().then(results => {
  process.exit(results.failedTests.length > 0 ? 1 : 0);
});
