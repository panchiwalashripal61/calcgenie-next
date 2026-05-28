import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.mfapi.in/mf', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('mfapi error');
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json({ error: 'Fund list unavailable' }, { status: 503 });
  }
}
