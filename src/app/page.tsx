'use client';
import Link from 'next/link';

const CALCS = [
  { href:'/sip', icon:'📈', name:'SIP Calculator', cat:'Investments', tag:'popular' },
  { href:'/lumpsum', icon:'💰', name:'Lumpsum', cat:'Investments' },
  { href:'/step-up-sip', icon:'🪜', name:'Step-Up SIP', cat:'Investments', tag:'new' },
  { href:'/emi', icon:'🏦', name:'EMI Calculator', cat:'Loans', tag:'popular' },
  { href:'/home-loan', icon:'🏠', name:'Home Loan Eligibility', cat:'Loans' },
  { href:'/car-loan', icon:'🚗', name:'Car Loan EMI', cat:'Loans' },
  { href:'/prepayment', icon:'⚡', name:'Loan Prepayment', cat:'Loans' },
  { href:'/income-tax', icon:'📋', name:'Income Tax FY 2026-27', cat:'Tax & Savings', tag:'tax' },
  { href:'/ppf', icon:'🏛️', name:'PPF Calculator', cat:'Tax & Savings' },
  { href:'/fd', icon:'🔒', name:'FD Calculator', cat:'Tax & Savings' },
  { href:'/rd', icon:'🐷', name:'RD Calculator', cat:'Tax & Savings' },
  { href:'/nsc', icon:'📜', name:'NSC Calculator', cat:'Tax & Savings' },
  { href:'/retirement', icon:'🌅', name:'Retirement Planner', cat:'Retirement' },
  { href:'/nps', icon:'🏗️', name:'NPS Calculator', cat:'Retirement' },
  { href:'/epf', icon:'👷', name:'EPF Calculator', cat:'Retirement' },
  { href:'/gst', icon:'🧾', name:'GST Calculator', cat:'Business' },
  { href:'/roi', icon:'📊', name:'ROI Calculator', cat:'Business' },
  { href:'/breakeven', icon:'⚖️', name:'Break-Even Analysis', cat:'Business' },
  { href:'/compound', icon:'🔢', name:'Compound Interest', cat:'Personal Finance' },
  { href:'/inflation', icon:'📉', name:'Inflation Calculator', cat:'Personal Finance' },
  { href:'/hra', icon:'🏘️', name:'HRA Exemption', cat:'Personal Finance', tag:'tax' },
  { href:'/salary', icon:'💼', name:'Salary / CTC Breakup', cat:'Personal Finance' },
  { href:'/goal', icon:'🎯', name:'Goal Planning', cat:'Personal Finance' },
  { href:'/gratuity', icon:'🎁', name:'Gratuity Calculator', cat:'Personal Finance' },
  { href:'/cagr', icon:'📐', name:'CAGR Calculator', cat:'Personal Finance' },
];

const CATEGORIES = ['All', 'Investments', 'Loans', 'Tax & Savings', 'Retirement', 'Business', 'Personal Finance'];

