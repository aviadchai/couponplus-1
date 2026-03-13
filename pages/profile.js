import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { createClient } from '../lib/supabase';
import { getCoupons } from '../lib/sheets';

const PERSONALITIES = [
  { chains: ['רמי לוי'],    emoji: '🥩', title: 'בן אדם של רמי לוי', desc: 'אתה יודע מה אתה רוצה — מחיר טוב, ישירות לעניין.' },
  { chains: ['שופרסל'],     emoji: '🛒', title: 'איש השופרסל הנאמן', desc: 'קבוע, אמין, תמיד יש שם מה שצריך.' },
  { chains: ['מגה'],        emoji: '🌿', title: 'הבריאותניק של מגה', desc: 'אתה מחפש תזונה טובה במחיר הוגן.' },
  { chains: ['ויקטורי'],    emoji: '🏆', title: 'הוויקטוריוז\'ר', desc: 'אתה אוהב לגלות מבצעים לפני כולם.' },
  { chains: ['יינות ביתן'], emoji: '🍷', title: 'גורמה של יינות ביתן', desc: 'לך הקנייה היא חוויה, לא רק רשימה.' },
  { chains: ['יוחננוף'],    emoji: '👑', title: 'אצילי יוחננוף', desc: 'איכות מעל הכל — אתה לא מתפשר.' },
  { chains: ['אושר עד'],    emoji: '💚', title: 'חסיד אושר עד', desc: 'חכם, מחושב, תמיד מוצא את הערך האמיתי.' },
  { chains: ['חצי חינם'],   emoji: '✂️', title: 'מלך החיסכון', desc: 'אם יש מבצע — אתה שם. תמיד.' },
];

const CATEGORY_LABELS = {
  'סופרמרקט':         '🛍️ סופרמרקט',
  'פארם ובריאות':     '💊 פארם',
  'טיפוח וקוסמטיקה': '💄 טיפוח',
  'אלקטרוניקה':       '📱 אלקטרוניקה',
  'בית ומטבח':        '🏠 בית ומטבח',
  'אופנה':            '👗 אופנה',
  'חיות מחמד':        '🐾 חיות מחמד',
  'טואלטיקה':         '🧴 טואלטיקה',
};

