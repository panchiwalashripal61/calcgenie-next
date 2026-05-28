import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const SALARY_PROMPT = `Extract all salary and tax data from this Indian payroll document. Return ONLY valid JSON with these fields (null if not found):
{
  "employee_name": "full name",
  "employee_id": "employee code",
  "company_name": "employer name",
  "month_year": "period e.g. October 2024",
  "payment_days": 31,
  "basic_monthly": 9506,
  "hra_monthly": 4752,
  "conveyance_monthly": 0,
  "pf_employee_monthly": 570,
  "professional_tax_monthly": 200,
  "tds_monthly": 0,
  "gross_monthly": 16208,
  "net_monthly": 15438,
  "annual_gross": 194496,
  "annual_basic": 114072,
  "annual_hra_received": 57024,
  "annual_pf": 6840,
  "annual_tds_deducted": 0,
  "form16_80c": null,
  "rent_paid_monthly": null,
  "city_type": "metro OR non-metro",
  "document_type": "salary_slip OR form16 OR itr OR other",
  "notes": "any important observations"
}
If partial month, calculate full-month equivalent values.`;

const GST_PROMPT = `Extract all GST information from this Indian invoice, bill, or receipt. Return ONLY valid JSON:
{
  "vendor_name": "supplier name",
  "vendor_gstin": "GST number",
  "buyer_name": "buyer name",
  "buyer_gstin": null,
  "invoice_number": "invoice number",
  "invoice_date": "date",
  "hsn_sac_code": "code",
  "item_description": "what was sold",
  "base_amount": 10000,
  "cgst_rate": 9,
  "sgst_rate": 9,
  "igst_rate": 0,
  "cgst_amount": 900,
  "sgst_amount": 900,
  "igst_amount": 0,
  "total_gst": 1800,
  "total_invoice_amount": 11800,
  "gst_rate_total": 18,
  "is_inclusive": false,
  "transaction_type": "intra-state OR inter-state",
  "notes": "observations"
}`;

export async function POST(req: Request) {
  try {
    const { file, mediaType, docType } = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const prompt = docType === 'gst_invoice' ? GST_PROMPT : SALARY_PROMPT;

    type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    
    const contentBlock = mediaType === 'application/pdf'
      ? { type: 'document' as const, source: { type: 'base64' as const, media_type: 'application/pdf' as const, data: file } }
      : { type: 'image' as const, source: { type: 'base64' as const, media_type: mediaType as ImageMediaType, data: file } };

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: 'You are a precise Indian financial document parser. Return ONLY valid JSON, no markdown, no explanation.',
      messages: [{ role: 'user', content: [contentBlock, { type: 'text', text: prompt }] }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Parse failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
