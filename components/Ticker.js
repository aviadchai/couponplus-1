import { useState, useEffect } from 'react';

export default function Ticker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  const segments = items.map(i =>
    i.is_clickable && i.url
      ? <a key={i.id} href={i.url} className="ticker-link">{i.text}</a>
      : <span key={i.id}>{i.text}</span>
  );

  const sep = <span aria-hidden="true" className="ticker-sep">✦</span>;

  const joined = segments.reduce((acc, el, idx) => {
    if (idx === 0) return [el];
    return [...acc, sep, el];
  }, []);

  return (
    <div className="ticker-wrap">
      <div className="ticker-label">🔥 חדש</div>
      <div className="ticker-track">
        <div className="ticker-content">
          <span className="ticker-inner">{joined}</span>
          <span className="ticker-inner" aria-hidden="true">{joined}</span>
        </div>
      </div>

      <style jsx>{`
        .ticker-wrap {
          background: #E8321A;
          display: flex;
          align-items: center;
          height: 36px;
          overflow: hidden;
          position: relative;
          z-index: 99;
        }
        .ticker-label {
          background: #1A1A2E;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 0 14px;
          height: 100%;
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
          letter-spacing: 0.5px;
          z-index: 2;
        }
        .ticker-track {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .ticker-content {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker 22s linear infinite;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Heebo', sans-serif;
          gap: 0;
        }
        .ticker-content:hover { animation-play-state: paused; }
        .ticker-inner { display: inline-flex; align-items: center; gap: 12px; padding: 0 12px; }
        .ticker-sep { opacity: .6; font-size: 10px; }
        .ticker-link { color: #fff; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; transition: opacity .15s; }
        .ticker-link:hover { opacity: .8; }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 600px) {
          .ticker-content { font-size: 12px; animation-duration: 18s; }
        }
      `}</style>
    </div>
  );
}
