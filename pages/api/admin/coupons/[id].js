import { requireAuth } from '../../../../lib/auth';
import { createAdminClient } from '../../../../lib/supabase';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  const { id } = req.query;
  const sb = createAdminClient();

  // PUT — update coupon
  if (req.method === 'PUT') {
    const { images, ...rest } = req.body;
    const updates = images?.length ? { ...rest, images } : rest;
    delete updates.id;
    delete updates.created_at;
    const { data, error } = await sb.from('coupons').update(updates).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // DELETE — delete coupon
  if (req.method === 'DELETE') {
    const { error } = await sb.from('coupons').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
