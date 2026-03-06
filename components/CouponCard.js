import Link from 'next/link';
import { useState } from 'react';

const CHAIN_COLORS = {
  'רמי לוי':    { accent: '#C8921A', bg: '#1C1A14', emoji: '🛒' },
  'שופרסל':     { accent: '#1A8C4E', bg: '#101C14', emoji: '🧴' },
  'מגה':        { accent: '#1A5FB5', bg: '#0E1420', emoji: '🥩' },
  'ויקטורי':    { accent: '#B52A2A', bg: '#1C1010', emoji: '🥛' },
  'יינות ביתן': { accent: '#7C3FA8', bg: '#150E1C', emoji: '🍷' },
  'חצי חינם':   { accent: '#C87820', bg: '#1C1710', emoji: '🏷️' },
  'סופר-פארם':  { accent: '#8B2AB0', bg: '#160E1C', emoji: '💊' },
  'KSP':        { accent: '#2A6DB5', bg: '#0E1520', emoji: '📱' },
  'לליין':      { accent: '#B54A1A', bg: '#1C1210', emoji: '💄' },
  'Wolt':       { accent: '#1AA0C8', bg: '#0E1820', emoji: '🛵' },
};
const DEFAULT_CHAIN = { accent: '#C84A1A', bg: '#1C1210', emoji: '🎫' };
const BADGE_MAP = {
  'חם':    { label: 'HOT' },
  'חדש':   { label: 'NEW' },
  'מוגבל': { label: 'LIMITED' },
};

export function AdCard() {
  return (
    <div className="cc-ad">
      <span className="cc-ad-tag">AD</span>
      <style jsx>{`
        .cc-ad { background: #F7F5F2; border: 1px solid #E8E2D9; border-radius: 16px; min-height: 300px; display:flex; align-items:center; justify-content:center; position:relative; width:100%; }
        .cc-ad-tag { font-size:9px; font-weight:700; color:#BDB6AC; letter-spacing:2px; text-transform:uppercase; }
      `}</style>
    </div>
  );
}

