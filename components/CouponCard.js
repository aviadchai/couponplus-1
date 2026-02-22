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
    <div className="coupon-card ad-card">
      <div className="ad-card-label">פרסומת</div>
      <div className="ad-card-inner">
        <div className="ad-card-icon">🎯</div>
        <div className="ad-card-text">Google Ads</div>
        <div className="ad-card-sub">300×250</div>
      </div>
      <style jsx>{`
        .ad-card { background: #F0F4FF; border: 2px dashed #C0CFEA !important; cursor: default; justify-content: center; align-items: center; min-height: 320px; position: relative; }
        .ad-card:hover { transform: none !important; box-shadow: none !important; border-color: #C0CFEA !important; }
        .ad-card-label { position: absolute; top: 10px; right: 10px; background: #C0CFEA; color: #536070; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; padding: 2px 8px; border-radius: 4px; }
        .ad-card-inner { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .ad-card-icon { font-size: 32px; opacity: .25; }
        .ad-card-text { font-size: 13px; font-weight: 700; color: #536070; }
        .ad-card-sub { font-size: 11px; color: #96AABF; }
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
    <Link href={`/coupon/${coupon.id}`} style={{ textDecoration: 'none' }}>
      <div className={`coupon-card${expired ? ' expired' : ''}`}>
        <div className="card-img">
          {coupon.image
            ? <img src={coupon.image} alt={coupon.name} className="card-img-photo" />
            : <div className="card-img-bg" style={{ background: chain.bg }}>{chain.emoji}</div>
          }
          <div className="card-badge-chain">
            <div className="chain-dot" style={{ background: chain.dot }}></div>
            {coupon.chain}
          </div>
          {expired
            ? <div className="card-badge-status badge-exp">⏰ פג תוקף</div>
            : badge && <div className={`card-badge-status ${badge.cls}`}>{badge.label}</div>
          }
          {coupon.discount && !expired && <div className="card-discount-badge">{coupon.discount}</div>}
        </div>
        <div className="card-body">
          <div className="card-title">{coupon.name}</div>
          {coupon.expiry && (
            <div className={`card-meta${expired ? ' expired-date' : ''}`}>
              {expired ? `⛔ פג ב-${coupon.expiry}` : `📅 עד ${coupon.expiry}`}
            </div>
          )}
        </div>
        <div className="card-footer-bar">
          <button className={`btn-details${expired ? ' expired' : ''}`}>
            {expired ? '⏰ פג תוקף' : 'לפרטים ולקוד →'}
          </button>
          {coupon.code && !expired && (
            <button className={`btn-code${revealed ? ' revealed' : ''}${copied ? ' copied' : ''}`} onClick={handleCode}>
              {copied ? '✅ הועתק!' : revealed ? coupon.code : masked}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
