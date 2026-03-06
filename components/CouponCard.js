import Link from 'next/link';
import { useState } from 'react';
import ChainIcon, { CHAIN_DATA } from './ChainIcon';

const CHAIN_META = {
  'רמי לוי':    { accent: '#D42B0F', bg: '#1C0E0E' },
  'שופרסל':     { accent: '#D42B0F', bg: '#1C0E0E' },
  'מגה':        { accent: '#22A05A', bg: '#0F1C13' },
  'ויקטורי':    { accent: '#FF7A00', bg: '#1C1408' },
  'יינות ביתן': { accent: '#7B1FA2', bg: '#150E1C' },
  'חצי חינם':   { accent: '#D42B0F', bg: '#1C0E0E' },
  'יוחננוף':    { accent: '#0288D1', bg: '#0D1520' },
  'אושר עד':    { accent: '#388E3C', bg: '#0F1C13' },
  'סופר-פארם':  { accent: '#9B30CC', bg: '#160E1C' },
  'KSP':        { accent: '#2B74D4', bg: '#0D1520' },
  'לליין':      { accent: '#CC4A1A', bg: '#1C1210' },
  'Wolt':       { accent: '#1AACD4', bg: '#0E181C' },
};
const DEFAULT_META = { accent: '#CC4A1A', bg: '#1C1210' };

const BADGE_LABEL = { 'חם': 'HOT', 'חדש': 'NEW', 'מוגבל': 'LIMITED' };

// Placeholder images per category
const CATEGORY_IMG = {
  'סופרמרקט': 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&q=80',
  'פארם ובריאות': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
  'אלקטרוניקה': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80',
  'טיפוח וקוסמטיקה': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
  'בית ומטבח': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'אופנה': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
};

export function AdCard() {
  return (
    <div className="cc-ad">
      <span className="cc-ad-lbl">AD</span>
      <style jsx>{`
        .cc-ad { background:#F4F1EE; border:1px solid #E8E2DA; border-radius:20px; min-height:320px; display:flex; align-items:center; justify-content:center; position:relative; width:100%; }
        .cc-ad-lbl { font-size:9px; font-weight:700; color:#C0B8B0; letter-spacing:2px; text-transform:uppercase; }
      `}</style>
    </div>
  );
}

