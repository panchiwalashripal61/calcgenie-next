'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcMFReturns } from '@/lib/calculators';


const config = {
  id: 'mf_ret', icon: '📊', color: '#dbeafe',
  title: 'Mutual Fund CAGR Calculator',
  subtitle: 'Calculate annualised return on existing MF investment',
  category: 'invest',
  formula: {
    eq: 'CAGR = ((FV/PV)^(1/n)−1)×100',
    vars: 'FV = current value · PV = invested amount · n = years',
    source: 'SEBI — Standard CAGR definition for mutual funds',
  },
  steps: [
    'Divide current value by invested value',
    'Raise to the power of 1/years',
    'Subtract 1 and multiply by 100 to get %',
  ],
  inputs: [
    { id: 'invested', label: 'Amount Invested', pfx: '₹', def: 100000, step: 1000 },
    { id: 'current', label: 'Current Value', pfx: '₹', def: 175000, step: 1000 },
    { id: 'years', label: 'Holding Period', sfx: 'Yrs', def: 5, min: 0.5, max: 50, step: 0.5 },
  ],
  hasFundSearch: true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcMFReturns(n.invested, n.current, n.years);
  },
};

export default function MFReturnsPage() {
  return <CalcEngine config={config} />;
}
