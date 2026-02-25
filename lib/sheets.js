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
  const SHEET_ID = '1KWZtbWdoVPi8Vem2Df45VZqozpFlC4yPGX71D1MzNqw';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=קופונים`;

  const res  = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));

  if (!json.table?.rows) return [];

  // Column layout:
  // A(0)=id | B(1)=name | C(2)=chain | D(3)=category | E(4)=discount
  // F(5)=type | G(6)=code | H(7)=url | I(8)=expiry | J(9)=badge
  // K(10)=image | L(11)=description | M(12)=pdf
  return json.table.rows
    .filter(row => row.c && row.c[1]?.v)
    .map((row, i) => {
      const c = row.c;
      const expiryRaw = c[8]?.f || c[8]?.v || '';
      const expiry    = parseDate(expiryRaw);
      const expired   = isExpired(expiry);
      const type      = c[5]?.v || '';

      return {
        id:          c[0]?.v ? String(c[0].v) : String(i),
        name:        c[1]?.v  || '',
        chain:       c[2]?.v  || '',
        category:    c[3]?.v  || '',
        discount:    parseDiscount(c[4]),
        type,                                      // 'קוד קופון' | 'קישור להטבה' | 'קוד + קישור'
        code:        c[6]?.v  ? String(c[6].v) : '',
        url:         c[7]?.v  || '',               // direct link to benefit
        expiry,
        expired,
        badge:       c[9]?.v  || '',
        image:       c[10]?.v || '',
        description: c[11]?.v || '',
        pdf:         c[12]?.v || '',
      };
    });
}
