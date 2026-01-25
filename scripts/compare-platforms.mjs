#!/usr/bin/env node
/**
 * Full Spectrum Platform Comparison
 * Compares Local DSQ vs Production vs Demo Guide specifications
 */

// Demo Guide Specifications (from dsq_DEMO-GUIDE.pdf)
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
      { q: 'Show me the latest end user request', expected: 'ticket-list' },  // Guide says "Live Zoho Desk Tickets"
    ]
  },
  'program-manager': {
    name: 'Program Manager (Jennifer Chen)',
    mode: 'Government',
    questions: [
      { q: 'Show me the sprint burndown', expected: 'contract-performance-dashboard' },  // Guide: Contract Performance Dashboard!
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
      { q: 'Show sprint burndown', expected: 'sprint-burndown-chart' },  // Guide: Sprint 24 Burndown Chart
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
      { q: 'Show my dashboard', expected: 'agent-performance-stats' },  // Guide: Personal Performance Dashboard
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },  // Guide: Agent Performance Comparison
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
      { q: 'Who are my top performers?', expected: 'agent-performance-comparison' },  // Guide: Agent Performance Comparison
      { q: 'Draft response about the outage', expected: 'response-composer' },
      { q: 'Open the most urgent access issue', expected: 'ticket-detail' },
      { q: 'Show me the latest end user request', expected: 'ticket-list' },
    ]
  },
};

// Test via HTTP
async function testQuery(baseUrl, personaId, question) {
  const url = `${baseUrl}/api/test-query?persona=${personaId}&query=${encodeURIComponent(question)}`;
  try {
    const response = await fetch(url, { timeout: 10000 });
    const data = await response.json();
    return data.widgetType || null;
  } catch (e) {
    return 'ERROR: ' + e.message;
  }
}

// Normalize widget types for comparison
function normalizeWidget(widget) {
  if (!widget) return null;
  // Map variations to standard names
  const mappings = {
    'live-ticket-detail': 'ticket-detail',
    'live-zoho-tickets': 'ticket-list',
  };
  return mappings[widget] || widget;
}

// Main comparison
async function runComparison() {
  const LOCAL_URL = 'http://localhost:3003';

  console.log('='.repeat(100));
  console.log('FULL SPECTRUM COMPARISON: LOCAL DSQ vs DEMO GUIDE');
  console.log('='.repeat(100));
  console.log('');

  const results = {
    total: 0,
    localMatchesGuide: 0,
    localDiffers: [],
  };

  for (const [personaId, persona] of Object.entries(demoGuideSpec)) {
    console.log(`\n## ${persona.name} (${persona.mode} Mode)`);
    console.log('-'.repeat(80));

    for (const { q, expected } of persona.questions) {
      results.total++;

      const localResult = await testQuery(LOCAL_URL, personaId, q);
      const normalizedLocal = normalizeWidget(localResult);
      const normalizedExpected = normalizeWidget(expected);

      const matchesGuide = normalizedLocal === normalizedExpected;

      if (matchesGuide) {
        results.localMatchesGuide++;
        console.log(`  ✅ "${q}"`);
        console.log(`     Local: ${localResult} = Guide: ${expected}`);
      } else {
        results.localDiffers.push({
          persona: persona.name,
          personaId,
          mode: persona.mode,
          question: q,
          local: localResult,
          guide: expected
        });
        console.log(`  ❌ "${q}"`);
        console.log(`     Local: ${localResult}`);
        console.log(`     Guide: ${expected}`);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(100));
  console.log('SUMMARY');
  console.log('='.repeat(100));
  console.log(`Total Questions: ${results.total}`);
  console.log(`Local Matches Guide: ${results.localMatchesGuide}/${results.total} (${Math.round(results.localMatchesGuide/results.total*100)}%)`);
  console.log(`Discrepancies: ${results.localDiffers.length}`);

  if (results.localDiffers.length > 0) {
    console.log('\n## DISCREPANCIES (Local DSQ vs Demo Guide):');
    console.log('-'.repeat(80));
    for (const diff of results.localDiffers) {
      console.log(`\n  [${diff.personaId}] ${diff.persona} (${diff.mode})`);
      console.log(`  Question: "${diff.question}"`);
      console.log(`  Local returns: ${diff.local}`);
      console.log(`  Guide expects: ${diff.guide}`);
    }
  }

  return results;
}

runComparison().then(results => {
  process.exit(results.localDiffers.length > 0 ? 1 : 0);
});
