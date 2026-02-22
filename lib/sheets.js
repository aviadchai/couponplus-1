export async function getCoupons() {
  const SHEET_ID = '1nTS9SuMhhfKGt7UIYUU-YPgAfp-NIFdlQtfJ4Ft_Vbc';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Sheet1`;

  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));

  if (!json.table?.rows) return [];

  return json.table.rows.map((row, i) => {
    const c = row.c;
    return {
      id: String(i),
      name:     c[0]?.v || '',
      code:     c[1]?.v || '',
      discount: c[2]?.v || '',
      chain:    c[3]?.v || '',
      category: c[4]?.v || '',
      status:   c[5]?.v || '',
      expiry:   c[6]?.v || '',
      badge:    c[7]?.v || '',
      image:    c[8]?.v || '',
      pdf:      c[9]?.v || '',
      description: c[10]?.v || '',
    };
  }).filter(c => c.status === 'פעיל' && c.name);
}
