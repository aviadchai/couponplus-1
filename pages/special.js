import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getCoupons } from '../lib/sheets';
import Layout from '../components/Layout';

// ═══════════════════════════════════════════════════════════════
//  HOLIDAY CONFIG — שנה כאן בלבד כשמחליפים חג
// ═══════════════════════════════════════════════════════════════
const HOLIDAY = {
  name:           'פסח',                    // שם החג
  year:           'תשפ״ה',                  // שנה עברית
  tagline:        'הגדה של קופונים',        // כותרת משנה
  sub:            'כל המבצעים לחג — בכל הרשתות הגדולות',
  footerGreeting: 'חג פסח שמח ומשמח!',
  footerIcon:     '🍷',
  decorations:    ['🍷','🫓','🌿','🕍','✡️'],

  // סינון קופונים: רק קופונים שה-badge שלהם מכיל את הערך הזה
  // אם ריק ('') — מציג את כל הקופונים הפעילים
  filterTag:      'פסח',

  // צבעי עיצוב
  colors: {
    heroFrom:   '#7A2D00',
    heroMid:    '#C8730A',
    heroTo:     '#E8A830',
    bg:         '#FFF8EE',
    wave:       '#FFF8EE',
    cardBorder: '#E8C97A',
    cardBg1:    '#FFFDF5',
    cardBg2:    '#FFF8E8',
    accent:     '#C8730A',
    accentDark: '#7A4F10',
    heading:    '#7A4F10',
    ornament:   '#C8933A',
  },
};

// ── דוגמאות להחלפה מהירה לחגים אחרים ──────────────────────────
//
// שבועות:
//   name:'שבועות' | year:'תשפ״ה' | tagline:'חג הביכורים של קופונים'
//   footerGreeting:'חג שבועות שמח!' | footerIcon:'🌸'
//   decorations:['🌸','🌾','🍀','🕍','🌼']
//   filterTag:'שבועות'
//   colors: heroFrom:'#1A4731' heroMid:'#2E7D32' heroTo:'#66BB6A'
//           bg:'#F1FFF4' wave:'#F1FFF4' cardBorder:'#A5D6A7'
//           cardBg1:'#F9FFF9' cardBg2:'#F1FFF4' accent:'#2E7D32'
//           accentDark:'#1A4731' heading:'#1A4731' ornament:'#4CAF50'
//
// ראש השנה:
//   name:'ראש השנה' | tagline:'שנה טובה ומתוקה' | footerIcon:'🍎'
//   decorations:['🍎','🍯','🌙','✡️','🕍']
//   filterTag:'ראש השנה'
//   colors: heroFrom:'#7B1FA2' heroMid:'#C62828' heroTo:'#E53935'
//           bg:'#FFF8F8' wave:'#FFF8F8' cardBorder:'#EF9A9A'
//           accent:'#C62828' accentDark:'#7B1FA2'
// ──────────────────────────────────────────────────────────────

const DECO_STRIP = [...HOLIDAY.decorations, ...HOLIDAY.decorations, ...HOLIDAY.decorations];

