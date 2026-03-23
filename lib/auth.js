import crypto from 'crypto';

const SECRET = process.env.ADMIN_SECRET || 'couponplus-change-this-secret';

export function createToken() {
  const payload = Buffer.from(JSON.stringify({ admin: true, ts: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  try {
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function requireAuth(req, res) {
  const token = req.cookies?.admin_auth;
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
