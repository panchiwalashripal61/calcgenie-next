import { RATES, NEW_REGIME_SLABS, OLD_REGIME_SLABS } from '@/lib/constants';
import { formatINR, formatPct } from '@/lib/formatters';

const C = formatINR;
const P = (n: number) => formatPct(n);

// ── SIP ──────────────────────────────────────────────
export function calcSIP(monthly: number, rate: number, years: number) {
  const r = rate / 100 / 12, n = years * 12;
  const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const inv = monthly * n, gain = fv - inv;
  const ydata: string[][] = [];
  for (let yr = 1; yr <= years; yr++) {
    const nn = yr * 12;
    const yfv = monthly * ((Math.pow(1 + r, nn) - 1) / r) * (1 + r);
    const yi = monthly * nn;
    ydata.push([String(yr), C(yi), C(yfv), C(yfv - yi), P((yfv - yi) / yi * 100)]);
  }
  return {
    primary: { label: 'Maturity Value', val: C(fv) },
    cards: [
      { label: 'Total Invested', val: C(inv), cls: '' },
      { label: 'Est. Wealth Gain', val: C(gain), cls: 'green' },
      { label: 'Absolute Return', val: P(gain / inv * 100), cls: 'amber' },
      { label: 'XIRR (approx)', val: P(rate), cls: 'blue' },
    ],
    bars: [{ name: 'Invested', amt: inv, col: '#86efac' }, { name: 'Returns', amt: gain, col: '#16a34a' }],
    chartData: { labels: ydata.map(r => `Yr ${r[0]}`), invested: Array.from({length:years},(_,i)=>monthly*(i+1)*12), values: Array.from({length:years},(_,i)=>{const nn=(i+1)*12;return monthly*((Math.pow(1+r,nn)-1)/r)*(1+r)}) },
    ydata, ycols: ['Year', 'Invested', 'Est. Value', 'Gain', 'Return %'],
  };
}

// ── LUMPSUM ───────────────────────────────────────────
export function calcLumpsum(principal: number, rate: number, years: number) {
  const fv = principal * Math.pow(1 + rate / 100, years);
  const gain = fv - principal;
  const ydata: string[][] = [];
  for (let yr = 1; yr <= years; yr++) {
    const yfv = principal * Math.pow(1 + rate / 100, yr);
    ydata.push([String(yr), C(principal), C(yfv), C(yfv - principal), P((yfv - principal) / principal * 100)]);
  }
  return {
    primary: { label: 'Maturity Value', val: C(fv) },
    cards: [
      { label: 'Invested', val: C(principal), cls: '' },
      { label: 'Returns', val: C(gain), cls: 'green' },
      { label: 'CAGR', val: P(rate), cls: 'amber' },
      { label: 'Multiple', val: (fv / principal).toFixed(2) + 'x', cls: 'blue' },
    ],
    bars: [{ name: 'Principal', amt: principal, col: '#93c5fd' }, { name: 'Returns', amt: gain, col: '#1d4ed8' }],
    chartData: { labels: ydata.map(r=>`Yr ${r[0]}`), invested: Array(years).fill(principal), values: Array.from({length:years},(_,i)=>principal*Math.pow(1+rate/100,i+1)) },
    ydata, ycols: ['Year', 'Invested', 'Value', 'Gain', 'CAGR %'],
  };
}

// ── STEP-UP SIP ───────────────────────────────────────
export function calcStepUpSIP(monthly: number, stepup: number, rate: number, years: number) {
  const r = rate / 100 / 12;
  let fv = 0, inv = 0;
  const ydata: string[][] = [];
  for (let yr = 0; yr < years; yr++) {
    const sip = monthly * Math.pow(1 + stepup / 100, yr);
    const n = (years - yr) * 12;
    fv += sip * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    inv += sip * 12;
  }
  // flat sip comparison
  const flatN = years * 12;
  const flatFV = monthly * ((Math.pow(1 + r, flatN) - 1) / r) * (1 + r);
  const cumRows: string[][] = [];
  let cumInv = 0;
  for (let yr = 1; yr <= years; yr++) {
    const sip = monthly * Math.pow(1 + stepup / 100, yr - 1);
    cumInv += sip * 12;
    let yFV = 0;
    for (let k = 0; k < yr; k++) {
      const sa = monthly * Math.pow(1 + stepup / 100, k);
      const nn = (yr - k) * 12;
      yFV += sa * ((Math.pow(1 + r, nn) - 1) / r) * (1 + r);
    }
    cumRows.push([String(yr), C(sip) + '/mo', C(cumInv), C(yFV), C(yFV - cumInv)]);
  }
  return {
    primary: { label: 'Maturity Value', val: C(fv) },
    cards: [
      { label: 'Total Invested', val: C(inv), cls: '' },
      { label: 'Wealth Gain', val: C(fv - inv), cls: 'green' },
      { label: 'vs Flat SIP', val: C(fv - flatFV), cls: 'amber' },
      { label: 'Final SIP', val: C(monthly * Math.pow(1 + stepup / 100, years - 1)) + '/mo', cls: 'blue' },
    ],
    bars: [{ name: 'Invested', amt: inv, col: '#86efac' }, { name: 'Returns', amt: fv - inv, col: '#16a34a' }],
    chartData: { labels: cumRows.map(r=>`Yr ${r[0]}`), invested: cumRows.map((_,i)=>{let s=0;for(let k=0;k<=i;k++)s+=monthly*Math.pow(1+stepup/100,k)*12;return s}), values: cumRows.map((_,i)=>{let yFV=0;for(let k=0;k<=i;k++){const sa=monthly*Math.pow(1+stepup/100,k);const nn=(i+1-k)*12;yFV+=sa*((Math.pow(1+r,nn)-1)/r)*(1+r);}return yFV;}) },
    ydata: cumRows, ycols: ['Year', 'SIP Amount', 'Total Invested', 'Est. Value', 'Gain'],
  };
}