export default function CouponCard({ coupon }) {
  const [revealed, setRevealed] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const meta    = CHAIN_META[coupon.chain] || DEFAULT_META;
  const expired = coupon.expired;
  const badgeLabel = BADGE_LABEL[coupon.badge];
  const imgSrc = coupon.image || CATEGORY_IMG[coupon.category] || null;

  function handleCode(e) {
    e.preventDefault(); e.stopPropagation();
    if (expired) return;
    if (!revealed) { setRevealed(true); return; }
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => { setCopied(false); setRevealed(false); }, 2500);
  }

  return (
    <Link href={`/coupon/${coupon.id}`} style={{ textDecoration:'none', display:'block', width:'100%' }}>
      <div className={`cc${expired ? ' cc-exp' : ''}`} style={{ '--accent': meta.accent, '--cbg': meta.bg }}>

        {/* ── IMAGE ── */}
        <div className="cc-img">
          {imgSrc
            ? <img src={imgSrc} alt={coupon.name} onError={e => e.target.style.opacity = 0} />
            : <div className="cc-img-fallback"><ChainIcon chain={coupon.chain} size={56} /></div>
          }
          <div className="cc-img-overlay" />

          {/* Discount badge over image */}
          {coupon.discount && !expired && (
            <div className="cc-pill-discount">{coupon.discount}</div>
          )}

          {/* Status badge */}
          {expired
            ? <div className="cc-pill-status exp">EXPIRED</div>
            : badgeLabel && <div className="cc-pill-status">{badgeLabel}</div>
          }
        </div>

        {/* ── INFO ── */}
        <div className="cc-info">
          <div className="cc-chain">{coupon.chain}</div>
          <div className="cc-name">{coupon.name}</div>
          {coupon.expiry && (
            <div className={`cc-date${expired ? ' cc-date-exp' : ''}`}>
              {expired ? `פג ${coupon.expiry}` : `עד ${coupon.expiry}`}
            </div>
          )}
        </div>

        {/* ── ACTIONS ── */}
        <div className="cc-actions">
          {!expired ? (
            <>
              {coupon.code && coupon.type !== 'קישור להטבה' && (
                <button
                  className={`cc-code${revealed ? ' rev' : ''}${copied ? ' cop' : ''}`}
                  onClick={handleCode}
                >
                  {copied ? '✓ הועתק' : revealed ? coupon.code : 'הצג קוד'}
                </button>
              )}
              {coupon.url && (coupon.type === 'קישור להטבה' || coupon.type === 'קוד + קישור' || (!coupon.code)) && (
                <a href={coupon.url} target="_blank" rel="noopener noreferrer"
                   className="cc-cta-url" onClick={e => e.stopPropagation()}>
                  לקבלת ההטבה
                </a>
              )}
              <Link href={`/coupon/${coupon.id}`} className="cc-cta">
                פרטים ←
              </Link>
            </>
          ) : (
            <div className="cc-cta cc-cta-dead">פג תוקף</div>
          )}
        </div>

      </div>

      <style jsx>{`
        .cc {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #EDE8E2;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          min-height: 300px;
          transition: transform .22s ease, box-shadow .22s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,.05);
        }
        .cc:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,.10); }
        .cc-exp { opacity: .4; filter: grayscale(1); pointer-events: none; }

        /* IMAGE */
        .cc-img {
          position: relative;
          height: 160px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--cbg);
        }
        .cc-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
        .cc:hover .cc-img img { transform: scale(1.06); }
        .cc-img-fallback {
          width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          background: var(--cbg);
          font-size: 52px; font-weight: 900;
          color: rgba(255,255,255,.15);
          font-family: 'Rubik', sans-serif;
        }
        .cc-img-overlay {
          position:absolute; inset:0;
          background: linear-gradient(to top, rgba(0,0,0,.45) 0%, transparent 55%);
        }

        /* PILLS */
        .cc-pill-discount {
          position:absolute; bottom:10px; right:12px;
          background: var(--accent);
          color: #fff;
          font-family: 'Rubik', sans-serif;
          font-size: 14px; font-weight: 900;
          padding: 3px 10px; border-radius: 8px;
          letter-spacing: .2px;
        }
        .cc-pill-status {
          position:absolute; top:10px; left:10px;
          background: rgba(0,0,0,.5);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 9px; font-weight: 800;
          letter-spacing: 1.8px; text-transform: uppercase;
          padding: 3px 8px; border-radius: 5px;
          border: 1px solid rgba(255,255,255,.12);
        }
        .cc-pill-status.exp { background: rgba(50,50,50,.6); }

        /* INFO */
        .cc-info { padding: 14px 14px 6px; flex: 1; }
        .cc-chain {
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.8px; text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 5px;
        }
        .cc-name {
          font-size: 13.5px; font-weight: 600;
          color: #1A1A1A; line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 6px;
        }
        .cc-date { font-size: 11px; color: #B0A89E; }
        .cc-date-exp { color: #D04030; }

        /* ACTIONS */
        .cc-actions {
          padding: 10px 12px 13px;
          border-top: 1px solid #F0EBE4;
          display: flex; gap: 7px; align-items: stretch;
        }

        /* Code button */
        .cc-code {
          flex: 1; min-width: 0;
          background: #F5F1ED;
          border: 1.5px solid #E5DED5;
          border-radius: 10px;
          padding: 8px 10px;
          font-size: 11px; font-weight: 700;
          color: #3A3028;
          cursor: pointer;
          transition: all .18s;
          font-family: 'Rubik', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          letter-spacing: .3px;
        }
        .cc-code:hover { border-color: var(--accent); color: var(--accent); background: #fff; }
        .cc-code.rev {
          background: #fff;
          border-color: var(--accent);
          color: var(--accent);
          letter-spacing: 1.5px;
          font-size: 12px;
          font-weight: 900;
        }
        .cc-code.cop { background: #F0FAF4; border-color: #27AE60; color: #27AE60; }

        /* URL CTA */
        .cc-cta-url {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          background: var(--accent);
          color: #fff;
          border-radius: 10px;
          padding: 8px 10px;
          font-size: 11px; font-weight: 700;
          text-decoration: none;
          transition: opacity .18s;
          font-family: 'Heebo', sans-serif;
          white-space: nowrap;
        }
        .cc-cta-url:hover { opacity: .85; }

        /* Details CTA */
        .cc-cta {
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: #1A1A2E;
          color: #fff;
          border: none; border-radius: 10px;
          padding: 8px 13px;
          font-size: 11px; font-weight: 700;
          cursor: pointer;
          transition: background .18s;
          font-family: 'Heebo', sans-serif;
          white-space: nowrap;
          text-decoration: none;
        }
        .cc-cta:hover { background: var(--accent); }
        .cc-cta-dead {
          flex: 1; background: #D8D4D0; cursor: default;
          display:flex; align-items:center; justify-content:center;
          border-radius:10px; padding:8px; font-size:11px; font-weight:700; color:#fff;
        }
      `}</style>
    </Link>
  );
}
