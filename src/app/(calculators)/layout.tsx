'use client';
import Link from 'next/link';

const SECTIONS = [
  { label: 'Investments', calcs: [
    { href:'/sip', icon:'📈', name:'SIP Calculator', tag:'pop' },
    { href:'/lumpsum', icon:'💰', name:'Lumpsum' },
    { href:'/step-up-sip', icon:'🪜', name:'Step-Up SIP', tag:'new' },
    { href:'/mf-returns', icon:'📊', name:'MF Returns' },
  ]},
  { label: 'Loans & EMI', calcs: [
    { href:'/emi', icon:'🏦', name:'EMI Calculator', tag:'pop' },
    { href:'/home-loan', icon:'🏠', name:'Home Loan Eligibility' },
    { href:'/car-loan', icon:'🚗', name:'Car Loan EMI' },
    { href:'/prepayment', icon:'⚡', name:'Loan Prepayment' },
  ]},
  { label: 'Tax & Savings', calcs: [
    { href:'/income-tax', icon:'📋', name:'Income Tax FY 2026-27', tag:'tax' },
    { href:'/ppf', icon:'🏛️', name:'PPF Calculator' },
    { href:'/fd', icon:'🔒', name:'FD Calculator' },
    { href:'/rd', icon:'🐷', name:'RD Calculator' },
    { href:'/nsc', icon:'📜', name:'NSC Calculator' },
  ]},
  { label: 'Retirement', calcs: [
    { href:'/retirement', icon:'🌅', name:'Retirement Planner' },
    { href:'/nps', icon:'🏗️', name:'NPS Calculator' },
    { href:'/epf', icon:'👷', name:'EPF Calculator' },
  ]},
  { label: 'Business', calcs: [
    { href:'/gst', icon:'🧾', name:'GST Calculator' },
    { href:'/roi', icon:'📊', name:'ROI Calculator' },
    { href:'/breakeven', icon:'⚖️', name:'Break-Even Analysis' },
  ]},
  { label: 'Personal Finance', calcs: [
    { href:'/compound', icon:'🔢', name:'Compound Interest' },
    { href:'/inflation', icon:'📉', name:'Inflation Calculator' },
    { href:'/hra', icon:'🏘️', name:'HRA Exemption', tag:'tax' },
    { href:'/salary', icon:'💼', name:'Salary / CTC Breakup' },
    { href:'/goal', icon:'🎯', name:'Goal Planning' },
    { href:'/gratuity', icon:'🎁', name:'Gratuity Calculator' },
    { href:'/cagr', icon:'📐', name:'CAGR Calculator' },
  ]},
];

export default function CalcLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--sf)' }}>
      {/* Header */}
      <header style={{ position:'sticky', top:0, zIndex:100, background:'rgba(250,250,249,.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--br)', padding:'0 1.5rem', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:30, height:30, background:'var(--ink)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:14, fontWeight:700 }}>C</div>
          <span className="serif" style={{ fontSize:20, color:'var(--ink)' }}>CalcGenie<span style={{ color:'var(--g)' }}>.</span></span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--gl)', border:'1px solid var(--gb)', borderRadius:20, padding:'4px 12px', fontSize:11, fontWeight:500, color:'var(--gd)' }}>
            <span style={{ width:6, height:6, background:'var(--g)', borderRadius:'50%', display:'inline-block' }} />
            AMFI · RBI Verified
          </div>
        </div>
      </header>

      {/* Layout */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'1.5rem', display:'grid', gridTemplateColumns:'240px 1fr', gap:'1.5rem', alignItems:'start' }}>
        {/* Sidebar */}
        <aside style={{ position:'sticky', top:72, maxHeight:'calc(100vh - 80px)', overflowY:'auto' }}>
          {SECTIONS.map(sec => (
            <div key={sec.label} style={{ marginBottom:4 }}>
              <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--qu)', padding:'10px 10px 3px' }}>{sec.label}</div>
              {sec.calcs.map(c => (
                <Link key={c.href} href={c.href} style={{ textDecoration:'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, cursor:'pointer', border:'1px solid transparent', transition:'all .1s' }}
                    onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background='var(--br2)'}}
                    onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background='transparent'}}>
                    <div style={{ width:28, height:28, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, background:'var(--br2)', flexShrink:0 }}>{c.icon}</div>
                    <span style={{ fontSize:12, color:'var(--ink3)' }}>{c.name}</span>
                    {c.tag && <span style={{ marginLeft:'auto', fontSize:8, fontWeight:700, padding:'2px 5px', borderRadius:5, background:c.tag==='pop'?'var(--rl)':c.tag==='new'?'var(--gl)':'var(--al)', color:c.tag==='pop'?'#991b1b':c.tag==='new'?'var(--gd)':'#92400e', textTransform:'uppercase', letterSpacing:'.3px' }}>{c.tag==='pop'?'HOT':c.tag==='new'?'NEW':'TAX'}</span>}
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </aside>

        {/* Main */}
        <main>{children}</main>
      </div>
    </div>
  );
}
