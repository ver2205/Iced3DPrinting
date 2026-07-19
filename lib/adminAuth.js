import crypto from 'crypto';

const LABEL = 'admin';

export function signAdminSession() {
  const sig = crypto
    .createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update(LABEL)
    .digest('hex');
  return `${LABEL}.${sig}`;
}

export function isValidAdminSession(cookieValue) {
  if (!cookieValue) return false;
  const [label, sig] = cookieValue.split('.');
  if (label !== LABEL || !sig) return false;

  const expected = crypto
    .createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update(LABEL)
    .digest('hex');

  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length !== expectedBuf.length) return false;

  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}
