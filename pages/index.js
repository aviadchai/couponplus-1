import Head from 'next/head';
import { useState } from 'react';
import { getCoupons, getSlides } from '../lib/sheets';
import Layout from '../components/Layout';
import CouponCard from '../components/CouponCard';
import HeroSlider from '../components/HeroSlider';
import ChainIcon from '../components/ChainIcon';

const CATEGORIES = [
  { key: 'all',              label: '🛒 הכל' },
  { key: 'hot',              label: '🔥 חמים עכשיו' },
  { key: 'סופרמרקט',         label: '🛍️ סופרמרקט' },
  { key: 'פארם ובריאות',     label: '💊 פארם' },
  { key: 'טיפוח וקוסמטיקה', label: '💄 טיפוח' },
  { key: 'טואלטיקה',         label: '🧴 טואלטיקה' },
  { key: 'אלקטרוניקה',       label: '📱 אלקטרוניקה' },
  { key: 'בית ומטבח',        label: '🏠 בית ומטבח' },
  { key: 'אופנה',            label: '👗 אופנה' },
  { key: 'חיות מחמד',        label: '🐾 חיות מחמד' },
];

// Supermarket chains — any coupon whose chain matches one of these shows in the super section
const SUPER_CHAINS = [
  { name: 'רמי לוי',    color: '#D42B0F' },
  { name: 'שופרסל',     color: '#D42B0F' },
  { name: 'מגה',        color: '#22A05A' },
  { name: 'ויקטורי',    color: '#FF7A00' },
  { name: 'יינות ביתן', color: '#7B1FA2' },
  { name: 'חצי חינם',   color: '#D42B0F' },
  { name: 'יוחננוף',    color: '#0288D1' },
  { name: 'אושר עד',    color: '#388E3C' },
];

