import Link from 'next/link';
import { useState } from 'react';

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
const BADGE_MAP = {
  'חם':    { cls: 'badge-hot', label: '🔥 חם' },
  'חדש':   { cls: 'badge-new', label: '✨ חדש' },
  'מוגבל': { cls: 'badge-lim', label: '⚡ מוגבל' },
};

export function AdCard() {
  return (
    <div className="cc-ad">
      <span className="cc-ad-tag">פרסומת</span>
      <div className="cc-ad-inner">
        <div style={{ fontSize: 28, opacity: .2 }}>🎯</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#536070' }}>Google Ads</div>
        <div style={{ fontSize: 11, color: '#96AABF' }}>300×250</div>
      </div>
      <style jsx>{`
        .cc-ad { background: #F0F4FF; border: 2px dashed #C0CFEA; border-radius: 18px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; cursor: default; width: 100%; }
        .cc-ad-tag { position: absolute; top: 10px; right: 10px; background: #C0CFEA; color: #536070; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 2px 7px; border-radius: 4px; }
        .cc-ad-inner { display: flex; flex-direction: column; align-items: center; gap: 8px; }
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

  // Show first 3 chars + blur the rest
  const codeVisible = coupon.code ? coupon.code.slice(0, 3) : '';
  const codeHidden  = coupon.code ? coupon.code.slice(3)    : '';

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
      <div className={`cc-card${expired ? ' cc-expired' : ''}`}>

        {/* IMAGE */}
        <div className="cc-img">
          {coupon.image
            ? <img src={coupon.image} alt={coupon.name}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            : null}
          <div className="cc-emoji" style={{ background: chain.bg, display: coupon.image ? 'none' : 'flex' }}>{chain.emoji}</div>
          <div className="cc-chain"><div className="cc-dot" style={{ background: chain.dot }} />{coupon.chain}</div>
          {expired
            ? <div className="cc-badge cc-exp">⏰ פג תוקף</div>
            : badge && <div className={`cc-badge ${badge.cls}`}>{badge.label}</div>}
          {coupon.discount && !expired && <div className="cc-discount">{coupon.discount}</div>}
        </div>

        {/* BODY */}
        <div className="cc-body">
          <div className="cc-title">{coupon.name}</div>
          {coupon.expiry && (
            <div className={`cc-meta${expired ? ' cc-meta-exp' : ''}`}>
              {expired ? `⛔ פג ב-${coupon.expiry}` : `📅 עד ${coupon.expiry}`}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="cc-footer">
          <button className={`cc-btn-main${expired ? ' cc-btn-exp' : ''}`}>
            {expired ? '⏰ פג תוקף' : 'פרטים נוספים →'}
          </button>

          {/* קישור להטבה — when type is url-based */}
          {coupon.url && !expired && (coupon.type === 'קישור להטבה' || coupon.type === 'קוד + קישור' || !coupon.code) && (
            <a href={coupon.url} target="_blank" rel="noopener noreferrer"
               className="cc-btn-url" onClick={e => e.stopPropagation()}>
              🔗 לקבלת ההטבה
            </a>
          )}

          {/* קוד קופון sticker — when type has a code */}
          {coupon.code && !expired && coupon.type !== 'קישור להטבה' && (
            <button className={`cc-sticker${revealed ? ' rev' : ''}${copied ? ' cop' : ''}`} onClick={handleCode}>
              {copied ? (
                <span className="sticker-copied">✅ הועתק!</span>
              ) : revealed ? (
                <span className="sticker-code">{coupon.code}</span>
              ) : (
                <span className="sticker-mask">
                  <span className="sticker-visible">{coupon.code.slice(0,3)}</span>
                  <span className="sticker-peel">
                    <span className="sticker-dots">••••</span>
                    <span className="sticker-tap">הצג</span>
                  </span>
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        /* ── CARD ── */
        .cc-card {
          background: #fff;
          border-radius: 18px;
          border: 2px solid #E8E0D8;
          box-shadow: 0 2px 10px rgba(0,0,0,.06);
          transition: transform .22s, box-shadow .22s, border-color .22s;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 100%;
          height: 100%;
          min-height: 310px;
        }
        .cc-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,.13); border-color: #E8321A; }
        .cc-expired { opacity: .52; filter: grayscale(.7); pointer-events: none; }

        /* ── IMAGE ── */
        .cc-img { width: 100%; height: 150px; position: relative; overflow: hidden; flex-shrink: 0; background: #F5F0EC; }
        .cc-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s; }
        .cc-card:hover .cc-img img { transform: scale(1.06); }
        .cc-emoji { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 56px; transition: transform .4s; }
        .cc-card:hover .cc-emoji { transform: scale(1.06); }
        .cc-chain { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.65); color: #fff; font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 20px; display: flex; align-items: center; gap: 4px; z-index: 2; }
        .cc-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .cc-badge { position: absolute; top: 10px; left: 10px; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 20px; z-index: 2; }
        .badge-hot { background: #FFE8E5; color: #D42B0F; }
        .badge-new { background: #E5FFE8; color: #0F8A1E; }
        .badge-lim { background: #FFF5E5; color: #B06000; }
        .cc-exp    { background: #EEE;    color: #757575; }
        .cc-discount { position: absolute; bottom: 10px; right: 10px; background: #E8321A; color: #fff; font-family: 'Rubik', sans-serif; font-size: 18px; font-weight: 900; padding: 4px 11px; border-radius: 10px; z-index: 2; }

        /* ── BODY ── */
        .cc-body { padding: 12px 14px 8px; flex: 1; min-height: 0; }
        .cc-title { font-size: 13.5px; font-weight: 700; color: #1A1A2E; line-height: 1.4; margin-bottom: 5px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cc-meta { font-size: 11px; color: #7A6E68; }
        .cc-meta-exp { color: #E53935; }

        /* ── FOOTER ── */
        .cc-footer { padding: 10px 12px; border-top: 1px solid #F5F0EC; display: flex; gap: 7px; flex-shrink: 0; align-items: center; }
        .cc-btn-main { flex: 1; background: #1A1A2E; color: #fff; border-radius: 9px; padding: 9px 6px; font-size: 12px; font-weight: 800; text-align: center; transition: background .18s; border: none; cursor: pointer; font-family: 'Heebo', sans-serif; white-space: nowrap; }
        .cc-btn-main:hover { background: #E8321A; }
        .cc-btn-exp { background: #9E9E9E; cursor: not-allowed; }
        .cc-btn-link { display:flex; align-items:center; justify-content:center; gap:5px; background:linear-gradient(135deg,#2DB86A,#1a9453); color:#fff; border-radius:9px; padding:0 12px; height:36px; font-size:12px; font-weight:800; font-family:'Heebo',sans-serif; white-space:nowrap; flex-shrink:0; transition:all .18s; text-decoration:none; }
        .cc-btn-link:hover { background:linear-gradient(135deg,#34d679,#22b560); transform:translateY(-1px); box-shadow:0 4px 14px rgba(45,184,106,.35); }
        .cc-btn-exp:hover { background: #9E9E9E !important; }

        /* ══════════════════════════════
           STICKER BUTTON
        ══════════════════════════════ */
        .cc-btn-url { display:flex; align-items:center; height:36px; padding:0 11px; background:linear-gradient(135deg,#1565C0,#1976D2); color:#fff; border-radius:9px; font-size:11px; font-weight:800; white-space:nowrap; text-decoration:none; transition:all .18s; font-family:'Heebo',sans-serif; flex-shrink:0; gap:4px; }
        .cc-btn-url:hover { background:linear-gradient(135deg,#0D47A1,#1565C0); transform:scale(1.03); }
        .cc-sticker {
          position: relative;
          border: none;
          cursor: pointer;
          border-radius: 9px;
          padding: 0;
          background: transparent;
          font-family: 'Rubik', sans-serif;
          transition: transform .15s;
          flex-shrink: 0;
          height: 36px;
          display: flex;
          align-items: stretch;
        }
        .cc-sticker:hover { transform: scale(1.05); }
        .cc-sticker:active { transform: scale(.97); }

        /* STATE: masked */
        .s-mask {
          display: flex;
          align-items: stretch;
          border-radius: 9px;
          overflow: hidden;
          height: 36px;
          border: 1.5px solid #E8E0D8;
          box-shadow: 0 2px 6px rgba(0,0,0,.08);
        }
        /* visible chars */
        .s-vis {
          display: flex;
          align-items: center;
          padding: 0 9px;
          background: #F8F6F3;
          color: #1A1A2E;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 1.5px;
          border-left: 1.5px solid #E8E0D8;
        }
        /* hidden chars behind sticker */
        .s-hidden-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .s-hidden-code {
          display: flex;
          align-items: center;
          padding: 0 8px;
          background: #F8F6F3;
          color: #1A1A2E;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 1.5px;
          filter: blur(3.5px);
          user-select: none;
          pointer-events: none;
        }
        /* red peel sticker ON TOP of blurred chars */
        .s-peel {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #E8321A 0%, #c42810 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 0 10px;
          border-radius: 0 7px 7px 0;
          /* torn paper edge on left */
          box-shadow: -3px 0 6px rgba(0,0,0,.2), inset -1px 0 0 rgba(255,255,255,.1);
        }
        /* tiny triangle "peel" corner top-left */
        .s-peel::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 8px 8px 0 0;
          border-color: rgba(0,0,0,.25) transparent transparent transparent;
        }
        .s-peel-dots {
          font-size: 11px;
          color: rgba(255,255,255,.6);
          letter-spacing: 2px;
        }
        .s-peel-label {
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: .5px;
          background: rgba(255,255,255,.18);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* STATE: revealed */
        .s-open {
          display: flex;
          align-items: center;
          height: 36px;
          border-radius: 9px;
          overflow: hidden;
          border: 1.5px dashed #E65100;
          animation: pop .22s ease;
        }
        .s-open-code {
          padding: 0 10px;
          background: #FFF3E0;
          color: #E65100;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
          height: 100%;
          display: flex;
          align-items: center;
        }
        .s-open-copy {
          padding: 0 9px;
          background: #E65100;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          height: 100%;
          display: flex;
          align-items: center;
        }

        /* STATE: copied */
        .s-copied {
          display: flex;
          align-items: center;
          padding: 0 12px;
          height: 36px;
          background: #E8F5E9;
          color: #2E7D32;
          font-size: 12px;
          font-weight: 800;
          border-radius: 9px;
          border: 1.5px solid #A5D6A7;
        }

        @keyframes pop {
          0%   { transform: scale(.92); }
          60%  { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Link>
  );
}
