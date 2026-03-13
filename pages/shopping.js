import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { createClient } from '../lib/supabase';
import { getCoupons } from '../lib/sheets';

export default function ShoppingPage({ allCoupons }) {
  const supabase = createClient();
  const router = useRouter();
  const [user,      setUser]      = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [checked,   setChecked]   = useState({});
  const [copied,    setCopied]    = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data?.session?.user ?? null;
      setUser(u);
      if (u) loadFavorites(u.id);
      else setLoading(false);
    });
  }, []);

  async function loadFavorites(userId) {
    const { data } = await supabase
      .from('favorites')
      .select('coupon_id')
      .eq('user_id', userId);
    const ids = (data || []).map(r => r.coupon_id);
    setFavorites(allCoupons.filter(c => ids.includes(c.id)));
    setLoading(false);
  }

  async function removeFavorite(couponId) {
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('coupon_id', couponId);
    setFavorites(prev => prev.filter(c => c.id !== couponId));
  }

  function toggleCheck(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function copyCode(code, id) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  // Group by chain
  const byChain = favorites.reduce((acc, c) => {
    if (!acc[c.chain]) acc[c.chain] = [];
    acc[c.chain].push(c);
    return acc;
  }, {});

  const totalChecked = Object.values(checked).filter(Boolean).length;

  return (
    <Layout>
      <Head>
        <title>קופון+ | אני בסופר</title>
      </Head>

      <div className="page">

        {/* ── HEADER ── */}
        <div className="page-hero">
          <div className="page-hero-inner">
            <div className="hero-icon">🛒</div>
            <div>
              <h1>אני בסופר</h1>
              <p>הקופונים השמורים שלך — מוכן לקנייה</p>
            </div>
            {favorites.length > 0 && (
              <div className="hero-progress">
                <div className="progress-text">{totalChecked}/{favorites.length} קופונים</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(totalChecked / favorites.length) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="content">

          {/* Not logged in */}
          {!user && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🔐</div>
              <h2>התחבר כדי לראות את הקופונים שלך</h2>
              <p>שמור קופונים עם ❤️ וראה אותם כאן לפני כל קנייה</p>
              <button className="btn-primary" onClick={async () => {
                await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/shopping' } });
              }}>כניסה עם גוגל</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <p>טוען...</p>
            </div>
          )}

          {/* Empty favorites */}
          {user && !loading && favorites.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🤍</div>
              <h2>עוד לא שמרת קופונים</h2>
              <p>לחץ על ❤️ בכל קופון כדי להוסיף אותו לרשימה</p>
              <button className="btn-primary" onClick={() => router.push('/')}>לכל הקופונים</button>
            </div>
          )}

          {/* Coupons by chain */}
          {user && !loading && Object.entries(byChain).map(([chain, coupons]) => (
            <div key={chain} className="chain-section">
              <div className="chain-header">
                <span className="chain-name">{chain}</span>
                <span className="chain-count">{coupons.length} קופונים</span>
              </div>

              {/* DESKTOP: cards grid */}
              <div className="cards-grid">
                {coupons.map(c => (
                  <div key={c.id} className={`card${checked[c.id] ? ' card-done' : ''}`}>
                    <div className="card-top">
                      <div className="card-discount">{c.discount}</div>
                      <button className="card-remove" onClick={() => removeFavorite(c.id)}>✕</button>
                    </div>
                    <div className="card-name">{c.name}</div>
                    {c.expiry && <div className="card-expiry">עד {c.expiry}</div>}
                    <div className="card-actions">
                      {c.code ? (
                        <button className={`card-code${copied === c.id ? ' done' : ''}`}
                          onClick={() => copyCode(c.code, c.id)}>
                          {copied === c.id ? '✓ הועתק!' : `קוד: ${c.code}`}
                        </button>
                      ) : c.url ? (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="card-link">לקבלת ההטבה ←</a>
                      ) : null}
                      <button className={`card-check${checked[c.id] ? ' checked' : ''}`}
                        onClick={() => toggleCheck(c.id)}>
                        {checked[c.id] ? '✓ לקחתי' : 'לקחתי?'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* MOBILE: checklist */}
              <div className="checklist">
                {coupons.map(c => (
                  <div key={c.id} className={`check-item${checked[c.id] ? ' done' : ''}`}
                    onClick={() => toggleCheck(c.id)}>
                    <div className={`check-box${checked[c.id] ? ' checked' : ''}`}>
                      {checked[c.id] && '✓'}
                    </div>
                    <div className="check-info">
                      <div className="check-name">{c.name}</div>
                      <div className="check-meta">
                        {c.discount && <span className="check-discount">{c.discount}</span>}
                        {c.code && <span className="check-code" onClick={e => { e.stopPropagation(); copyCode(c.code, c.id); }}>
                          {copied === c.id ? '✓ הועתק' : `קוד: ${c.code}`}
                        </span>}
                      </div>
                    </div>
                    <button className="check-remove" onClick={e => { e.stopPropagation(); removeFavorite(c.id); }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

      <style jsx>{`
        .page { min-height: 80vh; }

        /* HERO */
        .page-hero { background: linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%); padding: 32px 0; }
        .page-hero-inner { max-width: 1280px; margin: 0 auto; padding: 0 var(--pad); display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .hero-icon { font-size: 48px; line-height: 1; }
        h1 { font-family: 'Rubik', sans-serif; font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 4px; }
        h1 + p { font-size: 14px; color: rgba(255,255,255,.5); }
        .hero-progress { margin-right: auto; text-align: left; }
        .progress-text { font-size: 13px; font-weight: 700; color: rgba(255,255,255,.7); margin-bottom: 6px; text-align: center; }
        .progress-bar { width: 160px; height: 6px; background: rgba(255,255,255,.15); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: #E8321A; border-radius: 3px; transition: width .4s ease; }

        /* CONTENT */
        .content { max-width: 1280px; margin: 0 auto; padding: 32px var(--pad); }

        /* EMPTY */
        .empty-state { text-align: center; padding: 80px 20px; }
        .empty-icon { font-size: 64px; margin-bottom: 16px; }
        .empty-state h2 { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: #1A1A2E; margin-bottom: 8px; }
        .empty-state p { font-size: 15px; color: #7A6E68; margin-bottom: 24px; }
        .btn-primary { background: #E8321A; color: #fff; border: none; border-radius: 50px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Heebo', sans-serif; }

        /* CHAIN SECTION */
        .chain-section { margin-bottom: 40px; }
        .chain-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #F0EBE4; }
        .chain-name { font-family: 'Rubik', sans-serif; font-size: 20px; font-weight: 900; color: #1A1A2E; }
        .chain-count { font-size: 12px; color: #7A6E68; font-weight: 600; }

        /* DESKTOP CARDS */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
        .card {
          background: #fff; border: 1.5px solid #EDE8E2; border-radius: 18px;
          padding: 20px; display: flex; flex-direction: column; gap: 10px;
          transition: all .2s; box-shadow: 0 2px 8px rgba(0,0,0,.05);
        }
        .card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); transform: translateY(-2px); }
        .card-done { opacity: .5; filter: grayscale(.8); }
        .card-top { display: flex; align-items: center; justify-content: space-between; }
        .card-discount { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: #E8321A; }
        .card-remove { background: none; border: none; color: #C0B8B0; cursor: pointer; font-size: 16px; padding: 2px 6px; border-radius: 6px; transition: all .15s; }
        .card-remove:hover { background: #FFF0EE; color: #E8321A; }
        .card-name { font-size: 14px; font-weight: 600; color: #1A1A2E; line-height: 1.4; flex: 1; }
        .card-expiry { font-size: 11px; color: #B0A89E; }
        .card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .card-code {
          flex: 1; background: #F5F1ED; border: 1.5px solid #E5DED5; border-radius: 10px;
          padding: 8px 12px; font-size: 12px; font-weight: 700; color: #3A3028;
          cursor: pointer; font-family: 'Rubik', sans-serif; transition: all .15s; white-space: nowrap;
        }
        .card-code:hover { border-color: #E8321A; color: #E8321A; }
        .card-code.done { background: #F0FAF4; border-color: #27AE60; color: #27AE60; }
        .card-link { flex: 1; background: #E8321A; color: #fff; border-radius: 10px; padding: 8px 12px; font-size: 12px; font-weight: 700; text-decoration: none; text-align: center; white-space: nowrap; }
        .card-check {
          background: #F5F1ED; border: 1.5px solid #E5DED5; border-radius: 10px;
          padding: 8px 12px; font-size: 12px; font-weight: 700; color: #7A6E68;
          cursor: pointer; font-family: 'Heebo', sans-serif; transition: all .15s; white-space: nowrap;
        }
        .card-check.checked { background: #F0FAF4; border-color: #27AE60; color: #27AE60; }

        /* MOBILE CHECKLIST */
        .checklist { display: none; }
        .check-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 0; border-bottom: 1px solid #F0EBE4;
          cursor: pointer; transition: opacity .2s;
        }
        .check-item.done { opacity: .45; }
        .check-box {
          width: 26px; height: 26px; flex-shrink: 0;
          border: 2px solid #E8E0D8; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 900; color: #27AE60;
          transition: all .15s;
        }
        .check-box.checked { background: #27AE60; border-color: #27AE60; color: #fff; }
        .check-info { flex: 1; min-width: 0; }
        .check-name { font-size: 14px; font-weight: 600; color: #1A1A2E; margin-bottom: 4px; }
        .check-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .check-discount { font-size: 12px; font-weight: 800; color: #E8321A; }
        .check-code {
          font-size: 11px; font-weight: 700; color: #3A3028;
          background: #F5F1ED; border: 1px solid #E5DED5; border-radius: 6px;
          padding: 2px 8px; cursor: pointer;
        }
        .check-remove { background: none; border: none; color: #C0B8B0; font-size: 16px; cursor: pointer; padding: 4px; flex-shrink: 0; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .cards-grid { display: none; }
          .checklist { display: block; }
          h1 { font-size: 24px; }
          .hero-progress { width: 100%; }
          .progress-bar { width: 100%; }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps() {
  const allCoupons = await getCoupons();
  return { props: { allCoupons }, revalidate: 3600 };
}
