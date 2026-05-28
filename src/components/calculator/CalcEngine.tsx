'use client';
import { useState, useCallback, useRef } from 'react';
import { formatINR } from '@/lib/formatters';
import { FD_RATES } from '@/lib/constants';
import { ALL_FUNDS } from '@/lib/fund-data';
import type { Fund } from '@/lib/fund-data';
import GrowthChart from './GrowthChart';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CalcInput = Record<string, any>;

export interface CalcConfig {
  id: string; icon: string; color: string;
  title: string; subtitle: string;
  category: string;
  formula: { eq: string; vars?: string; source: string; url?: string };
  steps: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs: any[];
  note?: string;
  hasFundSearch?: boolean;
  hasBankRates?: boolean;
  hasChart?: boolean;
  hasUpload?: boolean;
  uploadType?: 'salary' | 'gst';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compute: (vals: Record<string, any>) => CalcResult;
}

export interface CalcResult {
  primary: { label: string; val: string };
  cards: { label: string; val: string; cls?: string; sub?: string }[];
  bars?: { name: string; amt: number; col: string }[];
  chartData?: { labels: string[]; invested: number[]; values: number[] };
  chartPie?: { labels: string[]; vals: number[]; cols: string[] };
  ydata?: string[][];
  ycols?: string[];
  newSlabs?: { r: string; rate: string; active: boolean }[];
  oldTaxable?: number; newTaxable?: number;
  newTotal?: number; oldTotal?: number;
  better?: string; saving?: number;
  threeVals?: { label: string; val: string; bold?: boolean }[];
  ctcBreakdown?: { item: string; monthly: string; annual: string; bold?: boolean }[];
  gstDetail?: { base: number; gst: number; total: number; cgst: number; sgst: number; igst: number; rate: number; txType: string };
  benchmarks?: { name: string; ret: string; cagr: number; highlight?: boolean }[];
}

const C = formatINR;

const METRIC_COLORS: Record<string, string> = {
  green: 'var(--gl)', amber: 'var(--al)', blue: 'var(--bll)', red: 'var(--rl)', '': 'var(--br2)'
};
const METRIC_TEXT: Record<string, string> = {
  green: 'var(--gd)', amber: '#78350f', blue: '#1e3a8a', red: '#7f1d1d', '': 'var(--ink)'
};
const METRIC_BORDER: Record<string, string> = {
  green: 'var(--gb)', amber: '#fde68a', blue: '#bfdbfe', red: '#fecaca', '': 'var(--br)'
};

