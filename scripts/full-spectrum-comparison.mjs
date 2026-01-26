#!/usr/bin/env node
/**
 * Full Spectrum Comparison: Our DSQ vs Parent Demo vs Demo Guide
 * Compares all 54 questions across both platforms
 */

const OUR_DSQ = 'https://support-iq-pearl.vercel.app/dsq';
const PARENT_DEMO = 'https://atc-support-v20-op3.vercel.app';

// Demo Guide Specification (from dsq_DEMO-GUIDE.pdf)
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
  if (widget.startsWith('ERROR')) return widget;
  const mappings = {
    'live-ticket-detail': 'ticket-detail',
    'live-zoho-tickets': 'ticket-list',
  };
  return mappings[widget] || widget;
}

// Test a single query against a platform
async function testQuery(baseUrl, personaId, question) {
  const url = `${baseUrl}/api/test-query?persona=${personaId}&query=${encodeURIComponent(question)}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return `ERROR: HTTP ${response.status}`;
    }

    const data = await response.json();
    return data.widgetType || 'NO_WIDGET';
  } catch (e) {
    if (e.name === 'AbortError') {
      return 'ERROR: Timeout';
    }
    return 'ERROR: ' + e.message;
  }
}

// Main comparison
async function runComparison() {
  console.log('='.repeat(120));
  console.log('FULL SPECTRUM COMPARISON: Our DSQ vs Parent Demo vs Demo Guide');
  console.log('='.repeat(120));
  console.log(`Our DSQ:     ${OUR_DSQ}`);
  console.log(`Parent Demo: ${PARENT_DEMO}`);
  console.log('');

  // Check health of both platforms
  console.log('Checking platform health...');
  try {
    const ourHealth = await fetch(`${OUR_DSQ}/api/health`).then(r => r.json());
    console.log(`✅ Our DSQ: ${ourHealth.status} (v${ourHealth.checks?.version || 'unknown'})`);
  } catch (e) {
    console.log(`❌ Our DSQ: ${e.message}`);
  }

  try {
    const parentHealth = await fetch(`${PARENT_DEMO}/api/health`).then(r => r.json());
    console.log(`✅ Parent Demo: ${parentHealth.status} (v${parentHealth.checks?.version || 'unknown'})`);
  } catch (e) {
    console.log(`❌ Parent Demo: ${e.message}`);
  }
  console.log('');

  const results = {
    total: 0,
    ourMatchesGuide: 0,
    parentMatchesGuide: 0,
    bothMatch: 0,
    differences: [],
    ourOnlyIssues: [],
    parentOnlyIssues: [],
    bothIssues: [],
  };

  for (const [personaId, persona] of Object.entries(demoGuideSpec)) {
    console.log(`\n${'─'.repeat(120)}`);
    console.log(`## ${persona.name} (${persona.mode} Mode)`);
    console.log('─'.repeat(120));
    console.log(`${'Question'.padEnd(45)} | ${'Guide'.padEnd(30)} | ${'Our DSQ'.padEnd(30)} | ${'Parent'.padEnd(30)} | Status`);
    console.log('─'.repeat(120));

    for (const { q, expected } of persona.questions) {
      results.total++;

      // Test both platforms in parallel
      const [ourResult, parentResult] = await Promise.all([
        testQuery(OUR_DSQ, personaId, q),
        testQuery(PARENT_DEMO, personaId, q),
      ]);

      const normalizedOur = normalizeWidget(ourResult);
      const normalizedParent = normalizeWidget(parentResult);
      const normalizedExpected = normalizeWidget(expected);

      const ourMatches = normalizedOur === normalizedExpected;
      const parentMatches = normalizedParent === normalizedExpected;
      const bothSame = normalizedOur === normalizedParent;

      if (ourMatches) results.ourMatchesGuide++;
      if (parentMatches) results.parentMatchesGuide++;
      if (ourMatches && parentMatches) results.bothMatch++;

      // Determine status
      let status = '';
      if (ourMatches && parentMatches) {
        status = '✅ Both Match';
      } else if (ourMatches && !parentMatches) {
        status = '⚠️ Parent Differs';
        results.parentOnlyIssues.push({
          persona: persona.name,
          personaId,
          mode: persona.mode,
          question: q,
          expected,
          ourResult: normalizedOur,
          parentResult: normalizedParent,
        });
      } else if (!ourMatches && parentMatches) {
        status = '⚠️ Our DSQ Differs';
        results.ourOnlyIssues.push({
          persona: persona.name,
          personaId,
          mode: persona.mode,
          question: q,
          expected,
          ourResult: normalizedOur,
          parentResult: normalizedParent,
        });
      } else {
        status = '❌ Both Differ';
        results.bothIssues.push({
          persona: persona.name,
          personaId,
          mode: persona.mode,
          question: q,
          expected,
          ourResult: normalizedOur,
          parentResult: normalizedParent,
        });
      }

      // Track any difference between platforms
      if (!bothSame) {
        results.differences.push({
          persona: persona.name,
          personaId,
          mode: persona.mode,
          question: q,
          expected,
          ourResult: normalizedOur,
          parentResult: normalizedParent,
        });
      }

      // Print row
      const qShort = q.length > 43 ? q.substring(0, 40) + '...' : q;
      const expShort = expected.length > 28 ? expected.substring(0, 25) + '...' : expected;
      const ourShort = (normalizedOur || 'null').length > 28 ? (normalizedOur || 'null').substring(0, 25) + '...' : (normalizedOur || 'null');
      const parentShort = (normalizedParent || 'null').length > 28 ? (normalizedParent || 'null').substring(0, 25) + '...' : (normalizedParent || 'null');

      console.log(`${qShort.padEnd(45)} | ${expShort.padEnd(30)} | ${ourShort.padEnd(30)} | ${parentShort.padEnd(30)} | ${status}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(120));
  console.log('SUMMARY');
  console.log('='.repeat(120));
  console.log(`Total Questions: ${results.total}`);
  console.log('');
  console.log(`Our DSQ vs Guide:     ${results.ourMatchesGuide}/${results.total} (${Math.round(results.ourMatchesGuide/results.total*100)}%)`);
  console.log(`Parent Demo vs Guide: ${results.parentMatchesGuide}/${results.total} (${Math.round(results.parentMatchesGuide/results.total*100)}%)`);
  console.log(`Both Match Guide:     ${results.bothMatch}/${results.total} (${Math.round(results.bothMatch/results.total*100)}%)`);
  console.log('');
  console.log(`Platform Differences: ${results.differences.length}`);
  console.log(`  - Our DSQ only issues: ${results.ourOnlyIssues.length}`);
  console.log(`  - Parent only issues:  ${results.parentOnlyIssues.length}`);
  console.log(`  - Both have issues:    ${results.bothIssues.length}`);

  // Detail sections
  if (results.differences.length > 0) {
    console.log('\n' + '='.repeat(120));
    console.log('PLATFORM DIFFERENCES (Our DSQ vs Parent Demo)');
    console.log('='.repeat(120));
    for (const diff of results.differences) {
      console.log(`\n[${diff.personaId}] ${diff.persona} (${diff.mode})`);
      console.log(`  Question: "${diff.question}"`);
      console.log(`  Guide expects: ${diff.expected}`);
      console.log(`  Our DSQ:       ${diff.ourResult}`);
      console.log(`  Parent Demo:   ${diff.parentResult}`);
    }
  }

  if (results.ourOnlyIssues.length > 0) {
    console.log('\n' + '='.repeat(120));
    console.log('ISSUES: Our DSQ differs from Guide (Parent is correct)');
    console.log('='.repeat(120));
    for (const issue of results.ourOnlyIssues) {
      console.log(`\n[${issue.personaId}] "${issue.question}"`);
      console.log(`  Expected: ${issue.expected}`);
      console.log(`  Our DSQ:  ${issue.ourResult} ❌`);
      console.log(`  Parent:   ${issue.parentResult} ✅`);
    }
  }

  if (results.parentOnlyIssues.length > 0) {
    console.log('\n' + '='.repeat(120));
    console.log('ISSUES: Parent Demo differs from Guide (Our DSQ is correct)');
    console.log('='.repeat(120));
    for (const issue of results.parentOnlyIssues) {
      console.log(`\n[${issue.personaId}] "${issue.question}"`);
      console.log(`  Expected: ${issue.expected}`);
      console.log(`  Our DSQ:  ${issue.ourResult} ✅`);
      console.log(`  Parent:   ${issue.parentResult} ❌`);
    }
  }

  if (results.bothIssues.length > 0) {
    console.log('\n' + '='.repeat(120));
    console.log('ISSUES: Both platforms differ from Guide');
    console.log('='.repeat(120));
    for (const issue of results.bothIssues) {
      console.log(`\n[${issue.personaId}] "${issue.question}"`);
      console.log(`  Expected: ${issue.expected}`);
      console.log(`  Our DSQ:  ${issue.ourResult} ❌`);
      console.log(`  Parent:   ${issue.parentResult} ❌`);
    }
  }

  console.log('\n' + '='.repeat(120));
  console.log('CONCLUSION');
  console.log('='.repeat(120));

  if (results.ourMatchesGuide === results.total) {
    console.log('✅ Our DSQ is 100% Demo Guide compliant');
  } else {
    console.log(`⚠️ Our DSQ has ${results.total - results.ourMatchesGuide} discrepancies from Demo Guide`);
  }

  if (results.parentMatchesGuide === results.total) {
    console.log('✅ Parent Demo is 100% Demo Guide compliant');
  } else {
    console.log(`⚠️ Parent Demo has ${results.total - results.parentMatchesGuide} discrepancies from Demo Guide`);
  }

  if (results.differences.length === 0) {
    console.log('✅ Both platforms return identical widgets for all questions');
  } else {
    console.log(`⚠️ Platforms differ on ${results.differences.length} questions`);
  }

  return results;
}

runComparison().then(results => {
  const hasIssues = results.ourOnlyIssues.length > 0 || results.bothIssues.length > 0;
  process.exit(hasIssues ? 1 : 0);
});
