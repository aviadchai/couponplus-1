import { getCoupons } from '../lib/notion';
import Head from 'next/head';
import { useState } from 'react';

export async function getStaticProps() {
  const coupons = await getCoupons();
  return {
    props: { coupons },
    revalidate: 300, // rebuild every 5 minutes
  };
}

const CHAIN_COLORS = {
  'רמי לוי':    { strip: 'linear-gradient(90deg,#E8A020,#F5C842)', dot: '#F5A623', bg: 'linear-gradient(135deg,#fff8e1,#fff0b3)', emoji: '🛒' },
  'שופרסל':     { strip: 'linear-gradient(90deg,#2DB86A,#4AD888)', dot: '#2DB86A', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', emoji: '🧴' },
  'מגה':        { strip: 'linear-gradient(90deg,#1565C0,#42A5F5)', dot: '#2196F3', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', emoji: '🏪' },
  'ויקטורי':    { strip: 'linear-gradient(90deg,#E53935,#EF9A9A)', dot: '#E53935', bg: 'linear-gradient(135deg,#ffebee,#ffcdd2)', emoji: '🛍️' },
  'יינות ביתן': { strip: 'linear-gradient(90deg,#7B1FA2,#CE93D8)', dot: '#BA68C8', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)', emoji: '🍷' },
  'חצי חינם':   { strip: 'linear-gradient(90deg,#F57C00,#FFB74D)', dot: '#FF9800', bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)', emoji: '🏷️' },
  'KSP':        { strip: 'linear-gradient(90deg,#1565C0,#42A5F5)', dot: '#2196F3', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', emoji: '💻' },
  'issta':      { strip: 'linear-gradient(90deg,#0AAFA5,#2DD4CB)', dot: '#0AAFA5', bg: 'linear-gradient(135deg,#e0f7fa,#b2ebf2)', emoji: '✈️' },
  'IKEA':       { strip: 'linear-gradient(90deg,#7B1FA2,#CE93D8)', dot: '#BA68C8', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)', emoji: '🛋️' },
};

const BADGE_STYLES = {
  'חם':      { cls: 'badge-hot', label: '🔥 חם' },
  'חדש':     { cls: 'badge-new', label: '✨ חדש' },
  'מוגבל':   { cls: 'badge-lim', label: '⚡ מוגבל' },
  'פופולרי': { cls: 'badge-pop', label: '⭐ פופולרי' },
};

function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);
  const chain = CHAIN_COLORS[coupon.chain] || { strip: 'linear-gradient(90deg,#1A56DB,#4880F0)', dot: '#1A56DB', bg: 'linear-gradient(135deg,#EBF2FF,#BFDBFE)', emoji: '🎫' };
  const badge = BADGE_STYLES[coupon.badge] || null;

  const isExpiringSoon = () => {
    if (!coupon.expiry) return false;
    const diff = new Date(coupon.expiry) - new Date();
    return diff > 0 && diff < 1000 * 60 * 60 * 48;
  };

  function copyCode() {
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="card">
      <div className="card-strip" style={{ background: chain.strip }} />
      <div className="card-img">
        {coupon.image ? (
          <img src={coupon.image} alt={coupon.name} className="card-img-real" />
        ) : (
          <div className="card-img-ph" style={{ background: chain.bg }}>
            {chain.emoji}
          </div>
        )}
        <div className="img-chain-tag">
          <div className="chain-pip" style={{ background: chain.dot }} />
          {coupon.chain}
        </div>
        {badge && <div className={`img-status ${badge.cls}`}>{badge.label}</div>}
        <div className="img-discount">{coupon.discount}</div>
      </div>
      <div className="card-body">
        <div className="card-title">{coupon.name}</div>
        <div className="ticket">
          <div className="tk-l">
            <div className="tk-amount">{coupon.discount}</div>
            <div className="tk-desc">{coupon.chain}</div>
          </div>
          <div className="tk-r">
            <span className="tk-lbl">קוד קופון</span>
            <button className="tk-code" onClick={copyCode}>
              <span className="ci">{copied ? '✅' : '📋'}</span>
              {copied ? 'הועתק!' : coupon.code}
            </button>
          </div>
        </div>
      </div>
      <div className="card-foot">
        <span className={`card-exp${isExpiringSoon() ? ' hot' : ''}`}>
          {isExpiringSoon() ? '⏰ נגמר בקרוב' : coupon.expiry ? `📅 עד ${new Date(coupon.expiry).toLocaleDateString('he-IL')}` : ''}
        </span>
        <button className="card-share">שתף 📤</button>
      </div>
    </div>
  );
}

export default function Home({ coupons }) {
  const [activeCategory, setActiveCategory] = useState('הכל');

  const categories = ['הכל', ...new Set(coupons.map(c => c.category).filter(Boolean))];
  const filtered = activeCategory === 'הכל' ? coupons : coupons.filter(c => c.category === activeCategory);

  return (
    <>
      <Head>
        <title>קופון+ | קופונים ומבצעים</title>
        <meta name="description" content="כל הקופונים והמבצעים של הרשתות הגדולות במקום אחד" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&family=Rubik:wght@700;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="top-strip">
        <div className="ts-left">
          <span className="beta-badge">Beta</span>
          <span>האתר בהרצה — <b>מבצעים אמיתיים, עדכונים יומיומיים</b> 🎉</span>
        </div>
        <div className="ts-right">
          <span>נוספו <b>{coupons.length}</b> קופונים</span>
        </div>
      </div>

      <header>
        <div className="header-inner">
          <a className="logo" href="/">
            <div className="logo-text-side">
              <span className="logo-wordmark">קופון<span className="plus">+</span></span>
            </div>
            <div className="logo-icon-side">
              <svg viewBox="0 0 24 24"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64a4 4 0 1 0-4 4c.59 0 1.14-.13 1.64-.36L9 11.28l-1.37 1.37a4 4 0 1 0 1.41 1.41L10.41 12.7 18 20.28V22H20V19.72L9.64 7.64M6 8C4.9 8 4 7.1 4 6s.9-2 2-2 2 .9 2 2-.9 2-2 2m0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2M18 6l-5 5 2 2 5-5V6h-2z"/></svg>
            </div>
          </a>
          <div className="search-bar">
            <input type="text" placeholder="חפש קופון, רשת, קטגוריה..." />
            <span className="search-ico">🔍</span>
          </div>
          <nav className="main-nav">
            <a className="nav-btn active" href="/">קופונים</a>
            <a className="nav-btn" href="/">מבצעים</a>
            <a className="nav-btn" href="/contact">צור קשר</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-eyebrow">✂ מתעדכן יומיומית</div>
            <h1>קופונים לסופר —<br /><em>חסכו בכל קנייה</em></h1>
            <p className="hero-sub">אלפי קופונים עם קודים לכל הרשתות הגדולות. מצאו, העתיקו והזינו בקופה.</p>
            <div className="hero-stats">
              <div className="hstat"><strong>{coupons.length}+</strong><span>קופונים פעילים</span></div>
              <div className="hstat"><strong>{categories.length - 1}</strong><span>קטגוריות</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="content-strip">
        <div className="content-strip-inner">
          <span className="count-txt">מציג <b>{filtered.length}</b> קופונים פעילים</span>
        </div>
      </div>

      <div className="main-wrap">
        <div>
          <div className="chip-row">
            {categories.map(cat => (
              <button key={cat} className={`chip${activeCategory === cat ? ' on' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="sec-head">
            <div className="sec-title">כל הקופונים</div>
          </div>

          <div className="cards-grid">
            {filtered.map(coupon => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-inner">
          <div className="fb-logo">קופון<span>+</span></div>
          <p>כל הקופונים והמבצעים במקום אחד</p>
          <div className="footer-links">
            <a href="/privacy">מדיניות פרטיות</a>
            <a href="/terms">תנאי שימוש</a>
            <a href="/contact">צור קשר</a>
          </div>
          <div className="footer-copy">© 2025 קופון+ — כל הזכויות שמורות</div>
        </div>
      </footer>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; width: 100%; }
        body { font-family: 'Heebo', sans-serif; background: #F4F6F9; color: #0C1F3A; direction: rtl; }
        a { text-decoration: none; }
        button { font-family: 'Heebo', sans-serif; cursor: pointer; border: none; background: none; }

        .top-strip { background: #0C1F3A; height: 40px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; gap: 16px; }
        .ts-left { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,.5); }
        .ts-left b { color: #CCFF00; }
        .beta-badge { background: #CCFF00; color: #0C1F3A; font-family: 'Rubik', sans-serif; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 4px; letter-spacing: .8px; text-transform: uppercase; }
        .ts-right { font-size: 12px; color: rgba(255,255,255,.42); }
        .ts-right b { color: rgba(255,255,255,.78); }

        header { background: #fff; border-bottom: 2px solid #D5DCE8; position: sticky; top: 0; z-index: 300; box-shadow: 0 1px 4px rgba(12,31,58,.06); }
        .header-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 66px; display: flex; align-items: center; gap: 20px; }

        .logo { display: flex; align-items: stretch; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(12,31,58,.14); height: 44px; flex-shrink: 0; }
        .logo-text-side { background: #0C1F3A; display: flex; align-items: center; padding: 0 14px 0 0; position: relative; }
        .logo-text-side::after { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; border-left: 2px dashed rgba(255,255,255,.22); }
        .logo-wordmark { font-family: 'Rubik', sans-serif; font-size: 20px; font-weight: 900; color: #fff; padding: 0 14px 0 12px; white-space: nowrap; line-height: 1; }
        .logo-wordmark .plus { color: #CCFF00; }
        .logo-icon-side { background: #CCFF00; width: 44px; display: flex; align-items: center; justify-content: center; }
        .logo-icon-side svg { width: 22px; height: 22px; fill: #0C1F3A; }

        .search-bar { flex: 1; max-width: 400px; position: relative; }
        .search-bar input { width: 100%; background: #EAEEF4; border: 1.5px solid #D5DCE8; border-radius: 50px; padding: 10px 18px 10px 44px; font-family: 'Heebo', sans-serif; font-size: 14px; color: #0C1F3A; outline: none; }
        .search-bar input:focus { border-color: #1A56DB; background: #fff; }
        .search-ico { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); font-size: 15px; opacity: .3; pointer-events: none; }

        .main-nav { display: flex; gap: 2px; margin-right: auto; }
        .nav-btn { padding: 7px 13px; border-radius: 8px; font-size: 13.5px; font-weight: 600; color: #536070; transition: background .18s, color .18s; white-space: nowrap; display: inline-block; }
        .nav-btn:hover { background: #0C1F3A; color: #fff; }
        .nav-btn.active { background: #1A56DB; color: #fff; }

        .hero { background: linear-gradient(148deg, #0C1F3A 0%, #0E2648 50%, #13315F 100%); padding: 52px 24px 64px; }
        .hero-layout { max-width: 1200px; margin: 0 auto; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 7px; background: rgba(204,255,0,.10); border: 1px solid rgba(204,255,0,.28); border-radius: 50px; padding: 5px 16px; font-size: 11px; font-weight: 700; color: #CCFF00; margin-bottom: 18px; letter-spacing: .5px; text-transform: uppercase; }
        .hero h1 { font-family: 'Rubik', sans-serif; font-size: 46px; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 14px; }
        .hero h1 em { color: #6DB8FF; font-style: normal; }
        .hero-sub { font-size: 16px; color: rgba(255,255,255,.5); line-height: 1.65; margin-bottom: 36px; max-width: 440px; }
        .hero-stats { display: flex; gap: 32px; }
        .hstat strong { font-family: 'Rubik', sans-serif; font-size: 30px; font-weight: 900; color: #fff; display: block; line-height: 1; }
        .hstat span { font-size: 11.5px; color: rgba(255,255,255,.36); display: block; margin-top: 3px; }

        .content-strip { background: #fff; border-bottom: 1px solid #D5DCE8; padding: 10px 24px; }
        .content-strip-inner { max-width: 1200px; margin: 0 auto; }
        .count-txt { font-size: 12.5px; color: #536070; }
        .count-txt b { color: #0C1F3A; }

        .main-wrap { max-width: 1200px; margin: 0 auto; padding: 28px 24px 64px; }

        .chip-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; margin-bottom: 28px; }
        .chip-row::-webkit-scrollbar { display: none; }
        .chip { flex-shrink: 0; background: #fff; border: 1.5px solid #D5DCE8; border-radius: 50px; padding: 7px 15px; font-size: 13px; font-weight: 700; color: #0C1F3A; transition: all .18s; white-space: nowrap; }
        .chip:hover, .chip.on { background: #0C1F3A; border-color: #0C1F3A; color: #fff; transform: translateY(-1px); }

        .sec-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .sec-title { font-family: 'Rubik', sans-serif; font-size: 18px; font-weight: 800; color: #0C1F3A; display: flex; align-items: center; gap: 10px; }
        .sec-title::before { content: ''; display: block; width: 4px; height: 20px; background: #CCFF00; border-radius: 2px; }

        .cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        .card { background: #fff; border-radius: 18px; border: 1.5px solid #D5DCE8; box-shadow: 0 2px 8px rgba(12,31,58,.09); overflow: hidden; transition: transform .22s, box-shadow .22s, border-color .22s; cursor: pointer; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(12,31,58,.17); border-color: #1A56DB; }
        .card-strip { height: 5px; width: 100%; flex-shrink: 0; }

        .card-img { width: 100%; height: 148px; position: relative; overflow: hidden; flex-shrink: 0; }
        .card-img-real { width: 100%; height: 100%; object-fit: cover; }
        .card-img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 52px; user-select: none; }

        .img-chain-tag { position: absolute; top: 10px; right: 12px; background: rgba(12,31,58,.76); color: #fff; font-size: 10.5px; font-weight: 800; padding: 3px 9px; border-radius: 20px; display: flex; align-items: center; gap: 5px; text-transform: uppercase; }
        .chain-pip { width: 6px; height: 6px; border-radius: 50%; }
        .img-status { position: absolute; top: 10px; left: 12px; font-size: 9.5px; font-weight: 800; padding: 3px 8px; border-radius: 20px; }
        .badge-hot { background: #FFF0ED; color: #D94020; }
        .badge-new { background: #E8FFF5; color: #00965A; }
        .badge-lim { background: #FFF8E6; color: #B06000; }
        .badge-pop { background: #EBF2FF; color: #1A56DB; }
        .img-discount { position: absolute; bottom: 10px; right: 12px; background: #0C1F3A; color: #fff; font-family: 'Rubik', sans-serif; font-size: 18px; font-weight: 900; padding: 4px 12px; border-radius: 10px; box-shadow: 0 2px 8px rgba(12,31,58,.35); line-height: 1.3; }

        .card-body { padding: 14px 16px; flex: 1; }
        .card-title { font-size: 14.5px; font-weight: 700; color: #0C1F3A; line-height: 1.4; margin-bottom: 12px; }

        .ticket { background: #F4F6F9; border: 1.5px dashed #D5DCE8; border-radius: 14px; padding: 11px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; position: relative; }
        .ticket::before, .ticket::after { content: ''; position: absolute; width: 15px; height: 15px; border-radius: 50%; background: #fff; border: 1.5px dashed #D5DCE8; top: 50%; transform: translateY(-50%); }
        .ticket::before { right: -8px; }
        .ticket::after  { left:  -8px; }
        .tk-l { flex: 1; }
        .tk-amount { font-family: 'Rubik', sans-serif; font-size: 24px; font-weight: 900; color: #1A56DB; line-height: 1; }
        .tk-desc { font-size: 11.5px; color: #536070; margin-top: 3px; }
        .tk-r { flex-shrink: 0; text-align: center; }
        .tk-lbl { font-size: 9px; font-weight: 800; color: #96AABF; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
        .tk-code { background: #0C1F3A; color: #fff; font-family: 'Rubik', sans-serif; font-size: 13px; font-weight: 900; padding: 6px 10px 6px 24px; border-radius: 10px; letter-spacing: 1.5px; white-space: nowrap; display: flex; align-items: center; gap: 5px; position: relative; transition: background .18s, transform .18s; }
        .tk-code:hover { background: #1A56DB; transform: scale(1.05); }
        .ci { position: absolute; left: 7px; font-size: 11px; }

        .card-foot { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-top: 1px solid #EAEEF4; background: #F4F6F9; }
        .card-exp { font-size: 11.5px; color: #96AABF; }
        .card-exp.hot { color: #D94020; font-weight: 700; }
        .card-share { font-size: 11.5px; font-weight: 600; color: #96AABF; transition: color .15s; }
        .card-share:hover { color: #0C1F3A; }

        footer { background: #0C1F3A; color: rgba(255,255,255,.38); padding: 44px 24px 24px; margin-top: 52px; text-align: center; }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .fb-logo { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 8px; }
        .fb-logo span { color: #CCFF00; }
        footer p { font-size: 13px; margin-bottom: 20px; }
        .footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 16px; }
        .footer-links a { font-size: 12.5px; color: rgba(255,255,255,.38); transition: color .15s; }
        .footer-links a:hover { color: rgba(255,255,255,.8); }
        .footer-copy { font-size: 11.5px; }

        @media (max-width: 600px) {
          .cards-grid { grid-template-columns: 1fr; }
          .hero h1 { font-size: 28px; }
          .main-nav { display: none; }
          .ts-right { display: none; }
        }
      `}</style>
    </>
  );
}
