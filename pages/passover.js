import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getCoupons } from '../lib/sheets';
import Layout from '../components/Layout';

const DECORATIONS = ['🍷','🫓','🌿','🕍','✡️','🍷','🫓','🌿','🕍','✡️','🍷','🫓'];

export default function PassoverPage({ coupons }) {
  const router = useRouter();
  const [copied, setCopied] = useState(null);
  const [revealed, setRevealed] = useState({});

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
        <title>מבצעי פסח 2025 | קופון פלוס</title>
        <meta name="description" content="כל קופוני ומבצעי פסח 2025 במקום אחד — שופרסל, רמי לוי, מגה ועוד. חסכו יותר לחג עם קופון פלוס." />
        <link rel="canonical" href="https://couponplus.co.il/passover" />
        <meta property="og:title" content="מבצעי פסח 2025 | קופון פלוס" />
        <meta property="og:description" content="כל קופוני ומבצעי פסח 2025 מכל הרשתות במקום אחד" />
        <meta property="og:url" content="https://couponplus.co.il/passover" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="page">

        {/* ══ HERO ══ */}
        <div className="hero">
          {/* Floating decorations */}
          <div className="deco-strip top">
            {DECORATIONS.map((d, i) => <span key={i} className="deco-item" style={{'--i': i}}>{d}</span>)}
          </div>

          <div className="hero-content">
            <div className="hero-tag">✨ חג פסח תשפ״ה ✨</div>
            <h1 className="hero-title">
              <span className="hero-line1">מבצעי פסח</span>
              <span className="hero-line2">הגדה של קופונים</span>
            </h1>
            <p className="hero-sub">כל המבצעים לחג — בכל הרשתות הגדולות</p>
            <div className="hero-stats">
              <div className="stat"><strong>{coupons.length}</strong><span>מבצעים</span></div>
              <div className="stat-sep">|</div>
              <div className="stat"><strong>{[...new Set(coupons.map(c=>c.chain))].length}</strong><span>רשתות</span></div>
            </div>
          </div>

          <div className="deco-strip bottom">
            {DECORATIONS.map((d, i) => <span key={i} className="deco-item" style={{'--i': i}}>{d}</span>)}
          </div>

          {/* Wave divider */}
          <div className="hero-wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FFF8EE"/>
            </svg>
          </div>
        </div>

        {/* ══ COUPONS ══ */}
        <div className="coupons-section">
          <div className="coupons-inner">

            <div className="section-header">
              <div className="section-ornament">✦</div>
              <h2>כל מבצעי החג</h2>
              <div className="section-ornament">✦</div>
            </div>

            <div className="coupons-grid">
              {coupons.map((c, idx) => (
                <div
                  key={c.id}
                  className="coupon-card"
                  onClick={() => router.push(`/coupon/${c.id}`)}
                  style={{'--delay': `${(idx % 12) * 0.05}s`}}
                >
                  {/* Decorative corner */}
                  <div className="card-corner">✦</div>

                  {c.badge && <div className="card-badge">{c.badge === 'חם' ? '🔥 חם' : c.badge}</div>}

                  <div className="card-discount">{c.discount}</div>
                  <div className="card-chain">{c.chain}</div>
                  <div className="card-name">{c.name}</div>

                  {c.expiry && !c.expired && (
                    <div className="card-expiry">⏰ עד {c.expiry}</div>
                  )}

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

          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <div className="page-footer">
          <div className="footer-icon">🍷</div>
          <p>חג פסח שמח ומשמח!</p>
          <Link href="/" className="footer-back">← חזרה לכל הקופונים</Link>
        </div>

      </div>

      <style jsx global>{`
        body { background: #FFF8EE !important; }
      `}</style>

      <style jsx>{`
        .page { min-height: 100vh; }

        /* ══ HERO ══ */
        .hero {
          background: linear-gradient(160deg, #7A2D00 0%, #C8730A 35%, #E8A830 65%, #C8730A 100%);
          padding: 20px 0 0;
          position: relative;
          overflow: hidden;
          min-height: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Deco strips */
        .deco-strip { width: 100%; display: flex; justify-content: center; gap: 0; overflow: hidden; }
        .deco-strip.top { margin-bottom: 24px; }
        .deco-strip.bottom { margin-top: 16px; }
        .deco-item {
          font-size: 22px;
          padding: 0 12px;
          opacity: .35;
          animation: float 4s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.3s);
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* Hero content */
        .hero-content { text-align: center; padding: 0 20px; z-index: 1; }
        .hero-tag {
          display: inline-block;
          background: rgba(255,255,255,.2);
          border: 1px solid rgba(255,255,255,.4);
          border-radius: 50px;
          padding: 5px 20px;
          font-size: 13px; font-weight: 700;
          color: rgba(255,255,255,.9);
          margin-bottom: 16px;
          letter-spacing: 1px;
        }
        .hero-title { margin-bottom: 12px; }
        .hero-line1 {
          display: block;
          font-family: 'Rubik', sans-serif;
          font-size: 52px; font-weight: 900;
          color: #fff;
          text-shadow: 0 4px 20px rgba(0,0,0,.3);
          line-height: 1.1;
        }
        .hero-line2 {
          display: block;
          font-family: 'Rubik', sans-serif;
          font-size: 28px; font-weight: 500;
          color: rgba(255,255,255,.75);
          font-style: italic;
          margin-top: 4px;
        }
        .hero-sub { font-size: 16px; color: rgba(255,255,255,.7); margin-bottom: 20px; }
        .hero-stats { display: flex; align-items: center; justify-content: center; gap: 16px; }
        .stat { text-align: center; }
        .stat strong { display: block; font-family: 'Rubik', sans-serif; font-size: 30px; font-weight: 900; color: #fff; }
        .stat span { font-size: 12px; color: rgba(255,255,255,.6); }
        .stat-sep { font-size: 24px; color: rgba(255,255,255,.3); }

        /* Wave */
        .hero-wave { width: 100%; line-height: 0; margin-top: -1px; }
        .hero-wave svg { width: 100%; height: 60px; }

        /* ══ COUPONS ══ */
        .coupons-section { background: #FFF8EE; padding: 40px 0 60px; }
        .coupons-inner { max-width: 1280px; margin: 0 auto; padding: 0 20px; }

        .section-header { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 32px; }
        .section-header h2 { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 900; color: #7A4F10; }
        .section-ornament { font-size: 20px; color: #C8933A; }

        /* GRID */
        .coupons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }

        /* CARD */
        .coupon-card {
          background: linear-gradient(145deg, #FFFDF5, #FFF8E8);
          border: 1.5px solid #E8C97A;
          border-radius: 20px;
          padding: 22px 18px 16px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform .22s ease, box-shadow .22s ease;
          box-shadow: 0 4px 16px rgba(200,147,58,.12);
          animation: fadeUp .5s ease both;
          animation-delay: var(--delay);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .coupon-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(200,147,58,.25); border-color: #C8933A; }

        /* Decorative corner */
        .card-corner { position: absolute; top: 10px; left: 14px; font-size: 12px; color: #E8C97A; }

        /* Card content */
        .card-badge {
          display: inline-block;
          background: #E8321A; color: #fff;
          font-size: 10px; font-weight: 800;
          padding: 2px 10px; border-radius: 50px;
          margin-bottom: 8px;
        }
        .card-discount {
          font-family: 'Rubik', sans-serif;
          font-size: 28px; font-weight: 900;
          color: #C8730A;
          margin-bottom: 4px;
          line-height: 1.1;
        }
        .card-chain {
          font-size: 10px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: #B8960A;
          margin-bottom: 8px;
        }
        .card-name {
          font-size: 14px; font-weight: 600;
          color: #3A2A0A; line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 10px;
          min-height: 40px;
        }
        .card-expiry { font-size: 11px; color: #B08050; margin-bottom: 12px; }

        /* Actions */
        .card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .card-code {
          flex: 1;
          background: #FFF0D0; border: 1.5px solid #E8C97A;
          border-radius: 10px; padding: 9px 12px;
          font-size: 12px; font-weight: 700; color: #7A4F10;
          cursor: pointer; transition: all .18s;
          font-family: 'Rubik', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .card-code:hover { background: #FFE8A0; border-color: #C8930A; }
        .card-code.rev { background: #fff; border-color: #C8930A; color: #C8730A; letter-spacing: 1.5px; font-size: 13px; }
        .card-code.cop { background: #F0FAF4; border-color: #27AE60; color: #27AE60; }
        .card-link {
          flex: 1;
          background: #C8730A; color: #fff;
          border-radius: 10px; padding: 9px 12px;
          font-size: 12px; font-weight: 700;
          text-align: center; white-space: nowrap;
          transition: background .18s;
        }
        .card-link:hover { background: #A85C08; }

        /* ══ FOOTER ══ */
        .page-footer {
          text-align: center;
          padding: 40px 20px 60px;
          background: linear-gradient(180deg, #FFF8EE, #FFF0D0);
          border-top: 2px solid #E8C97A;
        }
        .footer-icon { font-size: 40px; margin-bottom: 12px; }
        .page-footer p { font-size: 18px; font-weight: 700; color: #7A4F10; margin-bottom: 16px; }
        .footer-back {
          display: inline-block;
          background: #7A4F10; color: #fff;
          border-radius: 50px; padding: 10px 24px;
          font-size: 14px; font-weight: 700;
          transition: background .18s;
        }
        .footer-back:hover { background: #C8730A; }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 768px) {
          .hero-line1 { font-size: 36px; }
          .hero-line2 { font-size: 20px; }
          .nav-links { display: none; }
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
  const coupons = await getCoupons();
  return { props: { coupons: coupons.filter(c => !c.expired) }, revalidate: 60 };
}
