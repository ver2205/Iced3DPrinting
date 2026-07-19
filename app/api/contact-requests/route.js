import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const { honeypot, name, email, notes } = await req.json();

  if (honeypot) {
    return NextResponse.json({ error: 'rejected' }, { status: 400 });
  }
  if (!name || !email) {
    return NextResponse.json({ error: 'missing-fields' }, { status: 400 });
  }

  const { error } = await supabase.from('quote_requests').insert([
    {
      name,
      email,
      selected_ship: null,
      notes: notes || null,
      status: 'Received',
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
