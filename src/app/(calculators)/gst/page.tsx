'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcGST } from '@/lib/calculators';


const config = {
  id: 'gst', icon: '🧾', color: '#ccfbf1',
  title: 'GST Calculator',
  subtitle: 'Add/remove GST · CGST+SGST / IGST split · All slabs · Upload invoice for auto-fill',
  category: 'biz',
  formula: {
    eq: 'Exclusive: GST = Amount × Rate/100. Inclusive: Base = Amount/(1+Rate/100)',
    vars: 'Intra-state: CGST=Rate/2, SGST=Rate/2. Inter-state: IGST=Rate',
    source: 'GSTN India — GST Act 2017',
    url: 'https://www.gst.gov.in',
  },
  steps: [
    'Identify GST slab: 5%, 12%, 18%, or 28%',
    'Exclusive (adding): GST on base amount',
    'Inclusive (removing): Extract base from gross amount',
    'Intra-state: CGST+SGST. Inter-state: IGST',
  ],
  inputs: [
    { id: 'amount', label: 'Amount (₹)', pfx: '₹', def: 10000, step: 100 },
    { id: 'rate', label: 'GST Rate', type: 'sel' as const, opts: [{v:'5',l:'5% — Essential goods (food, medicine)'},{v:'12',l:'12% — Standard (computers, phones)'},{v:'18',l:'18% — Most services, electronics'},{v:'28',l:'28% — Luxury goods, cars, tobacco'}], def: '18' },
    { id: 'calcType', label: 'Calculation', type: 'sel' as const, opts: [{v:'excl',l:'Add GST (exclusive)'},{v:'incl',l:'Remove GST (inclusive)'}], def: 'excl' },
    { id: 'txType', label: 'Transaction Type', type: 'sel' as const, opts: [{v:'intra',l:'Intra-state (CGST + SGST)'},{v:'inter',l:'Inter-state (IGST)'}], def: 'intra' },
  ],
  hasUpload: true,
  uploadType: 'gst' as const,
  compute: (v: Record<string, number | string>) => calcGST(Number(v.amount), Number(v.rate), String(v.calcType), String(v.txType)),
};

export default function GSTPage() {
  return <CalcEngine config={config} />;
}
