'use client';
import { useEffect, useRef, useState } from 'react';
import { formatINR } from '@/lib/formatters';

interface Props {
  data: { labels: string[]; invested: number[]; values: number[] };
}

export default function GrowthChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [type, setType] = useState<'line'|'bar'>('line');
  const [ChartJS, setChartJS] = useState<any>(null);

  useEffect(() => {
    import('chart.js/auto').then(mod => setChartJS(mod.default));
  }, []);

  useEffect(() => {
    if (!ChartJS || !canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    chartRef.current = new ChartJS(ctx, {
      type,
      data: {
        labels: data.labels,
        datasets: [
          { label: 'Amount Invested', data: data.invested, borderColor: '#d4d4d4', backgroundColor: 'rgba(212,212,212,.2)', tension: .4, fill: type==='line', pointRadius: 0, borderWidth: 2 },
          { label: 'Estimated Value', data: data.values, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,.08)', tension: .4, fill: type==='line', pointRadius: 0, borderWidth: 2 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10, padding: 12 } } },
        scales: {
          y: { ticks: { callback: (v: number) => formatINR(v), font: { size: 10 }, color: '#a3a3a3' }, grid: { color: 'rgba(0,0,0,.04)' }, border: { display: false } },
          x: { ticks: { font: { size: 10 }, color: '#a3a3a3' }, grid: { display: false }, border: { display: false } },
        },
      },
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [ChartJS, data, type]);

  return (
    <div style={{ background: 'var(--br2)', border: '1px solid var(--br)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.875rem' }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--qu)' }}>Growth Chart</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['line','bar'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{ padding: '3px 9px', borderRadius: 8, border: '1px solid', fontSize: 10, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', borderColor: type===t?'var(--ink)':'var(--br)', background: type===t?'var(--ink)':'white', color: type===t?'white':'var(--su)' }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