function getPersonality(savedCoupons) {
  if (!savedCoupons.length) return null;
  const chainCount = {};
  savedCoupons.forEach(c => {
    chainCount[c.chain] = (chainCount[c.chain] || 0) + 1;
  });
  const topChain = Object.entries(chainCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  return PERSONALITIES.find(p => p.chains.includes(topChain)) || {
    emoji: '🎯',
    title: 'צייד הקופונים',
    desc: 'אתה לא נאמן לאף רשת — אתה נאמן רק למחיר הטוב ביותר.',
  };
}

function getCategoryStats(savedCoupons) {
  const counts = {};
  savedCoupons.forEach(c => {
    if (c.category) counts[c.category] = (counts[c.category] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
}

export default function ProfilePage({ allCoupons }) {
  const supabase = createClient();
  const router = useRouter();
  const [user,         setUser]         = useState(null);
  const [saved,        setSaved]        = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data?.session?.user ?? null;
      setUser(u);
      if (u) loadData(u.id);
      else setLoading(false);
    });
  }, []);

  async function loadData(userId) {
    const { data } = await supabase.from('favorites').select('coupon_id').eq('user_id', userId);
    const ids = (data || []).map(r => r.coupon_id);
    setSaved(allCoupons.filter(c => ids.includes(c.id)));
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const personality  = getPersonality(saved);
  const categoryStats = getCategoryStats(saved);
  const topChains = [...new Set(saved.map(c => c.chain))].slice(0, 4);

  if (!loading && !user) {
    return (
      <Layout>
        <div className="empty-page">
          <div style={{fontSize:64}}>🔐</div>
          <h2>כניסה נדרשת</h2>
          <p>התחבר כדי לראות את הפרופיל שלך</p>
          <button onClick={async () => {
            await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/profile' } });
          }} className="btn-google">
            כניסה עם גוגל
          </button>
          <style jsx>{`
            .empty-page { text-align:center; padding:100px 20px; }
            .empty-page h2 { font-family:'Rubik',sans-serif; font-size:24px; font-weight:900; color:#1A1A2E; margin:16px 0 8px; }
            .empty-page p { color:#7A6E68; margin-bottom:24px; }
            .btn-google { background:#1A1A2E; color:#fff; border:none; border-radius:50px; padding:12px 28px; font-size:15px; font-weight:700; cursor:pointer; font-family:'Heebo',sans-serif; }
          `}</style>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>קופון+ | הפרופיל שלי</title>
      </Head>

      <div className="profile-page">

        {/* ══ HERO ══ */}
        <div className="profile-hero">
          <div className="profile-hero-inner">
            {loading ? (
              <div className="avatar-skeleton" />
            ) : (
              <img
                src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'U')}&background=E8321A&color=fff&size=96`}
                className="avatar"
                alt="avatar"
              />
            )}
            <div className="profile-info">
              <div className="profile-name">{user?.user_metadata?.full_name || 'משתמש'}</div>
              <div className="profile-email">{user?.email}</div>
              <div className="profile-joined">חבר מ-{new Date(user?.created_at).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</div>
            </div>
            <button className="btn-signout" onClick={signOut}>יציאה</button>
          </div>
        </div>

        <div className="content">

          {/* ══ STATS ══ */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">{saved.length}</div>
              <div className="stat-label">קופונים שמורים</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{topChains.length}</div>
              <div className="stat-label">רשתות מועדפות</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{categoryStats.length}</div>
              <div className="stat-label">קטגוריות</div>
            </div>
          </div>

          {saved.length > 0 && (
            <>
              {/* ══ PERSONALITY ══ */}
              {personality && (
                <div className="personality-card">
                  <div className="personality-emoji">{personality.emoji}</div>
                  <div className="personality-text">
                    <div className="personality-label">האישיות הקנייתית שלך</div>
                    <div className="personality-title">{personality.title}</div>
                    <div className="personality-desc">{personality.desc}</div>
                  </div>
                </div>
              )}

              {/* ══ TOP CHAINS ══ */}
              {topChains.length > 0 && (
                <div className="section">
                  <div className="section-title"><span className="dot" />הרשתות שלך</div>
                  <div className="chains-row">
                    {topChains.map(chain => (
                      <div key={chain} className="chain-pill">{chain}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ CATEGORY STATS ══ */}
              {categoryStats.length > 0 && (
                <div className="section">
                  <div className="section-title"><span className="dot" />הקטגוריות שלך</div>
                  <div className="category-bars">
                    {categoryStats.map(([cat, count]) => (
                      <div key={cat} className="cat-bar-row">
                        <div className="cat-label">{CATEGORY_LABELS[cat] || cat}</div>
                        <div className="cat-bar-wrap">
                          <div className="cat-bar" style={{ width: `${(count / saved.length) * 100}%` }} />
                        </div>
                        <div className="cat-count">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ SAVED COUPONS ══ */}
              <div className="section">
                <div className="section-title-row">
                  <div className="section-title"><span className="dot" />הקופונים השמורים</div>
                  <button className="btn-shopping" onClick={() => router.push('/shopping')}>🛒 אני בסופר</button>
                </div>
                <div className="saved-grid">
                  {saved.map(c => (
                    <div key={c.id} className="saved-item" onClick={() => router.push(`/coupon/${c.id}`)}>
                      <div className="saved-chain">{c.chain}</div>
                      <div className="saved-name">{c.name}</div>
                      <div className="saved-discount">{c.discount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!loading && saved.length === 0 && (
            <div className="empty-saved">
              <div style={{fontSize:48}}>🤍</div>
              <p>עוד לא שמרת קופונים</p>
              <button className="btn-primary" onClick={() => router.push('/')}>לכל הקופונים</button>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .profile-page { min-height: 80vh; }

        /* HERO */
        .profile-hero { background: linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%); padding: 36px 0; }
        .profile-hero-inner { max-width: 1280px; margin: 0 auto; padding: 0 var(--pad); display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .avatar { width: 80px; height: 80px; border-radius: 50%; border: 3px solid rgba(255,255,255,.2); flex-shrink: 0; }
        .avatar-skeleton { width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,.1); flex-shrink: 0; }
        .profile-info { flex: 1; }
        .profile-name { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: #fff; }
        .profile-email { font-size: 13px; color: rgba(255,255,255,.5); margin: 3px 0; }
        .profile-joined { font-size: 12px; color: rgba(255,255,255,.35); }
        .btn-signout { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 50px; padding: 8px 18px; font-size: 13px; font-weight: 700; color: rgba(255,255,255,.7); cursor: pointer; transition: all .18s; font-family: 'Heebo', sans-serif; flex-shrink: 0; }
        .btn-signout:hover { background: rgba(255,255,255,.18); color: #fff; }

        /* CONTENT */
        .content { max-width: 1280px; margin: 0 auto; padding: 32px var(--pad) 60px; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
        .stat-card { background: #fff; border: 1.5px solid #EDE8E2; border-radius: 16px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,.04); }
        .stat-num { font-family: 'Rubik', sans-serif; font-size: 36px; font-weight: 900; color: #E8321A; }
        .stat-label { font-size: 12px; color: #7A6E68; font-weight: 600; margin-top: 4px; }

        /* PERSONALITY */
        .personality-card {
          background: linear-gradient(135deg, #1A1A2E, #2D1B4E);
          border-radius: 20px; padding: 24px;
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 28px;
          box-shadow: 0 8px 32px rgba(26,26,46,.2);
        }
        .personality-emoji { font-size: 52px; flex-shrink: 0; }
        .personality-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 6px; }
        .personality-title { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 6px; }
        .personality-desc { font-size: 14px; color: rgba(255,255,255,.6); line-height: 1.5; }

        /* SECTION */
        .section { background: #fff; border: 1.5px solid #EDE8E2; border-radius: 20px; padding: 22px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.04); }
        .section-title { font-family: 'Rubik', sans-serif; font-size: 17px; font-weight: 900; color: #1A1A2E; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .section-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .section-title-row .section-title { margin-bottom: 0; }
        .dot { width: 6px; height: 20px; background: #E8321A; border-radius: 3px; flex-shrink: 0; display: block; }

        /* CHAINS */
        .chains-row { display: flex; flex-wrap: wrap; gap: 10px; }
        .chain-pill { background: #F5F0EC; border: 1.5px solid #E8E0D8; border-radius: 50px; padding: 7px 18px; font-size: 14px; font-weight: 700; color: #1A1A2E; }

        /* CATEGORY BARS */
        .category-bars { display: flex; flex-direction: column; gap: 12px; }
        .cat-bar-row { display: flex; align-items: center; gap: 12px; }
        .cat-label { font-size: 13px; font-weight: 600; color: #1A1A2E; width: 130px; flex-shrink: 0; }
        .cat-bar-wrap { flex: 1; background: #F5F0EC; border-radius: 50px; height: 10px; overflow: hidden; }
        .cat-bar { height: 100%; background: linear-gradient(90deg, #E8321A, #FF5A3D); border-radius: 50px; transition: width .6s ease; }
        .cat-count { font-size: 12px; font-weight: 700; color: #7A6E68; width: 24px; text-align: center; flex-shrink: 0; }

        /* SAVED GRID */
        .btn-shopping { background: #1A1A2E; color: #fff; border: none; border-radius: 50px; padding: 8px 18px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Heebo', sans-serif; transition: background .18s; }
        .btn-shopping:hover { background: #E8321A; }
        .saved-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
        .saved-item { background: #F8F5F2; border: 1.5px solid #EDE8E2; border-radius: 14px; padding: 14px; cursor: pointer; transition: all .18s; }
        .saved-item:hover { border-color: #E8321A; background: #FFF8F6; transform: translateY(-2px); }
        .saved-chain { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #E8321A; margin-bottom: 5px; }
        .saved-name { font-size: 13px; font-weight: 600; color: #1A1A2E; line-height: 1.4; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .saved-discount { font-family: 'Rubik', sans-serif; font-size: 16px; font-weight: 900; color: #E8321A; }

        /* EMPTY */
        .empty-saved { text-align: center; padding: 60px 20px; }
        .empty-saved p { font-size: 16px; color: #7A6E68; margin: 12px 0 20px; }
        .btn-primary { background: #E8321A; color: #fff; border: none; border-radius: 50px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Heebo', sans-serif; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .stat-num { font-size: 28px; }
          .personality-card { flex-direction: column; text-align: center; }
          .cat-label { width: 100px; font-size: 12px; }
          .saved-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps() {
  const allCoupons = await getCoupons();
  return { props: { allCoupons }, revalidate: 3600 };
}
