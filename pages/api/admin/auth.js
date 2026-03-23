import { createToken, verifyToken } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body || {};
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = createToken();
      res.setHeader('Set-Cookie', `admin_auth=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict`);
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', 'admin_auth=; HttpOnly; Path=/; Max-Age=0');
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
