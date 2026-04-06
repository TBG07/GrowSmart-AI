import { NextResponse } from 'next/server';
import { generateLiveDashboardData } from '@/lib/realtime/simulatedEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = generateLiveDashboardData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[live-data API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}
