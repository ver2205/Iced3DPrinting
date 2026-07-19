import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(req) {
  const { token } = await req.json();

  if (!token) {
    return Response.json({ success: false, error: 'missing-token' }, { status: 400 });
  }

  const success = await verifyRecaptcha(token);
  return Response.json({ success });
}