// ── EMI ───────────────────────────────────────────────
export function calcEMI(principal: number, rate: number, years: number) {
  const r = rate / 100 / 12, n = years * 12;
  const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const total = emi * n, interest = total - principal;
  const ydata: string[][] = [];
  let bal = principal;
  for (let yr = 1; yr <= years; yr++) {
    let yInt = 0, yPrin = 0;
    for (let m = 0; m < 12; m++) {
      const i = bal * r, p = Math.min(emi - i, bal);
      yInt += i; yPrin += p; bal -= p;
      if (bal <= 0) break;
    }
    ydata.push([String(yr), C(emi), C(yPrin), C(yInt), C(Math.max(0, bal))]);
  }
  return {
    primary: { label: 'Monthly EMI', val: C(emi) },
    cards: [
      { label: 'Total Interest', val: C(interest), cls: 'amber' },
      { label: 'Total Payment', val: C(total), cls: '' },
      { label: 'Interest %', val: P(interest / total * 100), cls: 'blue' },
      { label: 'Principal %', val: P(principal / total * 100), cls: 'green' },
    ],
    bars: [{ name: 'Principal', amt: principal, col: '#93c5fd' }, { name: 'Interest', amt: interest, col: '#d97706' }],
    chartPie: { labels: ['Principal', 'Interest'], vals: [principal, interest], cols: ['#3b82f6', '#f59e0b'] },
    ydata, ycols: ['Year', 'EMI/mo', 'Principal Paid', 'Interest Paid', 'Balance'],
  };
}

