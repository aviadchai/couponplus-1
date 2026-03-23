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

// ── קריאה מ-Supabase (מקור ראשי) ────────────────────────────────
async function getCouponsFromSupabase() {
  const { createServerClient } = await import('./supabase.js');
  const sb = createServerClient();
  const { data, error } = await sb
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error || !data?.length) return null;
  return data.map(c => ({
    ...c,
    expired: isExpired(c.expiry),
  }));
}

// ── קריאה מ-Google Sheets (fallback) ─────────────────────────────
async function getCouponsFromSheets() {
  const SHEET_ID = '1KWZtbWdoVPi8Vem2Df45VZqozpFlC4yPGX71D1MzNqw';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=קופונים`;
  const res  = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));
  if (!json.table?.rows) return [];
  return json.table.rows
    .filter(row => row.c && row.c[1]?.v)
    .map((row, i) => {
      const c = row.c;
      const expiry  = parseDate(c[8]?.f || c[8]?.v || '');
      return {
        id: c[0]?.v ? String(c[0].v) : String(i),
        name: c[1]?.v || '', chain: c[2]?.v || '',
        category: c[3]?.v || '', discount: parseDiscount(c[4]),
        type: c[5]?.v || '', code: c[6]?.v ? String(c[6].v) : '',
        url: c[7]?.v || '', expiry, expired: isExpired(expiry),
        badge: c[9]?.v || '', image: c[10]?.v || '',
        description: c[11]?.v || '', pdf: c[12]?.v || '',
      };
    });
}

export async function getCoupons() {
  try {
    const fromDB = await getCouponsFromSupabase();
    if (fromDB) return fromDB;
  } catch {}
  return getCouponsFromSheets();
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

async function getSlidesFromSupabase() {
  const { createServerClient } = await import('./supabase.js');
  const sb = createServerClient();
  const { data, error } = await sb
    .from('slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(3);
  if (error || !data?.length) return null;
  return data.map(s => ({
    id: s.id, title: s.title, subtitle: s.subtitle,
    tag: s.tag, discount: s.discount, type: s.type,
    code: s.code, url: s.url, image: s.image,
    couponId: s.coupon_id,
  }));
}

export async function getSlides() {
  try {
    const fromDB = await getSlidesFromSupabase();
    if (fromDB) return fromDB;
  } catch {}
  return getSlidesFromSheets();
}

async function getSlidesFromSheets() {
  const SHEET_ID = process.env.SLIDER_SHEET_ID || '1Mqq74obZAefQOJpPwtR36tqpusL-4PSkMsa1qDewyHk';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=סליידר`;
  try {
    const res  = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    if (!json.table?.rows) return [];
    // Columns: A=active, B=title, C=subtitle, D=tag, E=discount, F=type, G=code, H=url, I=image, J=couponId
    return json.table.rows
      .filter(row => row.c && row.c[1]?.v && row.c[0]?.v === 'כן')
      .slice(0, 3)
      .map((row, i) => ({
        id:        i,
        title:     row.c[1]?.v || '',
        subtitle:  row.c[2]?.v || '',
        tag:       row.c[3]?.v || '',
        discount:  row.c[4]?.v || '',
        type:      row.c[5]?.v || '',
        code:      row.c[6]?.v ? String(row.c[6].v) : '',
        url:       row.c[7]?.v || '',
        image:     row.c[8]?.v || '',
        couponId:  row.c[9]?.v ? String(row.c[9].v) : '', // e.g. "coup_00" → links to /coupon/coup_00
      }));
  } catch { return []; }
}