const TRUST = [
  ['✅', 'AMFI Verified NAV', 'Real fund data · Updated daily'],
  ['🏛️', 'RBI Based Formulas', 'EMI reducing balance mandate'],
  ['📋', 'IT Dept FY 2026-27', 'Budget 2026 · No slab change'],
  ['🔍', 'Formula Transparent', 'Source shown on every calculator'],
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--sf)' }}>
      {/* Header */}
      <header style={{ position:'sticky', top:0, zIndex:100, background:'rgba(250,250,249,.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--br)', padding:'0 1.5rem', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:'var(--ink)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:14, fontWeight:700 }}>C</div>
          <span className="serif" style={{ fontSize:20, color:'var(--ink)' }}>CalcGenie<span style={{ color:'var(--g)' }}>.</span></span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--gl)', border:'1px solid var(--gb)', borderRadius:20, padding:'4px 12px', fontSize:11, fontWeight:500, color:'var(--gd)' }}>
            <span style={{ width:6, height:6, background:'var(--g)', borderRadius:'50%', display:'inline-block' }} />
            AMFI · RBI Verified
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'3rem 1.5rem 2rem', display:'grid', gridTemplateColumns:'1fr auto', gap:'2rem', alignItems:'start' }}>
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'white', border:'1px solid var(--br)', borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:500, color:'var(--mu)', marginBottom:'1.25rem', letterSpacing:'.3px', textTransform:'uppercase' }}>
            <span style={{ width:16, height:16, background:'var(--g)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:9, fontWeight:700 }}>✓</span>
            SEBI Formula Verified · Budget 2026 Updated
          </div>
          <h1 className="serif" style={{ fontSize:'clamp(1.8rem, 4vw, 3rem)', lineHeight:1.1, letterSpacing:'-.5px', marginBottom:'1rem', color:'var(--ink)' }}>
            {"India's most "}
            <em style={{ color:'var(--g)', fontStyle:'italic' }}>accurate</em><br />
            financial calculators
          </h1>
          <p style={{ fontSize:15, color:'var(--mu)', maxWidth:460, lineHeight:1.65, marginBottom:'2rem' }}>
            Every number is real. Real mutual fund CAGR from AMFI NAV history. Verified tax slabs. RBI-mandated EMI formula.
          </p>
          <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap' }}>
            {[['25','Calculators'],['500+','Mutual Funds'],['Live','NAV Data'],['Free','Always']].map(([n,l]) => (
              <div key={l}>
                <div className="serif" style={{ fontSize:'1.75rem', color:'var(--ink)', lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:11, color:'var(--su)', textTransform:'uppercase', letterSpacing:'.3px', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, minWidth:200 }}>
          {TRUST.map(([icon, title, sub]) => (
            <div key={title} style={{ background:'white', border:'1px solid var(--br)', borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, background:'var(--gl)', flexShrink:0 }}>{icon}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--ink2)' }}>{title}</div>
                <div style={{ fontSize:10, color:'var(--su)', marginTop:1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator Grid */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem 3rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:10 }}>
          {CALCS.map(c => (
            <Link key={c.href} href={c.href} style={{ textDecoration:'none' }}>
              <div style={{ background:'white', border:'1px solid var(--br)', borderRadius:12, padding:'1rem', transition:'all .12s', cursor:'pointer' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='var(--g)';(e.currentTarget as HTMLDivElement).style.background='var(--gl)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='var(--br)';(e.currentTarget as HTMLDivElement).style.background='white'}}>
                <div style={{ fontSize:20, marginBottom:8 }}>{c.icon}</div>
                <div style={{ fontSize:13, fontWeight:500, color:'var(--ink2)', marginBottom:3, lineHeight:1.3 }}>{c.name}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ fontSize:10, color:'var(--su)' }}>{c.cat}</div>
                  {c.tag && <div style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:6, background:c.tag==='popular'?'var(--rl)':c.tag==='new'?'var(--gl)':'var(--al)', color:c.tag==='popular'?'#991b1b':c.tag==='new'?'var(--gd)':'#92400e', textTransform:'uppercase', letterSpacing:'.3px' }}>{c.tag==='popular'?'HOT':c.tag==='new'?'NEW':'TAX'}</div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer style={{ borderTop:'1px solid var(--br)', padding:'2rem 1.5rem', textAlign:'center', color:'var(--su)', fontSize:12 }}>
        <div style={{ display:'flex', justifyContent:'center', gap:'1.5rem', flexWrap:'wrap', marginBottom:'.75rem' }}>
          {['AMFI NAV Data','RBI Formula Standards','IT Dept FY 2026-27','EPFO 8.25%','NSI PPF 7.1%'].map(t=>(
            <div key={t} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:5, height:5, background:'var(--g)', borderRadius:'50%', display:'inline-block' }} />
              {t}
            </div>
          ))}
        </div>
        <div>© 2026 CalcGenie. All rights reserved.</div>
        <div style={{ maxWidth:580, margin:'.75rem auto 0', fontSize:10.5, color:'var(--qu)', lineHeight:1.65 }}>
          All calculations are estimates for educational purposes only. Mutual fund returns are historical. Past performance does not guarantee future results. Always consult a SEBI-registered advisor or CA before making investment decisions.
        </div>
      </footer>
    </div>
  );
}
