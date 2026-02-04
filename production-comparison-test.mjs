#!/usr/bin/env node
/**
 * Production vs Local DSQ Comparison Test
 * Compares widget responses between production (atc-support-v20-op3.vercel.app) and local (localhost:3003)
 */

// All 54 demo questions by persona
const demoQuestions = {
  // MODE 1: Government Contract Management
  'cor': {
    name: 'COR (Alexa Johnson)',
    mode: 'Government',
    questions: [
      'Show me the contract status',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },
  'program-manager': {
    name: 'Program Manager (Jennifer Chen)',
    mode: 'Government',
    questions: [
      'Show me the sprint burndown',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },
  'stakeholder-lead': {
    name: 'Stakeholder Lead (Jessica Martinez)',
    mode: 'Government',
    questions: [
      'Show stakeholder engagement',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },

  // MODE 2: Project Management
  'project-manager': {
    name: 'Project Manager (Dale Thompson)',
    mode: 'Project',
    questions: [
      'Show sprint burndown',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },
  'service-team-lead': {
    name: 'Service Team Lead (Herbert Roberts)',
    mode: 'Project',
    questions: [
      'Show me team status',
      'Show code quality metrics',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },
  'service-team-member': {
    name: 'Service Team Member (Molly Rivera)',
    mode: 'Project',
    questions: [
      'Show my dashboard',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },

  // MODE 3: ATC Customer Support
  'atc-executive': {
    name: 'Executive (Jennifer Anderson)',
    mode: 'ATC',
    questions: [
      'Show executive summary',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },
  'atc-manager': {
    name: 'Manager (David Miller)',
    mode: 'ATC',
    questions: [
      'Compare agent performance',
      'Show team workload',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },
  'atc-support': {
    name: 'Support Agent (Christopher Hayes)',
    mode: 'ATC',
    questions: [
      'Show my open tickets',
      'Show ticket TICK-001',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },
  'atc-csm': {
    name: 'CSM (Jordan Taylor)',
    mode: 'ATC',
    questions: [
      'Show customer health',
      'Show at-risk customers',
      'Who are my top performers?',
      'Draft response about the outage',
      'Open the most urgent access issue',
      'Show me the latest end user request',
    ]
  },
};

// Test via HTTP to local server
async function testLocal(personaId, question) {
  const url = `http://localhost:3003/api/test-query?persona=${personaId}&query=${encodeURIComponent(question)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.widgetType || null;
  } catch (e) {
    return 'ERROR: ' + e.message;
  }
}

// Main comparison runner - local only (production requires browser)
async function runLocalTests() {
  console.log('='.repeat(80));
  console.log('LOCAL DSQ WIDGET RESPONSES');
  console.log('='.repeat(80));
  console.log('');

  const results = {};

  for (const [personaId, persona] of Object.entries(demoQuestions)) {
    console.log(`\n## ${persona.name} (${persona.mode} Mode)`);
    console.log('-'.repeat(60));

    results[personaId] = {
      name: persona.name,
      mode: persona.mode,
      responses: []
    };

    for (const question of persona.questions) {
      const widgetType = await testLocal(personaId, question);
      results[personaId].responses.push({ question, widgetType });
      console.log(`  "${question}"`);
      console.log(`     → ${widgetType}`);
    }
  }

  // Output as JSON for comparison
  console.log('\n' + '='.repeat(80));
  console.log('JSON OUTPUT FOR COMPARISON');
  console.log('='.repeat(80));
  console.log(JSON.stringify(results, null, 2));

  return results;
}

runLocalTests();
