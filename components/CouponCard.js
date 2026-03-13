import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ChainIcon, { CHAIN_DATA } from './ChainIcon';
import { createClient } from '../lib/supabase';

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
const BADGE_LABEL = { 'חם': '🔥 חם', 'חדש': '✨ חדש', 'מוגבל': '⚡ מוגבל' };

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
  const router  = useRouter();
  const supabase = createClient();
  const [revealed, setRevealed] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [user,     setUser]     = useState(null);
  const meta    = CHAIN_META[coupon.chain] || DEFAULT_META;
  const expired = coupon.expired;
  const badgeLabel = BADGE_LABEL[coupon.badge];
  const imgSrc = coupon.image || null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data?.session?.user ?? null;
      setUser(u);
      if (u) {
        supabase
          .from('favorites')
          .select('id')
          .eq('user_id', u.id)
          .eq('coupon_id', coupon.id)
          .maybeSingle()
          .then(({ data: row }) => setSaved(!!row));
      }
    });
  }, [coupon.id]);

  async function toggleSave(e) {
    e.stopPropagation();
    if (!user) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      return;
    }
    if (saved) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('coupon_id', coupon.id);
      setSaved(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, coupon_id: coupon.id });
      setSaved(true);
    }
  }

  function handleCode(e) {
    e.preventDefault(); e.stopPropagation();
    if (expired) return;
    if (!revealed) { setRevealed(true); return; }
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => { setCopied(false); setRevealed(false); }, 2500);
  }

  return (
    <div onClick={() => router.push(`/coupon/${coupon.id}`)} style={{ textDecoration:'none', display:'block', width:'100%', cursor:'pointer' }}>
      <div className={`cc${expired ? ' cc-exp' : ''}`} style={{ '--accent': meta.accent, '--cbg': meta.bg }}>

        {/* ── IMAGE ── */}
        <div className="cc-img">
          {imgSrc
            ? <img src={imgSrc} alt={coupon.name} onError={e => e.target.style.opacity = 0} />
            : <div className="cc-img-fallback"><ChainIcon chain={coupon.chain} size={56} /></div>
          }
          {coupon.discount && !expired && (
            <div className="cc-pill-discount">{coupon.discount}</div>
          )}
          {expired
            ? <div className="cc-pill-status exp">⏰ פג תוקף</div>
            : badgeLabel && <div className="cc-pill-status">{badgeLabel}</div>
          }

          {/* ── SAVE BUTTON ── */}
          <button className={`cc-save${saved ? ' saved' : ''}`} onClick={toggleSave}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#E8321A' : 'none'} stroke={saved ? '#E8321A' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {!user && <span className="cc-save-tip">התחבר לשמירה</span>}
          </button>
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
            </>
          ) : (
            <div className="cc-cta-dead">פג תוקף</div>
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
        .cc-img { position: relative; height: 160px; overflow: hidden; flex-shrink: 0; background: #F5F1EE; }
        .cc-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
        .cc:hover .cc-img img { transform: scale(1.06); }
        .cc-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background: #F5F1EE; }

        /* SAVE BUTTON */
        .cc-save {
          position: absolute; top: 10px; right: 10px;
          background: rgba(255,255,255,.9);
          backdrop-filter: blur(8px);
          border: none; border-radius: 50%;
          width: 34px; height: 34px;
          font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: transform .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,.15);
        }
        .cc-save:hover { transform: scale(1.15); }
        .cc-save.saved { background: #fff0f0; }
        .cc-save-tip {
          position: absolute; top: 42px; right: 0;
          background: #1A1A2E; color: #fff;
          font-size: 10px; font-weight: 700;
          padding: 4px 8px; border-radius: 6px;
          white-space: nowrap;
          opacity: 0; pointer-events: none;
          transition: opacity .2s;
          font-family: 'Heebo', sans-serif;
        }
        .cc-save:hover .cc-save-tip { opacity: 1; }

        /* PILLS */
        .cc-pill-discount { position:absolute; bottom:10px; right:12px; background: var(--accent); color: #fff; font-family: 'Rubik', sans-serif; font-size: 14px; font-weight: 900; padding: 3px 10px; border-radius: 8px; }
        .cc-pill-status { position:absolute; top:10px; left:10px; background: rgba(0,0,0,.5); backdrop-filter: blur(8px); color: #fff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,.12); }
        .cc-pill-status.exp { background: rgba(50,50,50,.6); }

        /* INFO */
        .cc-info { padding: 14px 14px 6px; flex: 1; }
        .cc-chain { font-size: 10px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; }
        .cc-name { font-size: 13.5px; font-weight: 600; color: #1A1A1A; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 6px; }
        .cc-date { font-size: 11px; color: #B0A89E; }
        .cc-date-exp { color: #D04030; }

        /* ACTIONS */
        .cc-actions { padding: 10px 12px 13px; border-top: 1px solid #F0EBE4; display: flex; gap: 7px; align-items: stretch; }
        .cc-code { flex: 1; min-width: 0; background: #F5F1ED; border: 1.5px solid #E5DED5; border-radius: 10px; padding: 8px 10px; font-size: 11px; font-weight: 700; color: #3A3028; cursor: pointer; transition: all .18s; font-family: 'Rubik', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cc-code:hover { border-color: var(--accent); color: var(--accent); background: #fff; }
        .cc-code.rev { background: #fff; border-color: var(--accent); color: var(--accent); letter-spacing: 1.5px; font-size: 12px; font-weight: 900; }
        .cc-code.cop { background: #F0FAF4; border-color: #27AE60; color: #27AE60; }
        .cc-cta-url { flex: 1; display: flex; align-items: center; justify-content: center; background: var(--accent); color: #fff; border-radius: 10px; padding: 8px 10px; font-size: 11px; font-weight: 700; text-decoration: none; transition: opacity .18s; font-family: 'Heebo', sans-serif; white-space: nowrap; }
        .cc-cta-url:hover { opacity: .85; }
        .cc-cta-dead { flex: 1; background: #D8D4D0; cursor: default; display:flex; align-items:center; justify-content:center; border-radius:10px; padding:8px; font-size:11px; font-weight:700; color:#fff; }
      `}</style>
    </div>
  );
}
