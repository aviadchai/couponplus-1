import { requireAuth } from '../../../lib/auth';
import { createAdminClient } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const sb = createAdminClient();

  if (req.method === 'GET') {
    const { data, error } = await sb.from('slides').select('*').order('sort_order');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await sb.from('slides').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).end();
}
