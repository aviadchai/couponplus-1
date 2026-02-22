import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/Layout';
import CouponCard from '../../components/CouponCard';
import { getCoupons } from '../../lib/sheets';

const CHAIN_COLORS = {
  'רמי לוי':    { dot: '#F5A623', bg: 'linear-gradient(135deg,#fff8e1,#fff0b3)', emoji: '🛒' },
  'שופרסל':     { dot: '#2DB86A', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', emoji: '🧴' },
  'מגה':        { dot: '#2196F3', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', emoji: '🥩' },
  'ויקטורי':    { dot: '#E53935', bg: 'linear-gradient(135deg,#ffebee,#ffcdd2)', emoji: '🥛' },
  'יינות ביתן': { dot: '#BA68C8', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)', emoji: '🍷' },
  'חצי חינם':   { dot: '#FF9800', bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)', emoji: '🏷️' },
  'סופר-פארם':  { dot: '#9C27B0', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)', emoji: '💊' },
};
const DEFAULT_CHAIN = { dot: '#E8321A', bg: 'linear-gradient(135deg,#fff0e6,#ffddd0)', emoji: '🎫' };

export default function CouponPage({ coupon, related }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const chain = CHAIN_COLORS[coupon?.chain] || DEFAULT_CHAIN;
  const expired = coupon?.expired;

  if (!coupon) return <Layout><div style={{padding:'60px',textAlign:'center'}}>קופון לא נמצא</div></Layout>;

  function handleCode() {
    if (expired) return;
    if (!revealed) { setRevealed(true); return; }
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => { setCopied(false); setRevealed(false); }, 2000);
  }

  return (
    <Layout>
      <Head>
        <title>{coupon.name} | קופון+</title>
        <meta name="description" content={`${coupon.discount} הנחה ב${coupon.chain} — ${coupon.name}`} />
      </Head>

      <div className="page-wrap">
        <div className={`coupon-detail${expired ? ' expired-detail' : ''}`}>
          <div className="detail-img" style={{ background: chain.bg }}>
            {coupon.image
              ? <img src={coupon.image} alt={coupon.name} />
              : <div className="detail-emoji">{chain.emoji}</div>
            }
            {coupon.discount && !expired && <div className="detail-discount">{coupon.discount}</div>}
            {expired && <div className="expired-banner">⏰ פג תוקף</div>}
          </div>

          <div className="detail-info">
            <div className="chain-row">
              <div className="chain-pill" style={{ borderColor: chain.dot }}>
                <div className="chain-dot2" style={{ background: chain.dot }} />
                {coupon.chain}
              </div>
              {expired
                ? <div className="badge-exp-big">⏰ פג תוקף</div>
                : coupon.badge && <div className="badge-hot-big">{coupon.badge === 'חם' ? '🔥 חם' : coupon.badge === 'חדש' ? '✨ חדש' : '⚡ מוגבל'}</div>
              }
            </div>

            <h1 className={expired ? 'title-expired' : ''}>{coupon.name}</h1>

            {coupon.description && <p className="desc">{coupon.description}</p>}

            <div className="meta">
              {coupon.expiry && (
                <div className={`meta-item${expired ? ' meta-expired' : ''}`}>
                  {expired ? '⛔' : '📅'} {expired ? `פג תוקף ב-${coupon.expiry}` : `בתוקף עד: ${coupon.expiry}`}
                </div>
              )}
              {coupon.category && <div className="meta-item">🏷️ {coupon.category}</div>}
            </div>

            {coupon.code && (
              <div className={`code-box${expired ? ' code-expired' : ''}`}>
                <div className="code-label">קוד קופון</div>
                <div className="code-row">
                  <span className="code-text">{revealed ? coupon.code : coupon.code.slice(0,3) + '•••'}</span>
                  {!expired && (
                    <button className={`code-btn${revealed ? ' rev' : ''}${copied ? ' cop' : ''}`} onClick={handleCode}>
                      {copied ? '✅ הועתק!' : revealed ? 'העתק קוד' : 'הצג קוד'}
                    </button>
                  )}
                </div>
                {expired && <div className="code-exp-note">הקופון פג תוקף ואינו ניתן לשימוש</div>}
              </div>
            )}

            {coupon.pdf && !expired && (
              <div className="pdf-box">
                <div>📄</div>
                <div>
                  <div className="pdf-title">חוברת מבצעים מלאה</div>
                  <div className="pdf-sub">{coupon.chain}</div>
                </div>
                <a href={coupon.pdf} target="_blank" rel="noreferrer" className="pdf-btn">פתח PDF</a>
              </div>
            )}
          </div>
        </div>

        <div className="ad-mid">
          <div className="ad-lbl">פרסומת</div>
          Google Ads — 728×90
        </div>

        {related.length > 0 && (
          <div className="related">
            <h2>מבצעים נוספים של {coupon.chain}</h2>
            <div className="related-grid">
              {related.map(c => <CouponCard key={c.id} coupon={c} />)}
            </div>
          </div>
        )}

        <div className="ad-mid" style={{ marginTop: 32 }}>
          <div className="ad-lbl">פרסומת</div>
          Google Ads — 728×90
        </div>
      </div>

      <style jsx>{`
        .page-wrap{max-width:1280px;margin:0 auto;padding:32px 24px}
        .coupon-detail{display:grid;grid-template-columns:1fr 1.4fr;gap:40px;margin-bottom:40px}
        .expired-detail{opacity:.7}
        .detail-img{border-radius:24px;height:360px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
        .detail-img img{width:100%;height:100%;object-fit:cover;border-radius:24px}
        .detail-emoji{font-size:110px}
        .detail-discount{position:absolute;bottom:20px;right:20px;background:#E8321A;color:#fff;font-family:'Rubik',sans-serif;font-size:26px;font-weight:900;padding:10px 20px;border-radius:16px;box-shadow:0 6px 20px rgba(232,50,26,.4)}
        .expired-banner{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;font-family:'Rubik',sans-serif;font-size:28px;font-weight:900;color:#fff;letter-spacing:2px}
        .detail-info{display:flex;flex-direction:column;gap:18px}
        .chain-row{display:flex;align-items:center;gap:10px}
        .chain-pill{display:flex;align-items:center;gap:8px;border:2px solid;border-radius:50px;padding:6px 16px;font-size:14px;font-weight:700}
        .chain-dot2{width:8px;height:8px;border-radius:50%}
        .badge-hot-big{background:#FFE8E5;color:#D42B0F;font-size:13px;font-weight:800;padding:6px 14px;border-radius:20px}
        .badge-exp-big{background:#EEEEEE;color:#757575;font-size:13px;font-weight:800;padding:6px 14px;border-radius:20px}
        h1{font-family:'Rubik',sans-serif;font-size:30px;font-weight:900;color:#1A1A2E;line-height:1.3}
        .title-expired{color:#9E9E9E;text-decoration:line-through}
        .desc{font-size:15px;color:#7A6E68;line-height:1.7}
        .meta{display:flex;flex-direction:column;gap:8px}
        .meta-item{font-size:14px;color:#7A6E68}
        .meta-expired{color:#E53935;font-weight:700}
        .code-box{background:#F5F0EC;border-radius:16px;padding:20px}
        .code-expired{background:#EEEEEE;opacity:.7}
        .code-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#7A6E68;margin-bottom:12px}
        .code-row{display:flex;align-items:center;gap:12px}
        .code-text{font-family:'Rubik',sans-serif;font-size:22px;font-weight:900;color:#1A1A2E;letter-spacing:2px;flex:1}
        .code-btn{background:#1A1A2E;color:#fff;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:800;transition:all .2s;cursor:pointer;border:none;font-family:'Heebo',sans-serif;white-space:nowrap}
        .code-btn:hover,.code-btn.rev{background:#E8321A}
        .code-btn.cop{background:#2E7D32}
        .code-exp-note{font-size:12px;color:#E53935;margin-top:8px}
        .pdf-box{background:#EEF2FF;border:2px solid #C7D2FE;border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:16px;font-size:28px}
        .pdf-title{font-size:15px;font-weight:700;color:#1A1A2E}
        .pdf-sub{font-size:12px;color:#7A6E68;margin-top:2px}
        .pdf-btn{margin-right:auto;background:#4F46E5;color:#fff;border-radius:10px;padding:10px 20px;font-size:13px;font-weight:800;transition:background .18s;font-family:'Heebo',sans-serif}
        .pdf-btn:hover{background:#4338CA}
        .ad-mid{background:#F0F4FF;border:1.5px dashed #C0CFEA;border-radius:14px;padding:20px;text-align:center;font-size:13px;color:#536070;position:relative;margin-bottom:32px}
        .ad-lbl{position:absolute;top:8px;left:12px;background:#C0CFEA;color:#536070;font-size:9px;font-weight:800;padding:2px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:1px}
        .related{margin-bottom:32px}
        .related h2{font-family:'Rubik',sans-serif;font-size:22px;font-weight:900;color:#1A1A2E;margin-bottom:18px}
        .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
        @media(max-width:768px){
          .page-wrap{padding:20px 16px}
          .coupon-detail{grid-template-columns:1fr;gap:20px}
          .detail-img{height:220px}
          h1{font-size:22px}
          .code-row{flex-direction:column;gap:10px}
          .code-btn{width:100%;text-align:center;padding:13px}
          .related-grid{grid-template-columns:repeat(2,1fr);gap:10px}
        }
        @media(max-width:400px){.related-grid{grid-template-columns:1fr}}
      `}</style>
    </Layout>
  );
}

export async function getStaticPaths() {
  const coupons = await getCoupons();
  return { paths: coupons.map(c => ({ params: { id: c.id } })), fallback: 'blocking' };
}
export async function getStaticProps({ params }) {
  const coupons = await getCoupons();
  const coupon = coupons.find(c => c.id === params.id);
  if (!coupon) return { notFound: true };
  const related = coupons.filter(c => c.chain === coupon.chain && c.id !== coupon.id).slice(0, 4);
  return { props: { coupon, related }, revalidate: 60 };
}