export default function SpecialPage({ coupons }) {
  const router = useRouter();
  const [copied,   setCopied]   = useState(null);
  const [revealed, setRevealed] = useState({});
  const { colors } = HOLIDAY;

  function handleReveal(id, e) {
    e.stopPropagation();
    setRevealed(prev => ({ ...prev, [id]: true }));
  }

  function handleCopy(code, id, e) {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <Layout minimal>
      <Head>
        <title>מבצעי {HOLIDAY.name} {new Date().getFullYear()} | קופון פלוס</title>
        <meta name="description" content={`כל קופוני ומבצעי ${HOLIDAY.name} ${new Date().getFullYear()} במקום אחד — שופרסל, רמי לוי, מגה ועוד. חסכו יותר לחג עם קופון פלוס.`} />
        <link rel="canonical" href="https://couponplus.co.il/special" />
        <meta property="og:title" content={`מבצעי ${HOLIDAY.name} | קופון פלוס`} />
        <meta property="og:description" content={`כל קופוני ומבצעי ${HOLIDAY.name} מכל הרשתות במקום אחד`} />
        <meta property="og:url" content="https://couponplus.co.il/special" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="page">

        {/* ══ HERO ══ */}
        <div className="hero">
          <div className="deco-strip top">
            {DECO_STRIP.map((d, i) => <span key={i} className="deco-item" style={{'--i': i % HOLIDAY.decorations.length}}>{d}</span>)}
          </div>

          <div className="hero-content">
            <div className="hero-tag">✨ חג {HOLIDAY.name} {HOLIDAY.year} ✨</div>
            <h1 className="hero-title">
              <span className="hero-line1">מבצעי {HOLIDAY.name}</span>
              <span className="hero-line2">{HOLIDAY.tagline}</span>
            </h1>
            <p className="hero-sub">{HOLIDAY.sub}</p>
            <div className="hero-stats">
              <div className="stat"><strong>{coupons.length}</strong><span>מבצעים</span></div>
              <div className="stat-sep">|</div>
              <div className="stat"><strong>{[...new Set(coupons.map(c => c.chain))].length}</strong><span>רשתות</span></div>
            </div>
          </div>

          <div className="deco-strip bottom">
            {DECO_STRIP.map((d, i) => <span key={i} className="deco-item" style={{'--i': i % HOLIDAY.decorations.length}}>{d}</span>)}
          </div>

          <div className="hero-wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d={`M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z`} fill={colors.wave}/>
            </svg>
          </div>
        </div>

        {/* ══ COUPONS ══ */}
        <div className="coupons-section">
          <div className="coupons-inner">
            <div className="section-header">
              <div className="section-ornament">✦</div>
              <h2>כל מבצעי {HOLIDAY.name}</h2>
              <div className="section-ornament">✦</div>
            </div>

            {coupons.length === 0 ? (
              <div className="empty-state">
                <div style={{fontSize:48}}>{HOLIDAY.footerIcon}</div>
                <p>קופונים ל{HOLIDAY.name} יתווספו בקרוב!</p>
                <Link href="/" className="footer-back">← כל הקופונים</Link>
              </div>
            ) : (
              <div className="coupons-grid">
                {coupons.map((c, idx) => (
                  <div
                    key={c.id}
                    className="coupon-card"
                    onClick={() => router.push(`/coupon/${c.id}`)}
                    style={{'--delay': `${(idx % 12) * 0.05}s`}}
                  >
                    <div className="card-corner">✦</div>
                    {c.badge && <div className="card-badge">{c.badge === 'חם' ? '🔥 חם' : c.badge}</div>}
                    <div className="card-discount">{c.discount}</div>
                    <div className="card-chain">{c.chain}</div>
                    <div className="card-name">{c.name}</div>
                    {c.expiry && !c.expired && <div className="card-expiry">⏰ עד {c.expiry}</div>}
                    <div className="card-actions" onClick={e => e.stopPropagation()}>
                      {c.code && c.type !== 'קישור להטבה' && (
                        <button
                          className={`card-code${revealed[c.id] ? ' rev' : ''}${copied === c.id ? ' cop' : ''}`}
                          onClick={e => revealed[c.id] ? handleCopy(c.code, c.id, e) : handleReveal(c.id, e)}
                        >
                          {copied === c.id ? '✓ הועתק!' : revealed[c.id] ? c.code : '🎁 הצג קוד'}
                        </button>
                      )}
                      {c.url && (c.type === 'קישור להטבה' || c.type === 'קוד + קישור' || !c.code) && (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="card-link">
                          לקבלת ההטבה →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <div className="page-footer">
          <div className="footer-icon">{HOLIDAY.footerIcon}</div>
          <p>{HOLIDAY.footerGreeting}</p>
          <Link href="/" className="footer-back">← חזרה לכל הקופונים</Link>
        </div>

      </div>

      <style jsx global>{`body { background: ${colors.bg} !important; }`}</style>

      <style jsx>{`
        .page { min-height: 100vh; }

        /* HERO */
        .hero {
          background: linear-gradient(160deg, ${colors.heroFrom} 0%, ${colors.heroMid} 35%, ${colors.heroTo} 65%, ${colors.heroMid} 100%);
          padding: 20px 0 0; position: relative; overflow: hidden;
          min-height: 360px; display: flex; flex-direction: column; align-items: center;
        }
        .deco-strip { width: 100%; display: flex; justify-content: center; overflow: hidden; }
        .deco-strip.top { margin-bottom: 24px; }
        .deco-strip.bottom { margin-top: 16px; }
        .deco-item {
          font-size: 22px; padding: 0 12px; opacity: .35;
          animation: float 4s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.3s);
        }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

        .hero-content { text-align: center; padding: 0 20px; z-index: 1; }
        .hero-tag {
          display: inline-block; background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.4);
          border-radius: 50px; padding: 5px 20px; font-size: 13px; font-weight: 700;
          color: rgba(255,255,255,.9); margin-bottom: 16px; letter-spacing: 1px;
        }
        .hero-title { margin-bottom: 12px; }
        .hero-line1 {
          display: block; font-family: 'Rubik', sans-serif;
          font-size: 52px; font-weight: 900; color: #fff;
          text-shadow: 0 4px 20px rgba(0,0,0,.3); line-height: 1.1;
        }
        .hero-line2 {
          display: block; font-family: 'Rubik', sans-serif;
          font-size: 28px; font-weight: 500;
          color: rgba(255,255,255,.75); font-style: italic; margin-top: 4px;
        }
        .hero-sub { font-size: 16px; color: rgba(255,255,255,.7); margin-bottom: 20px; }
        .hero-stats { display: flex; align-items: center; justify-content: center; gap: 16px; }
        .stat { text-align: center; }
        .stat strong { display: block; font-family: 'Rubik', sans-serif; font-size: 30px; font-weight: 900; color: #fff; }
        .stat span { font-size: 12px; color: rgba(255,255,255,.6); }
        .stat-sep { font-size: 24px; color: rgba(255,255,255,.3); }
        .hero-wave { width: 100%; line-height: 0; margin-top: -1px; }
        .hero-wave svg { width: 100%; height: 60px; }

        /* COUPONS */
        .coupons-section { background: ${colors.bg}; padding: 40px 0 60px; }
        .coupons-inner { max-width: 1280px; margin: 0 auto; padding: 0 20px; }
        .section-header { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 32px; }
        .section-header h2 { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 900; color: ${colors.heading}; }
        .section-ornament { font-size: 20px; color: ${colors.ornament}; }
        .empty-state { text-align: center; padding: 60px 20px; color: ${colors.accentDark}; }
        .empty-state p { font-size: 18px; font-weight: 700; margin: 16px 0; }

        /* GRID */
        .coupons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }

        /* CARD */
        .coupon-card {
          background: linear-gradient(145deg, ${colors.cardBg1}, ${colors.cardBg2});
          border: 1.5px solid ${colors.cardBorder};
          border-radius: 20px; padding: 22px 18px 16px;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform .22s ease, box-shadow .22s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,.08);
          animation: fadeUp .5s ease both;
          animation-delay: var(--delay);
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .coupon-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,.15); border-color: ${colors.accent}; }
        .card-corner { position: absolute; top: 10px; left: 14px; font-size: 12px; color: ${colors.cardBorder}; }
        .card-badge {
          display: inline-block; background: #E8321A; color: #fff;
          font-size: 10px; font-weight: 800; padding: 2px 10px; border-radius: 50px; margin-bottom: 8px;
        }
        .card-discount {
          font-family: 'Rubik', sans-serif; font-size: 28px; font-weight: 900;
          color: ${colors.accent}; margin-bottom: 4px; line-height: 1.1;
        }
        .card-chain {
          font-size: 10px; font-weight: 800; letter-spacing: 2px;
          color: ${colors.ornament}; margin-bottom: 8px;
        }
        .card-name {
          font-size: 14px; font-weight: 600; color: #3A2A0A; line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; margin-bottom: 10px; min-height: 40px;
        }
        .card-expiry { font-size: 11px; color: #B08050; margin-bottom: 12px; }
        .card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .card-code {
          flex: 1; background: rgba(255,255,255,.6); border: 1.5px solid ${colors.cardBorder};
          border-radius: 10px; padding: 9px 12px; font-size: 12px; font-weight: 700;
          color: ${colors.accentDark}; cursor: pointer; transition: all .18s;
          font-family: 'Rubik', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .card-code:hover { border-color: ${colors.accent}; }
        .card-code.rev { background: #fff; border-color: ${colors.accent}; color: ${colors.accent}; letter-spacing: 1.5px; font-size: 13px; }
        .card-code.cop { background: #F0FAF4; border-color: #27AE60; color: #27AE60; }
        .card-link {
          flex: 1; background: ${colors.accent}; color: #fff;
          border-radius: 10px; padding: 9px 12px; font-size: 12px; font-weight: 700;
          text-align: center; white-space: nowrap; transition: background .18s;
        }
        .card-link:hover { background: ${colors.accentDark}; }

        /* FOOTER */
        .page-footer {
          text-align: center; padding: 40px 20px 60px;
          background: linear-gradient(180deg, ${colors.bg}, ${colors.cardBg2});
          border-top: 2px solid ${colors.cardBorder};
        }
        .footer-icon { font-size: 40px; margin-bottom: 12px; }
        .page-footer p { font-size: 18px; font-weight: 700; color: ${colors.accentDark}; margin-bottom: 16px; }
        .footer-back {
          display: inline-block; background: ${colors.accentDark}; color: #fff;
          border-radius: 50px; padding: 10px 24px; font-size: 14px; font-weight: 700; transition: background .18s;
        }
        .footer-back:hover { background: ${colors.accent}; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .hero-line1 { font-size: 36px; }
          .hero-line2 { font-size: 20px; }
          .coupons-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .coupon-card { padding: 16px 14px 12px; }
          .card-discount { font-size: 22px; }
        }
        @media (max-width: 480px) {
          .coupons-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps() {
  const all = await getCoupons();
  const coupons = HOLIDAY.filterTag
    ? all.filter(c => !c.expired && (c.badge === HOLIDAY.filterTag || c.category === HOLIDAY.filterTag || c.name.includes(HOLIDAY.filterTag)))
    : all.filter(c => !c.expired);
  return { props: { coupons }, revalidate: 60 };
}
