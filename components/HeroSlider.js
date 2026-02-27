import { useState, useEffect, useCallback } from 'react';

const TINTS = [
  'linear-gradient(135deg,#6A1B9A,transparent)',
  'linear-gradient(135deg,#E8321A,transparent)',
  'linear-gradient(135deg,#1565C0,transparent)',
];
const FALLBACK_BG = [
  'linear-gradient(135deg,#1A0D2E,#6A1B9A)',
  'linear-gradient(135deg,#1A1A2E,#C0321A)',
  'linear-gradient(135deg,#0D2137,#1565C0)',
];
const TAG_EMOJI = {
  'סופרמרקט':'🛒','אלקטרוניקה':'📱','טיפוח':'💄','פארם':'💊',
  'טיפוח וקוסמטיקה':'💄','פארם ובריאות':'💊','בית ומטבח':'🏠',
  'אופנה':'👗','חיות מחמד':'🐾','בינלאומי':'🌍',
};

export default function HeroSlider({ slides = [] }) {
  const [cur,     setCur]     = useState(0);
  const [revealed,setRevealed]= useState(false);
  const [copied,  setCopied]  = useState(false);
  const total = slides.length;

  const goTo = useCallback(i => {
    setCur(((i % total) + total) % total);
    setRevealed(false);
    setCopied(false);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const t = setTimeout(() => goTo(cur + 1), 4500);
    return () => clearTimeout(t);
  }, [cur, total, goTo]);

  if (!total) return null;

  const slide = slides[cur];

  function handleCode(e) {
    e.preventDefault(); e.stopPropagation();
    if (!revealed) { setRevealed(true); return; }
    navigator.clipboard.writeText(slide.code).catch(()=>{});
    setCopied(true);
    setTimeout(() => { setCopied(false); setRevealed(false); }, 2000);
  }

  return (
    <div className="hs-outer">
      <div className="hs-header">
        <span className="hs-bar" />
        <span className="hs-title">המבצעים הכי חמים 🔥</span>
      </div>

      <div className="hs-slider">
        <span className="hs-hot">🔥 חם עכשיו</span>

        {total > 1 && <>
          <button className="hs-arr hs-arr-r" onClick={() => goTo(cur - 1)}>‹</button>
          <button className="hs-arr hs-arr-l" onClick={() => goTo(cur + 1)}>›</button>
        </>}

        {/* Slides */}
        <div className="hs-track" style={{ transform: `translateX(${cur * 100}%)` }}>
          {slides.map((s, i) => (
            <div key={i} className="hs-slide">
              {/* Background image or gradient */}
              <div className="hs-bg" style={{
                backgroundImage: s.image ? `url(${s.image})` : 'none',
                background: s.image ? undefined : FALLBACK_BG[i % 3],
              }} />
              {/* Overlay */}
              <div className="hs-overlay" />
              {/* Color tint */}
              <div className="hs-tint" style={{ background: TINTS[i % 3] }} />

              {/* Content */}
              <div className="hs-content">
                <div className="hs-left">
                  {s.tag && (
                    <span className="hs-tag">
                      {TAG_EMOJI[s.tag] || '🎫'} {s.tag}
                    </span>
                  )}
                  <div className="hs-name">{s.title}</div>
                  {s.subtitle && <div className="hs-sub">{s.subtitle}</div>}
                  <div className="hs-btns">
                    {/* URL button */}
                    {s.url && s.type !== 'קוד קופון' && (
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                         className="hs-btn-url" onClick={e => e.stopPropagation()}>
                        🔗 לקבלת ההטבה
                      </a>
                    )}
                    {/* Code sticker */}
                    {s.code && s.type !== 'קישור להטבה' && (
                      <button
                        className={`hs-sticker${i === cur && revealed ? ' rev' : ''}${i === cur && copied ? ' cop' : ''}`}
                        onClick={handleCode}
                      >
                        {i === cur && copied ? (
                          <span className="hs-cop">✅ הועתק!</span>
                        ) : i === cur && revealed ? (
                          <span className="hs-code-full">{s.code}</span>
                        ) : (
                          <span className="hs-mask">
                            <span className="hs-vis">{s.code.slice(0, 4)}</span>
                            <span className="hs-peel">
                              <span className="hs-dots">••••</span>
                              <span className="hs-tap">הצג</span>
                            </span>
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {s.discount && (
                  <div className="hs-discount">{s.discount}</div>
                )}
              </div>
              <div className="hs-counter">{i + 1} / {total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="hs-dots">
          {slides.map((_, i) => (
            <button key={i} className={`hs-dot${i === cur ? ' on' : ''}`} onClick={() => goTo(i)} />
          ))}
        </div>
      )}

      <style jsx>{`
        .hs-outer { padding:0 20px; max-width:1280px; margin:28px auto 0; }
        .hs-header { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
        .hs-bar { width:5px; height:22px; background:#E8321A; border-radius:3px; display:block; flex-shrink:0; }
        .hs-title { font-family:'Rubik',sans-serif; font-size:20px; font-weight:900; color:#1A1A2E; }

        /* Slider shell */
        .hs-slider { position:relative; border-radius:22px; overflow:hidden; height:400px; box-shadow:0 12px 48px rgba(0,0,0,.22); }
        .hs-track { display:flex; height:100%; transition:transform .55s cubic-bezier(.4,0,.2,1); }
        .hs-slide { min-width:100%; height:100%; position:relative; display:flex; align-items:flex-end; }

        /* Layers */
        .hs-bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:transform 6s ease; }
        .hs-slide:hover .hs-bg { transform:scale(1.04); }
        .hs-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.5) 40%,rgba(0,0,0,.15) 70%,rgba(0,0,0,.0) 100%); }
        .hs-tint { position:absolute; inset:0; opacity:.22; }

        /* Content */
        .hs-content { position:relative; z-index:3; width:100%; padding:32px 44px; display:flex; justify-content:space-between; align-items:flex-end; gap:20px; }
        .hs-left { flex:1; min-width:0; }
        .hs-tag { display:inline-flex; background:rgba(255,255,255,.12); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,.2); color:#fff; font-size:11px; font-weight:800; padding:4px 14px; border-radius:20px; margin-bottom:12px; letter-spacing:.5px; }
        .hs-name { font-family:'Rubik',sans-serif; font-size:32px; font-weight:900; color:#fff; line-height:1.2; margin-bottom:9px; text-shadow:0 2px 20px rgba(0,0,0,.4); }
        .hs-sub { font-size:14px; color:rgba(255,255,255,.6); margin-bottom:18px; line-height:1.5; }
        .hs-discount { font-family:'Rubik',sans-serif; font-size:72px; font-weight:900; color:#fff; line-height:1; flex-shrink:0; opacity:.92; text-shadow:0 4px 30px rgba(0,0,0,.4); }

        /* Buttons */
        .hs-btns { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
        .hs-btn-url { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,.12); backdrop-filter:blur(10px); border:1.5px solid rgba(255,255,255,.28); color:#fff; border-radius:11px; padding:11px 20px; font-size:13px; font-weight:800; text-decoration:none; font-family:'Heebo',sans-serif; transition:all .18s; }
        .hs-btn-url:hover { background:rgba(255,255,255,.22); }

        /* Sticker */
        .hs-sticker { border:none; cursor:pointer; border-radius:11px; padding:0; background:transparent; font-family:'Rubik',sans-serif; transition:transform .15s; white-space:nowrap; }
        .hs-sticker:hover { transform:scale(1.04); }
        .hs-mask { display:flex; align-items:stretch; height:40px; border-radius:11px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,.3); }
        .hs-vis { display:flex; align-items:center; padding:0 14px; background:rgba(255,255,255,.95); color:#1A1A2E; font-size:13px; font-weight:900; letter-spacing:2px; }
        .hs-peel { display:flex; align-items:center; gap:6px; padding:0 13px; background:#E8321A; color:#fff; }
        .hs-dots { font-size:13px; letter-spacing:2px; opacity:.85; }
        .hs-tap { background:rgba(255,255,255,.2); padding:2px 7px; border-radius:4px; font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.5px; }
        .hs-code-full { display:flex; align-items:center; padding:0 16px; height:40px; background:rgba(255,255,255,.95); color:#E65100; font-size:14px; font-weight:900; letter-spacing:2px; border-radius:11px; border:2px dashed #E65100; animation:pop .2s ease; }
        .hs-cop { display:flex; align-items:center; padding:0 14px; height:40px; background:#E8F5E9; color:#2E7D32; font-size:13px; font-weight:800; border-radius:11px; }
        @keyframes pop { 0%{transform:scale(.95)} 60%{transform:scale(1.06)} 100%{transform:scale(1)} }

        /* Nav */
        .hs-hot { position:absolute; top:18px; right:18px; background:#E8321A; color:#fff; font-size:10px; font-weight:800; padding:5px 14px; border-radius:20px; z-index:5; letter-spacing:.5px; box-shadow:0 4px 12px rgba(232,50,26,.4); }
        .hs-arr { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.1); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,.18); color:#fff; width:46px; height:46px; border-radius:50%; font-size:22px; cursor:pointer; z-index:10; display:flex; align-items:center; justify-content:center; transition:all .18s; }
        .hs-arr:hover { background:rgba(255,255,255,.22); transform:translateY(-50%) scale(1.08); }
        .hs-arr-r { right:16px; }
        .hs-arr-l { left:16px; }
        .hs-counter { position:absolute; bottom:18px; left:44px; z-index:5; font-size:12px; color:rgba(255,255,255,.4); font-weight:700; letter-spacing:1px; }

        /* Dots */
        .hs-dots { display:flex; justify-content:center; gap:8px; margin-top:13px; }
        .hs-dot { width:8px; height:8px; border-radius:50%; background:rgba(26,26,46,.2); border:none; cursor:pointer; padding:0; transition:all .3s cubic-bezier(.4,0,.2,1); }
        .hs-dot.on { background:#E8321A; width:28px; border-radius:4px; }

        /* Mobile */
        @media (max-width:700px) {
          .hs-outer { padding:0 14px; margin-top:20px; }
          .hs-slider { height:220px; border-radius:16px; }
          .hs-content { padding:20px 20px; }
          .hs-name { font-size:19px; }
          .hs-sub { display:none; }
          .hs-discount { font-size:48px; }
          .hs-mask, .hs-code-full, .hs-cop { height:34px; }
          .hs-vis { font-size:11px; padding:0 10px; }
          .hs-peel { padding:0 10px; }
          .hs-btn-url { padding:9px 14px; font-size:12px; }
          .hs-arr { width:34px; height:34px; font-size:16px; }
          .hs-dot.on { width:20px; }
        }
      `}</style>
    </div>
  );
}
