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
    <div className="coupon-card ad-card" style={{ width: 250, flexShrink: 0 }}>
      <div className="ad-card-inner">
        <div style={{ fontSize: 28, opacity: .25 }}>🎯</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#536070' }}>Google Ads</div>
        <div style={{ fontSize: 11, color: '#96AABF' }}>300×250</div>
      </div>
      <style jsx>{`
        .ad-card { background: #F0F4FF; border: 2px dashed #C0CFEA !important; cursor: default; min-height: 300px; justify-content: center; align-items: center; }
        .ad-card:hover { transform: none !important; box-shadow: none !important; border-color: #C0CFEA !important; }
        .ad-card-inner { display: flex; flex-direction: column; align-items: center; gap: 8px; }
      `}</style>
    </div>
  );
}

export default function CouponCard({ coupon }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const chain = CHAIN_COLORS[coupon.chain] || DEFAULT_CHAIN;
  const badge = BADGE_MAP[coupon.badge];
  const masked = coupon.code ? coupon.code.slice(0, 3) + '•••' : '';
  const expired = coupon.expired;

  function handleCode(e) {
    e.preventDefault();
    e.stopPropagation();
    if (expired) return;
    if (!revealed) { setRevealed(true); return; }
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => { setCopied(false); setRevealed(false); }, 2000);
  }

  return (
    <Link href={`/coupon/${coupon.id}`} style={{ textDecoration: 'none', display: 'flex' }}>
      <div className={`cc-card${expired ? ' cc-expired' : ''}`}>
        <div className="cc-img">
          {coupon.image
            ? <img src={coupon.image} alt={coupon.name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            : null}
          <div className="cc-emoji" style={{ background: chain.bg, display: coupon.image ? 'none' : 'flex' }}>{chain.emoji}</div>
          <div className="cc-chain"><div className="cc-dot" style={{ background: chain.dot }} />{coupon.chain}</div>
          {expired
            ? <div className="cc-badge cc-exp">⏰ פג תוקף</div>
            : badge && <div className={`cc-badge ${badge.cls}`}>{badge.label}</div>
          }
          {coupon.discount && !expired && <div className="cc-discount">{coupon.discount}</div>}
        </div>
        <div className="cc-body">
          <div className="cc-title">{coupon.name}</div>
          {coupon.expiry && (
            <div className={`cc-meta${expired ? ' cc-meta-exp' : ''}`}>
              {expired ? `⛔ פג ב-${coupon.expiry}` : `📅 עד ${coupon.expiry}`}
            </div>
          )}
        </div>
        <div className="cc-footer">
          <button className={`cc-btn-main${expired ? ' cc-btn-exp' : ''}`}>
            {expired ? '⏰ פג תוקף' : 'לפרטים ולקוד →'}
          </button>
          {coupon.code && !expired && (
            <button className={`cc-btn-code${revealed ? ' rev' : ''}${copied ? ' cop' : ''}`} onClick={handleCode}>
              {copied ? '✅ הועתק!' : revealed ? coupon.code : masked}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .cc-card {
          background: #fff;
          border-radius: 18px;
          border: 2px solid #E8E0D8;
          box-shadow: 0 2px 12px rgba(0,0,0,.06);
          transition: transform .25s, box-shadow .25s, border-color .25s;
          display: flex;
          flex-direction: column;
          overflow: visible;
          width: 250px;
          min-height: 320px;
        }
        .cc-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,.14); border-color: #E8321A; }
        .cc-expired { opacity: .55; filter: grayscale(.7); pointer-events: none; }
        .cc-expired:hover { transform: none; box-shadow: 0 2px 12px rgba(0,0,0,.06); border-color: #E8E0D8; }
        .cc-img { width: 100%; height: 155px; position: relative; border-radius: 16px 16px 0 0; overflow: hidden; flex-shrink: 0; background: #F5F0EC; }
        .cc-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
        .cc-card:hover .cc-img img { transform: scale(1.06); }
        .cc-emoji { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 58px; transition: transform .4s; }
        .cc-card:hover .cc-emoji { transform: scale(1.06); }
        .cc-chain { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.65); backdrop-filter: blur(6px); color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 5px; z-index: 2; }
        .cc-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .cc-badge { position: absolute; top: 10px; left: 10px; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; z-index: 2; }
        .badge-hot { background: #FFE8E5; color: #D42B0F; }
        .badge-new { background: #E5FFE8; color: #0F8A1E; }
        .badge-lim { background: #FFF5E5; color: #B06000; }
        .cc-exp { background: #EEEEEE; color: #757575; }
        .cc-discount { position: absolute; bottom: 10px; right: 10px; background: #E8321A; color: #fff; font-family: 'Rubik', sans-serif; font-size: 19px; font-weight: 900; padding: 5px 12px; border-radius: 10px; box-shadow: 0 4px 12px rgba(232,50,26,.35); z-index: 2; }
        .cc-body { padding: 14px 14px 8px; flex: 1; }
        .cc-title { font-size: 14px; font-weight: 700; color: #1A1A2E; line-height: 1.4; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cc-meta { font-size: 11px; color: #7A6E68; }
        .cc-meta-exp { color: #E53935; }
        .cc-footer { padding: 10px 14px 12px; border-top: 1px solid #F5F0EC; display: flex; gap: 8px; border-radius: 0 0 16px 16px; }
        .cc-btn-main { flex: 1; background: #1A1A2E; color: #fff; border-radius: 10px; padding: 9px 8px; font-size: 12.5px; font-weight: 800; text-align: center; transition: background .18s; border: none; cursor: pointer; font-family: 'Heebo', sans-serif; }
        .cc-btn-main:hover { background: #E8321A; }
        .cc-btn-exp { background: #9E9E9E; cursor: not-allowed; }
        .cc-btn-exp:hover { background: #9E9E9E; }
        .cc-btn-code { background: #F5F0EC; color: #1A1A2E; border-radius: 10px; padding: 9px 10px; font-size: 11.5px; font-weight: 800; font-family: 'Rubik', sans-serif; letter-spacing: 1px; transition: all .18s; white-space: nowrap; border: none; cursor: pointer; }
        .cc-btn-code.rev { background: #FFF3E0; color: #E65100; letter-spacing: 2px; }
        .cc-btn-code.cop { background: #E8F5E9; color: #2E7D32; letter-spacing: normal; }
      `}</style>
    </Link>
  );
}
