#!/usr/bin/env node
/**
 * Generate Missing Embeddings Script
 *
 * Generates OpenAI embeddings for knowledge_items that are missing them.
 * Uses text-embedding-3-small model (1536 dimensions).
 */

import { createClient } from '@supabase/supabase-js';

// Configuration from environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fhtempgkltrazrgbedrh.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodGVtcGdrbHRyYXpyZ2JlZHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3ODgzOTEsImV4cCI6MjA4NDM2NDM5MX0.6nESGQI48SWOfwBen2IRDStMMkOEKBKdAE6xCK7McQs';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is required');
  console.log('Set it with: export OPENAI_API_KEY="sk-proj-..."');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Generate embedding using OpenAI API
 */
async function generateEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Finding items without embeddings...\n');

  // Get items without embeddings
  const { data: items, error: fetchError } = await supabase
    .from('knowledge_items')
    .select('id, title, content, summary')
    .is('embedding', null);

  if (fetchError) {
    console.error('Error fetching items:', fetchError);
    process.exit(1);
  }

  if (!items || items.length === 0) {
    console.log('✅ All items already have embeddings!');
    return;
  }

  console.log(`Found ${items.length} items without embeddings:\n`);
  items.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.title}`);
  });
  console.log('');

  // Generate embeddings for each item
  let successCount = 0;
  let errorCount = 0;

  for (const item of items) {
    try {
      // Combine title, summary, and content for embedding
      const textToEmbed = [
        item.title,
        item.summary || '',
        item.content || ''
      ].filter(Boolean).join('\n\n');

      console.log(`⏳ Generating embedding for: ${item.title}`);

      const embedding = await generateEmbedding(textToEmbed);

      // Update the item with the embedding
      const { error: updateError } = await supabase
        .from('knowledge_items')
        .update({ embedding })
        .eq('id', item.id);

      if (updateError) {
        console.error(`  ❌ Failed to update: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ Updated successfully`);
        successCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total items: ${items.length}`);
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  if (errorCount === 0) {
    console.log('\n🎉 All embeddings generated successfully!');
  }
}

main().catch(console.error);
