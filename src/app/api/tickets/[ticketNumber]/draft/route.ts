/**
 * API Route: Fetch and Update Draft for a Ticket
 * GET - Fetch draft by ticket number
 * PATCH - Update draft content
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    ticketNumber: string;
  }>;
}

interface DraftRecord {
  id: number;
  created_at: string;
  draft: string;
  status: 'pending' | 'sent';
}

/**
 * GET /api/tickets/[ticketNumber]/draft
 * Fetch draft response for a ticket
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { ticketNumber } = await context.params;

    if (!ticketNumber) {
      return NextResponse.json(
        { success: false, error: 'Ticket number is required' },
        { status: 400 }
      );
    }

    // Extract numeric part from TICK-XXX format
    const numericTicketNumber = ticketNumber.replace(/^TICK-?/i, '');
    console.log('[API /draft] Fetching draft for ticket:', numericTicketNumber);

    if (!supabase) {
      console.warn('[API /draft] Supabase not configured');
      return NextResponse.json({
        success: false,
        error: 'Database not configured',
        draft: null
      });
    }

    // Query drafts_demo table by ticket id
    const { data, error } = await supabase
      .from('drafts_demo')
      .select('*')
      .eq('id', parseInt(numericTicketNumber, 10))
      .maybeSingle<DraftRecord>();

    if (error) {
      console.error('[API /draft] Supabase error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        draft: null
      });
    }

    if (!data) {
      console.log('[API /draft] No draft found for ticket:', numericTicketNumber);
      return NextResponse.json({
        success: true,
        draft: null,
        message: 'No draft found for this ticket'
      });
    }

    // Parse the draft content (it's stored as JSON string)
    let draftContent = '';
    if (data.draft) {
      try {
        // Remove outer quotes if present
        draftContent = typeof data.draft === 'string'
          ? JSON.parse(data.draft)
          : data.draft;
      } catch {
        // If parsing fails, use as-is
        draftContent = data.draft;
      }
    }

    return NextResponse.json({
      success: true,
      draft: {
        id: data.id,
        ticketNumber: numericTicketNumber,
        content: draftContent,
        createdAt: data.created_at,
        status: data.status || 'pending',
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch draft';
    console.error('[API /draft] Error:', errorMessage);

    return NextResponse.json({
      success: false,
      error: errorMessage,
      draft: null
    }, { status: 500 });
  }
}

/**
 * PATCH /api/tickets/[ticketNumber]/draft
 * Update draft content
 */
export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { ticketNumber } = await context.params;
    const body = await req.json();
    const { content } = body;

    if (!ticketNumber) {
      return NextResponse.json(
        { success: false, error: 'Ticket number is required' },
        { status: 400 }
      );
    }

    if (content === undefined) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Extract numeric part
    const numericTicketNumber = ticketNumber.replace(/^TICK-?/i, '');
    console.log('[API /draft] Updating draft for ticket:', numericTicketNumber);

    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 });
    }

    const ticketId = parseInt(numericTicketNumber, 10);

    // Check if draft already exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingDraft } = await (supabase as any)
      .from('drafts_demo')
      .select('*')
      .eq('id', ticketId)
      .maybeSingle() as { data: DraftRecord | null; error: Error | null };

    let data: DraftRecord | null = null;
    let error: Error | null = null;

    if (existingDraft) {
      // Update existing draft
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateResult = await (supabase as any)
        .from('drafts_demo')
        .update({
          draft: JSON.stringify(content),
          status: 'pending', // Always set to pending when updating
          created_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .select()
        .single() as { data: DraftRecord | null; error: Error | null };

      data = updateResult.data;
      error = updateResult.error;
    } else {
      // Insert new draft
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const insertResult = await (supabase as any)
        .from('drafts_demo')
        .insert({
          id: ticketId,
          draft: JSON.stringify(content),
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single() as { data: DraftRecord | null; error: Error | null };

      data = insertResult.data;
      error = insertResult.error;
    }

    if (error || !data) {
      console.error('[API /draft] Update error:', error);
      return NextResponse.json({
        success: false,
        error: error?.message || 'Failed to save draft'
      }, { status: 500 });
    }

    console.log('[API /draft] Draft updated successfully');
    return NextResponse.json({
      success: true,
      draft: {
        id: data.id,
        ticketNumber: numericTicketNumber,
        content: content,
        createdAt: data.created_at,
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update draft';
    console.error('[API /draft] Error:', errorMessage);

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
