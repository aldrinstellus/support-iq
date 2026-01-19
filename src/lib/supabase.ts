/**
 * Supabase Client for Support IQ (dSQ)
 *
 * Connected to the master Digital Workplace AI Supabase database.
 * Uses the `dsq` schema for Support IQ specific tables.
 *
 * Schema: dsq
 * Tables: customers, tickets, conversations, kb_articles, agents, escalations, etc.
 *
 * @see /docs/SUPABASE_DATABASE_REFERENCE.md for full schema documentation
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database, Dsq, DsqTables } from './database.types';

// Ensure environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing environment variables. Database features will be disabled.\n' +
    'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

/**
 * Supabase client for browser/client-side operations
 * Uses anon key with Row Level Security (RLS)
 */
export const supabase: SupabaseClient<Database> | null = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public', // Default schema
      },
    })
  : null;

/**
 * Helper to check if Supabase is available
 */
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

// =============================================================================
// DSQ Schema Helpers (Type-safe)
// =============================================================================

/**
 * Get a typed query builder for DSQ schema tables
 *
 * @example
 * const { data, error } = await dsq('tickets').select('*').eq('status', 'open');
 * const { data } = await dsq('customers').select('id, email, full_name');
 */
export function dsq<T extends DsqTables>(tableName: T) {
  if (!supabase) {
    throw new Error('[Supabase] Client not available. Check environment variables.');
  }
  // Query dsq schema tables using schema.table format
  return supabase.from(`dsq.${tableName}` as `dsq.${T}`);
}

/**
 * Safe version that returns null instead of throwing
 */
export function dsqSafe<T extends DsqTables>(tableName: T) {
  if (!supabase) {
    console.warn('[Supabase] Client not available');
    return null;
  }
  return supabase.from(`dsq.${tableName}` as `dsq.${T}`);
}

// =============================================================================
// Ticket Operations
// =============================================================================

/**
 * Get all tickets with optional filters
 */
export async function getTickets(options?: {
  status?: Dsq.TicketStatus;
  priority?: Dsq.TicketPriority;
  assignedAgentId?: string;
  customerId?: string;
  limit?: number;
}) {
  const query = dsq('tickets').select(`
    *,
    customer:customers(id, email, full_name, company),
    agent:agents(id, display_name, email, avatar_url)
  `);

  if (options?.status) query.eq('status', options.status);
  if (options?.priority) query.eq('priority', options.priority);
  if (options?.assignedAgentId) query.eq('assigned_agent_id', options.assignedAgentId);
  if (options?.customerId) query.eq('customer_id', options.customerId);

  return query
    .order('created_at', { ascending: false })
    .limit(options?.limit || 50);
}

/**
 * Get a single ticket by ID or ticket number
 */
export async function getTicket(idOrNumber: string) {
  const isTicketNumber = idOrNumber.startsWith('DESK-');

  return dsq('tickets')
    .select(`
      *,
      customer:customers(id, email, full_name, company, phone, tier, health_score),
      agent:agents(id, display_name, email, avatar_url, status),
      sla_policy:sla_policies(id, name, first_response_hours, resolution_hours),
      messages:ticket_messages(*)
    `)
    .eq(isTicketNumber ? 'ticket_number' : 'id', idOrNumber)
    .single();
}

/**
 * Create a new ticket
 */
export async function createTicket(ticket: Dsq.TicketInsert) {
  if (!supabase) {
    throw new Error('[Supabase] Client not available');
  }
  // @ts-expect-error - Schema typing for cross-schema tables
  return supabase.from('dsq.tickets').insert(ticket).select().single();
}

/**
 * Update a ticket
 */
export async function updateTicket(id: string, updates: Partial<Dsq.Ticket>) {
  if (!supabase) {
    throw new Error('[Supabase] Client not available');
  }
  // @ts-expect-error - Schema typing for cross-schema tables
  return supabase.from('dsq.tickets').update(updates).eq('id', id).select().single();
}

// =============================================================================
// Customer Operations
// =============================================================================

/**
 * Get all customers with optional filters
 */
export async function getCustomers(options?: {
  tier?: string;
  riskLevel?: string;
  limit?: number;
}) {
  const query = dsq('customers').select('*');

  if (options?.tier) query.eq('tier', options.tier);
  if (options?.riskLevel) query.eq('risk_level', options.riskLevel);

  return query
    .order('created_at', { ascending: false })
    .limit(options?.limit || 50);
}

/**
 * Get a single customer by ID or email
 */
export async function getCustomer(idOrEmail: string) {
  const isEmail = idOrEmail.includes('@');

  return dsq('customers')
    .select(`
      *,
      tickets:tickets(id, ticket_number, subject, status, priority, created_at),
      conversations:conversations(id, channel, status, started_at)
    `)
    .eq(isEmail ? 'email' : 'id', idOrEmail)
    .single();
}

/**
 * Create a new customer
 */
