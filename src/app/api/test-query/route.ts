import { NextRequest, NextResponse } from 'next/server';
import { detectWidgetQuery, PersonaId } from '@/lib/query-detection';

/**
 * Test endpoint for query detection
 * Usage: GET /api/test-query?persona=program-manager&query=Show%20me%20the%20sprint%20burndown
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const persona = searchParams.get('persona') as PersonaId;
  const query = searchParams.get('query');

  if (!persona || !query) {
    return NextResponse.json(
      { error: 'Missing persona or query parameter' },
      { status: 400 }
    );
  }

  try {
    const result = detectWidgetQuery(query, persona);

    return NextResponse.json({
      persona,
      query,
      widgetType: result?.widgetType || null,
      responseText: result?.responseText || null,
      hasWidgetData: !!result?.widgetData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Query detection failed', details: String(error) },
      { status: 500 }
    );
  }
}
