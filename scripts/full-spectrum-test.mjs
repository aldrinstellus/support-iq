#!/usr/bin/env node
/**
 * Full Spectrum Test Script for Support IQ (dSQ)
 * Tests all 117 queries from Master Demo Guide against production
 *
 * Usage: node scripts/full-spectrum-test.mjs
 */

const PRODUCTION_URL = 'https://dsq.digitalworkplace.ai';

// All test cases from Master Demo Guide
const TEST_CASES = {
  // Government Mode
  'cor': {
    name: 'COR - Alexa Johnson',
    mode: 'Government',
    queries: [
      { query: 'Show contract status', expectedWidget: 'contract-performance-dashboard' },
      { query: 'Show me current contract status', expectedWidget: 'contract-performance-dashboard' },
      { query: 'Show contract performance dashboard', expectedWidget: 'contract-performance-dashboard' },
      { query: 'Show vendor performance', expectedWidget: 'vendor-compliance-dashboard' },
      { query: 'Show me vendor performance metrics', expectedWidget: 'vendor-compliance-dashboard' },
      { query: 'Show me compliance dashboard', expectedWidget: 'vendor-compliance-dashboard' },
      { query: 'Show deliverables due this month', expectedWidget: 'deliverable-review-list' },
      { query: 'Show me contract deliverables status', expectedWidget: 'deliverable-review-list' },
      { query: 'Show me budget tracking dashboard', expectedWidget: 'budget-utilization-dashboard' },
      { query: 'Budget remaining for contracts', expectedWidget: 'budget-utilization-dashboard' },
      { query: 'Who is top performing agent?', expectedWidget: 'agent-performance-comparison' },
      { query: 'Who is most slacking agent?', expectedWidget: 'team-workload-dashboard' },
    ]
  },
  'program-manager': {
    name: 'Program Manager - Jennifer Chen',
    mode: 'Government',
    queries: [
      { query: 'Show program overview', expectedWidget: 'program-health-dashboard' },
      { query: 'Show program health dashboard', expectedWidget: 'program-health-dashboard' },
      { query: 'Program health', expectedWidget: 'program-health-dashboard' },
      { query: 'Show milestone status', expectedWidget: 'milestone-tracking-dashboard' },
      { query: 'Milestone status', expectedWidget: 'milestone-tracking-dashboard' },
      { query: 'Show risk register', expectedWidget: 'risk-register-dashboard' },
      { query: 'Critical risk', expectedWidget: 'risk-register-dashboard' },
      { query: 'Show resource allocation', expectedWidget: 'resource-capacity-dashboard' },
      { query: 'Resource capacity', expectedWidget: 'resource-capacity-dashboard' },
      { query: 'Show me sprint burndown', expectedWidget: 'sprint-burndown-chart' },
      { query: 'Sprint burn-down', expectedWidget: 'sprint-burndown-chart' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'stakeholder-lead': {
    name: 'Stakeholder Lead - Jessica Martinez',
    mode: 'Government',
    queries: [
      { query: 'Show impact analysis', expectedWidget: 'stakeholder-engagement-dashboard' },
      { query: 'Stakeholder engagement status', expectedWidget: 'stakeholder-engagement-dashboard' },
      { query: 'Show stakeholder engagement', expectedWidget: 'stakeholder-engagement-dashboard' },
      { query: 'Show change requests', expectedWidget: 'change-request-dashboard' },
      { query: 'Change request pending', expectedWidget: 'change-request-dashboard' },
      { query: 'Show user feedback', expectedWidget: 'sentiment-analysis' },
      { query: 'Show requirements tracking', expectedWidget: 'requirements-tracking-dashboard' },
      { query: 'Requirements tracking status', expectedWidget: 'requirements-tracking-dashboard' },
      { query: 'Requirements traceability', expectedWidget: 'requirements-tracking-dashboard' },
      { query: 'Upcoming meetings', expectedWidget: 'meeting-scheduler' },
    ]
  },

  // Project Mode
  'project-manager': {
    name: 'Project Manager - Dale Thompson',
    mode: 'Project',
    queries: [
      { query: 'Show sprint burndown', expectedWidget: 'sprint-burndown-chart' },
      { query: 'Burndown', expectedWidget: 'sprint-burndown-chart' },
      { query: 'Show team velocity', expectedWidget: 'team-velocity-dashboard' },
      { query: 'Velocity', expectedWidget: 'team-velocity-dashboard' },
      { query: 'Show resource capacity', expectedWidget: 'resource-capacity-dashboard' },
      { query: 'Resource capacity', expectedWidget: 'resource-capacity-dashboard' },
      { query: 'Show blockers', expectedWidget: 'blocker-resolution-dashboard' },
      { query: 'Blocker', expectedWidget: 'blocker-resolution-dashboard' },
      { query: 'Sprint planning', expectedWidget: 'task-kanban-board' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'service-team-lead': {
    name: 'Service Team Lead - Herbert Roberts',
    mode: 'Project',
    queries: [
      { query: 'Show team workload', expectedWidget: 'team-workload-dashboard' },
      { query: 'Team workload', expectedWidget: 'team-workload-dashboard' },
      { query: 'Show code quality metrics', expectedWidget: 'code-quality-dashboard' },
      { query: 'Code quality', expectedWidget: 'code-quality-dashboard' },
      { query: 'technical debt', expectedWidget: 'code-quality-dashboard' },
      { query: 'Show code reviews', expectedWidget: 'code-review-dashboard' },
      { query: 'Show deployment status', expectedWidget: 'deployment-pipeline-dashboard' },
      { query: 'Deployment', expectedWidget: 'deployment-pipeline-dashboard' },
      { query: 'DORA metrics', expectedWidget: 'dora-metrics-dashboard' },
      { query: 'DORA', expectedWidget: 'dora-metrics-dashboard' },
      { query: 'Show DORA metrics', expectedWidget: 'dora-metrics-dashboard' },
    ]
  },
  'service-team-member': {
    name: 'Service Team Member - Molly Rivera',
    mode: 'Project',
    queries: [
      { query: 'Show my assigned requests', expectedWidget: 'agent-dashboard' },
      { query: 'Daily update', expectedWidget: 'agent-dashboard' },
      { query: 'my dashboard', expectedWidget: 'agent-performance-stats' },
      { query: 'Show my performance this week', expectedWidget: 'agent-performance-stats' },
      { query: 'my performance', expectedWidget: 'agent-performance-stats' },
      { query: 'Show my sprint tasks', expectedWidget: 'task-kanban-board' },
      { query: 'My tasks', expectedWidget: 'task-kanban-board' },
      { query: 'Sprint task', expectedWidget: 'task-kanban-board' },
      { query: 'code quality', expectedWidget: 'code-quality-dashboard' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },

  // ATC Mode
  'atc-executive': {
    name: 'C-Level Executive - Jennifer Anderson',
    mode: 'ATC',
    queries: [
      { query: 'Show me executive summary', expectedWidget: 'executive-summary' },
      { query: 'Show board-level metrics', expectedWidget: 'executive-summary' },
      { query: 'Show detailed analytics', expectedWidget: 'analytics-dashboard' },
      { query: 'Show me the detailed analytics', expectedWidget: 'analytics-dashboard' },
      { query: 'Show me SLA performance', expectedWidget: 'sla-performance-chart' },
      { query: 'Show me the SLA performance breakdown', expectedWidget: 'sla-performance-chart' },
      { query: 'Which customers are at churn risk?', expectedWidget: 'customer-risk-list' },
      { query: 'Show me high-risk customers', expectedWidget: 'customer-risk-list' },
      { query: 'customer sentiment', expectedWidget: 'nps-sentiment-analysis' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'atc-manager': {
    name: 'CS Manager - David Miller',
    mode: 'ATC',
    queries: [
      { query: 'Show me team status', expectedWidget: 'team-workload-dashboard' },
      { query: 'Show me my team\'s status', expectedWidget: 'team-workload-dashboard' },
      { query: 'Show workload balance', expectedWidget: 'team-workload-dashboard' },
      { query: 'Who is top performing agent?', expectedWidget: 'agent-performance-comparison' },
      { query: 'Who are the top and bottom performers?', expectedWidget: 'agent-performance-comparison' },
      { query: 'compare agent performance', expectedWidget: 'agent-performance-comparison' },
      { query: 'Who is most slacking agent?', expectedWidget: 'team-workload-dashboard' },
      { query: 'Show me all high-risk customers', expectedWidget: 'customer-risk-list' },
      { query: 'Show team budget', expectedWidget: 'budget-utilization-dashboard' },
      { query: 'my current tickets', expectedWidget: 'ticket-list' },
      { query: 'Show ticket DESK-1001', expectedWidget: 'ticket-detail' },
    ]
  },
  'atc-support': {
    name: 'Support Agent - Christopher Hayes',
    mode: 'ATC',
    queries: [
      { query: 'Good morning, what\'s on my plate today?', expectedWidget: 'agent-dashboard' },
      { query: 'what is on my plate today', expectedWidget: 'agent-dashboard' },
      { query: 'good morning', expectedWidget: 'agent-dashboard' },
      { query: 'Show me my performance stats', expectedWidget: 'agent-performance-stats' },
      { query: 'Show me my tickets', expectedWidget: 'ticket-list' },
      { query: 'my tickets', expectedWidget: 'ticket-list' },
      { query: 'Show ticket DESK-1001', expectedWidget: 'ticket-detail' },
      { query: 'Show me ticket TICK-001', expectedWidget: 'ticket-detail' },
      { query: 'Find similar tickets I\'ve resolved', expectedWidget: 'similar-tickets-analysis' },
      { query: 'similar tickets', expectedWidget: 'similar-tickets-analysis' },
      { query: 'Help me prepare for the call with Acme Corp', expectedWidget: 'call-prep-notes' },
      { query: 'prepare for call', expectedWidget: 'call-prep-notes' },
      { query: 'Draft response for angry customer', expectedWidget: 'response-composer' },
      { query: 'draft response', expectedWidget: 'response-composer' },
      { query: 'Search knowledge base for password reset', expectedWidget: 'knowledge-article' },
      { query: 'knowledge base', expectedWidget: 'knowledge-base-search' },
      { query: 'password reset', expectedWidget: 'knowledge-article' },
    ]
  },
  'atc-csm': {
    name: 'CSM - Jordan Taylor',
    mode: 'ATC',
    queries: [
      { query: 'Show customer health scores', expectedWidget: 'customer-risk-list' },
      { query: 'customer health scores', expectedWidget: 'customer-risk-list' },
      { query: 'Show upcoming renewals', expectedWidget: 'renewal-pipeline' },
      { query: 'upcoming renewals', expectedWidget: 'renewal-pipeline' },
      { query: 'Show upsell opportunities', expectedWidget: 'upsell-opportunities' },
      { query: 'upsell opportunities', expectedWidget: 'upsell-opportunities' },
      { query: 'expansion opportunities', expectedWidget: 'upsell-opportunities' },
      { query: 'Which customers declining adoption?', expectedWidget: 'product-adoption-metrics' },
      { query: 'product adoption', expectedWidget: 'product-adoption-metrics' },
      { query: 'churn risk analysis', expectedWidget: 'customer-risk-profile' },
      { query: 'NPS survey results', expectedWidget: 'nps-sentiment-analysis' },
      { query: 'business review', expectedWidget: 'meeting-scheduler' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  }
};

async function testQuery(personaId, query, expectedWidget) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${PRODUCTION_URL}/dsq/api/test-query?persona=${personaId}&query=${encodedQuery}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}`, actualWidget: null };
    }

    const data = await response.json();
    const actualWidget = data.widgetType || null;
    const success = actualWidget === expectedWidget;

    return { success, actualWidget, error: null };
  } catch (error) {
    return { success: false, error: error.message, actualWidget: null };
  }
}

async function runFullSpectrumTest() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('           FULL SPECTRUM TEST - Support IQ (dSQ)');
  console.log('           Production URL:', PRODUCTION_URL);
  console.log('           Test Date:', new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    byMode: {
      Government: { total: 0, passed: 0, failed: 0 },
      Project: { total: 0, passed: 0, failed: 0 },
      ATC: { total: 0, passed: 0, failed: 0 }
    },
    byPersona: {},
    failures: []
  };

  for (const [personaId, persona] of Object.entries(TEST_CASES)) {
    console.log(`\n┌─────────────────────────────────────────────────────────────┐`);
    console.log(`│ ${persona.mode.padEnd(10)} │ ${persona.name.padEnd(45)} │`);
    console.log(`│ Persona: ${personaId.padEnd(56)} │`);
    console.log(`└─────────────────────────────────────────────────────────────┘`);

    results.byPersona[personaId] = { total: 0, passed: 0, failed: 0 };

    for (const testCase of persona.queries) {
      results.total++;
      results.byMode[persona.mode].total++;
      results.byPersona[personaId].total++;

      const result = await testQuery(personaId, testCase.query, testCase.expectedWidget);

      if (result.success) {
        results.passed++;
        results.byMode[persona.mode].passed++;
        results.byPersona[personaId].passed++;
        console.log(`  ✅ "${testCase.query.substring(0, 40).padEnd(40)}" → ${testCase.expectedWidget}`);
      } else {
        results.failed++;
        results.byMode[persona.mode].failed++;
        results.byPersona[personaId].failed++;
        console.log(`  ❌ "${testCase.query.substring(0, 40).padEnd(40)}" → Expected: ${testCase.expectedWidget}, Got: ${result.actualWidget || result.error}`);
        results.failures.push({
          persona: personaId,
          query: testCase.query,
          expected: testCase.expectedWidget,
          actual: result.actualWidget,
          error: result.error
        });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const pStats = results.byPersona[personaId];
    console.log(`  ─────────────────────────────────────────────────────────────`);
    console.log(`  Persona Result: ${pStats.passed}/${pStats.total} (${((pStats.passed/pStats.total)*100).toFixed(0)}%)`);
  }

  // Print summary
  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('                         TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Results by Mode:');
  console.log('┌────────────┬───────┬────────┬────────┬──────────┐');
  console.log('│ Mode       │ Total │ Passed │ Failed │ Pass Rate│');
  console.log('├────────────┼───────┼────────┼────────┼──────────┤');
  for (const [mode, stats] of Object.entries(results.byMode)) {
    const rate = ((stats.passed / stats.total) * 100).toFixed(1);
    console.log(`│ ${mode.padEnd(10)} │ ${String(stats.total).padStart(5)} │ ${String(stats.passed).padStart(6)} │ ${String(stats.failed).padStart(6)} │ ${rate.padStart(7)}% │`);
  }
  console.log('├────────────┼───────┼────────┼────────┼──────────┤');
  const totalRate = ((results.passed / results.total) * 100).toFixed(1);
  console.log(`│ ${'TOTAL'.padEnd(10)} │ ${String(results.total).padStart(5)} │ ${String(results.passed).padStart(6)} │ ${String(results.failed).padStart(6)} │ ${totalRate.padStart(7)}% │`);
  console.log('└────────────┴───────┴────────┴────────┴──────────┘');

  console.log('\nResults by Persona:');
  console.log('┌──────────────────────────┬───────┬────────┬────────┐');
  console.log('│ Persona                  │ Total │ Passed │ Failed │');
  console.log('├──────────────────────────┼───────┼────────┼────────┤');
  for (const [personaId, stats] of Object.entries(results.byPersona)) {
    console.log(`│ ${personaId.padEnd(24)} │ ${String(stats.total).padStart(5)} │ ${String(stats.passed).padStart(6)} │ ${String(stats.failed).padStart(6)} │`);
  }
  console.log('└──────────────────────────┴───────┴────────┴────────┘');

  if (results.failures.length > 0) {
    console.log('\n\n❌ FAILURES:');
    console.log('─────────────────────────────────────────────────────────────────');
    for (const failure of results.failures) {
      console.log(`Persona: ${failure.persona}`);
      console.log(`Query: "${failure.query}"`);
      console.log(`Expected: ${failure.expected}`);
      console.log(`Actual: ${failure.actual || failure.error}`);
      console.log('─────────────────────────────────────────────────────────────────');
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  if (results.failed === 0) {
    console.log('                    ✅ ALL TESTS PASSED!');
  } else {
    console.log(`                    ❌ ${results.failed} TESTS FAILED`);
  }
  console.log(`                    ${results.passed}/${results.total} (${totalRate}%)`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  return results;
}

// Run the test
runFullSpectrumTest().then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
}).catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
