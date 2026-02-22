import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import CouponCard, { AdCard } from '../components/CouponCard';
import { getCoupons } from '../lib/sheets';

const CHAIN_COLORS = {
  'רמי לוי':    { dot: '#F5A623', bg: 'linear-gradient(135deg,#fff8e1,#fff0b3)', emoji: '🛒' },
  'שופרסל':     { dot: '#2DB86A', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', emoji: '🧴' },
  'מגה':        { dot: '#2196F3', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', emoji: '🥩' },
  'ויקטורי':    { dot: '#E53935', bg: 'linear-gradient(135deg,#ffebee,#ffcdd2)', emoji: '🥛' },
  'יינות ביתן': { dot: '#BA68C8', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)', emoji: '🍷' },
  'חצי חינם':   { dot: '#FF9800', bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)', emoji: '🏷️' },
};
const DEFAULT_CHAIN = { dot: '#E8321A', bg: 'linear-gradient(135deg,#fff0e6,#ffddd0)', emoji: '🎫' };

const CATEGORIES = [
  { key: 'all', label: '🛒 הכל', href: null },
  { key: 'hot', label: '🔥 חמים עכשיו', href: '/deals' },
  { key: 'סופרמרקט', label: '🛍️ סופרמרקט', href: '/category/סופרמרקט' },
  { key: 'פארם ובריאות', label: '💊 פארם ובריאות', href: '/category/פארם ובריאות' },
  { key: 'טיפוח וקוסמטיקה', label: '💄 טיפוח', href: '/category/טיפוח וקוסמטיקה' },
  { key: 'טואלטיקה', label: '🧴 טואלטיקה', href: '/category/טואלטיקה' },
  { key: 'אלקטרוניקה', label: '📱 אלקטרוניקה', href: '/category/אלקטרוניקה' },
  { key: 'בית ומטבח', label: '🏠 בית ומטבח', href: '/category/בית ומטבח' },
  { key: 'אופנה', label: '👗 אופנה', href: '/category/אופנה' },
  { key: 'חיות מחמד', label: '🐾 חיות מחמד', href: '/category/חיות מחמד' },
];

function ScrollRow({ coupons }) {
  const ref = useRef(null);
  const scroll = dir => ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  return (
    <div className="scroll-container">
      <button className="arr arr-r" onClick={() => scroll(-1)}>‹</button>
      <div className="scroll-row" ref={ref}>
        {coupons.map((c, i) => (
          <div key={c.id} style={{ flexShrink: 0, width: 250 }}>
            <CouponCard coupon={c} />
          </div>
        ))}
        <div style={{ flexShrink: 0, width: 250 }}><AdCard /></div>
      </div>
      <button className="arr arr-l" onClick={() => scroll(1)}>›</button>
    </div>
  );
}

export default function Home({ coupons }) {
  const [search, setSearch] = useState('');
  const activeCoupons = coupons.filter(c => !c.expired);
  const hotCoupons = activeCoupons.filter(c => c.badge === 'חם');
  const pharmCoupons = activeCoupons.filter(c => ['פארם ובריאות','טיפוח וקוסמטיקה'].includes(c.category));
  const chains = [...new Set(activeCoupons.map(c => c.chain))];
  const searchResults = search ? coupons.filter(c => c.name.includes(search) || c.chain.includes(search) || (c.code && c.code.includes(search))) : [];

  return (
    <Layout>
      <Head>
        <title>קופון+ | כל הקופונים והמבצעים במקום אחד</title>
        <meta name="description" content="אלפי קופונים ומבצעים מכל הרשתות הגדולות" />
      </Head>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">✂ <span>מתעדכן כל יום</span></div>
            <h1>חסכו יותר<br />בכל <em>קנייה</em></h1>
            <p className="hero-sub">אלפי מבצעים וקופונים מכל הרשתות הגדולות.</p>
            <div className="hero-search">
              <input type="text" placeholder="חפש קופון, מוצר, או רשת..." value={search} onChange={e => setSearch(e.target.value)} />
              <span className="hs-ico">🔍</span>
            </div>
            <div className="hero-stats">
              <div className="hstat"><strong>{coupons.length}</strong><span>מבצעים</span></div>
              <div className="hstat"><strong>{chains.length}</strong><span>רשתות</span></div>
              <div className="hstat"><strong>{hotCoupons.length}</strong><span>חמים עכשיו</span></div>
            </div>
          </div>
          <div className="hero-chains">
            <div className="hc-title">בחר רשת</div>
            <div className="hc-grid">
              {chains.slice(0, 6).map((chain, i) => {
                const ch = CHAIN_COLORS[chain] || DEFAULT_CHAIN;
                return (
                  <Link href={`/category/${chain}`} key={chain} className={`hc-btn hc-${i}`}>
                    <span>{ch.emoji}</span>
                    <span className="hc-name">{chain}</span>
                    <span className="hc-count">{activeCoupons.filter(c => c.chain === chain).length}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {search && (
        <div className="section">
          <div className="section-head">
            <div className="section-title"><span className="dot" />תוצאות עבור &ldquo;{search}&rdquo;</div>
          </div>
          {searchResults.length === 0
            ? <p className="no-results">לא נמצאו קופונים</p>
            : <div className="cards-grid">{searchResults.map(c => <CouponCard key={c.id} coupon={c} />)}</div>
          }
        </div>
      )}

      {!search && (
        <div className="chips-section" id="coupons">
          <div className="chips-row">
            {CATEGORIES.map(cat => (
              cat.href
                ? <Link key={cat.key} href={cat.href} className="chip">
                    {cat.label}<span className="chip-num">{cat.key === 'hot' ? hotCoupons.length : coupons.filter(c => c.category === cat.key).length}</span>
                  </Link>
                : <div key={cat.key} className="chip on">{cat.label}<span className="chip-num">{coupons.length}</span></div>
            ))}
          </div>
        </div>
      )}

      {!search && (
        <div className="section">
          <div className="section-head">
            <div className="section-title"><span className="dot" />🔥 חמים עכשיו</div>
            <Link href="/deals" className="see-all">לכל המבצעים →</Link>
          </div>
          <ScrollRow coupons={hotCoupons.length ? hotCoupons : activeCoupons.slice(0, 6)} />
        </div>
      )}

      {!search && (
        <div className="ad-strip-wrap">
          <div className="ad-strip"><div className="ad-label">פרסומת</div><div className="ad-placeholder">Google Ads — 728×90</div></div>
        </div>
      )}

      {!search && chains.length > 0 && (
        <div className="section">
          <div className="section-head">
            <div className="section-title"><span className="dot" />🏪 מבצעי שבוע לפי רשת</div>
            <Link href="/deals" className="see-all">כל הרשתות →</Link>
          </div>
          <div className="promo-grid">
            {chains.slice(0, 3).map((chain, i) => {
              const ch = CHAIN_COLORS[chain] || DEFAULT_CHAIN;
              return (
                <Link href={`/category/${chain}`} key={chain} className="promo-card">
                  <div className="promo-bg" style={{ background: ch.bg }}>{ch.emoji}</div>
                  <div className="promo-overlay" />
                  <div className="promo-content">
                    <div className="promo-chain">{chain}</div>
                    <div className="promo-title">מבצעי השבוע</div>
                    <div className="promo-btn">לפרטים נוספים →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {!search && pharmCoupons.length > 0 && (
        <div className="pharm-bg">
          <div className="section">
            <div className="section-head">
              <div className="section-title"><span className="dot" />💊 פארם וקוסמטיקה</div>
              <Link href="/pharm" className="see-all">לכל מבצעי הפארם →</Link>
            </div>
            <ScrollRow coupons={pharmCoupons.slice(0, 8)} />
          </div>
        </div>
      )}

      {!search && (
        <div className="ad-strip-wrap">
          <div className="ad-strip"><div className="ad-label">פרסומת</div><div className="ad-placeholder">Google Ads — 728×90</div></div>
        </div>
      )}

      <style jsx>{`
        .hero{background:linear-gradient(135deg,#1A1A2E 0%,#2D1B4E 55%,#1A1A2E 100%);padding:52px 24px 68px;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(232,50,26,.22) 0%,transparent 55%)}
        .hero-inner{max-width:1280px;margin:0 auto;position:relative;display:flex;align-items:center;gap:56px}
        .hero-copy{flex:1}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:50px;padding:6px 18px;font-size:12px;font-weight:700;color:rgba(255,255,255,.6);margin-bottom:18px}
        .hero-badge span{color:#FF5A3D}
        .hero-copy h1{font-family:'Rubik',sans-serif;font-size:50px;font-weight:900;color:#fff;line-height:1.1;margin-bottom:14px}
        .hero-copy h1 em{color:#FF5A3D;font-style:normal}
        .hero-sub{font-size:16px;color:rgba(255,255,255,.45);line-height:1.7;max-width:400px;margin-bottom:24px}
        .hero-search{position:relative;max-width:420px;margin-bottom:28px}
        .hero-search input{width:100%;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.15);border-radius:50px;padding:13px 20px 13px 48px;font-family:'Heebo',sans-serif;font-size:15px;color:#fff;outline:none;transition:all .2s}
        .hero-search input::placeholder{color:rgba(255,255,255,.35)}
        .hero-search input:focus{background:rgba(255,255,255,.15);border-color:rgba(255,90,61,.6)}
        .hs-ico{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:17px;opacity:.4}
        .hero-stats{display:flex;gap:36px}
        .hstat strong{font-family:'Rubik',sans-serif;font-size:30px;font-weight:900;color:#fff;display:block}
        .hstat span{font-size:11px;color:rgba(255,255,255,.35)}
        .hero-chains{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:20px;min-width:270px;flex-shrink:0}
        .hc-title{font-size:10px;font-weight:800;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}
        .hc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .hc-btn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:11px 10px;text-align:center;transition:all .2s;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px}
        .hc-btn:hover{transform:scale(1.03)}
        .hc-0:hover{background:#F5A623;border-color:#F5A623}.hc-1:hover{background:#2DB86A;border-color:#2DB86A}
        .hc-2:hover{background:#1565C0;border-color:#1565C0}.hc-3:hover{background:#E53935;border-color:#E53935}
        .hc-4:hover{background:#7B1FA2;border-color:#7B1FA2}.hc-5:hover{background:#FF6F00;border-color:#FF6F00}
        .hc-name{font-size:12px;font-weight:700;color:#fff}
        .hc-count{font-size:10px;color:rgba(255,255,255,.3)}
        .chips-section{padding:20px 24px 0;max-width:1280px;margin:0 auto}
        .chips-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
        .chips-row::-webkit-scrollbar{display:none}
        .chip{flex-shrink:0;display:flex;align-items:center;gap:7px;background:#fff;border:2px solid #E8E0D8;border-radius:50px;padding:7px 16px;font-size:13px;font-weight:700;color:#1A1A2E;transition:all .18s;cursor:pointer;white-space:nowrap}
        .chip:hover,.chip.on{background:#1A1A2E;border-color:#1A1A2E;color:#fff;transform:translateY(-2px)}
        .chip-num{background:#F5F0EC;color:#7A6E68;font-size:11px;font-weight:700;padding:2px 7px;border-radius:50px}
        .chip:hover .chip-num,.chip.on .chip-num{background:rgba(255,255,255,.15);color:rgba(255,255,255,.7)}
        .section{padding:36px 24px;max-width:1280px;margin:0 auto}
        .section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
        .section-title{font-family:'Rubik',sans-serif;font-size:21px;font-weight:900;color:#1A1A2E;display:flex;align-items:center;gap:10px}
        .dot{width:7px;height:26px;background:#E8321A;border-radius:4px;display:block;flex-shrink:0}
        .see-all{font-size:13px;font-weight:700;color:#E8321A}
        .see-all:hover{text-decoration:underline}
        .scroll-container{position:relative;overflow:visible}
        .scroll-row{display:flex;gap:14px;overflow-x:auto;overflow-y:visible;padding:10px 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .scroll-row::-webkit-scrollbar{display:none}
        .arr{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:38px;background:#fff;border:1.5px solid #E8E0D8;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.1);z-index:10;transition:all .2s}
        .arr:hover{background:#E8321A;color:#fff;border-color:#E8321A}
        .arr-r{right:-18px}.arr-l{left:-18px}
        .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}
        .no-results{text-align:center;color:#7A6E68;padding:40px;font-size:18px}
        .promo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .promo-card{border-radius:20px;overflow:hidden;position:relative;cursor:pointer;height:230px;transition:transform .25s,box-shadow .25s;display:block}
        .promo-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.18)}
        .promo-bg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px}
        .promo-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%)}
        .promo-content{position:absolute;bottom:14px;right:14px;left:14px}
        .promo-chain{font-size:13px;font-weight:900;color:rgba(255,255,255,.95);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;text-shadow:0 1px 4px rgba(0,0,0,.4)}
        .promo-title{font-family:'Rubik',sans-serif;font-size:17px;font-weight:900;color:#fff;margin-bottom:8px}
        .promo-btn{display:inline-block;background:#E8321A;color:#fff;font-size:13px;font-weight:800;padding:6px 14px;border-radius:8px}
        .pharm-bg{background:#FFF0E6;padding:4px 0}
        .ad-strip-wrap{padding:0 24px;max-width:1280px;margin:0 auto 8px}
        .ad-strip{background:#F0F4FF;border:1.5px dashed #C0CFEA;border-radius:14px;padding:16px 24px;text-align:center;position:relative}
        .ad-label{position:absolute;top:8px;left:12px;background:#C0CFEA;color:#536070;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;padding:2px 7px;border-radius:4px}
        .ad-placeholder{font-size:13px;color:#536070;padding-top:4px}
        @media(max-width:768px){
          .hero{padding:28px 16px 40px}
          .hero-inner{flex-direction:column;gap:24px}
          .hero-copy h1{font-size:28px}
          .hero-sub{font-size:14px;margin-bottom:16px}
          .hero-search{max-width:100%}
          .hero-stats{gap:16px}
          .hstat strong{font-size:20px}
          .hero-chains{width:100%;min-width:unset}
          .hc-grid{grid-template-columns:repeat(3,1fr)}
          .chips-section{padding:14px 16px 0}
          .section{padding:20px 16px}
          .section-title{font-size:17px}
          .promo-grid{grid-template-columns:1fr;gap:10px}
          .promo-card{height:150px}
          .cards-grid{grid-template-columns:repeat(2,1fr);gap:10px}
          .scroll-row{margin:0 -16px;padding:10px 16px}
          .arr{display:none}
          .ad-strip-wrap{padding:0 16px}
        }
        @media(max-width:400px){
          .cards-grid{grid-template-columns:1fr}
          .hc-grid{grid-template-columns:repeat(2,1fr)}
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps() {
  const coupons = await getCoupons();
  return { props: { coupons }, revalidate: 60 };
}
