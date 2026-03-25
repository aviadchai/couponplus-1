import { requireAuth } from '../../../lib/auth';
import { createAdminClient } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  const sb = createAdminClient();

  // GET — all coupons (including inactive)
  if (req.method === 'GET') {
    const { data, error } = await sb
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST — create coupon
  if (req.method === 'POST') {
    const { images, ...rest } = req.body;
    const coupon = images?.length ? { ...rest, images } : rest;
    if (!coupon.id || !coupon.name || !coupon.chain) {
      return res.status(400).json({ error: 'חסרים שדות חובה: id, name, chain' });
    }
    const { data, error } = await sb.from('coupons').insert([coupon]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).end();
}