export default function Home({ coupons, slides }) {
  const [search,       setSearch]       = useState('');
  const [activeCat,    setActiveCat]    = useState('all');
  const [activeSuper,  setActiveSuper]  = useState(null); // selected supermarket chain

  // Main grid filter
  const filtered = coupons.filter(c => {
    const ms = !search || c.name.includes(search) || c.chain.includes(search) || (c.code && c.code.includes(search));
    const mc = activeCat === 'all' ? true : activeCat === 'hot' ? c.badge === 'חם' : c.category === activeCat;
    return ms && mc;
  });

  // Super section: ALL supermarket coupons (regardless of badge or expiry)
  const superNames   = SUPER_CHAINS.map(s => s.name);
  const superCoupons = coupons.filter(c => superNames.includes(c.chain) || c.category === 'סופרמרקט');
  const superFiltered = activeSuper
    ? superCoupons.filter(c => c.chain === activeSuper)
    : superCoupons.slice(0, 8);

  const superLabel = activeSuper
    ? `🔥 הקופונים של ${activeSuper}`
    : '🔥 החמים ביותר בסופר';

  const catLabel = search
    ? `תוצאות עבור "${search}"`
    : (CATEGORIES.find(c => c.key === activeCat)?.label || 'הכל');

  function catCount(key) {
    if (key === 'all') return coupons.length;
    if (key === 'hot') return coupons.filter(c => c.badge === 'חם').length;
    return coupons.filter(c => c.category === key).length;
  }

  // Which chains actually have coupons
  const availableSupers = SUPER_CHAINS.filter(s =>
    coupons.some(c => c.chain === s.name || c.category === 'סופרמרקט')
  );

  return (
    <Layout>
      <Head>
        <title>קופון+ | כל הקופונים והמבצעים במקום אחד</title>
        <meta name="description" content="אלפי קופונים ומבצעים מכל הרשתות הגדולות" />
      </Head>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">✂ <span>מתעדכן כל שעה</span></div>
            <h1>חסכו יותר<br />בכל <em>קנייה בסופר</em></h1>
            <p className="hero-sub">אלפי מבצעים וקופונים מכל הרשתות — במקום אחד.</p>
            <a href="#super" className="hero-cta">🛒 קופונים לעגלה</a>
            <div className="hero-stats">
              <div className="hstat"><strong>{coupons.length}+</strong><span>מבצעים</span></div>
              <div className="hstat"><strong>{[...new Set(coupons.map(c=>c.chain))].length}</strong><span>רשתות</span></div>
              <div className="hstat"><strong>{coupons.filter(c=>c.badge==='חם').length}</strong><span>חמים</span></div>
            </div>
          </div>

          {/* GLASSMORPHIC SUPER PICKER */}
          <div className="hero-glass" id="super">
            <div className="hg-header">
              <div className="hg-icon">🛒</div>
              <div>
                <div className="hg-title">קופונים ישירות לעגלה</div>
                <div className="hg-sub">בחר סופרמרקט לקופונים שלו</div>
              </div>
            </div>
            <div className="hg-grid">
              {SUPER_CHAINS.map(s => {
                const count = coupons.filter(c => c.chain === s.name).length;
                const isActive = activeSuper === s.name;
                return (
                  <button
                    key={s.name}
                    className={`hg-btn${isActive ? ' active' : ''}${count === 0 ? ' empty' : ''}`}
                    style={{ '--chain-color': s.color }}
                    onClick={() => {
                      setActiveSuper(isActive ? null : s.name);
                      document.getElementById('super-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <ChainIcon chain={s.name} size={28} />
                    <div className="hg-btn-text">
                      <span className="hg-btn-name">{s.name}</span>
                      <span className="hg-btn-count">{count > 0 ? `${count} קופונים` : 'בקרוב'}</span>
                    </div>
                    {isActive && <span className="hg-check">✓</span>}
                  </button>
                );
              })}
            </div>
            {activeSuper && (
              <button className="hg-clear" onClick={() => setActiveSuper(null)}>
                ✕ הצג הכל
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ SUPER RESULTS ══ */}
      <div className="super-section" id="super-results">
        <div className="super-head">
          <div className="super-title">
            <span className="super-bar"></span>
            {superLabel}
          </div>
          <span className="super-count">{superFiltered.length} קופונים</span>
        </div>
        {superFiltered.length > 0 ? (
          <div className="super-grid">
            {superFiltered.map(c => (
              <div key={c.id} className="pg-cell"><CouponCard coupon={c} /></div>
            ))}
          </div>
        ) : (
          <div className="super-empty">
            <span>🛒</span>
            <p>אין עדיין קופונים ל{activeSuper} — יתווספו בקרוב!</p>
          </div>
        )}
      </div>

      {/* ══ HERO SLIDER ══ */}
      <HeroSlider slides={slides} />

      {/* ══ AD ══ */}
      <div className="pg-ad-wrap">
        <div className="pg-ad"><span className="pg-ad-tag">פרסומת</span><span>🎯</span><b>Google Ads — 728×90</b></div>
      </div>

      {/* ══ CHIPS ══ */}
      <div className="pg-chips" id="coupons">
        <div className="chips-scroll">
          {CATEGORIES.map(cat => (
            <button key={cat.key} className={`chip${activeCat === cat.key ? ' on' : ''}`} onClick={() => setActiveCat(cat.key)}>
              {cat.label} <span className="chip-n">{catCount(cat.key)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ MAIN GRID ══ */}
      <div className="pg-section">
        <div className="pg-head">
          <div className="pg-title"><span className="pg-bar"></span>{catLabel}</div>
          <span className="pg-count">{filtered.length} קופונים</span>
        </div>
        <div className="pg-grid">
          {filtered.map(c => (
            <div key={c.id} className="pg-cell"><CouponCard coupon={c} /></div>
          ))}
          {filtered.length === 0 && <p className="pg-empty">לא נמצאו קופונים</p>}
        </div>
      </div>

      {/* ══ AD BOTTOM ══ */}
      <div className="pg-ad-wrap">
        <div className="pg-ad"><span className="pg-ad-tag">פרסומת</span><span>🎯</span><b>Google Ads — 728×90</b></div>
      </div>

      <style jsx>{`
        /* ── HERO ── */
        .hero { background: linear-gradient(135deg,#1A1A2E 0%,#2D1B4E 60%,#1A1A2E 100%); padding: 48px 40px 56px; position: relative; overflow: hidden; }
        .hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 15% 60%,rgba(232,50,26,.18),transparent 55%); pointer-events:none; }
        .hero::after  { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 80% 20%,rgba(100,60,200,.12),transparent 50%); pointer-events:none; }
        .hero-inner { max-width:1280px; margin:0 auto; position:relative; display:flex; align-items:center; gap:48px; }
        .hero-copy { flex:1; min-width:0; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); border-radius:50px; padding:5px 16px; font-size:12px; font-weight:700; color:rgba(255,255,255,.65); margin-bottom:16px; }
        .hero-badge span { color:#FF5A3D; }
        .hero h1 { font-family:'Rubik',sans-serif; font-size:46px; font-weight:900; color:#fff; line-height:1.1; margin-bottom:14px; }
        .hero h1 em { color:#FF5A3D; font-style:normal; }
        .hero-sub { font-size:16px; color:rgba(255,255,255,.5); line-height:1.6; max-width:400px; margin-bottom:28px; }
        .hero-cta { display:inline-flex; align-items:center; gap:8px; background:#E8321A; color:#fff; border-radius:50px; padding:13px 28px; font-size:15px; font-weight:800; box-shadow:0 6px 20px rgba(232,50,26,.35); transition:all .2s; font-family:'Heebo',sans-serif; }
        .hero-cta:hover { background:#FF5A3D; transform:translateY(-2px); }
        .hero-stats { display:flex; gap:32px; margin-top:28px; }
        .hstat strong { font-family:'Rubik',sans-serif; font-size:28px; font-weight:900; color:#fff; display:block; }
        .hstat span { font-size:11px; color:rgba(255,255,255,.35); }

        /* ── GLASSMORPHIC SUPER PICKER ── */
        .hero-glass {
          background: rgba(255,255,255,.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 24px;
          padding: 22px;
          min-width: 320px;
          flex-shrink: 0;
          box-shadow: 0 8px 32px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.1);
        }
        .hg-header { display:flex; align-items:center; gap:12px; margin-bottom:18px; }
        .hg-icon { font-size:28px; line-height:1; }
        .hg-title { font-family:'Rubik',sans-serif; font-size:15px; font-weight:900; color:#fff; }
        .hg-sub { font-size:11px; color:rgba(255,255,255,.4); margin-top:2px; }
        .hg-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .hg-btn {
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px;
          padding: 10px 12px;
          text-align:right;
          cursor:pointer;
          transition: all .2s;
          position: relative;
          font-family:'Heebo',sans-serif;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hg-btn-text { display:flex; flex-direction:column; align-items:flex-start; flex:1; min-width:0; }
        .hg-btn:hover:not(.empty) {
          background: color-mix(in srgb, var(--chain-color) 25%, rgba(255,255,255,.1));
          border-color: var(--chain-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,.2);
        }
        .hg-btn.active {
          background: color-mix(in srgb, var(--chain-color) 35%, rgba(0,0,0,.2));
          border-color: var(--chain-color);
          box-shadow: 0 0 0 2px var(--chain-color), 0 4px 16px rgba(0,0,0,.2);
        }
        .hg-btn.empty { opacity:.4; cursor:default; }
        .hg-btn-name { font-size:13px; font-weight:800; color:#fff; display:block; line-height:1.2; }
        .hg-btn-count { font-size:10px; color:rgba(255,255,255,.4); margin-top:3px; display:block; }
        .hg-btn.active .hg-btn-count { color:rgba(255,255,255,.7); }
        .hg-check { position:absolute; top:7px; left:9px; font-size:11px; color:#fff; background:rgba(255,255,255,.2); border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; font-weight:900; }
        .hg-clear { margin-top:12px; width:100%; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); border-radius:10px; padding:8px; font-size:12px; font-weight:700; color:rgba(255,255,255,.6); cursor:pointer; transition:all .18s; font-family:'Heebo',sans-serif; }
        .hg-clear:hover { background:rgba(255,255,255,.14); color:#fff; }

        /* ── SUPER RESULTS SECTION ── */
        .super-section { padding:28px 20px 32px; max-width:1280px; margin:0 auto; }
        .super-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .super-title { font-family:'Rubik',sans-serif; font-size:22px; font-weight:900; color:#1A1A2E; display:flex; align-items:center; gap:10px; }
        .super-bar { width:6px; height:26px; background:linear-gradient(180deg,#E8321A,#FF5A3D); border-radius:3px; display:block; flex-shrink:0; }
        .super-count { font-size:12px; color:#7A6E68; font-weight:600; }
        .super-empty { text-align:center; padding:32px; color:#7A6E68; }
        .super-empty span { font-size:40px; display:block; margin-bottom:10px; }
        .super-empty p { font-size:15px; }

        /* ── AD ── */
        .pg-ad-wrap { padding:10px 20px; max-width:1280px; margin:0 auto; }
        .pg-ad { background:#F0F4FF; border:1.5px dashed #C0CFEA; border-radius:10px; padding:14px 20px; display:flex; align-items:center; justify-content:center; gap:10px; position:relative; font-size:13px; color:#536070; }
        .pg-ad-tag { position:absolute; top:5px; right:10px; background:#C0CFEA; color:#536070; font-size:9px; font-weight:800; text-transform:uppercase; padding:1px 5px; border-radius:3px; }

        /* ── CHIPS ── */
        .pg-chips { padding:20px 40px 0; max-width:1280px; margin:0 auto; }
        .chips-scroll { display:flex; gap:8px; overflow-x:auto; padding-bottom:6px; scrollbar-width:none; }
        .chips-scroll::-webkit-scrollbar { display:none; }
        .chip { flex-shrink:0; display:flex; align-items:center; gap:6px; background:#fff; border:2px solid #E8E0D8; border-radius:50px; padding:7px 14px; font-size:13px; font-weight:700; color:#1A1A2E; cursor:pointer; white-space:nowrap; transition:all .18s; font-family:'Heebo',sans-serif; }
        .chip:hover,.chip.on { background:#1A1A2E; border-color:#1A1A2E; color:#fff; }
        .chip-n { background:#F5F0EC; color:#7A6E68; font-size:11px; font-weight:700; padding:1px 7px; border-radius:50px; transition:all .18s; }
        .chip.on .chip-n,.chip:hover .chip-n { background:rgba(255,255,255,.15); color:rgba(255,255,255,.7); }

        /* ── SUPER GRID ── */
        .super-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(210px, 1fr)); gap:16px; }

        /* ── MAIN GRID ── */
        .pg-section { padding:24px 20px 32px; max-width:1280px; margin:0 auto; }
        .pg-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .pg-title { font-family:'Rubik',sans-serif; font-size:20px; font-weight:900; color:#1A1A2E; display:flex; align-items:center; gap:10px; }
        .pg-bar { width:6px; height:24px; background:#E8321A; border-radius:3px; display:block; flex-shrink:0; }
        .pg-count { font-size:12px; color:#7A6E68; font-weight:600; }
        .pg-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(210px, 1fr)); gap:16px; }
        .pg-cell { display:flex; flex-direction:column; min-width:0; }
        .pg-empty { text-align:center; color:#7A6E68; padding:48px; font-size:16px; grid-column:1/-1; }

        /* ── RESPONSIVE ── */
        @media (max-width:960px) { .hero-glass { display:none; } .hero h1 { font-size:36px; } }
        @media (max-width:600px) {
          .hero { padding:32px 16px 40px; }
          .hero h1 { font-size:28px; }
          .hero-stats { gap:20px; }
          .hstat strong { font-size:22px; }
          .super-section { padding:20px 0 24px; }
          .super-head { padding:0 16px; }
          .super-title { font-size:18px; }
          .pg-chips { padding:16px 16px 0; }
          .pg-section { padding:16px 0 28px; }
          .pg-head { padding:0 16px; }
          .pg-ad-wrap { padding:8px 16px; }
          .super-grid, .pg-grid {
            display:flex;
            flex-direction:row;
            overflow-x:auto;
            gap:12px;
            padding:4px 16px 12px;
            scrollbar-width:none;
            -webkit-overflow-scrolling:touch;
            scroll-snap-type:x mandatory;
          }
          .super-grid::-webkit-scrollbar, .pg-grid::-webkit-scrollbar { display:none; }
          .pg-cell {
            flex:0 0 72vw;
            max-width:280px;
            min-width:240px;
            scroll-snap-align:start;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps() {
  const [coupons, slides] = await Promise.all([getCoupons(), getSlides()]);
  return { props: { coupons, slides }, revalidate: 3600 };
}