export async function createCustomer(customer: Dsq.CustomerInsert) {
  if (!supabase) {
    throw new Error('[Supabase] Client not available');
  }
  // @ts-expect-error - Schema typing for cross-schema tables
  return supabase.from('dsq.customers').insert(customer).select().single();
}

// =============================================================================
// Agent Operations
// =============================================================================

/**
 * Get all agents with optional filters
 */
export async function getAgents(options?: {
  status?: string;
  department?: string;
  limit?: number;
}) {
  const query = dsq('agents').select('*');

  if (options?.status) query.eq('status', options.status);
  if (options?.department) query.eq('department', options.department);

  return query
    .order('display_name', { ascending: true })
    .limit(options?.limit || 100);
}

/**
 * Get agent metrics for a date range
 */
export async function getAgentMetrics(agentId: string, startDate: string, endDate: string) {
  return dsq('agent_metrics')
    .select('*')
    .eq('agent_id', agentId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });
}

// =============================================================================
// Knowledge Base Operations
// =============================================================================

/**
 * Get all KB categories
 */
export async function getKbCategories() {
  return dsq('kb_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
}

/**
 * Get KB articles with optional filters
 */
export async function getKbArticles(options?: {
  categoryId?: string;
  status?: Dsq.ArticleStatus;
  isPublic?: boolean;
  isFeatured?: boolean;
  limit?: number;
}) {
  const query = dsq('kb_articles').select(`
    *,
    category:kb_categories(id, name, slug)
  `);

  if (options?.categoryId) query.eq('category_id', options.categoryId);
  if (options?.status) query.eq('status', options.status);
  if (options?.isPublic !== undefined) query.eq('is_public', options.isPublic);
  if (options?.isFeatured !== undefined) query.eq('is_featured', options.isFeatured);

  return query
    .order('created_at', { ascending: false })
    .limit(options?.limit || 50);
}

/**
 * Search KB articles using full-text search
 */
export async function searchKbArticles(query: string, limit = 10) {
  return dsq('kb_articles')
    .select(`
      id, title, slug, summary, tags,
      category:kb_categories(id, name, slug)
    `)
    .eq('status', 'published')
    .eq('is_public', true)
    .textSearch('searchable', query)
    .limit(limit);
}

// =============================================================================
// Cross-Project Knowledge Search
// =============================================================================

/**
 * Cross-project search using knowledge_items table
 * Searches across all Digital Workplace AI projects
 *
 * @param query - Search query text
 * @param projectCodes - Optional filter by project codes (e.g., ['dSQ', 'dIQ'])
 */
export async function searchKnowledgeItems(
  query: string,
  projectCodes?: string[]
) {
  if (!supabase) {
    console.warn('[Supabase] Client not available for search');
    return { data: null, error: new Error('Supabase not configured') };
  }

  let queryBuilder = supabase
    .from('knowledge_items')
    .select(`
      id,
      project_id,
      source_table,
      type,
      title,
      content,
      summary,
      tags,
      created_at,
      projects!inner(code, name)
    `)
    .textSearch('searchable', query);

  if (projectCodes && projectCodes.length > 0) {
    queryBuilder = queryBuilder.in('projects.code', projectCodes);
  }

  return queryBuilder.limit(20);
}

// =============================================================================
// Real-time Subscriptions
// =============================================================================

/**
 * Subscribe to ticket updates
 */
export function subscribeToTickets(
  callback: (payload: { eventType: string; new: Dsq.Ticket; old: Dsq.Ticket }) => void
) {
  if (!supabase) {
    console.warn('[Supabase] Client not available for subscriptions');
    return null;
  }

  return supabase
    .channel('dsq-tickets')
    .on(
      'postgres_changes',
      { event: '*', schema: 'dsq', table: 'tickets' },
      (payload) => callback(payload as { eventType: string; new: Dsq.Ticket; old: Dsq.Ticket })
    )
    .subscribe();
}

/**
 * Subscribe to conversation messages
 */
export function subscribeToConversationMessages(
  conversationId: string,
  callback: (message: Dsq.ConversationMessage) => void
) {
  if (!supabase) {
    console.warn('[Supabase] Client not available for subscriptions');
    return null;
  }

  return supabase
    .channel(`dsq-conversation-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'dsq',
        table: 'conversation_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => callback(payload.new as Dsq.ConversationMessage)
    )
    .subscribe();
}

// =============================================================================
// Analytics & Activity Logging
// =============================================================================

/**
 * Log an analytics event
 */
export async function logAnalyticsEvent(event: Dsq.AnalyticsInsert) {
  return dsq('analytics').insert(event);
}

/**
 * Log an activity
 */
export async function logActivity(activity: Dsq.ActivityLogInsert) {
  return dsq('activity_log').insert(activity);
}

// =============================================================================
// Re-export types for convenience
// =============================================================================

export type { Dsq, Database, DsqTables } from './database.types';

export default supabase;
