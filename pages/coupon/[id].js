import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/Layout';
import CouponCard from '../../components/CouponCard';
import ChainIcon from '../../components/ChainIcon';
import { getCoupons } from '../../lib/sheets';

const CHAIN_COLORS = {
  'רמי לוי':    '#D42B0F',
  'שופרסל':     '#D42B0F',
  'מגה':        '#22A05A',
  'ויקטורי':    '#FF7A00',
  'יינות ביתן': '#7B1FA2',
  'חצי חינם':   '#D42B0F',
  'יוחננוף':    '#0288D1',
  'אושר עד':    '#388E3C',
};

export default function CouponPage({ coupon, related }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const accent = CHAIN_COLORS[coupon?.chain] || '#E8321A';
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

      {/* Lightbox */}
      {lightbox && coupon.image && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lb-close" onClick={() => setLightbox(false)}>✕</button>
          <img src={coupon.image} alt={coupon.name} onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="wrap">

        {/* ── TOP CARD ── */}
        <div className={`top-card${expired ? ' expired' : ''}`}>

          {/* Image / Icon */}
          <div className="media" onClick={() => coupon.image && setLightbox(true)}
               style={{ cursor: coupon.image ? 'zoom-in' : 'default' }}>
            {coupon.image
              ? <img src={coupon.image} alt={coupon.name} />
              : <div className="media-icon"><ChainIcon chain={coupon.chain} size={80} /></div>
            }
            {coupon.image && <div className="zoom-hint">🔍 לחץ להגדלה</div>}
            {expired && <div className="expired-banner">⏰ פג תוקף</div>}
          </div>

          {/* Info */}
          <div className="info">
            {/* Chain row */}
            <div className="chain-row">
              <ChainIcon chain={coupon.chain} size={36} />
              <span className="chain-name" style={{ color: accent }}>{coupon.chain}</span>
              {!expired && coupon.badge && (
                <span className="badge-pill">
                  {coupon.badge === 'חם' ? '🔥 חם' : coupon.badge === 'חדש' ? '✨ חדש' : '⚡ מוגבל'}
                </span>
              )}
              {expired && <span className="badge-exp">⏰ פג תוקף</span>}
            </div>

            <h1 className={expired ? 'title-exp' : ''}>{coupon.name}</h1>

            {coupon.discount && !expired && (
              <div className="discount-big" style={{ color: accent }}>{coupon.discount}</div>
            )}

            <div className="meta-list">
              {coupon.expiry && (
                <div className={`meta-item${expired ? ' meta-exp' : ''}`}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {expired ? `פג תוקף: ${coupon.expiry}` : `בתוקף עד: ${coupon.expiry}`}
                </div>
              )}
              {coupon.category && (
                <div className="meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  {coupon.category}
                </div>
              )}
            </div>

            {/* Actions */}
            {!expired ? (
              <div className="actions">
                {coupon.url && coupon.type !== 'קוד קופון' && (
                  <a href={coupon.url} target="_blank" rel="noopener noreferrer" className="btn-url" style={{ background: accent }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    לקבלת ההטבה
                  </a>
                )}
                {coupon.code && coupon.type !== 'קישור להטבה' && (
                  <div className="code-box">
                    <div className="code-label">קוד קופון</div>
                    <div className="code-row">
                      <span className="code-val">{revealed ? coupon.code : coupon.code.slice(0,3) + '•••'}</span>
                      <button className={`code-btn${revealed ? ' rev' : ''}${copied ? ' cop' : ''}`}
                              onClick={handleCode} style={{ background: copied ? '#27AE60' : revealed ? accent : '#1A1A2E' }}>
                        {copied ? '✓ הועתק' : revealed ? 'העתק' : 'הצג קוד'}
                      </button>
                    </div>
                  </div>
                )}
                {coupon.pdf && (
                  <a href={coupon.pdf} target="_blank" rel="noreferrer" className="btn-pdf">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    חוברת מבצעים PDF
                  </a>
                )}
              </div>
            ) : (
              <div className="expired-note">⏰ הקופון פג תוקף ואינו ניתן לשימוש</div>
            )}
          </div>
        </div>

        {/* ── DESCRIPTION ── */}
        {coupon.description && (
          <div className="desc-section">
            <h2 className="desc-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              פרטי ההטבה
            </h2>
            <p className="desc-text">{coupon.description}</p>
          </div>
        )}

        {/* ── AD ── */}
        <div className="ad-wrap">
          <div className="ad-strip">
            <span className="ad-tag">פרסומת</span>
            <span style={{fontSize:13,color:'#536070'}}>Google Ads — 728×90</span>
          </div>
        </div>

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <div className="related-section">
            <div className="related-head">
              <span className="related-bar" style={{ background: accent }} />
              <h2>מבצעים נוספים של {coupon.chain}</h2>
            </div>
            <div className="related-grid">
              {related.map(c => <CouponCard key={c.id} coupon={c} />)}
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .wrap { max-width: 1100px; margin: 0 auto; padding: 28px 20px 40px; }

        /* Lightbox */
        .lightbox { position:fixed; inset:0; background:rgba(0,0,0,.92); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
        .lightbox img { max-width:100%; max-height:90vh; object-fit:contain; border-radius:12px; box-shadow:0 24px 80px rgba(0,0,0,.6); }
        .lb-close { position:absolute; top:20px; left:20px; background:rgba(255,255,255,.15); border:none; color:#fff; width:42px; height:42px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .18s; }
        .lb-close:hover { background:rgba(255,255,255,.3); }

        /* Top card */
        .top-card { display:grid; grid-template-columns:1fr 1.3fr; gap:36px; margin-bottom:28px; background:#fff; border-radius:24px; border:1px solid #EDE8E2; overflow:hidden; }
        .expired { opacity:.65; }

        /* Media */
        .media { position:relative; min-height:320px; background:#F5F1EE; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .media img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
        .media:hover img { transform:scale(1.03); }
        .media-icon { display:flex; align-items:center; justify-content:center; width:100%; height:100%; min-height:320px; }
        .zoom-hint { position:absolute; bottom:12px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,.5); color:#fff; font-size:11px; font-weight:700; padding:4px 12px; border-radius:20px; white-space:nowrap; opacity:0; transition:opacity .2s; }
        .media:hover .zoom-hint { opacity:1; }
        .expired-banner { position:absolute; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900; color:#fff; }

        /* Info */
        .info { padding:28px 28px 28px 0; display:flex; flex-direction:column; gap:18px; }
        .chain-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .chain-name { font-size:13px; font-weight:800; letter-spacing:.5px; }
        .badge-pill { background:#FFF0EE; color:#D42B0F; font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; }
        .badge-exp { background:#EEE; color:#777; font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; }
        h1 { font-family:'Rubik',sans-serif; font-size:26px; font-weight:900; color:#1A1A2E; line-height:1.3; margin-bottom: 8px; }
        .title-exp { color:#9E9E9E; text-decoration:line-through; }
        .discount-big { font-family:'Rubik',sans-serif; font-size:42px; font-weight:900; line-height:1; margin-bottom: 4px; }

        /* Meta */
        .meta-list { display:flex; flex-direction:column; gap:7px; }
        .meta-item { display:flex; align-items:center; gap:7px; font-size:13px; color:#7A6E68; }
        .meta-item svg { flex-shrink:0; opacity:.6; }
        .meta-exp { color:#E53935; font-weight:700; }

        /* Actions */
        .actions { display:flex; flex-direction:column; gap:12px; margin-top:4px; }
        .btn-url { display:flex; align-items:center; justify-content:center; gap:10px; color:#fff; border-radius:14px; padding:14px 24px; font-size:15px; font-weight:800; text-decoration:none; transition:opacity .2s; font-family:'Heebo',sans-serif; }
        .btn-url:hover { opacity:.88; }
        .code-box { background:#F5F1EE; border-radius:14px; padding:16px; }
        .code-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#9A9088; margin-bottom:10px; }
        .code-row { display:flex; align-items:center; gap:10px; }
        .code-val { font-family:'Rubik',sans-serif; font-size:20px; font-weight:900; color:#1A1A2E; letter-spacing:2px; flex:1; }
        .code-btn { color:#fff; border-radius:10px; padding:10px 20px; font-size:13px; font-weight:800; cursor:pointer; border:none; font-family:'Heebo',sans-serif; transition:background .18s; white-space:nowrap; }
        .btn-pdf { display:flex; align-items:center; gap:8px; background:#EEF2FF; color:#4F46E5; border-radius:12px; padding:12px 18px; font-size:13px; font-weight:700; transition:background .18s; }
        .btn-pdf:hover { background:#E0E7FF; }
        .expired-note { background:#FFF0EE; color:#C0392B; border-radius:12px; padding:14px 18px; font-size:13px; font-weight:700; }

        /* Description */
        .desc-section { background:#fff; border-radius:20px; border:1px solid #EDE8E2; padding:24px 28px; margin-bottom:24px; }
        .desc-title { display:flex; align-items:center; gap:9px; font-family:'Rubik',sans-serif; font-size:17px; font-weight:900; color:#1A1A2E; margin-bottom:14px; }
        .desc-title svg { color:#E8321A; flex-shrink:0; }
        .desc-text { font-size:15px; color:#4A4440; line-height:1.8; white-space:pre-line; }

        /* Ad */
        .ad-wrap { margin-bottom:28px; }
        .ad-strip { background:#F0F4FF; border:1.5px dashed #C0CFEA; border-radius:14px; padding:20px; text-align:center; position:relative; min-height:70px; display:flex; align-items:center; justify-content:center; }
        .ad-tag { position:absolute; top:8px; right:12px; background:#C0CFEA; color:#536070; font-size:9px; font-weight:800; padding:2px 7px; border-radius:4px; text-transform:uppercase; letter-spacing:1px; }

        /* Related */
        .related-section { }
        .related-head { display:flex; align-items:center; gap:12px; margin-bottom:18px; }
        .related-bar { width:5px; height:22px; border-radius:3px; display:block; flex-shrink:0; }
        .related-head h2 { font-family:'Rubik',sans-serif; font-size:20px; font-weight:900; color:#1A1A2E; }
        .related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; }

        /* Responsive */
        @media (max-width:768px) {
          .wrap { padding:16px 16px 32px; }
          .top-card { grid-template-columns:1fr; }
          .media { min-height:220px; }
          .media-icon { min-height:220px; }
          .info { padding:20px; }
          h1 { font-size:20px; }
          .discount-big { font-size:32px; }
          .related-grid { grid-template-columns:repeat(2,1fr); gap:10px; }
        }
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
