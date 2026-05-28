import { NextResponse } from 'next/server';

interface NavRow { date: string; nav: string; }

function navOnDate(navArr: NavRow[], yearsAgo: number): { nav: number } | null {
  const target = new Date();
  target.setFullYear(target.getFullYear() - yearsAgo);
  let best: { nav: number; diff: number } | null = null;
  for (const row of navArr) {
    const [d, m, y] = row.date.split('-');
    const date = new Date(`${y}-${m}-${d}`);
    const diff = Math.abs(date.getTime() - target.getTime());
    if (!best || diff < best.diff) best = { nav: parseFloat(row.nav), diff };
  }
  return best;
}

function cagr(from: { nav: number } | null, to: number, years: number): number | null {
  if (!from || from.nav <= 0) return null;
  return (Math.pow(to / from.nav, 1 / years) - 1) * 100;
}

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    const res = await fetch(`https://api.mfapi.in/mf/${code}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('NAV fetch failed');
    const data = await res.json();
    const navArr: NavRow[] = data.data || [];
    if (!navArr.length) throw new Error('No NAV data');

    const latest = parseFloat(navArr[0].nav);
    return NextResponse.json({
      meta: data.meta,
      latestNAV: latest,
      navDate: navArr[0].date,
      dataPoints: navArr.length,
      cagr: {
        '1y': cagr(navOnDate(navArr, 1), latest, 1),
        '3y': cagr(navOnDate(navArr, 3), latest, 3),
        '5y': cagr(navOnDate(navArr, 5), latest, 5),
        '10y': cagr(navOnDate(navArr, 10), latest, 10),
      },
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } });
  } catch (e) {
    return NextResponse.json({ error: 'NAV data unavailable' }, { status: 503 });
  }
}
