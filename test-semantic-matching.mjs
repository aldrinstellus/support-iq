#!/usr/bin/env node
/**
 * Full Spectrum Semantic Matching Test
 * Tests all demo guide questions across all personas and modes
 */

// Test cases organized by persona
const testCases = {
  // ============================================================================
  // GOVERNMENT MODE
  // ============================================================================
  'program-manager': {
    mode: 'Government',
    tests: [
      { query: 'show me sprint burndown', expectedWidget: 'sprint-burndown-chart' },
      { query: 'show me the sprint burn down', expectedWidget: 'sprint-burndown-chart' },
      { query: 'show me sprint burn-down', expectedWidget: 'sprint-burndown-chart' },
      { query: 'burndown', expectedWidget: 'sprint-burndown-chart' },
      { query: 'burn down chart', expectedWidget: 'sprint-burndown-chart' },
      { query: 'sprint progress', expectedWidget: 'sprint-burndown-chart' },
      { query: 'program health dashboard', expectedWidget: 'program-health-dashboard' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
      { query: 'resource capacity', expectedWidget: 'resource-capacity-dashboard' },
    ]
  },
  'cor': {
    mode: 'Government',
    tests: [
      { query: 'show contract performance', expectedWidget: 'contract-performance-dashboard' },
      { query: 'contract status', expectedWidget: 'contract-performance-dashboard' },
      { query: 'deliverable reviews', expectedWidget: 'deliverable-review-list' },
      { query: 'vendor compliance', expectedWidget: 'vendor-compliance-dashboard' },
      { query: 'SLA compliance', expectedWidget: 'vendor-compliance-dashboard' },
      { query: 'budget status', expectedWidget: 'contract-performance-dashboard' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'stakeholder-lead': {
    mode: 'Government',
    tests: [
      { query: 'stakeholder engagement', expectedWidget: 'stakeholder-engagement-dashboard' },
      { query: 'requirements tracking', expectedWidget: 'requirements-tracking-dashboard' },
      { query: 'change requests', expectedWidget: 'change-request-dashboard' },
      { query: 'upcoming meetings', expectedWidget: 'meeting-scheduler' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },

  // ============================================================================
  // PROJECT MODE
  // ============================================================================
  'project-manager': {
    mode: 'Project',
    tests: [
      { query: 'sprint burndown', expectedWidget: 'sprint-burndown-chart' },
      { query: 'burn down', expectedWidget: 'sprint-burndown-chart' },
      { query: 'team velocity', expectedWidget: 'team-velocity-dashboard' },
      { query: 'resource capacity', expectedWidget: 'resource-capacity-dashboard' },
      { query: 'blockers', expectedWidget: 'blocker-resolution-dashboard' },
      { query: 'sprint planning', expectedWidget: 'task-kanban-board' },
      { query: 'scope changes', expectedWidget: 'change-request-dashboard' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'service-team-lead': {
    mode: 'Project',
    tests: [
      { query: 'team workload', expectedWidget: 'team-workload-dashboard' },
      { query: 'code quality', expectedWidget: 'code-quality-dashboard' },
      { query: 'technical debt', expectedWidget: 'code-quality-dashboard' },
      { query: 'deployment pipeline', expectedWidget: 'deployment-pipeline-dashboard' },
      { query: 'DORA metrics', expectedWidget: 'dora-metrics-dashboard' },
      { query: 'blocker resolution', expectedWidget: 'blocker-resolution-dashboard' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'service-team-member': {
    mode: 'Project',
    tests: [
      { query: 'my dashboard', expectedWidget: 'agent-performance-stats' },
      { query: 'daily update', expectedWidget: 'agent-dashboard' },
      { query: 'my tasks', expectedWidget: 'agent-dashboard' },
      { query: 'my performance', expectedWidget: 'agent-performance-stats' },
      { query: 'code quality', expectedWidget: 'code-quality-dashboard' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },

  // ============================================================================
  // ATC MODE
  // ============================================================================
  'atc-executive': {
    mode: 'ATC',
    tests: [
      { query: 'executive summary', expectedWidget: 'executive-summary' },
      { query: 'analytics dashboard', expectedWidget: 'analytics-dashboard' },
      { query: 'customers at churn risk', expectedWidget: 'customer-risk-list' },
      { query: 'SLA performance', expectedWidget: 'sla-performance-chart' },
      { query: 'customer sentiment', expectedWidget: 'sentiment-analysis' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'atc-manager': {
    mode: 'ATC',
    tests: [
      { query: 'team workload', expectedWidget: 'team-workload-dashboard' },
      { query: 'my current tickets', expectedWidget: 'ticket-list' },
      { query: 'high risk customers', expectedWidget: 'customer-risk-list' },
      { query: 'compare agent performance', expectedWidget: 'agent-performance-comparison' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'atc-support': {
    mode: 'ATC',
    tests: [
      { query: 'what is on my plate today', expectedWidget: 'agent-dashboard' },
      { query: 'good morning', expectedWidget: 'agent-dashboard' },
      { query: 'my tickets', expectedWidget: 'ticket-list' },
      { query: 'similar tickets', expectedWidget: 'similar-tickets-analysis' },
      { query: 'prepare for call', expectedWidget: 'call-prep-notes' },
      { query: 'draft response', expectedWidget: 'response-composer' },
      { query: 'my performance stats', expectedWidget: 'agent-performance-stats' },
      { query: 'knowledge base', expectedWidget: 'knowledge-base-search' },
      { query: 'password reset', expectedWidget: 'knowledge-article' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
  'atc-csm': {
    mode: 'ATC',
    tests: [
      { query: 'churn risk analysis', expectedWidget: 'customer-risk-profile' },
      { query: 'product adoption', expectedWidget: 'analytics-dashboard' },
      { query: 'upcoming renewals', expectedWidget: 'analytics-dashboard' },
      { query: 'expansion opportunities', expectedWidget: 'customer-risk-list' },
      { query: 'NPS survey results', expectedWidget: 'sentiment-analysis' },
      { query: 'business review', expectedWidget: 'meeting-scheduler' },
      { query: 'show me zoho tickets', expectedWidget: 'ticket-list' },
      { query: 'top performers', expectedWidget: 'agent-performance-comparison' },
    ]
  },
};

// Import the semantic matcher
async function runTests() {
  console.log('🚀 Full Spectrum Semantic Matching Test\n');
  console.log('='.repeat(70) + '\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = [];

  for (const [personaId, config] of Object.entries(testCases)) {
    console.log(`\n📋 ${personaId.toUpperCase()} (${config.mode} Mode)`);
    console.log('-'.repeat(50));

    for (const test of config.tests) {
      totalTests++;
      const response = await fetch(`http://localhost:3003/dsq/api/test-query?persona=${personaId}&query=${encodeURIComponent(test.query)}`);

      if (!response.ok) {
        // If no test API, we'll test via the actual page
        console.log(`  ⚠️  "${test.query}" - API test not available`);
        continue;
      }

      const result = await response.json();
      const actualWidget = result.widgetType;

      if (actualWidget === test.expectedWidget) {
        passedTests++;
        console.log(`  ✅ "${test.query}" → ${actualWidget}`);
      } else {
        failedTests.push({
          persona: personaId,
          query: test.query,
          expected: test.expectedWidget,
          actual: actualWidget,
        });
        console.log(`  ❌ "${test.query}"`);
        console.log(`     Expected: ${test.expectedWidget}`);
        console.log(`     Actual:   ${actualWidget || 'null'}`);
      }
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n📊 SUMMARY\n');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests.length}`);
  console.log(`Pass Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS:\n');
    for (const fail of failedTests) {
      console.log(`  ${fail.persona}: "${fail.query}"`);
      console.log(`    Expected: ${fail.expected}, Got: ${fail.actual}`);
    }
  }

  console.log('\n');
}

runTests().catch(console.error);
