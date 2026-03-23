function parseDate(val) {
  if (!val) return '';
  const s = String(val);
  const match = s.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (match) {
    const [, y, m, d] = match;
    return `${String(d).padStart(2,'0')}/${String(parseInt(m)+1).padStart(2,'0')}/${y}`;
  }
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${d}/${m}/${y}`;
  }
  return s;
}

function isExpired(expiryStr) {
  if (!expiryStr) return false;
  const parts = expiryStr.split('/');
  if (parts.length !== 3) return false;
  const [d, m, y] = parts;
  const fullYear = y.length === 2 ? '20' + y : y;
  const expiryDate = new Date(`${fullYear}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`);
  expiryDate.setHours(23, 59, 59);
  return expiryDate < new Date();
}

function parseDiscount(cell) {
  if (!cell) return '';
  if (cell.f) return cell.f;
  if (typeof cell.v === 'number') {
    if (cell.v > 0 && cell.v <= 1) return Math.round(cell.v * 100) + '%';
    return cell.v + '%';
  }
  return cell.v || '';
}

export async function getCoupons() {
  const { createServerClient } = await import('./supabase.js');
  const sb = createServerClient();
  const { data, error } = await sb
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data || []).map(c => ({ ...c, expired: isExpired(c.expiry) }));
}

// Fetch AliExpress coupons from our API route (server-side only)
export async function getAliCoupons(baseUrl = '') {
  try {
    const res  = await fetch(`${baseUrl}/api/aliexpress`);
    const data = await res.json();
    return data.coupons || [];
  } catch {
    return [];
  }
}

export async function getSlides() {
  const { createServerClient } = await import('./supabase.js');
  const sb = createServerClient();
  const { data, error } = await sb
    .from('slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(3);
  if (error) return [];
  return (data || []).map(s => ({
    id: s.id, title: s.title, subtitle: s.subtitle,
    tag: s.tag, discount: s.discount, type: s.type,
    code: s.code, url: s.url, image: s.image,
    couponId: s.coupon_id,
  }));
}

