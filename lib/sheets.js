export async function getCoupons() {
  const SHEET_ID = '1nTS9SuMhhfKGt7UIYUU-YPgAfp-NIFdlQtfJ4Ft_Vbc';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Sheet1`;
  
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));
  
  return json.table.rows.map((row, i) => ({
    id: i,
    name:     row.c[0]?.v || '',
    code:     row.c[1]?.v || '',
    discount: row.c[2]?.v || '',
    chain:    row.c[3]?.v || '',
    category: row.c[4]?.v || '',
    status:   row.c[5]?.v || '',
    expiry:   row.c[6]?.v || '',
    badge:    row.c[7]?.v || '',
    image:    row.c[8]?.v || '',
  })).filter(c => c.status === 'פעיל');
}