export default function CalcEngine({ config }: { config: CalcConfig }) {
  const [vals, setVals] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = {};
    config.inputs.forEach(inp => { init[inp.id] = inp.def; });
    return init;
  });
  const [result, setResult] = useState<CalcResult | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selFund, setSelFund] = useState<Fund | null>(null);
  const [fundSearch, setFundSearch] = useState('');
  const [fundCat, setFundCat] = useState('all');
  const [showFundDrop, setShowFundDrop] = useState(false);
  const [fundLive, setFundLive] = useState<{ cagr: Record<string, number | null>; nav: number; date: string } | null>(null);
  const [selBank, setSelBank] = useState<string | null>(null);
  const [parseStatus, setParseStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [parseMsg, setParseMsg] = useState('');
  const [extractedRows, setExtractedRows] = useState<[string, string][]>([]);
  const [showFormula, setShowFormula] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compute = useCallback(() => {
    try {
      const numVals: Record<string, number | string> = {};
      config.inputs.forEach(inp => {
        const v = vals[inp.id];
        numVals[inp.id] = (inp.type === 'sel' || inp.opts) ? String(v) : (parseFloat(String(v)) || Number(inp.def) || 0);
      });
      setResult(config.compute(numVals));
      setShowAll(false);
    } catch (e) { console.error(e); }
  }, [vals, config]);

  const reset = () => {
    const init: Record<string, string | number> = {};
    config.inputs.forEach(inp => { init[inp.id] = inp.def; });
    setVals(init);
    setResult(null);
    setSelFund(null);
    setFundSearch('');
    setFundLive(null);
    setSelBank(null);
    setParseStatus('idle');
    setExtractedRows([]);
  };

  // Fund search
  const filteredFunds = ALL_FUNDS.filter(f => {
    const nm = f.n.toLowerCase();
    const catOk = fundCat === 'all' || nm.includes(fundCat) || f.cat.includes(fundCat);
    if (!catOk) return false;
    if (!fundSearch || fundSearch.length < 2) return fundCat !== 'all';
    return fundSearch.toLowerCase().split(' ').every((t: string) => t.length < 2 || nm.includes(t) || f.h.toLowerCase().includes(t));
  }).slice(0, 40);

  const pickFund = async (fund: Fund) => {
    setSelFund(fund);
    setFundSearch(fund.n);
    setShowFundDrop(false);
    setFundLive(null);
    const useReturn = fund.r5 || fund.r3 || fund.r1 || 12;
    setVals(prev => ({ ...prev, rate: Number(useReturn.toFixed(1)) }));
    // Try live NAV
    try {
      const res = await fetch(`/api/mf/${fund.c}`);
      if (res.ok) {
        const data = await res.json();
        setFundLive({ cagr: data.cagr, nav: data.latestNAV, date: data.navDate });
        const liveCagr = data.cagr?.['5y'] || data.cagr?.['3y'] || data.cagr?.['1y'];
        if (liveCagr) setVals(prev => ({ ...prev, rate: Number(liveCagr.toFixed(1)) }));
      }
    } catch {}
  };

  // Bank rate select
  const pickBank = (bank: typeof FD_RATES[0]) => {
    setSelBank(bank.bank);
    const yrs = parseFloat(String(vals['years'])) || 1;
    const r = yrs <= 1 ? bank.rate1 : yrs <= 2 ? bank.rate2 : bank.rate3;
    setVals(prev => ({ ...prev, rate: r }));
  };

  // Document upload
  const handleFile = async (file: File) => {
    if (!file) return;
    setParseStatus('loading');
    setParseMsg('Reading document…');
    setExtractedRows([]);
    try {
      const b64 = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res((r.result as string).split(',')[1]);
        r.onerror = () => rej(new Error('Read failed'));
        r.readAsDataURL(file);
      });
      const resp = await fetch('/api/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: b64, mediaType: file.type || 'application/pdf', docType: config.uploadType === 'gst' ? 'gst_invoice' : 'salary_slip' }),
      });
      if (!resp.ok) throw new Error('API error ' + resp.status);
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      // Apply extracted data
      if (config.uploadType === 'gst') {
        if (data.base_amount) setVals(prev => ({ ...prev, amount: Math.round(data.base_amount) }));
        if (data.gst_rate_total) {
          const slabs = [5,12,18,28];
          const closest = slabs.reduce((a:number,b:number) => Math.abs(b-data.gst_rate_total)<Math.abs(a-data.gst_rate_total)?b:a);
          setVals(prev => ({ ...prev, rate: String(closest) }));
        }
        if (data.is_inclusive !== undefined) setVals(prev => ({ ...prev, calcType: data.is_inclusive ? 'incl' : 'excl' }));
        if (data.transaction_type) setVals(prev => ({ ...prev, txType: data.transaction_type?.includes('inter') ? 'inter' : 'intra' }));
        const rows: [string,string][] = [];
        if (data.vendor_name) rows.push(['Vendor', data.vendor_name]);
        if (data.vendor_gstin) rows.push(['GSTIN', data.vendor_gstin]);
        if (data.invoice_number) rows.push(['Invoice No.', data.invoice_number]);
        if (data.invoice_date) rows.push(['Date', data.invoice_date]);
        if (data.hsn_sac_code) rows.push(['HSN/SAC', data.hsn_sac_code]);
        if (data.base_amount) rows.push(['Base Amount', C(data.base_amount)]);
        if (data.total_gst) rows.push(['Total GST', C(data.total_gst)]);
        if (data.total_invoice_amount) rows.push(['Total Invoice', C(data.total_invoice_amount)]);
        setExtractedRows(rows);
      } else {
        const annualGross = data.annual_gross || (data.gross_monthly ? data.gross_monthly * 12 : null);
        if (annualGross) setVals(prev => ({ ...prev, income: Math.round(annualGross) }));
        const pf80c = Math.min(data.annual_pf || (data.pf_employee_monthly ? data.pf_employee_monthly * 12 : 6840), 150000);
        setVals(prev => ({ ...prev, d80c: data.form16_80c || pf80c }));
        const rows: [string,string][] = [];
        if (data.employee_name) rows.push(['Employee', data.employee_name]);
        if (data.company_name) rows.push(['Company', data.company_name]);
        if (data.month_year) rows.push(['Period', data.month_year]);
        if (data.gross_monthly) rows.push(['Monthly Gross', C(data.gross_monthly)]);
        if (data.net_monthly) rows.push(['Monthly Net', C(data.net_monthly)]);
        if (annualGross) rows.push(['Annual Gross (projected)', C(annualGross)]);
        if (data.annual_pf) rows.push(['Annual PF', C(data.annual_pf)]);
        if (data.annual_tds_deducted != null) rows.push(['TDS Deducted', C(data.annual_tds_deducted)]);
        setExtractedRows(rows);
      }
      setParseStatus('success');
      setParseMsg(`✅ Document read successfully — ${file.name}`);
    } catch (e) {
      setParseStatus('error');
      setParseMsg(e instanceof Error ? e.message : 'Could not parse document');
    }
  };

  const s: React.CSSProperties = { fontFamily: 'var(--font-geist-sans)' };
  const mono: React.CSSProperties = { fontFamily: 'var(--font-geist-mono)' };

  return (
    <div style={{ background:'white', border:'1px solid var(--br)', borderRadius:18, overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,.07)' }}>
      {/* Panel Header */}
      <div style={{ padding:'1.5rem 1.75rem 1.25rem', borderBottom:'1px solid var(--br2)', background:'linear-gradient(to bottom, white, var(--sf))' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:'1rem' }}>
          <div style={{ width:46, height:46, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, background:config.color, flexShrink:0 }}>{config.icon}</div>
          <div>
            <div className="serif" style={{ fontSize:'1.4rem', letterSpacing:'-.3px', marginBottom:3, lineHeight:1.2 }}>{config.title}</div>
            <div style={{ fontSize:12, color:'var(--su)', lineHeight:1.5 }}>{config.subtitle}</div>
          </div>
        </div>
        <div style={{ background:'var(--br2)', border:'1px solid var(--br)', borderRadius:10, padding:'9px 13px' }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--qu)', marginBottom:2 }}>Formula</div>
          <div style={{ ...mono, fontSize:11.5, color:'var(--ink2)', lineHeight:1.5 }}>{config.formula.eq}</div>
          {config.formula.vars && <div style={{ fontSize:10, color:'var(--su)', marginTop:2 }}>{config.formula.vars}</div>}
          <div style={{ fontSize:10, color:'var(--g)', marginTop:2 }}>
            📌 {config.formula.source}{config.formula.url && <a href={config.formula.url} target="_blank" rel="noopener" style={{ color:'var(--g)', marginLeft:4 }}>↗</a>}
          </div>
        </div>
      </div>

      <div style={{ padding:'1.5rem 1.75rem' }}>
        {/* Document Upload */}
        {config.hasUpload && (
          <div style={{ border:'1.5px solid var(--br)', borderRadius:10, padding:'1rem', marginBottom:'1rem' }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--mu)', marginBottom:'.75rem' }}>
              📎 Upload {config.uploadType === 'gst' ? 'Invoice or Bill' : 'Salary Slip or Form 16'}
              <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, color:'var(--qu)', marginLeft:8 }}>PDF or image · Auto-fills all fields</span>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor='var(--g)'; }}
              onDragLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor='var(--br)'; }}
              onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor='var(--br)'; const f=e.dataTransfer?.files?.[0]; if(f) handleFile(f); }}
              style={{ border:'2px dashed var(--br)', borderRadius:10, padding:'1.25rem', textAlign:'center', cursor:'pointer', marginBottom:'.75rem' }}
            >
              <div style={{ fontSize:24, marginBottom:6 }}>📄</div>
              <div style={{ fontSize:13, fontWeight:500, color:'var(--ink2)', marginBottom:3 }}>Drop {config.uploadType === 'gst' ? 'invoice' : 'salary slip'} here</div>
              <div style={{ fontSize:11, color:'var(--su)' }}>PDF, JPG, PNG · Click to browse</div>
              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:'none' }} onChange={e => { const f=e.target.files?.[0]; if(f) handleFile(f); }} />
            </div>
            {parseStatus !== 'idle' && (
              <div style={{ borderRadius:8, padding:'9px 12px', fontSize:12, marginBottom:'.5rem', background:parseStatus==='success'?'var(--gl)':parseStatus==='error'?'var(--rl)':'var(--bll)', color:parseStatus==='success'?'var(--gd)':parseStatus==='error'?'#7f1d1d':'#1e3a8a', border:`1px solid ${parseStatus==='success'?'var(--gb)':parseStatus==='error'?'#fecaca':'#bfdbfe'}` }}>
                {parseStatus === 'loading' ? '⏳ ' : ''}{parseMsg}
              </div>
            )}
            {extractedRows.length > 0 && (
              <div style={{ border:'0.5px solid var(--br)', borderRadius:8, overflow:'hidden' }}>
                <div style={{ padding:'6px 12px', background:'var(--br2)', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--su)' }}>Extracted from document</div>
                {extractedRows.map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 12px', borderTop:'0.5px solid var(--br2)', fontSize:12 }}>
                    <span style={{ color:'var(--mu)' }}>{k}</span>
                    <span style={{ ...mono, fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fund Selector */}
        {config.hasFundSearch && (
          <div style={{ border:'1.5px solid var(--br)', borderRadius:10, padding:'1rem', marginBottom:'1rem' }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--mu)', marginBottom:'.75rem' }}>
              🔍 Select Mutual Fund
              <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, color:'var(--qu)', marginLeft:8 }}>Live CAGR from AMFI · 500+ funds</span>
            </div>
            <div style={{ position:'relative', marginBottom:'.625rem' }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--qu)', fontSize:14 }}>⌕</span>
              <input
                type="text"
                value={fundSearch}
                onChange={e => { setFundSearch(e.target.value); setShowFundDrop(true); }}
                onFocus={() => setShowFundDrop(true)}
                placeholder="Search: Nifty 50, HDFC Mid Cap, Parag Parikh..."
                style={{ width:'100%', padding:'8px 13px 8px 32px', border:'1.5px solid var(--br)', borderRadius:8, fontSize:13, outline:'none', ...s }}
              />
            </div>
            {/* Filter tags */}
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:'.625rem' }}>
              {['all','equity','large cap','mid cap','small cap','flexi cap','elss','index','hybrid','debt','liquid','gilt','sectoral','gold','international'].map(cat => (
                <span key={cat} onClick={() => { setFundCat(cat); setShowFundDrop(true); }}
                  style={{ padding:'3px 9px', borderRadius:12, border:'1px solid', fontSize:10, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap', borderColor:fundCat===cat?'var(--ink)':'var(--br)', background:fundCat===cat?'var(--ink)':'white', color:fundCat===cat?'white':'var(--mu)', textTransform:'capitalize' }}>
                  {cat}
                </span>
              ))}
            </div>
            {/* Dropdown */}
            {showFundDrop && filteredFunds.length > 0 && (
              <div style={{ border:'1px solid var(--br)', borderRadius:8, maxHeight:220, overflowY:'auto', background:'white', boxShadow:'0 4px 16px rgba(0,0,0,.08)', position:'relative', zIndex:10 }}>
                {filteredFunds.map(f => (
                  <div key={f.c} onClick={() => pickFund(f)}
                    style={{ padding:'8px 12px', cursor:'pointer', borderBottom:'1px solid var(--br2)' }}
                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='var(--gl)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='white'}>
                    <div style={{ fontSize:12, fontWeight:500, color:'var(--ink)', lineHeight:1.3, marginBottom:2 }}>{f.n}</div>
                    <div style={{ fontSize:10, color:'var(--su)', display:'flex', gap:8 }}>
                      <span>{f.h}</span><span style={{ textTransform:'capitalize' }}>{f.cat}</span>
                      {f.r5 && <span style={{ color:'var(--g)', fontWeight:600 }}>5Y: {f.r5}%</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Selected fund card */}
            {selFund && (
              <div style={{ background:'var(--gl)', border:'1.5px solid var(--gb)', borderRadius:8, padding:'10px 12px', marginTop:'.625rem' }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--gd)', marginBottom:3 }}>{selFund.n}</div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                  {[['1Y', fundLive?.cagr?.['1y'] ?? selFund.r1], ['3Y', fundLive?.cagr?.['3y'] ?? selFund.r3], ['5Y', fundLive?.cagr?.['5y'] ?? selFund.r5], ['10Y', fundLive?.cagr?.['10y'] ?? selFund.r10]].filter(([,v])=>v!=null).map(([y,v]) => (
                    <div key={y as string}>
                      <div style={{ fontSize:9, color:'var(--mu)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.3px' }}>{y}</div>
                      <div style={{ ...mono, fontSize:13, fontWeight:600, color:'var(--gd)' }}>{(v as number).toFixed(1)}%</div>
                    </div>
                  ))}
                  {fundLive && <div><div style={{ fontSize:9, color:'var(--mu)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.3px' }}>NAV</div><div style={{ ...mono, fontSize:13, fontWeight:600, color:'var(--gd)' }}>₹{fundLive.nav.toFixed(2)}</div></div>}
                </div>
                <div style={{ fontSize:11, color:'var(--gd)' }}>
                  {fundLive ? `✅ Live CAGR from AMFI · NAV as on ${fundLive.date}` : '✅ Verified CAGR (AMFI Apr 2026) · Rate auto-applied above'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bank Rates */}
        {config.hasBankRates && (
          <div style={{ border:'1.5px solid var(--br)', borderRadius:10, padding:'1rem', marginBottom:'1rem' }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--mu)', marginBottom:'.75rem' }}>🏦 Bank FD Rates (Apr 2026) — Click to auto-fill</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(155px, 1fr))', gap:6 }}>
              {FD_RATES.map(b => (
                <div key={b.bank} onClick={() => pickBank(b)}
                  style={{ border:`1.5px solid ${selBank===b.bank?'var(--bl)':'var(--br)'}`, borderRadius:8, padding:'8px 11px', cursor:'pointer', background:selBank===b.bank?'var(--bll)':'white' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor='var(--bl)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor=selBank===b.bank?'var(--bl)':'var(--br)'}>
                  <div style={{ fontSize:11, fontWeight:600, color:'var(--ink2)', marginBottom:2 }}>{b.bank}</div>
                  <div style={{ ...mono, fontSize:'1.1rem', fontWeight:600, color:'var(--bl)' }}>{b.rateMax}%</div>
                  <div style={{ fontSize:9, color:'var(--su)', marginTop:2 }}>1yr:{b.rate1}% · Sr:{b.senior}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inputs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:'1rem', marginBottom:'1.25rem' }}>
          {config.inputs.map(inp => (
            <div key={inp.id} style={{ display:'flex', flexDirection:'column', gap:5 }}>
              <label style={{ fontSize:11, fontWeight:600, color:'var(--mu)', textTransform:'uppercase', letterSpacing:'.4px', display:'flex', justifyContent:'space-between' }}>
                {inp.label}
                {inp.hint && <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, fontSize:10, color:'var(--qu)' }}>{inp.hint}</span>}
              </label>
              {inp.type === 'sel' || inp.opts ? (
                <select value={String(vals[inp.id] ?? inp.def)} onChange={e => setVals(prev => ({ ...prev, [inp.id]: e.target.value }))}
                  style={{ padding:'9px 28px 9px 10px', border:'1.5px solid var(--br)', borderRadius:8, fontSize:13, color:'var(--ink)', background:'white', outline:'none', cursor:'pointer', ...s, appearance:'none', backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24'%3E%3Cpath fill='%23a3a3a3' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center' }}>
                  {(inp.opts || []).map((o: {v: string|number; l: string}) => <option key={String(o.v)} value={String(o.v)}>{o.l}</option>)}
                </select>
              ) : (
                <div style={{ position:'relative' }}>
                  {inp.pfx && <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:12, color:'var(--su)', ...mono, pointerEvents:'none' }}>{inp.pfx}</span>}
                  {inp.sfx && <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:12, color:'var(--su)', ...mono, pointerEvents:'none' }}>{inp.sfx}</span>}
                  <input type="number"
                    value={vals[inp.id] ?? inp.def}
                    min={inp.min} max={inp.max} step={inp.step || 1}
                    onChange={e => setVals(prev => ({ ...prev, [inp.id]: e.target.value }))}
                    style={{ width:'100%', padding:`9px ${inp.sfx?'32px':'10px'} 9px ${inp.pfx?'26px':'10px'}`, border:'1.5px solid var(--br)', borderRadius:8, ...mono, fontSize:14, fontWeight:500, color:'var(--ink)', background:'white', outline:'none' }}
                    onFocus={e=>(e.currentTarget as HTMLInputElement).style.borderColor='var(--g)'}
                    onBlur={e=>(e.currentTarget as HTMLInputElement).style.borderColor='var(--br)'}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:8, marginBottom:'1.5rem' }}>
          <button onClick={compute} style={{ flex:1, padding:'11px 20px', background:'var(--ink)', color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', ...s }}>Calculate</button>
          <button onClick={reset} style={{ padding:'11px 14px', background:'white', color:'var(--su)', border:'1.5px solid var(--br)', borderRadius:8, fontSize:13, cursor:'pointer', ...s }}>↺ Reset</button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ animation:'fadeUp .25s ease' }}>
            {/* Primary banner */}
            <div style={{ background:'var(--ink)', borderRadius:10, padding:'1.25rem 1.5rem', position:'relative', overflow:'hidden', marginBottom:'1rem' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg, var(--g), var(--gm))' }} />
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.4px', marginBottom:4 }}>{result.primary.label}</div>
                  <div className="serif" style={{ fontSize:'2rem', color:'white', letterSpacing:'-.5px', lineHeight:1 }}>{result.primary.val}</div>
                </div>
                <div style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', borderRadius:20, padding:'4px 10px', fontSize:10, color:'rgba(255,255,255,.6)' }}>✓ Formula Verified</div>
              </div>
            </div>

            {/* Metric cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(125px, 1fr))', gap:8, marginBottom:'1rem' }}>
              {result.cards.map(card => (
                <div key={card.label} style={{ background:METRIC_COLORS[card.cls||''], border:`1px solid ${METRIC_BORDER[card.cls||'']}`, borderRadius:8, padding:'.875rem 1rem', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:card.cls==='green'?'var(--g)':card.cls==='amber'?'var(--am)':card.cls==='blue'?'var(--bl)':card.cls==='red'?'var(--rd)':'var(--br)' }} />
                  <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px', color:'var(--qu)', marginBottom:5 }}>{card.label}</div>
                  <div style={{ ...mono, fontSize:'1.05rem', fontWeight:500, color:METRIC_TEXT[card.cls||''], lineHeight:1.2 }}>{card.val}</div>
                  {card.sub && <div style={{ fontSize:10, color:'var(--su)', marginTop:3 }}>{card.sub}</div>}
                </div>
              ))}
            </div>

            {/* Bar breakdown */}
            {result.bars && result.bars.length > 0 && (
              <div style={{ background:'var(--br2)', border:'1px solid var(--br)', borderRadius:8, padding:'1rem', marginBottom:'1rem' }}>
                <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--qu)', marginBottom:'.875rem' }}>Breakdown</div>
                {result.bars.map(b => {
                  const tot = result.bars!.reduce((s,x)=>s+Math.abs(x.amt),0);
                  return (
                    <div key={b.name} style={{ marginBottom:8 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3, fontSize:12 }}>
                        <span style={{ fontWeight:500, color:'var(--ink3)' }}>{b.name}</span>
                        <span style={{ ...mono, fontSize:11, color:'var(--su)' }}>{C(b.amt)}</span>
                      </div>
                      <div style={{ height:4, background:'var(--br)', borderRadius:2, overflow:'hidden' }}>
                        <div style={{ height:'100%', background:b.col, borderRadius:2, width:`${Math.max(3, tot>0?Math.abs(b.amt)/tot*100:0).toFixed(1)}%`, transition:'width .7s cubic-bezier(.4,0,.2,1)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Chart */}
            {result.chartData && <GrowthChart data={result.chartData} />}

            {/* Income Tax Regime Compare */}
            {result.newSlabs && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:'1rem' }}>
                {[
                  { title:'New Regime', isWinner:result.better==='New Regime', slabs:result.newSlabs, tax:result.newTotal||0, note:'87A rebate ₹60K → Zero tax ≤₹12L · Std ded ₹75K', noteColor:'var(--gl)', noteText:'var(--gd)' },
                  { title:'Old Regime', isWinner:result.better==='Old Regime', slabs:[{r:'Up to ₹2.5L',rate:'0%',active:false},{r:'₹2.5L–₹5L',rate:'5%',active:false},{r:'₹5L–₹10L',rate:'20%',active:false},{r:'Above ₹10L',rate:'30%',active:false}], tax:result.oldTotal||0, note:'80C ₹1.5L + 80D + HRA + NPS + Home loan', noteColor:'var(--al)', noteText:'#78350f' },
                ].map(regime => (
                  <div key={regime.title} style={{ border:`${regime.isWinner?'2':'1'}px solid ${regime.isWinner?'var(--gb)':'var(--br)'}`, borderRadius:10, padding:'1rem', background:regime.isWinner?'var(--gl)':'white' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'.75rem' }}>
                      <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px', color:regime.isWinner?'var(--gd)':'var(--mu)' }}>{regime.title}</span>
                      {regime.isWinner && <span style={{ background:'var(--g)', color:'white', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:6 }}>✓ Better</span>}
                    </div>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11, marginBottom:8 }}>
                      <thead><tr><th style={{ textAlign:'left', padding:'4px 7px', background:'rgba(0,0,0,.03)', fontSize:9, textTransform:'uppercase', color:'var(--qu)', letterSpacing:'.3px' }}>Range</th><th style={{ textAlign:'right', padding:'4px 7px', background:'rgba(0,0,0,.03)', fontSize:9, textTransform:'uppercase', color:'var(--qu)', letterSpacing:'.3px' }}>Rate</th></tr></thead>
                      <tbody>
                        {regime.slabs.map(sl => (
                          <tr key={sl.r} style={{ background:sl.active?(regime.isWinner?'rgba(22,163,74,.15)':'rgba(251,191,36,.15)'):'transparent' }}>
                            <td style={{ padding:'5px 7px', color:'var(--ink2)', borderTop:'0.5px solid var(--br2)', fontWeight:sl.active?600:400 }}>{sl.r}</td>
                            <td style={{ ...mono, padding:'5px 7px', textAlign:'right', borderTop:'0.5px solid var(--br2)', fontWeight:sl.active?600:400 }}>{sl.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ fontSize:11, padding:'6px 9px', borderRadius:6, background:regime.noteColor, color:regime.noteText, marginBottom:8 }}>{regime.note}</div>
                    <div style={{ ...mono, fontSize:13, fontWeight:600, color:regime.isWinner?'var(--gd)':'var(--mu)' }}>Tax: {C(regime.tax)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* HRA 3 values */}
            {result.threeVals && (
              <div style={{ marginBottom:'1rem' }}>
                {result.threeVals.map(tv => (
                  <div key={tv.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'0.5px solid var(--br2)', fontSize:12 }}>
                    <span style={{ color:'var(--mu)', fontWeight:tv.bold?600:400 }}>{tv.label}</span>
                    <span style={{ ...mono, fontWeight:500, color:tv.bold?'var(--gd)':'var(--ink2)' }}>{tv.val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTC Breakdown */}
            {result.ctcBreakdown && (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, marginBottom:'1rem' }}>
                <thead><tr>
                  <th style={{ textAlign:'left', padding:'5px 10px', background:'var(--br2)', fontSize:9, textTransform:'uppercase', color:'var(--qu)', letterSpacing:'.3px', borderBottom:'1px solid var(--br)' }}>Component</th>
                  <th style={{ textAlign:'right', padding:'5px 10px', background:'var(--br2)', fontSize:9, textTransform:'uppercase', color:'var(--qu)', letterSpacing:'.3px', borderBottom:'1px solid var(--br)' }}>Monthly</th>
                  <th style={{ textAlign:'right', padding:'5px 10px', background:'var(--br2)', fontSize:9, textTransform:'uppercase', color:'var(--qu)', letterSpacing:'.3px', borderBottom:'1px solid var(--br)' }}>Annual</th>
                </tr></thead>
                <tbody>
                  {result.ctcBreakdown.map(r => (
                    <tr key={r.item} style={{ background:r.bold?'var(--gl)':'transparent' }}>
                      <td style={{ padding:'6px 10px', color:r.bold?'var(--gd)':'var(--ink2)', fontWeight:r.bold?600:400, borderBottom:'0.5px solid var(--br2)' }}>{r.item}</td>
                      <td style={{ ...mono, padding:'6px 10px', textAlign:'right', color:r.bold?'var(--gd)':'var(--mu)', fontWeight:r.bold?600:400, borderBottom:'0.5px solid var(--br2)' }}>{r.monthly}</td>
                      <td style={{ ...mono, padding:'6px 10px', textAlign:'right', color:r.bold?'var(--gd)':'var(--mu)', fontWeight:r.bold?600:400, borderBottom:'0.5px solid var(--br2)' }}>{r.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* GST Invoice */}
            {result.gstDetail && (
              <div style={{ background:'var(--br2)', border:'1px solid var(--br)', borderRadius:8, padding:'1rem', marginBottom:'1rem' }}>
                <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--qu)', marginBottom:'.75rem' }}>GST Invoice Summary</div>
                {[
                  ['Base Amount (taxable)', C(result.gstDetail.base)],
                  ...(result.gstDetail.cgst > 0 ? [['CGST @ '+result.gstDetail.rate/2+'%', C(result.gstDetail.cgst)], ['SGST @ '+result.gstDetail.rate/2+'%', C(result.gstDetail.sgst)]] : []),
                  ...(result.gstDetail.igst > 0 ? [['IGST @ '+result.gstDetail.rate+'%', C(result.gstDetail.igst)]] : []),
                  ['Total Invoice Amount', C(result.gstDetail.total)],
                ].map(([k,v],i,arr) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:i<arr.length-1?'0.5px solid var(--br2)':'none', fontSize:12, fontWeight:i===arr.length-1?700:400 }}>
                    <span style={{ color:'var(--mu)' }}>{k}</span>
                    <span style={{ ...mono, fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Benchmarks */}
            {result.benchmarks && (
              <div style={{ background:'var(--br2)', border:'1px solid var(--br)', borderRadius:8, padding:'1rem', marginBottom:'1rem' }}>
                <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--qu)', marginBottom:'.75rem' }}>Benchmark Comparison</div>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                  <thead><tr>
                    {['Investment','Return / CAGR','Grade'].map(h=><th key={h} style={{ textAlign:h==='Investment'?'left':'right', padding:'5px 10px', background:'rgba(0,0,0,.03)', fontSize:9, textTransform:'uppercase', color:'var(--qu)', letterSpacing:'.3px' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {result.benchmarks.map(b => (
                      <tr key={b.name} style={{ background:b.highlight?'var(--gl)':'transparent' }}>
                        <td style={{ padding:'6px 10px', color:b.highlight?'var(--gd)':'var(--ink2)', fontWeight:b.highlight?600:400, borderTop:'0.5px solid var(--br2)' }}>{b.name}</td>
                        <td style={{ ...mono, padding:'6px 10px', textAlign:'right', borderTop:'0.5px solid var(--br2)', color:b.highlight?'var(--gd)':'var(--mu)' }}>{b.ret}</td>
                        <td style={{ padding:'6px 10px', textAlign:'right', borderTop:'0.5px solid var(--br2)', color:b.highlight?'var(--gd)':b.cagr>=13?'var(--g)':'var(--su)' }}>{b.highlight?'← Your investment':b.cagr>=13?'Strong':b.cagr>=7?'Moderate':'Low'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Year table */}
            {result.ydata && result.ycols && (
              <div style={{ marginBottom:'1rem', overflowX:'auto' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.625rem' }}>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--qu)' }}>Year-by-Year Projection</div>
                  {result.ydata.length > 8 && (
                    <button onClick={() => setShowAll(p=>!p)} style={{ fontSize:10, color:'var(--g)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', ...s }}>
                      {showAll ? 'Show less ▲' : `Show all ${result.ydata.length} years ▼`}
                    </button>
                  )}
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11.5 }}>
                  <thead><tr>
                    {result.ycols.map((col,i) => <th key={col} style={{ textAlign:i>0?'right':'left', padding:'5px 10px', background:'var(--br2)', fontSize:9, textTransform:'uppercase', letterSpacing:'.3px', color:'var(--qu)', fontWeight:700, borderBottom:'1px solid var(--br)' }}>{col}</th>)}
                  </tr></thead>
                  <tbody>
                    {(showAll ? result.ydata : result.ydata.slice(0,8)).map((row,ri,arr) => (
                      <tr key={ri} style={{ background:ri===arr.length-1&&showAll?'var(--gl)':'transparent' }}
                        onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background='var(--br2)'}
                        onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background=ri===arr.length-1&&showAll?'var(--gl)':'transparent'}>
                        {row.map((cell,ci) => (
                          <td key={ci} style={{ padding:'7px 10px', borderBottom:'0.5px solid var(--br2)', textAlign:ci>0?'right':'left', ...ci>0?mono:{}, color:'var(--mu)', ...(ci===0?{color:'var(--ink2)',fontWeight:500,...s}:{}) }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Note */}
            {config.note && (
              <div style={{ background:'var(--al)', borderRadius:8, padding:'9px 13px', fontSize:11.5, color:'#78350f', lineHeight:1.6, display:'flex', gap:7, alignItems:'flex-start', marginBottom:'1rem' }}>
                <span>⚠️</span><span>{config.note}</span>
              </div>
            )}

            {/* Formula accordion */}
            <div style={{ border:'1px solid var(--br)', borderRadius:8, overflow:'hidden' }}>
              <button onClick={() => setShowFormula(p=>!p)} style={{ width:'100%', padding:'10px 14px', background:'var(--br2)', border:'none', display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, fontWeight:500, color:'var(--mu)', cursor:'pointer', textAlign:'left', ...s }}>
                <span>How is this calculated? Formula & methodology</span>
                <span style={{ transition:'transform .2s', display:'inline-block', transform:showFormula?'rotate(180deg)':'none' }}>▼</span>
              </button>
              {showFormula && (
                <div style={{ padding:'.875rem 1rem', borderTop:'1px solid var(--br)', background:'white' }}>
                  <ol style={{ listStyle:'none', counterReset:'step', paddingLeft:0 }}>
                    {config.steps.map((step,i) => (
                      <li key={i} style={{ counterIncrement:'step', display:'flex', gap:9, marginBottom:8, fontSize:12, color:'var(--ink3)', alignItems:'flex-start' }}>
                        <span style={{ width:18, height:18, minWidth:18, background:'var(--gl)', color:'var(--gd)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, marginTop:1 }}>{i+1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div style={{ ...mono, fontSize:11, background:'var(--br2)', padding:'6px 10px', borderRadius:6, marginTop:4, color:'var(--ink2)' }}>{config.formula.eq}</div>
                  {config.formula.url && (
                    <a href={config.formula.url} target="_blank" rel="noopener" style={{ fontSize:11, color:'var(--g)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:3, marginTop:8 }}>📎 Official source ↗</a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
