import { getCoupons } from '../lib/sheets';

const BASE_URL = 'https://couponplus.co.il';

const STATIC_PAGES = [
  { url: '/',             priority: '1.0', changefreq: 'hourly' },
  { url: '/deals',        priority: '0.9', changefreq: 'hourly' },
  { url: '/international',priority: '0.8', changefreq: 'daily'  },
  { url: '/special',      priority: '0.9', changefreq: 'daily'  },
  { url: '/pharm',        priority: '0.8', changefreq: 'daily'  },
  { url: '/shopping',     priority: '0.7', changefreq: 'daily'  },
  { url: '/contact',      priority: '0.5', changefreq: 'monthly'},
  { url: '/privacy',      priority: '0.3', changefreq: 'monthly'},
  { url: '/terms',        priority: '0.3', changefreq: 'monthly'},
  { url: '/category/סופרמרקט',         priority: '0.8', changefreq: 'daily' },
  { url: '/category/פארם ובריאות',     priority: '0.8', changefreq: 'daily' },
  { url: '/category/טיפוח וקוסמטיקה', priority: '0.7', changefreq: 'daily' },
  { url: '/category/טואלטיקה',         priority: '0.7', changefreq: 'daily' },
  { url: '/category/אלקטרוניקה',       priority: '0.7', changefreq: 'daily' },
  { url: '/category/בית ומטבח',        priority: '0.7', changefreq: 'daily' },
  { url: '/category/אופנה',            priority: '0.7', changefreq: 'daily' },
  { url: '/category/חיות מחמד',        priority: '0.7', changefreq: 'daily' },
  { url: '/category/קופוני-מוצר',      priority: '0.8', changefreq: 'daily' },
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function urlEntry(loc, priority, changefreq) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`;
}

export default function SitemapPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  const coupons = await getCoupons().catch(() => []);

  const entries = [
    ...STATIC_PAGES.map(p => urlEntry(`${BASE_URL}${p.url}`, p.priority, p.changefreq)),
    ...coupons.map(c => urlEntry(`${BASE_URL}/coupon/${encodeURIComponent(c.id)}`, '0.6', 'daily')),
  ];

  const sitemap = buildSitemap(entries);

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  res.write(sitemap);
  res.end();

  return { props: {} };
}
