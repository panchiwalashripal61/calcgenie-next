// Indian number formatting utilities

export function formatINR(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '−' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000)   return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
}

export function formatINRFull(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '—';
  return '₹' + Math.round(Math.abs(n)).toLocaleString('en-IN');
}

export function formatPct(n: number, decimals = 2): string {
  return isFinite(n) ? `${n.toFixed(decimals)}%` : '—';
}

export function formatN(n: number): string {
  return isFinite(n) ? Math.round(n).toLocaleString('en-IN') : '—';
}
