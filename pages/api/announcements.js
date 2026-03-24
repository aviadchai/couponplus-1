import { createServerClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const sb = createServerClient();
  const { data } = await sb
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  res.setHeader('Cache-Control', 'public, s-maxage=60');
  res.status(200).json(data || []);
}