// ── HOME LOAN ELIGIBILITY ─────────────────────────────
export function calcHomeLoan(income: number, existing: number, rate: number, years: number) {
  const maxEmi = income * 0.45 - existing;
  const r = rate / 100 / 12, n = years * 12;
  const maxLoan = Math.max(0, maxEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
  const propVal = maxLoan / 0.8, down = propVal * 0.2;
  return {
    primary: { label: 'Max Eligible Loan', val: C(maxLoan) },
    cards: [
      { label: 'Max EMI Capacity', val: C(Math.max(0, maxEmi)), cls: 'blue' },
      { label: 'Property Value ~', val: C(propVal), cls: 'amber' },
      { label: 'Down Payment ~', val: C(down), cls: 'green' },
      { label: 'FOIR Used', val: '45%', cls: '' },
    ],
    bars: [{ name: 'EMI capacity', amt: Math.max(0, maxEmi), col: '#93c5fd' }, { name: 'Existing EMIs', amt: existing, col: '#fcd34d' }],
  };
}

// ── CAR LOAN ─────────────────────────────────────────
export function calcCarLoan(price: number, down: number, rate: number, years: number) {
  const loan = price - down, r = rate / 100 / 12, n = years * 12;
  const emi = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalPay = emi * n, interest = totalPay - loan;
  return {
    primary: { label: 'Monthly EMI', val: C(emi) },
    cards: [
      { label: 'Loan Amount', val: C(loan), cls: '' },
      { label: 'Total Interest', val: C(interest), cls: 'amber' },
      { label: 'Total Cost', val: C(down + totalPay), cls: 'blue' },
      { label: 'Interest/Total', val: P(interest / totalPay * 100), cls: 'green' },
    ],
    bars: [{ name: 'Principal', amt: loan, col: '#93c5fd' }, { name: 'Interest', amt: interest, col: '#f59e0b' }],
  };
}

// ── PREPAYMENT ────────────────────────────────────────
export function calcPrepayment(principal: number, rate: number, years: number, extra: number) {
  const r = rate / 100 / 12, n = years * 12;
  const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  let bal = principal, totInt = 0, months = 0;
  while (bal > 0.01 && months < 600) {
    const i = bal * r; totInt += i; bal = bal + i - emi - extra; months++;
    if (bal < 0) bal = 0;
  }
  const origInt = emi * n - principal, saving = origInt - totInt;
  return {
    primary: { label: 'Interest Saved', val: C(saving) },
    cards: [
      { label: 'Years Saved', val: Math.max(0, (n - months) / 12).toFixed(1) + ' yrs', cls: 'green' },
      { label: 'New Payoff', val: Math.ceil(months / 12) + ' yrs', cls: 'blue' },
      { label: 'Original Interest', val: C(origInt), cls: 'amber' },
      { label: 'New Interest', val: C(totInt), cls: '' },
    ],
    bars: [{ name: 'Without prepayment', amt: origInt, col: '#fca5a5' }, { name: 'With prepayment', amt: totInt, col: '#86efac' }, { name: 'Saved', amt: saving, col: '#16a34a' }],
  };
}

// ── INCOME TAX ────────────────────────────────────────
export function calcIncomeTax(income: number, d80c: number, d80d: number, hraEx: number, nps: number, homeLoan: number) {
  const newTaxable = Math.max(0, income - RATES.STD_DED_NEW);
  let nt = NEW_REGIME_SLABS.reduce((t, s) => newTaxable > s.from ? t + (Math.min(newTaxable, s.to as number) - s.from) * s.rate : t, 0);
  if (newTaxable <= RATES.SECTION_87A_LIMIT) nt = Math.max(0, nt - RATES.SECTION_87A_REBATE);
  else if (newTaxable <= 1275000) nt = Math.min(nt, newTaxable - RATES.SECTION_87A_LIMIT);
  const newTotal = Math.round(nt * (1 + RATES.CESS));
  const totalDed = RATES.STD_DED_OLD + Math.min(d80c, RATES.MAX_80C) + Math.min(d80d, 75000) + hraEx + Math.min(nps, RATES.MAX_NPS_80CCD1B) + Math.min(homeLoan, RATES.MAX_HOME_LOAN_INT);
  const oldTaxable = Math.max(0, income - totalDed);
  let ot = OLD_REGIME_SLABS.reduce((t, s) => oldTaxable > s.from ? t + (Math.min(oldTaxable, s.to as number) - s.from) * s.rate : t, 0);
  if (oldTaxable <= 500000) ot = Math.max(0, ot - 12500);
  const oldTotal = Math.round(ot * (1 + RATES.CESS));
  const saving = oldTotal - newTotal;
  const better = newTotal <= oldTotal ? 'New Regime' : 'Old Regime';
  const newSlabs = [
    { r: 'Up to ₹4L', rate: '0%', active: newTaxable <= 400000 },
    { r: '₹4L–₹8L', rate: '5%', active: newTaxable > 400000 && newTaxable <= 800000 },
    { r: '₹8L–₹12L', rate: '10%', active: newTaxable > 800000 && newTaxable <= 1200000 },
    { r: '₹12L–₹16L', rate: '15%', active: newTaxable > 1200000 && newTaxable <= 1600000 },
    { r: '₹16L–₹20L', rate: '20%', active: newTaxable > 1600000 && newTaxable <= 2000000 },
    { r: '₹20L–₹24L', rate: '25%', active: newTaxable > 2000000 && newTaxable <= 2400000 },
    { r: 'Above ₹24L', rate: '30%', active: newTaxable > 2400000 },
  ];
  const ydata: string[][] = [];
  for (let yr = 1; yr <= 5; yr++) {
    const inc = Math.round(income * Math.pow(1.10, yr - 1));
    const nt2Tx = Math.max(0, inc - RATES.STD_DED_NEW);
    let nt2 = NEW_REGIME_SLABS.reduce((t,s)=>nt2Tx>s.from?t+(Math.min(nt2Tx,s.to as number)-s.from)*s.rate:t,0);
    if(nt2Tx<=RATES.SECTION_87A_LIMIT) nt2=Math.max(0,nt2-RATES.SECTION_87A_REBATE);
    const newT = Math.round(nt2*(1+RATES.CESS));
    const oldT2Tx = Math.max(0,inc-totalDed);
    let ot2 = OLD_REGIME_SLABS.reduce((t,s)=>oldT2Tx>s.from?t+(Math.min(oldT2Tx,s.to as number)-s.from)*s.rate:t,0);
    if(oldT2Tx<=500000) ot2=Math.max(0,ot2-12500);
    const oldT = Math.round(ot2*(1+RATES.CESS));
    ydata.push([`Year ${yr}`, C(inc), C(newT), C(oldT), newT<=oldT?'New':'Old']);
  }
  return { primary:{label:better+' — You Save',val:C(Math.abs(saving))}, cards:[{label:'New Regime Tax',val:C(newTotal),cls:newTotal<=oldTotal?'green':''},{label:'Old Regime Tax',val:C(oldTotal),cls:oldTotal<newTotal?'green':''},{label:'Taxable (New)',val:C(newTaxable),cls:'blue'},{label:'Taxable (Old)',val:C(oldTaxable),cls:'amber'}], bars:[{name:'New regime tax',amt:newTotal,col:'#86efac'},{name:'Old regime tax',amt:oldTotal,col:'#fca5a5'}], newSlabs, oldTaxable, newTaxable, newTotal, oldTotal, better, saving, ydata, ycols:['Year','Income','New Regime','Old Regime','Better'] };
}

// ── PPF ───────────────────────────────────────────────
export function calcPPF(yearly: number, years: number) {
  const r = RATES.PPF_RATE;
  let bal = 0;
  const ydata: string[][] = [];
  for (let yr = 1; yr <= years; yr++) {
    const open = bal, interest = (open + yearly) * r;
    bal = open + yearly + interest;
    ydata.push([String(yr), C(open), C(yearly), C(interest), C(bal)]);
  }
  const inv = yearly * years, interest = bal - inv;
  return {
    primary: { label: 'Tax-Free Maturity', val: C(bal) },
    cards: [{ label: 'Total Invested', val: C(inv), cls: '' }, { label: 'Interest Earned', val: C(interest), cls: 'green' }, { label: 'Tax Saving @30%', val: C(Math.min(yearly, 150000) * 0.30 * years), cls: 'amber' }, { label: 'Current Rate', val: '7.1% p.a.', cls: 'blue' }],
    bars: [{ name: 'Principal', amt: inv, col: '#fcd34d' }, { name: 'Tax-free Interest', amt: interest, col: '#b45309' }],
    chartData: { labels: ydata.map(r=>`Yr ${r[0]}`), invested: Array.from({length:years},(_,i)=>yearly*(i+1)), values: ydata.map(r=>{let b=0;for(let k=0;k<parseInt(r[0]);k++)b=(b+yearly)*(1+RATES.PPF_RATE);return b}) },
    ydata, ycols: ['Year', 'Opening Bal', 'Contribution', 'Interest', 'Closing Balance'],
  };
}

// ── FD ────────────────────────────────────────────────
export function calcFD(principal: number, rate: number, years: number, senior: number) {
  const er = rate + senior;
  const amount = principal * Math.pow(1 + er / 100 / 4, 4 * years);
  const interest = amount - principal;
  const annualInt = interest / years;
  const tds = annualInt > 40000 ? interest * 0.10 : 0;
  const ydata: string[][] = [];
  for (let yr = 1; yr <= Math.ceil(years); yr++) {
    const yt = Math.min(yr, years);
    const ya = principal * Math.pow(1 + er / 100 / 4, 4 * yt);
    const yi = ya - principal;
    ydata.push([yr === Math.ceil(years) ? years + ' (M)' : String(yr), C(principal), C(yi), C(yi / years > 40000 ? yi * 0.10 : 0), C(ya)]);
  }
  return {
    primary: { label: 'Maturity Amount', val: C(amount) },
    cards: [{ label: 'Interest Earned', val: C(interest), cls: 'amber' }, { label: 'TDS (10%)', val: C(tds), cls: '' }, { label: 'Post-TDS Value', val: C(amount - tds), cls: 'green' }, { label: 'Effective Rate', val: P(er), cls: 'blue' }],
    bars: [{ name: 'Principal', amt: principal, col: '#fcd34d' }, { name: 'Interest', amt: interest, col: '#92400e' }],
    ydata, ycols: ['Year', 'Principal', 'Accrued Interest', 'TDS', 'Value'],
  };
}

// ── RD ────────────────────────────────────────────────
export function calcRD(monthly: number, rate: number, years: number) {
  const r = rate / 100 / 4, months = years * 12;
  let amount = 0;
  for (let m = 1; m <= months; m++) amount += monthly * Math.pow(1 + r, (months - m) / 3);
  const invested = monthly * months, interest = amount - invested;
  return {
    primary: { label: 'Maturity Amount', val: C(amount) },
    cards: [{ label: 'Total Deposited', val: C(invested), cls: '' }, { label: 'Interest Earned', val: C(interest), cls: 'amber' }, { label: 'Effective Return', val: P(interest / invested * 100), cls: 'blue' }, { label: 'Monthly Deposit', val: C(monthly), cls: '' }],
    bars: [{ name: 'Deposited', amt: invested, col: '#fcd34d' }, { name: 'Interest', amt: interest, col: '#78350f' }],
  };
}

// ── NSC ───────────────────────────────────────────────
export function calcNSC(principal: number, rate: number) {
  const amount = principal * Math.pow(1 + rate / 200, 10);
  const interest = amount - principal;
  const ydata: string[][] = [];
  for (let yr = 1; yr <= 5; yr++) {
    const ya = principal * Math.pow(1 + rate / 200, yr * 2);
    const prev = yr > 1 ? principal * Math.pow(1 + rate / 200, (yr - 1) * 2) : principal;
    ydata.push([String(yr), C(ya), C(ya - prev), C(ya - principal), yr < 5 ? '80C eligible' : 'Taxable income']);
  }
  return {
    primary: { label: 'Maturity Amount (5 Yr)', val: C(amount) },
    cards: [{ label: 'Interest Earned', val: C(interest), cls: 'amber' }, { label: '80C Benefit (Yr1)', val: C(Math.min(principal, 150000) * 0.30), cls: 'green' }, { label: 'Half-yr Rate', val: P(rate / 2), cls: 'blue' }, { label: 'Tenure', val: '5 Years fixed', cls: '' }],
    bars: [{ name: 'Principal', amt: principal, col: '#fcd34d' }, { name: 'Interest', amt: interest, col: '#a16207' }],
    ydata, ycols: ['Year', 'Value', 'Year Interest', 'Cumulative Interest', 'Tax Status'],
  };
}

// ── RETIREMENT ────────────────────────────────────────
export function calcRetirement(age: number, retireAge: number, monthly: number, inflation: number, returnRate: number) {
  const n = retireAge - age;
  const futMo = monthly * Math.pow(1 + inflation / 100, n);
  const corpus = futMo * 12 * 25;
  const r = returnRate / 100 / 12, months = n * 12;
  const sipNeeded = corpus * r / ((Math.pow(1 + r, months) - 1) * (1 + r));
  const totalInv = sipNeeded * months;
  const ydata: string[][] = [];
  for (let yr = 5; yr <= n; yr += 5) {
    const mo = yr * 12, yFV = sipNeeded * ((Math.pow(1 + r, mo) - 1) / r) * (1 + r);
    ydata.push([String(yr), String(age + yr), C(sipNeeded * mo), C(yFV), P(yFV / corpus * 100)]);
  }
  return {
    primary: { label: 'Corpus Required', val: C(corpus) },
    cards: [{ label: 'Monthly SIP Needed', val: C(sipNeeded), cls: 'green' }, { label: 'Future Monthly Exp.', val: C(futMo), cls: 'amber' }, { label: 'Years to Invest', val: n + ' years', cls: 'blue' }, { label: 'Total Contribution', val: C(totalInv), cls: '' }],
    bars: [{ name: 'Your SIP contributions', amt: totalInv, col: '#c4b5fd' }, { name: 'Returns needed', amt: corpus - totalInv, col: '#7c3aed' }],
    chartData: { labels: ydata.map(r=>`Age ${r[1]}`), invested: ydata.map((_,i)=>sipNeeded*(i+1)*5*12), values: ydata.map((_,i)=>{const mo=(i+1)*5*12;return sipNeeded*((Math.pow(1+r,mo)-1)/r)*(1+r)}) },
    ydata, ycols: ['Year', 'Your Age', 'Invested', 'Portfolio Value', '% of Goal'],
  };
}

// ── NPS ───────────────────────────────────────────────
export function calcNPS(monthly: number, age: number, rate: number) {
  const n = (60 - age) * 12, r = rate / 100 / 12;
  const corpus = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  const lumpsum = corpus * 0.6, annuity = corpus * 0.4;
  const pension = annuity * 0.06 / 12;
  const ydata: string[][] = [];
  for (let yr = 5; yr <= 60 - age; yr += 5) {
    const mo = yr * 12, yFV = monthly * ((Math.pow(1 + r, mo) - 1) / r) * (1 + r);
    ydata.push([String(yr), String(age + yr), C(monthly * mo), C(yFV)]);
  }
  return {
    primary: { label: 'NPS Corpus at 60', val: C(corpus) },
    cards: [{ label: 'Tax-free Lumpsum (60%)', val: C(lumpsum), cls: 'green' }, { label: 'Annuity (40%)', val: C(annuity), cls: 'blue' }, { label: 'Est. Monthly Pension', val: C(pension), cls: 'amber' }, { label: 'Total Invested', val: C(invested), cls: '' }],
    bars: [{ name: 'Contributions', amt: invested, col: '#c4b5fd' }, { name: 'Returns', amt: corpus - invested, col: '#7c3aed' }],
    ydata, ycols: ['Year', 'Your Age', 'Invested', 'Portfolio Value'],
  };
}

// ── EPF ───────────────────────────────────────────────
export function calcEPF(basic: number, age: number, increment: number) {
  const rate = RATES.EPF_RATE, retire = 58;
  let corpus = 0, totalContrib = 0, basicSal = basic;
  const ydata: string[][] = [];
  for (let yr = age; yr < retire; yr++) {
    const monthly = basicSal * (0.12 + 0.0367);
    const annual = monthly * 12;
    totalContrib += annual;
    corpus = (corpus + annual) * (1 + rate);
    if ((yr - age + 1) % 5 === 0 || yr === retire - 1)
      ydata.push([String(yr - age + 1), String(yr + 1), C(basicSal), C(annual), C(corpus)]);
    basicSal *= (1 + increment / 100);
  }
  return {
    primary: { label: 'EPF Corpus at 58', val: C(corpus) },
    cards: [{ label: 'Total Contributed', val: C(totalContrib), cls: '' }, { label: 'Tax-free Interest', val: C(corpus - totalContrib), cls: 'green' }, { label: 'Years', val: (retire - age) + ' yrs', cls: 'blue' }, { label: 'EPF Rate', val: '8.25%', cls: 'amber' }],
    bars: [{ name: 'Contributions', amt: totalContrib, col: '#c4b5fd' }, { name: 'Tax-free interest', amt: corpus - totalContrib, col: '#5b21b6' }],
    ydata, ycols: ['Year', 'Age', 'Basic Salary', 'Annual Contribution', 'Corpus'],
  };
}

// ── GST ───────────────────────────────────────────────
export function calcGST(amount: number, rate: number, calcType: string, txType: string) {
  const rn = Number(rate);
  let base: number, gst: number, total: number;
  if (calcType === 'excl') { base = amount; gst = base * rn / 100; total = base + gst; }
  else { total = amount; base = total / (1 + rn / 100); gst = total - base; }
  const cgst = txType === 'intra' ? gst / 2 : 0, sgst = txType === 'intra' ? gst / 2 : 0, igst = txType === 'inter' ? gst : 0;
  return {
    primary: { label: 'GST Amount', val: C(gst) },
    cards: [{ label: 'Base Amount', val: C(base), cls: '' }, { label: 'Total Amount', val: C(total), cls: 'green' }, { label: txType === 'intra' ? 'CGST + SGST' : 'IGST', val: txType === 'intra' ? C(cgst) + ' + ' + C(sgst) : C(igst), cls: 'blue' }, { label: 'GST Rate', val: rn + '%', cls: 'amber' }],
    bars: [{ name: 'Base value', amt: base, col: '#99f6e4' }, { name: 'GST component', amt: gst, col: '#0d9488' }],
    gstDetail: { base, gst, total, cgst, sgst, igst, rate: rn, txType },
  };
}

// ── ROI ───────────────────────────────────────────────
export function calcROI(invested: number, returns: number, years: number) {
  const roi = (returns - invested) / invested * 100;
  const cagr = (Math.pow(returns / invested, 1 / years) - 1) * 100;
  const profit = returns - invested;
  return {
    primary: { label: 'ROI', val: P(roi) },
    cards: [{ label: 'Net Profit/Loss', val: C(profit), cls: profit >= 0 ? 'green' : 'red' }, { label: 'CAGR', val: P(cagr), cls: 'blue' }, { label: 'Multiple', val: (returns / invested).toFixed(2) + 'x', cls: 'amber' }, { label: 'vs FD (7%)', val: P(cagr - 7) + (cagr > 7 ? ' better' : ' worse'), cls: cagr > 7 ? 'green' : 'red' }],
    bars: [{ name: 'Invested', amt: invested, col: '#99f6e4' }, { name: 'Profit', amt: Math.abs(profit), col: profit >= 0 ? '#0d9488' : '#dc2626' }],
    benchmarks: [{ name: 'FD (bank)', ret: '~7%', cagr: 7 }, { name: 'PPF', ret: '7.1%', cagr: 7.1 }, { name: 'Gold', ret: '~10%', cagr: 10 }, { name: 'Nifty 50', ret: '~13%', cagr: 13 }, { name: 'Your ROI', ret: P(cagr), cagr: Number(cagr.toFixed(2)), highlight: true }],
  };
}

// ── BREAKEVEN ─────────────────────────────────────────
export function calcBreakeven(fixed: number, price: number, variable: number, target: number) {
  const cm = price - variable, bep = Math.ceil(fixed / cm);
  const bepRev = bep * price, cmr = cm / price * 100;
  const targetProfit = (target - bep) * cm;
  const rows: string[][] = [];
  for (let u = Math.max(100, bep - 500); u <= target * 1.5 && rows.length < 10; u += Math.max(100, Math.round(bep / 5))) {
    const p = u * cm - fixed;
    rows.push([u.toLocaleString('en-IN'), C(u * price), C(p), P(p / (u * price) * 100)]);
  }
  return {
    primary: { label: 'Break-Even Units', val: bep.toLocaleString('en-IN') },
    cards: [{ label: 'Break-Even Revenue', val: C(bepRev), cls: 'green' }, { label: 'Contribution Margin', val: C(cm) + '/unit', cls: 'blue' }, { label: 'CM Ratio', val: P(cmr), cls: 'amber' }, { label: 'Profit at Target', val: C(Math.max(0, targetProfit)), cls: targetProfit >= 0 ? 'green' : 'red' }],
    bars: [{ name: 'Fixed costs', amt: fixed, col: '#fca5a5' }, { name: 'Variable at BEP', amt: bep * variable, col: '#99f6e4' }],
    ydata: rows, ycols: ['Units Sold', 'Revenue', 'Profit/Loss', 'Net Margin'],
  };
}

// ── COMPOUND ──────────────────────────────────────────
export function calcCompound(principal: number, rate: number, years: number, freq: number) {
  const n = Number(freq), amount = principal * Math.pow(1 + rate / 100 / n, n * years);
  const ci = amount - principal, si = principal * rate / 100 * years;
  const dbl = 72 / rate;
  const ydata: string[][] = [];
  for (let yr = 1; yr <= years; yr++) {
    const a = principal * Math.pow(1 + rate / 100 / n, n * yr);
    ydata.push([String(yr), C(a), C(a - principal), C(principal * rate / 100 * yr), C((a - principal) - (principal * rate / 100 * yr))]);
  }
  return {
    primary: { label: 'Total Amount', val: C(amount) },
    cards: [{ label: 'Compound Interest', val: C(ci), cls: 'green' }, { label: 'Simple Interest', val: C(si), cls: '' }, { label: 'CI Advantage', val: C(ci - si), cls: 'amber' }, { label: 'Rule of 72 (double in)', val: dbl.toFixed(1) + ' yrs', cls: 'blue' }],
    bars: [{ name: 'Principal', amt: principal, col: '#fca5a5' }, { name: 'CI', amt: ci, col: '#dc2626' }, { name: 'SI (reference)', amt: si, col: '#fcd34d' }],
    chartData: { labels: ydata.map(r=>`Yr ${r[0]}`), invested: Array(years).fill(principal), values: Array.from({length:years},(_,i)=>principal*Math.pow(1+rate/100/n,n*(i+1))) },
    ydata, ycols: ['Year', 'Total Amount', 'Compound Int.', 'Simple Int.', 'CI Advantage'],
  };
}

// ── INFLATION ─────────────────────────────────────────
export function calcInflation(amount: number, inflation: number, years: number) {
  const future = amount * Math.pow(1 + inflation / 100, years);
  const realVal = amount / Math.pow(1 + inflation / 100, years);
  const ydata: string[][] = [];
  for (let yr = 1; yr <= years; yr++) {
    const fc = amount * Math.pow(1 + inflation / 100, yr);
    const rv = amount / Math.pow(1 + inflation / 100, yr);
    ydata.push([String(yr), C(fc), C(rv), P((1 - rv / amount) * 100)]);
  }
  return {
    primary: { label: 'Future Cost of ' + C(amount), val: C(future) },
    cards: [{ label: "Real Value Today's ₹", val: C(realVal), cls: 'amber' }, { label: 'Purchasing Power Lost', val: P((1 - realVal / amount) * 100), cls: 'red' }, { label: 'Min return to break even', val: P(inflation), cls: 'blue' }, { label: 'Savings account', val: '~3-4%', cls: '' }],
    bars: [{ name: 'Real value remaining', amt: realVal, col: '#fca5a5' }, { name: 'Inflation erosion', amt: amount - realVal, col: '#dc2626' }],
    chartData: { labels: ydata.map(r=>`Yr ${r[0]}`), invested: Array(years).fill(amount), values: ydata.map((_,i)=>amount*Math.pow(1+inflation/100,i+1)) },
    ydata, ycols: ['Year', 'Future Cost', 'Real Value', 'Purchasing Power Lost'],
  };
}

// ── HRA ───────────────────────────────────────────────
export function calcHRA(basic: number, hraRec: number, rent: number, city: number) {
  const pct = Number(city) / 100;
  const a1 = hraRec * 12, a2 = basic * pct * 12, a3 = Math.max(0, (rent - basic * 0.10) * 12);
  const exempt = Math.min(a1, a2, a3), taxable = a1 - exempt;
  const which = a1 <= a2 && a1 <= a3 ? 'Actual HRA' : a2 <= a1 && a2 <= a3 ? `${city}% of Basic` : 'Rent − 10% Basic';
  return {
    primary: { label: 'Annual HRA Exempt', val: C(exempt) },
    cards: [{ label: 'Actual HRA (Annual)', val: C(a1), cls: '' }, { label: 'Taxable HRA', val: C(taxable), cls: taxable > 0 ? 'amber' : 'green' }, { label: 'Tax Saving @30%', val: C(exempt * 0.30), cls: 'blue' }, { label: 'Limiting Condition', val: which, cls: '' }],
    bars: [{ name: 'Exempt HRA', amt: exempt, col: '#86efac' }, { name: 'Taxable HRA', amt: taxable, col: '#fca5a5' }],
    threeVals: [{ label: '1. Actual HRA received', val: C(a1) }, { label: `2. ${city}% of Basic salary`, val: C(a2) }, { label: '3. Rent paid − 10% of Basic', val: C(a3) }, { label: 'Exempt (Minimum of above)', val: C(exempt), bold: true }],
  };
}

// ── SALARY ────────────────────────────────────────────
export function calcSalary(ctc: number, basicPct: number, hraPct: number) {
  const basic = ctc * basicPct / 100, hra = basic * hraPct / 100;
  const pfEmployer = Math.min(basic * 0.12 / 12, 1800);
  const pfEmployee = Math.min(basic * 0.12 / 12, 1800);
  const grossMonthly = ctc / 12, pt = 200;
  const tds = ctc > 1200000 ? (ctc - 1200000) * 0.20 / 12 : 0;
  const takeHome = grossMonthly - pfEmployee - pt - tds;
  return {
    primary: { label: 'Monthly Take-Home', val: C(takeHome) },
    cards: [{ label: 'Gross Monthly', val: C(grossMonthly), cls: '' }, { label: 'PF Deduction/mo', val: C(pfEmployee), cls: 'blue' }, { label: 'TDS/mo (est.)', val: C(tds), cls: 'amber' }, { label: 'Annual In-Hand', val: C(takeHome * 12), cls: 'green' }],
    bars: [{ name: 'Take-home', amt: takeHome * 12, col: '#86efac' }, { name: 'Deductions (annual)', amt: ctc - takeHome * 12, col: '#fca5a5' }],
    ctcBreakdown: [
      { item: 'Basic Salary', monthly: C(basic / 12), annual: C(basic) },
      { item: 'HRA', monthly: C(hra / 12), annual: C(hra) },
      { item: 'Special Allowance', monthly: C((ctc - basic - hra - pfEmployer * 12) / 12), annual: C(ctc - basic - hra - pfEmployer * 12) },
      { item: 'Employer PF', monthly: C(pfEmployer), annual: C(pfEmployer * 12) },
      { item: 'Total CTC', monthly: C(grossMonthly), annual: C(ctc), bold: true },
      { item: '(−) Employee PF', monthly: C(-pfEmployee), annual: C(-pfEmployee * 12) },
      { item: '(−) Prof. Tax', monthly: '−₹200', annual: '−₹2,400' },
      { item: '(−) TDS', monthly: C(-tds), annual: C(-tds * 12) },
      { item: 'NET TAKE-HOME', monthly: C(takeHome), annual: C(takeHome * 12), bold: true },
    ],
  };
}

// ── GOAL ─────────────────────────────────────────────
export function calcGoal(goal: number, years: number, inflation: number, ret: number) {
  const fg = goal * Math.pow(1 + inflation / 100, years);
  const r = ret / 100 / 12, n = years * 12;
  const monthly = fg * r / ((Math.pow(1 + r, n) - 1) * (1 + r));
  const totalInv = monthly * n;
  const ydata: string[][] = [];
  for (let yr = 1; yr <= years; yr++) {
    const mo = yr * 12, yFV = monthly * ((Math.pow(1 + r, mo) - 1) / r) * (1 + r);
    ydata.push([String(yr), C(monthly * mo), C(yFV), P(yFV / fg * 100)]);
  }
  return {
    primary: { label: 'Monthly SIP Needed', val: C(monthly) },
    cards: [{ label: 'Future Goal Value', val: C(fg), cls: 'amber' }, { label: 'Total Contributions', val: C(totalInv), cls: '' }, { label: 'Returns Component', val: C(fg - totalInv), cls: 'green' }, { label: 'Returns %', val: P((fg - totalInv) / fg * 100), cls: 'blue' }],
    bars: [{ name: 'Your contributions', amt: totalInv, col: '#c4b5fd' }, { name: 'Market returns', amt: fg - totalInv, col: '#7c3aed' }],
    chartData: { labels: ydata.map(r=>`Yr ${r[0]}`), invested: Array.from({length:years},(_,i)=>monthly*(i+1)*12), values: Array.from({length:years},(_,i)=>{const mo=(i+1)*12;return monthly*((Math.pow(1+r,mo)-1)/r)*(1+r)}) },
    ydata, ycols: ['Year', 'Invested', 'Portfolio Value', '% of Goal'],
  };
}

// ── GRATUITY ─────────────────────────────────────────
export function calcGratuity(basic: number, years: number) {
  const gratuity = (basic / 26) * 15 * years;
  const taxFree = Math.min(gratuity, 2000000), taxable = Math.max(0, gratuity - 2000000);
  return {
    primary: { label: 'Gratuity Amount', val: C(gratuity) },
    cards: [{ label: 'Tax-Free Portion', val: C(taxFree), cls: 'green' }, { label: 'Taxable (if any)', val: C(taxable), cls: taxable > 0 ? 'amber' : '' }, { label: 'Per Year of Service', val: C(gratuity / years), cls: 'blue' }, { label: 'Effective Daily Wage', val: C(basic / 26), cls: '' }],
    bars: [{ name: 'Tax-free gratuity', amt: taxFree, col: '#99f6e4' }, { name: 'Taxable portion', amt: taxable, col: taxable > 0 ? '#fca5a5' : '#99f6e4' }],
  };
}

// ── CAGR ─────────────────────────────────────────────
export function calcCAGR(begin: number, end: number, years: number) {
  const cagr = (Math.pow(end / begin, 1 / years) - 1) * 100;
  const total = (end - begin) / begin * 100;
  return {
    primary: { label: 'CAGR', val: P(cagr) },
    cards: [{ label: 'Total Return', val: P(total), cls: 'green' }, { label: 'Absolute Gain', val: C(end - begin), cls: 'blue' }, { label: 'Multiple', val: (end / begin).toFixed(2) + 'x', cls: 'amber' }, { label: 'vs Nifty50 (~13%)', val: P(cagr - 13) + (cagr >= 13 ? ' better' : ' worse'), cls: cagr >= 13 ? 'green' : 'red' }],
    bars: [{ name: 'Initial value', amt: begin, col: '#99f6e4' }, { name: 'Growth', amt: end - begin, col: '#065f46' }],
    benchmarks: [{ name: 'Savings Account', ret: '3-4%', cagr: 3.5 }, { name: 'FD (bank)', ret: '~7%', cagr: 7 }, { name: 'PPF', ret: '7.1%', cagr: 7.1 }, { name: 'Gold', ret: '~10%', cagr: 10 }, { name: 'Nifty 50', ret: '~13%', cagr: 13 }, { name: 'Your CAGR', ret: P(cagr), cagr: Number(cagr.toFixed(2)), highlight: true }],
  };
}

// ── MF RETURNS ────────────────────────────────────────
export function calcMFReturns(invested: number, current: number, years: number) {
  const cagr = (Math.pow(current / invested, 1 / years) - 1) * 100;
  const gain = current - invested, abs = gain / invested * 100;
  return {
    primary: { label: 'CAGR', val: P(cagr) },
    cards: [{ label: 'Total Gain', val: C(gain), cls: gain >= 0 ? 'green' : 'red' }, { label: 'Absolute Return', val: P(abs), cls: 'amber' }, { label: 'Multiple', val: (current / invested).toFixed(2) + 'x', cls: 'blue' }, { label: 'Benchmark Nifty50', val: '~12–14%', cls: '' }],
    bars: [{ name: 'Invested', amt: invested, col: '#93c5fd' }, { name: 'Gain', amt: Math.abs(gain), col: gain >= 0 ? '#1d4ed8' : '#dc2626' }],
    benchmarks: [{ name: 'FD', ret: '7%', cagr: 7 }, { name: 'PPF', ret: '7.1%', cagr: 7.1 }, { name: 'Nifty 50', ret: '~13%', cagr: 13 }, { name: 'Your Fund', ret: P(cagr), cagr: Number(cagr.toFixed(2)), highlight: true }],
  };
}
