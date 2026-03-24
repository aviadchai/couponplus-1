import { requireAuth } from '../../../lib/auth';

const PATHS = [
  '/',
  '/deals',
  '/pharm',
  '/international',
  '/shopping',
  '/profile',
  '/special',
  '/passover',
];

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await Promise.all(PATHS.map(p => res.revalidate(p)));
    return res.status(200).json({ ok: true, revalidated: PATHS });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
