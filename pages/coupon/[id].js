import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
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

  if (!coupon) return <div>קופון לא נמצא</div>;

  function handleCode() {
    if (!revealed) { setRevealed(true); return; }
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => { setCopied(false); setRevealed(false); }, 2000);
  }

  return (
    <>
      <Head>
        <title>{coupon.name} | קופון+</title>
        <meta name="description" content={`${coupon.discount} הנחה ב${coupon.chain} — ${coupon.name}`} />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </Head>

      {/* HEADER */}
      <header>
        <div className="header-inner">
          <Link href="/" className="logo">קופון<span>+</span></Link>
          <nav className="main-nav">
            <Link href="/" className="nav-link active">קופונים</Link>
            <Link href="/contact" className="nav-link">צור קשר</Link>
          </nav>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="breadcrumb-wrap">
        <div className="breadcrumb">
          <Link href="/">ראשי</Link>
          <span>›</span>
          <span>{coupon.category}</span>
          <span>›</span>
          <span className="current">{coupon.chain}</span>
        </div>
      </div>

      <div className="page-wrap">
        {/* MAIN COUPON */}
        <div className="coupon-detail">
          {/* Image / Visual */}
          <div className="detail-img" style={{ background: chain.bg }}>
            {coupon.image
              ? <img src={coupon.image} alt={coupon.name} />
              : <div className="detail-emoji">{chain.emoji}</div>
            }
            {coupon.discount && <div className="detail-discount">{coupon.discount}</div>}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-chain-row">
              <div className="chain-pill" style={{ borderColor: chain.dot }}>
                <div className="chain-dot2" style={{ background: chain.dot }}></div>
                {coupon.chain}
              </div>
              {coupon.badge && <div className="detail-badge">{coupon.badge === 'חם' ? '🔥 חם' : coupon.badge === 'חדש' ? '✨ חדש' : '⚡ מוגבל'}</div>}
            </div>

            <h1 className="detail-title">{coupon.name}</h1>

            {coupon.description && <p className="detail-desc">{coupon.description}</p>}

            <div className="detail-meta">
              {coupon.expiry && <div className="meta-item">📅 <span>בתוקף עד: <b>{coupon.expiry}</b></span></div>}
              {coupon.category && <div className="meta-item">🏷️ <span>קטגוריה: <b>{coupon.category}</b></span></div>}
            </div>

            {/* Code Box */}
            {coupon.code && (
              <div className="code-box">
                <div className="code-label">קוד קופון</div>
                <div className="code-display">
                  <span className="code-text">{revealed ? coupon.code : coupon.code.slice(0,3) + '•••'}</span>
                  <button className={`code-btn ${copied ? 'copied' : revealed ? 'revealed' : ''}`} onClick={handleCode}>
                    {copied ? '✅ הועתק!' : revealed ? 'העתק קוד' : 'הצג קוד'}
                  </button>
                </div>
                <div className="code-hint">לחץ "הצג קוד" כדי לגלות, לחץ שוב כדי להעתיק</div>
              </div>
            )}

            {/* PDF */}
            {coupon.pdf && (
              <div className="pdf-box">
                <div className="pdf-icon">📄</div>
                <div>
                  <div className="pdf-title">חוברת מבצעים מלאה</div>
                  <div className="pdf-sub">לצפייה בכל מבצעי {coupon.chain}</div>
                </div>
                <a href={coupon.pdf} target="_blank" rel="noopener noreferrer" className="pdf-btn">פתח PDF</a>
              </div>
            )}
          </div>
        </div>

        {/* AD */}
        <div className="ad-strip mid-ad">
          <div className="ad-label-txt">פרסומת</div>
          <div className="ad-placeholder">Google Ads — 728×90</div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div className="related-section">
            <h2 className="related-title">מבצעים נוספים של {coupon.chain}</h2>
            <div className="related-grid">
              {related.map(c => (
                <Link key={c.id} href={`/coupon/${c.id}`} className="related-card">
                  <div className="related-img" style={{ background: chain.bg }}>{chain.emoji}</div>
                  <div className="related-body">
                    <div className="related-name">{c.name}</div>
                    {c.discount && <div className="related-disc">{c.discount}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AD BEFORE FOOTER */}
        <div className="ad-strip mid-ad" style={{ marginTop: 32 }}>
          <div className="ad-label-txt">פרסומת</div>
          <div className="ad-placeholder">Google Ads — 728×90</div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-bottom">
            <span>© 2025 קופון+ — כל הזכויות שמורות</span>
            <div className="footer-links">
              <Link href="/privacy">פרטיות</Link>
              <Link href="/terms">תנאים</Link>
              <Link href="/contact">צור קשר</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Heebo', sans-serif; background: #FFF8F3; color: #1A1A1A; direction: rtl; }
        a { text-decoration: none; color: inherit; }
        button { font-family: 'Heebo', sans-serif; cursor: pointer; border: none; background: none; }
        :root { --red: #E8321A; --navy: #1A1A2E; --gray: #F5F0EC; --gray2: #E8E0D8; --muted: #7A6E68; --white: #FFFFFF; }
        header { background: var(--white); border-bottom: 1px solid var(--gray2); position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; gap: 24px; }
        .logo { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 900; color: var(--navy); }
        .logo span { color: var(--red); }
        .main-nav { display: flex; gap: 4px; margin-right: auto; }
        .nav-link { padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--muted); transition: all .18s; }
        .nav-link:hover { background: var(--gray); color: var(--navy); }
        .nav-link.active { background: var(--red); color: #fff; }
        .breadcrumb-wrap { background: var(--white); border-bottom: 1px solid var(--gray2); }
        .breadcrumb { max-width: 1280px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
        .breadcrumb a { color: var(--muted); } .breadcrumb a:hover { color: var(--red); }
        .breadcrumb .current { color: var(--navy); font-weight: 600; }
        .page-wrap { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }
        .coupon-detail { display: grid; grid-template-columns: 1fr 1.4fr; gap: 40px; margin-bottom: 40px; }
        .detail-img { border-radius: 24px; height: 360px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .detail-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; }
        .detail-emoji { font-size: 120px; }
        .detail-discount { position: absolute; bottom: 20px; right: 20px; background: var(--red); color: white; font-family: 'Rubik', sans-serif; font-size: 28px; font-weight: 900; padding: 10px 20px; border-radius: 16px; box-shadow: 0 6px 20px rgba(232,50,26,.4); }
        .detail-info { display: flex; flex-direction: column; gap: 20px; }
        .detail-chain-row { display: flex; align-items: center; gap: 10px; }
        .chain-pill { display: flex; align-items: center; gap: 8px; border: 2px solid; border-radius: 50px; padding: 6px 16px; font-size: 14px; font-weight: 700; }
        .chain-dot2 { width: 8px; height: 8px; border-radius: 50%; }
        .detail-badge { background: #FFE8E5; color: #D42B0F; font-size: 12px; font-weight: 800; padding: 5px 12px; border-radius: 20px; }
        .detail-title { font-family: 'Rubik', sans-serif; font-size: 32px; font-weight: 900; color: var(--navy); line-height: 1.3; }
        .detail-desc { font-size: 16px; color: var(--muted); line-height: 1.7; }
        .detail-meta { display: flex; flex-direction: column; gap: 8px; }
        .meta-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--muted); }
        .meta-item b { color: var(--navy); }
        .code-box { background: var(--gray); border-radius: 16px; padding: 20px; }
        .code-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 12px; }
        .code-display { display: flex; align-items: center; gap: 12px; }
        .code-text { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: var(--navy); letter-spacing: 2px; flex: 1; }
        .code-btn { background: var(--navy); color: white; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 800; transition: all .2s; white-space: nowrap; }
        .code-btn:hover { background: var(--red); }
        .code-btn.revealed { background: var(--red); }
        .code-btn.copied { background: #2E7D32; }
        .code-hint { font-size: 11px; color: var(--muted); margin-top: 8px; }
        .pdf-box { background: #EEF2FF; border: 2px solid #C7D2FE; border-radius: 16px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; }
        .pdf-icon { font-size: 32px; }
        .pdf-title { font-size: 15px; font-weight: 700; color: var(--navy); }
        .pdf-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .pdf-btn { margin-right: auto; background: #4F46E5; color: white; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 800; transition: background .18s; font-family: 'Heebo', sans-serif; }
        .pdf-btn:hover { background: #4338CA; }
        .mid-ad { background: #F0F4FF; border: 1.5px dashed #C0CFEA; border-radius: 16px; padding: 20px; text-align: center; position: relative; margin-bottom: 32px; }
        .ad-label-txt { position: absolute; top: 8px; left: 12px; background: #C0CFEA; color: #536070; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .ad-placeholder { font-size: 13px; color: #536070; padding-top: 6px; }
        .related-section { margin-bottom: 32px; }
        .related-title { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: var(--navy); margin-bottom: 20px; }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .related-card { background: white; border-radius: 16px; border: 2px solid var(--gray2); overflow: hidden; transition: all .2s; display: block; }
        .related-card:hover { transform: translateY(-4px); border-color: var(--red); box-shadow: 0 8px 24px rgba(0,0,0,.1); }
        .related-img { height: 100px; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .related-body { padding: 12px; }
        .related-name { font-size: 13px; font-weight: 700; color: var(--navy); margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .related-disc { font-family: 'Rubik', sans-serif; font-size: 15px; font-weight: 900; color: var(--red); }
        footer { background: var(--navy); padding: 24px; margin-top: 20px; }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 12px; color: rgba(255,255,255,.6); }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { color: rgba(255,255,255,.6); transition: color .15s; }
        .footer-links a:hover { color: #fff; }
      `}</style>
    </>
  );
}

export async function getStaticPaths() {
  const coupons = await getCoupons();
  return {
    paths: coupons.map(c => ({ params: { id: c.id } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const coupons = await getCoupons();
  const coupon = coupons.find(c => c.id === params.id);
  if (!coupon) return { notFound: true };
  const related = coupons.filter(c => c.chain === coupon.chain && c.id !== coupon.id).slice(0, 4);
  return { props: { coupon, related }, revalidate: 3600 };
}
