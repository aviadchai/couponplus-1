import { requireAuth } from '../../../lib/auth';
import { createAdminClient, createServerClient } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  const admin = createAdminClient();
  const anon  = createServerClient();

  const [
    { data: couponsAdmin, error: e1 },
    { data: couponsAnon,  error: e2 },
    { data: slidesAdmin,  error: e3 },
    { data: slidesAnon,   error: e4 },
  ] = await Promise.all([
    admin.from('coupons').select('id,is_active').limit(5),
    anon.from('coupons').select('id,is_active').limit(5),
    admin.from('slides').select('id,is_active').limit(5),
    anon.from('slides').select('id,is_active').limit(5),
  ]);

  res.status(200).json({
    coupons: {
      admin: { count: couponsAdmin?.length ?? 0, error: e1?.message },
      anon:  { count: couponsAnon?.length  ?? 0, error: e2?.message },
    },
    slides: {
      admin: { count: slidesAdmin?.length ?? 0, error: e3?.message },
      anon:  { count: slidesAnon?.length  ?? 0, error: e4?.message },
    },
    env: {
      url:      !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey:  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      adminKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
}