export default function CouponCard({ coupon }) {
  const [revealed, setRevealed] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const chain   = CHAIN_COLORS[coupon.chain] || DEFAULT_CHAIN;
  const badge   = BADGE_MAP[coupon.badge];
  const expired = coupon.expired;

  function handleCode(e) {
    e.preventDefault();
    e.stopPropagation();
    if (expired) return;
    if (!revealed) { setRevealed(true); return; }
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => { setCopied(false); setRevealed(false); }, 2500);
  }

  return (
    <Link href={`/coupon/${coupon.id}`} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
      <div className={`cc-card${expired ? ' cc-expired' : ''}`} style={{ '--accent': chain.accent, '--bg': chain.bg }}>

        {/* IMAGE AREA */}
        <div className="cc-img">
          {coupon.image
            ? <img src={coupon.image} alt={coupon.name}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            : null}
          <div className="cc-emoji-wrap" style={{ display: coupon.image ? 'none' : 'flex' }}>
            <span className="cc-emoji">{chain.emoji}</span>
          </div>

          {/* Discount pill — top left */}
          {coupon.discount && !expired && (
            <div className="cc-discount">{coupon.discount}</div>
          )}

          {/* Badge — top right */}
          {!expired && badge && (
            <div className="cc-badge">{badge.label}</div>
          )}
          {expired && <div className="cc-badge cc-badge-exp">EXPIRED</div>}
        </div>

        {/* BODY */}
        <div className="cc-body">
          <div className="cc-chain-name">{coupon.chain}</div>
          <div className="cc-title">{coupon.name}</div>
          {coupon.expiry && (
            <div className={`cc-expiry${expired ? ' cc-expiry-exp' : ''}`}>
              {expired ? `פג תוקף ${coupon.expiry}` : `עד ${coupon.expiry}`}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="cc-footer">
          {!expired ? (
            <>
              {coupon.code && coupon.type !== 'קישור להטבה' && (
                <button className={`cc-code-btn${revealed ? ' rev' : ''}${copied ? ' cop' : ''}`} onClick={handleCode}>
                  <span className="cc-code-inner">
                    {copied ? '✓ הועתק' : revealed ? coupon.code : 'הצג קוד'}
                  </span>
                </button>
              )}
              {coupon.url && (coupon.type === 'קישור להטבה' || coupon.type === 'קוד + קישור' || (!coupon.code && coupon.url)) && (
                <a href={coupon.url} target="_blank" rel="noopener noreferrer"
                   className="cc-url-btn" onClick={e => e.stopPropagation()}>
                  לקבלת ההטבה ↗
                </a>
              )}
              <button className="cc-details-btn">פרטים</button>
            </>
          ) : (
            <button className="cc-details-btn cc-details-exp">פג תוקף</button>
          )}
        </div>

      </div>

      <style jsx>{`
        .cc-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #ECDDD0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 100%;
          height: 100%;
          min-height: 300px;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,.05);
        }
        .cc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,.10);
          border-color: var(--accent);
        }
        .cc-expired { opacity: .45; filter: grayscale(1); pointer-events: none; }

        /* IMAGE */
        .cc-img {
          width: 100%;
          height: 148px;
          position: relative;
          overflow: hidden;
          background: var(--bg);
          flex-shrink: 0;
        }
        .cc-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
        .cc-card:hover .cc-img img { transform: scale(1.05); }
        .cc-emoji-wrap {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg);
        }
        .cc-emoji { font-size: 52px; opacity: .85; }

        /* DISCOUNT */
        .cc-discount {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: var(--accent);
          color: #fff;
          font-family: 'Rubik', sans-serif;
          font-size: 15px;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 8px;
          letter-spacing: .3px;
        }

        /* BADGE */
        .cc-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,.55);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,.15);
        }
        .cc-badge-exp { background: rgba(80,80,80,.6); }

        /* BODY */
        .cc-body { padding: 14px 14px 8px; flex: 1; }
        .cc-chain-name {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 5px;
        }
        .cc-title {
          font-size: 13px;
          font-weight: 600;
          color: #1A1A2E;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .cc-expiry { font-size: 11px; color: #A09890; }
        .cc-expiry-exp { color: #C0392B; }

        /* FOOTER */
        .cc-footer {
          padding: 10px 12px 12px;
          border-top: 1px solid #F0EAE4;
          display: flex;
          gap: 7px;
          flex-shrink: 0;
          align-items: stretch;
        }

        /* CODE BTN */
        .cc-code-btn {
          flex: 1;
          border: 1.5px solid #E0D8D0;
          background: #FAF7F4;
          border-radius: 9px;
          cursor: pointer;
          transition: all .18s;
          padding: 0;
          overflow: hidden;
          font-family: 'Rubik', sans-serif;
          min-width: 0;
        }
        .cc-code-btn:hover { border-color: var(--accent); background: #fff; }
        .cc-code-inner {
          display: block;
          padding: 8px 10px;
          font-size: 11px;
          font-weight: 700;
          color: #3A3028;
          letter-spacing: .5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cc-code-btn.rev .cc-code-inner {
          color: var(--accent);
          letter-spacing: 1.5px;
          font-size: 12px;
          font-weight: 900;
        }
        .cc-code-btn.cop { border-color: #27AE60; background: #F0FBF4; }
        .cc-code-btn.cop .cc-code-inner { color: #27AE60; }

        /* URL BTN */
        .cc-url-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent);
          color: #fff;
          border-radius: 9px;
          padding: 8px 10px;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          transition: opacity .18s;
          white-space: nowrap;
          font-family: 'Heebo', sans-serif;
        }
        .cc-url-btn:hover { opacity: .85; }

        /* DETAILS BTN */
        .cc-details-btn {
          flex-shrink: 0;
          background: #1A1A2E;
          color: #fff;
          border: none;
          border-radius: 9px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: background .18s;
          font-family: 'Heebo', sans-serif;
          white-space: nowrap;
        }
        .cc-details-btn:hover { background: var(--accent); }
        .cc-details-exp { background: #C0C0C0; cursor: default; flex: 1; }
        .cc-details-exp:hover { background: #C0C0C0 !important; }
      `}</style>
    </Link>
  );
}
