'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcBreakeven } from '@/lib/calculators';


const config = {
  id: 'breakeven', icon: '⚖️', color: '#ccfbf1',
  title: 'Break-Even Calculator',
  subtitle: 'Units needed to cover costs · Contribution margin · Profit projection',
  category: 'biz',
  formula: {
    eq: 'BEP(units) = Fixed Costs / (Price − Variable Cost)',
    vars: 'CM = Price − Variable Cost. CMR = CM/Price × 100',
    source: 'Standard managerial accounting BEP formula',
    
  },
  steps: ['Contribution Margin (CM) = Selling price − Variable cost', 'BEP units = Fixed costs ÷ CM', 'Profit at any sales = (Units − BEP) × CM'],
  inputs: [{id:"fixed",label:"Fixed Costs/Month",pfx:"₹",def:200000,step:5000,hint:"Rent, salaries, EMI"},{id:"price",label:"Selling Price/Unit",pfx:"₹",def:500,step:10},{id:"variable",label:"Variable Cost/Unit",pfx:"₹",def:200,step:5},{id:"target",label:"Target Sales/Month",sfx:"units",def:1000,step:50}],
  note: undefined,
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcBreakeven(n.fixed,n.price,n.variable,n.target);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
