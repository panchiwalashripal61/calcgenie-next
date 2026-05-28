'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcSalary } from '@/lib/calculators';


const config = {
  id: 'salary', icon: '💼', color: '#fee2e2',
  title: 'Salary & CTC Breakup',
  subtitle: 'CTC → Take-home · All deductions · In-hand salary calculator',
  category: 'pf',
  formula: {
    eq: 'Take-home = Gross Monthly − PF − TDS − PT',
    vars: 'PF: 12% of basic · PT: ~₹200/mo · TDS: as per slab',
    source: 'EPF Act + Income Tax Act + State PT rules',
    
  },
  steps: ['Basic = 40-50% of CTC typically', 'Employee PF = 12% of basic', 'Professional Tax = ₹200/month most states'],
  inputs: [{id:"ctc",label:"Annual CTC",pfx:"₹",def:1200000,step:50000},{id:"basicPct",label:"Basic % of CTC",sfx:"%",def:40,min:30,max:60,step:5},{id:"hraPct",label:"HRA % of Basic",sfx:"%",def:50,min:0,max:50,step:10}],
  note: undefined,
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcSalary(n.ctc,n.basicPct,n.hraPct);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
