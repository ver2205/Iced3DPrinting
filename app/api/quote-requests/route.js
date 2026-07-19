import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyRecaptcha } from '@/lib/recaptcha';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const body = await req.json();
  const { token, honeypot, ...quote } = body;

  if (honeypot) {
    return NextResponse.json({ error: 'rejected' }, { status: 400 });
  }

  const humanVerified = await verifyRecaptcha(token);
  if (!humanVerified) {
    return NextResponse.json({ error: 'recaptcha-failed' }, { status: 400 });
  }

  if (!quote.name || !quote.email || !quote.phone) {
    return NextResponse.json({ error: 'missing-fields' }, { status: 400 });
  }

  const isCustom = quote.selected_ship === 'Custom Design';

  const { error } = await supabase.from('quote_requests').insert([
    {
      selected_ship: quote.selected_ship,
      scale: quote.scale || null,
      name: quote.name,
      email: quote.email,
      phone: quote.phone || null,
      notes: quote.notes || null,
      custom_ship_name: isCustom ? quote.custom_ship_name || null : null,
      has_technical_draws: isCustom ? quote.has_technical_draws === 'yes' : null,
      is_still_sailing: isCustom ? quote.is_still_sailing === 'yes' : null,
      has_photos: isCustom ? quote.has_photos === 'yes' : null,
      rc_model: isCustom ? quote.rc_model === 'yes' : null,
      build_ready: isCustom ? quote.build_ready === 'yes' : null,
      case_cover: isCustom ? quote.case_cover === 'yes' : null,
      status: 'Received',
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
