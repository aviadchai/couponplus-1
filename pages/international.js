import Head from 'next/head';
import Layout from '../components/Layout';
import CouponCard from '../components/CouponCard';
import { getCoupons } from '../lib/sheets';
import { useState } from 'react';

const INTL_SITES = [
  { key: 'all',       label: 'הכל',        emoji: '🌍' },
  { key: 'AliExpress', label: 'AliExpress', emoji: '🛒' },
  { key: 'Shein',      label: 'Shein',      emoji: '👗' },
  { key: 'Amazon',     label: 'Amazon',     emoji: '📦' },
  { key: 'eBay',       label: 'eBay',       emoji: '🏷️' },
  { key: 'Temu',       label: 'Temu',       emoji: '🎯' },
];

function AdStrip() {
  return (
    <div className="ad-wrap">
      <div className="ad-strip">
        <span className="ad-tag">פרסומת</span>
        <span style={{fontSize:'20px',opacity:.22}}>🎯</span>
        <span style={{fontSize:'13px',color:'#536070'}}><b>Google Ads — 728×90</b></span>
      </div>
    </div>
  );
}

export default function International({ coupons }) {
  const [site, setSite]     = useState('all');
  const [search, setSearch] = useState('');

  const filtered = coupons.filter(c => {
    const matchSite   = site === 'all' || c.chain === site;
    const matchSearch = !search || c.name.includes(search) || c.chain.includes(search);
    return matchSite && matchSearch;
  });

  return (
    <Layout>
      <Head><title>קופונים בינלאומיים | קופון+</title></Head>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-badge">🌍 בינלאומי</div>
          <h1>קופונים בינלאומיים</h1>
          <p>מבצעים מ-AliExpress, Shein, Amazon, Temu ועוד — מתעדכנים אוטומטית</p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="חפש קופון בינלאומי..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SITE FILTER CHIPS */}
      <div className="chips-bar">
        <div className="chips-row">
          {INTL_SITES.map(s => (
            <div
              key={s.key}
              className={`chip${site === s.key ? ' on' : ''}`}
              onClick={() => setSite(s.key)}
            >
              {s.emoji} {s.label}
              <span className="chip-num">
                {s.key === 'all' ? coupons.length : coupons.filter(c => c.chain === s.key).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AdStrip />

      <div className="section">
        <div className="section-head">
          <div className="section-title">
            <span className="dot"></span>
            {site === 'all' ? '🌍 כל הקופונים הבינלאומיים' : `${INTL_SITES.find(s=>s.key===site)?.emoji} ${site}`}
          </div>
          <span style={{fontSize:'12px',color:'#7A6E68',fontWeight:600}}>{filtered.length} קופונים</span>
        </div>

        {filtered.length > 0 ? (
          <div className="cards-grid">
            {filtered.map(c => <CouponCard key={c.id} coupon={c} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <h3>קופונים בינלאומיים יתווספו בקרוב</h3>
            <p>הוסף קופונים בינלאומיים לגיליון Google Sheets שלך עם שם רשת כמו AliExpress, Shein, Amazon, Temu, eBay</p>
            <div className="how-to">
              <h4>איך להוסיף קופונים בינלאומיים?</h4>
              <div className="steps">
                <div className="step"><span className="step-num">1</span><span>פתח את גיליון הקופונים שלך</span></div>
                <div className="step"><span className="step-num">2</span><span>בעמודת "רשת" כתוב: AliExpress / Shein / Amazon / Temu / eBay</span></div>
                <div className="step"><span className="step-num">3</span><span>בעמודת "קטגוריה" כתוב: בינלאומי</span></div>
                <div className="step"><span className="step-num">4</span><span>האתר יציג אותם כאן אוטומטית</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AdStrip />

      <style jsx>{`
        .hero { background: linear-gradient(135deg,#1A1A2E,#0D3B6E); padding: 48px 20px 56px; text-align: center; color: #fff; }
        .hero-inner { max-width: 700px; margin: 0 auto; }
        .hero-badge { display: inline-block; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 50px; padding: 5px 16px; font-size: 13px; font-weight: 700; margin-bottom: 16px; color: rgba(255,255,255,.8); }
        .hero h1 { font-family: 'Rubik', sans-serif; font-size: 38px; font-weight: 900; margin-bottom: 12px; }
        .hero p { font-size: 15px; color: rgba(255,255,255,.55); max-width: 500px; margin: 0 auto 24px; line-height: 1.6; }
        .hero-search { max-width: 440px; margin: 0 auto; }
        .hero-search input { width: 100%; background: rgba(255,255,255,.12); border: 2px solid rgba(255,255,255,.2); border-radius: 50px; padding: 12px 22px; font-family: 'Heebo', sans-serif; font-size: 14px; color: #fff; outline: none; transition: border-color .2s; }
        .hero-search input:focus { border-color: #fff; }
        .hero-search input::placeholder { color: rgba(255,255,255,.4); }
        .chips-bar { padding: 20px 20px 0; max-width: 1280px; margin: 0 auto; }
        .chips-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .chips-row::-webkit-scrollbar { display: none; }
        .chip { flex-shrink: 0; display: flex; align-items: center; gap: 6px; background: #fff; border: 2px solid #E8E0D8; border-radius: 50px; padding: 7px 14px; font-size: 13px; font-weight: 700; color: #1A1A2E; cursor: pointer; white-space: nowrap; transition: all .18s; }
        .chip:hover, .chip.on { background: #1A1A2E; border-color: #1A1A2E; color: #fff; }
        .chip-num { background: #F5F0EC; color: #7A6E68; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 50px; transition: all .18s; }
        .chip.on .chip-num, .chip:hover .chip-num { background: rgba(255,255,255,.15); color: rgba(255,255,255,.7); }
        .empty-state { text-align: center; padding: 48px 20px; }
        .empty-icon { font-size: 56px; margin-bottom: 16px; }
        .empty-state h3 { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: #1A1A2E; margin-bottom: 10px; }
        .empty-state p { font-size: 14px; color: #7A6E68; max-width: 500px; margin: 0 auto 28px; line-height: 1.6; }
        .how-to { background: #F5F0EC; border-radius: 16px; padding: 24px; max-width: 500px; margin: 0 auto; text-align: right; }
        .how-to h4 { font-size: 15px; font-weight: 800; color: #1A1A2E; margin-bottom: 16px; }
        .steps { display: flex; flex-direction: column; gap: 10px; }
        .step { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #1A1A2E; }
        .step-num { width: 28px; height: 28px; background: #E8321A; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; flex-shrink: 0; }
        @media (max-width: 600px) {
          .hero { padding: 32px 16px 40px; }
          .hero h1 { font-size: 26px; }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps() {
  const all = await getCoupons();
  // Filter only international coupons (category === 'בינלאומי' OR chain is international site)
  const intlSites = ['AliExpress','Shein','Amazon','eBay','Temu','ASOS','Zara','H&M'];
  const coupons = all.filter(c =>
    c.category === 'בינלאומי' ||
    intlSites.some(s => c.chain && c.chain.includes(s))
  );
  return { props: { coupons }, revalidate: 3600 };
}
