import { NextResponse } from 'next/server';
import { detectWidgetQuery, type PersonaId } from '@/lib/query-detection';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const persona = searchParams.get('persona') as PersonaId;
  const query = searchParams.get('query');

  if (!persona || !query) {
    return NextResponse.json(
      { error: 'Missing persona or query parameter' },
      { status: 400 }
    );
  }

  const result = detectWidgetQuery(query, persona);

  return NextResponse.json({
    persona,
    query,
    widgetType: result?.widgetType || null,
    responseText: result?.responseText || null,
  });
}
