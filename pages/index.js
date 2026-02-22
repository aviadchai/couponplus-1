import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { getCoupons } from '../lib/sheets';

const CHAIN_COLORS = {
  '\u05e8\u05de\u05d9 \u05dc\u05d5\u05d9':    { dot: '#F5A623', bg: 'linear-gradient(135deg,#fff8e1,#fff0b3)', emoji: '\ud83d\uded2' },
  '\u05e9\u05d5\u05e4\u05e8\u05e1\u05dc':     { dot: '#2DB86A', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', emoji: '\ud83e\uddf4' },
  '\u05de\u05d2\u05d4':        { dot: '#2196F3', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', emoji: '\ud83e\udd69' },
  '\u05d5\u05d9\u05e7\u05d8\u05d5\u05e8\u05d9':    { dot: '#E53935', bg: 'linear-gradient(135deg,#ffebee,#ffcdd2)', emoji: '\ud83e\udd5b' },
  '\u05d9\u05d9\u05e0\u05d5\u05ea \u05d1\u05d9\u05ea\u05df': { dot: '#BA68C8', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)', emoji: '\ud83c\udf77' },
  '\u05d7\u05e6\u05d9 \u05d7\u05d9\u05e0\u05dd':   { dot: '#FF9800', bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)', emoji: '\ud83c\udff7\ufe0f' },
  '\u05e1\u05d5\u05e4\u05e8-\u05e4\u05d0\u05e8\u05dd':  { dot: '#9C27B0', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)', emoji: '\ud83d\udc8a' },
};
const DEFAULT_CHAIN = { dot: '#E8321A', bg: 'linear-gradient(135deg,#fff0e6,#ffddd0)', emoji: '\ud83c\udfab' };

const BADGE_MAP = {
  '\u05d7\u05dd':      { cls: 'hot', label: '\ud83d\udd25 \u05d7\u05dd' },
  '\u05d7\u05d3\u05e9':     { cls: 'new', label: '\u2728 \u05d7\u05d3\u05e9' },
  '\u05de\u05d5\u05d2\u05d1\u05dc':   { cls: 'lim', label: '\u26a1 \u05de\u05d5\u05d2\u05d1\u05dc' },
};

const CATEGORIES = [
  { key: 'all', label: '\ud83d\uded2 \u05d4\u05db\u05dc' },
  { key: 'hot', label: '\ud83d\udd25 \u05d7\u05de\u05d9\u05dd \u05e2\u05db\u05e9\u05d9\u05d5' },
  { key: '\u05e1\u05d5\u05e4\u05e8\u05de\u05e8\u05e7\u05d8', label: '\ud83d\udecd\ufe0f \u05e1\u05d5\u05e4\u05e8\u05de\u05e8\u05e7\u05d8' },
  { key: '\u05e4\u05d0\u05e8\u05dd \u05d5\u05d1\u05e8\u05d9\u05d0\u05d5\u05ea', label: '\ud83d\udc8a \u05e4\u05d0\u05e8\u05dd \u05d5\u05d1\u05e8\u05d9\u05d0\u05d5\u05ea' },
  { key: '\u05d8\u05d9\u05e4\u05d5\u05d7 \u05d5\u05e7\u05d5\u05e1\u05de\u05d8\u05d9\u05e7\u05d4', label: '\ud83d\udc84 \u05d8\u05d9\u05e4\u05d5\u05d7' },
  { key: '\u05d8\u05d5\u05d0\u05dc\u05d8\u05d9\u05e7\u05d4', label: '\ud83e\uddf4 \u05d8\u05d5\u05d0\u05dc\u05d8\u05d9\u05e7\u05d4' },
  { key: '\u05d0\u05dc\u05e7\u05d8\u05e8\u05d5\u05e0\u05d9\u05e7\u05d4', label: '\ud83d\udcf1 \u05d0\u05dc\u05e7\u05d8\u05e8\u05d5\u05e0\u05d9\u05e7\u05d4' },
  { key: '\u05d1\u05d9\u05ea \u05d5\u05de\u05d8\u05d1\u05d7', label: '\ud83c\udfe0 \u05d1\u05d9\u05ea \u05d5\u05de\u05d8\u05d1\u05d7' },
  { key: '\u05d0\u05d5\u05e4\u05e0\u05d4', label: '\ud83d\udc57 \u05d0\u05d5\u05e4\u05e0\u05d4' },
  { key: '\u05d7\u05d9\u05d5\u05ea \u05de\u05d7\u05de\u05d3', label: '\ud83d\udc3e \u05d7\u05d9\u05d5\u05ea \u05de\u05d7\u05de\u05d3' },
];

function CouponCard({ coupon }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const chain = CHAIN_COLORS[coupon.chain] || DEFAULT_CHAIN;
  const badge = BADGE_MAP[coupon.badge];
  const masked = coupon.code ? coupon.code.slice(0, 3) + '\u2022\u2022\u2022' : '';

  function handleCode(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!revealed) { setRevealed(true); return; }
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => { setCopied(false); setRevealed(false); }, 2000);
  }

  return (
    <Link href={`/coupon/${coupon.id}`} style={{ textDecoration: 'none' }}>
      <div className={`coupon-card${coupon.expired ? ' expired' : ''}`}>
        <div className="card-img">
          {coupon.image
            ? <img src={coupon.image} alt={coupon.name} className="card-img-photo" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            : null}
          <div className="card-img-bg" style={{ background: chain.bg, display: coupon.image ? 'none' : 'flex' }}>{chain.emoji}</div>
          }
          <div className="card-badge-chain">
            <div className="chain-dot" style={{ background: chain.dot }}></div>
            {coupon.chain}
          </div>
          {coupon.expired ? <div className="card-badge-status exp">⏰ פג תוקף</div> : badge && <div className={`card-badge-status ${badge.cls}`}>{badge.label}</div>}
          {coupon.discount && <div className="card-discount-badge">{coupon.discount}</div>}
        </div>
        <div className="card-body">
          <div className="card-title">{coupon.name}</div>
          {coupon.expiry && <div className="card-meta"><span>\ud83d\udcc5 \u05e2\u05d3 {coupon.expiry}</span></div>}
        </div>
        <div className="card-footer">
          <button className="btn-details">\u05dc\u05e4\u05e8\u05d8\u05d9\u05dd \u05d5\u05dc\u05e7\u05d5\u05d3 \u2192</button>
          {coupon.code && (
            <button className={`btn-code ${revealed ? 'revealed' : ''} ${copied ? 'copied' : ''}`} onClick={handleCode}>
              {copied ? '\u2705 \u05d4\u05d5\u05e2\u05ea\u05e7!' : revealed ? coupon.code : masked}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

function AdCard() {
  return (
    <div className="coupon-card ad-card">
      <div className="ad-card-label">\u05e4\u05e8\u05e1\u05d5\u05de\u05ea</div>
      <div className="ad-card-inner">
        <div className="ad-card-icon">\ud83c\udfaf</div>
        <div className="ad-card-text">Google Ads</div>
        <div className="ad-card-sub">300\u00d7250</div>
      </div>
    </div>
  );
}

export default function Home({ coupons }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const hotRef = useRef(null);
  const pharmRef = useRef(null);

  const filtered = coupons.filter(c => {
    const matchSearch = !search || c.name.includes(search) || c.chain.includes(search) || c.code.includes(search);
    const matchCat = activeCat === 'all' ? true
      : activeCat === 'hot' ? c.badge === '\u05d7\u05dd'
      : c.category === activeCat;
    return matchSearch && matchCat;
  });

  const hotCoupons = coupons.filter(c => c.badge === '\u05d7\u05dd').slice(0, 8);
  const pharmCoupons = coupons.filter(c => c.category === '\u05e4\u05d0\u05e8\u05dd \u05d5\u05d1\u05e8\u05d9\u05d0\u05d5\u05ea' || c.category === '\u05d8\u05d9\u05e4\u05d5\u05d7 \u05d5\u05e7\u05d5\u05e1\u05de\u05d8\u05d9\u05e7\u05d4').slice(0, 8);
  const chains = [...new Set(coupons.map(c => c.chain))];

  function scrollRow(ref, dir) {
    if (ref.current) ref.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
  }

  return (
    <>
      <Head>
        <title>\u05e7\u05d5\u05e4\u05d5\u05df+ | \u05db\u05dc \u05d4\u05e7\u05d5\u05e4\u05d5\u05e0\u05d9\u05dd \u05d5\u05d4\u05de\u05d1\u05e6\u05e2\u05d9\u05dd \u05d1\u05de\u05e7\u05d5\u05dd \u05d0\u05d7\u05d3</title>
        <meta name="description" content="\u05d0\u05dc\u05e4\u05d9 \u05e7\u05d5\u05e4\u05d5\u05e0\u05d9\u05dd \u05d5\u05de\u05d1\u05e6\u05e2\u05d9\u05dd \u05de\u05db\u05dc \u05d4\u05e8\u05e9\u05ea\u05d5\u05ea \u05d4\u05d2\u05d3\u05d5\u05dc\u05d5\u05ea" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </Head>

      {/* TOP BAR */}
      <div className="topbar">
        <span>\ud83d\udd25 \u05de\u05d1\u05e6\u05e2\u05d9\u05dd \u05d7\u05de\u05d9\u05dd</span>
        <span className="sep">|</span>
        <span>\u05e0\u05d5\u05e1\u05e4\u05d5 <b>{coupons.length} \u05e7\u05d5\u05e4\u05d5\u05e0\u05d9\u05dd</b> \u05e4\u05e2\u05d9\u05dc\u05d9\u05dd</span>
        <span className="sep">|</span>
        <span>\u05de\u05ea\u05e2\u05d3\u05db\u05df \u05de\u05d3\u05d9 \u05d9\u05d5\u05dd</span>
      </div>

      {/* HEADER */}
      <header>
        <div className="header-inner">
          <Link href="/" className="logo">\u05e7\u05d5\u05e4\u05d5\u05df<span>+</span></Link>
          <div className="search-wrap">
            <input
              type="text"
              placeholder="\u05d7\u05e4\u05e9 \u05de\u05d1\u05e6\u05e2, \u05de\u05d5\u05e6\u05e8, \u05d0\u05d5 \u05e8\u05e9\u05ea..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="search-ico">\ud83d\udd0d</span>
          </div>
          <nav className="main-nav">
            <Link href="/" className="nav-link active">\u05e7\u05d5\u05e4\u05d5\u05e0\u05d9\u05dd</Link>
            <Link href="/deals" className="nav-link">\u05de\u05d1\u05e6\u05e2\u05d9\u05dd</Link>
            <Link href="/pharm" className="nav-link">\u05e4\u05d0\u05e8\u05dd</Link>
            <Link href="/contact" className="nav-link">\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">\u2702 <span>\u05de\u05ea\u05e2\u05d3\u05db\u05df \u05db\u05dc \u05e9\u05e2\u05d4</span> \u2014 \u05e7\u05d5\u05e4\u05d5\u05e0\u05d9\u05dd \u05d0\u05de\u05d9\u05ea\u05d9\u05d9\u05dd \u05d1\u05dc\u05d1\u05d3</div>
            <h1>\u05d7\u05e1\u05db\u05d5 \u05d9\u05d5\u05ea\u05e8<br />\u05d1\u05db\u05dc <em>\u05e7\u05e0\u05d9\u05d9\u05d4 \u05d1\u05e1\u05d5\u05e4\u05e8</em></h1>
            <p className="hero-sub">\u05d0\u05dc\u05e4\u05d9 \u05de\u05d1\u05e6\u05e2\u05d9\u05dd \u05d5\u05e7\u05d5\u05e4\u05d5\u05e0\u05d9\u05dd \u05de\u05db\u05dc \u05d4\u05e8\u05e9\u05ea\u05d5\u05ea \u05d4\u05d2\u05d3\u05d5\u05dc\u05d5\u05ea \u2014 \u05d1\u05de\u05e7\u05d5\u05dd \u05d0\u05d7\u05d3, \u05de\u05ea\u05e2\u05d3\u05db\u05e0\u05d9\u05dd \u05de\u05d3\u05d9 \u05d9\u05d5\u05dd.</p>
            <a href="#coupons" className="hero-cta">\ud83d\udd25 \u05dc\u05db\u05dc \u05d4\u05de\u05d1\u05e6\u05e2\u05d9\u05dd \u05d4\u05d7\u05de\u05d9\u05dd</a>
            <div className="hero-stats">
              <div className="hstat"><strong>{coupons.length}+</strong><span>\u05de\u05d1\u05e6\u05e2\u05d9\u05dd \u05e4\u05e2\u05d9\u05dc\u05d9\u05dd</span></div>
              <div className="hstat"><strong>{chains.length}</strong><span>\u05e8\u05e9\u05ea\u05d5\u05ea</span></div>
              <div className="hstat"><strong>{hotCoupons.length}</strong><span>\u05d7\u05de\u05d9\u05dd \u05e2\u05db\u05e9\u05d9\u05d5</span></div>
            </div>
          </div>
          <div className="hero-chains">
            <div className="hc-title">\u05d1\u05d7\u05e8 \u05e8\u05e9\u05ea</div>
            <div className="hc-grid">
              {chains.slice(0, 6).map((chain, i) => (
                <div key={chain} className={`hc-btn hc-${i}`} onClick={() => setActiveCat(chain)}>
                  <span className="hc-btn-name">{chain}</span>
                  <span className="hc-btn-count">{coupons.filter(c => c.chain === chain).length} \u05de\u05d1\u05e6\u05e2\u05d9\u05dd</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHIPS */}
      <div className="chips-section" id="coupons">
        <div className="chips-row">
          {CATEGORIES.map(cat => (
            <div
              key={cat.key}
              className={`chip ${activeCat === cat.key ? 'on' : ''}`}
              onClick={() => setActiveCat(cat.key)}
            >
              {cat.label}
              <span className="chip-num">
                {cat.key === 'all' ? coupons.length
                  : cat.key === 'hot' ? coupons.filter(c => c.badge === '\u05d7\u05dd').length
                  : coupons.filter(c => c.category === cat.key).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {(search || activeCat !== 'all') && (
        <div className="section">
          <div className="section-head">
            <div className="section-title"><span className="dot"></span>
              {search ? `\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05e2\u05d1\u05d5\u05e8 "${search}"` : CATEGORIES.find(c => c.key === activeCat)?.label}
            </div>
          </div>
          <div className="cards-grid">
            {filtered.map((c, i) => (
              <>
                <CouponCard key={c.id} coupon={c} />
                {(i + 1) % 4 === 0 && <AdCard key={`ad-${i}`} />}
              </>
            ))}
            {filtered.length === 0 && <p className="no-results">\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05e7\u05d5\u05e4\u05d5\u05e0\u05d9\u05dd</p>}
          </div>
        </div>
      )}

      {/* HOT NOW */}
      {!search && activeCat === 'all' && (
        <>
          <div className="section">
            <div className="section-head">
              <div className="section-title"><span className="dot"></span>\ud83d\udd25 \u05d7\u05de\u05d9\u05dd \u05e2\u05db\u05e9\u05d9\u05d5</div>
              <Link href="/?cat=hot" className="see-all">\u05dc\u05db\u05dc \u05d4\u05de\u05d1\u05e6\u05e2\u05d9\u05dd \u05d4\u05d7\u05de\u05d9\u05dd \u2192</Link>
            </div>
            <div className="scroll-container">
              <button className="scroll-arrow arr-right" onClick={() => scrollRow(hotRef, -1)}>\u2039</button>
              <div className="scroll-row" ref={hotRef}>
                {(hotCoupons.length ? hotCoupons : coupons.slice(0, 6)).map((c, i) => (
                  <>
                    <CouponCard key={c.id} coupon={c} />
                    {i === 3 && <AdCard key="ad-hot" />}
                  </>
                ))}
              </div>
              <button className="scroll-arrow arr-left" onClick={() => scrollRow(hotRef, 1)}>\u203a</button>
            </div>
          </div>

          {/* AD STRIP */}
          <div className="ad-strip-wrap">
            <div className="ad-strip">
              <div className="ad-label">\u05e4\u05e8\u05e1\u05d5\u05de\u05ea</div>
              <div className="ad-content">
                <div className="ad-icon">\ud83c\udfaf</div>
                <div className="ad-text"><b>Google Ads \u2014 728\u00d790</b> | Leaderboard Banner</div>
              </div>
            </div>
          </div>

          {/* PROMO GRID */}
          <div className="section">
            <div className="section-head">
              <div className="section-title"><span className="dot"></span>\ud83c\udfea \u05de\u05d1\u05e6\u05e2\u05d9 \u05e9\u05d1\u05d5\u05e2 \u05dc\u05e4\u05d9 \u05e8\u05e9\u05ea</div>
              <Link href="/deals" className="see-all">\u05db\u05dc \u05d4\u05e8\u05e9\u05ea\u05d5\u05ea \u2192</Link>
            </div>
            <div className="promo-grid">
              {chains.slice(0, 3).map((chain, i) => {
                const ch = CHAIN_COLORS[chain] || DEFAULT_CHAIN;
                const chainCoupons = coupons.filter(c => c.chain === chain);
                return (
                  <div key={chain} className="promo-card" onClick={() => setActiveCat(chain)}>
                    <div className="promo-card-bg" style={{ background: ch.bg }}>{ch.emoji}</div>
                    <div className="promo-card-overlay"></div>
                    <div className="promo-card-content">
                      <div className="promo-chain">{chain}</div>
                      <div className="promo-title">\u05de\u05d1\u05e6\u05e2\u05d9 \u05d4\u05e9\u05d1\u05d5\u05e2</div>
                      <div className="promo-discount">\u05dc\u05e4\u05e8\u05d8\u05d9\u05dd \u05e0\u05d5\u05e1\u05e4\u05d9\u05dd \u2192</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PHARM */}
          {pharmCoupons.length > 0 && (
            <div className="pharm-section">
              <div className="section">
                <div className="section-head">
                  <div className="section-title"><span className="dot"></span>\ud83d\udc8a \u05e4\u05d0\u05e8\u05dd \u05d5\u05e7\u05d5\u05e1\u05de\u05d8\u05d9\u05e7\u05d4</div>
                  <Link href="/pharm" className="see-all">\u05dc\u05db\u05dc \u05de\u05d1\u05e6\u05e2\u05d9 \u05d4\u05e4\u05d0\u05e8\u05dd \u2192</Link>
                </div>
                <div className="scroll-container">
                  <div className="scroll-row" ref={pharmRef}>
                    {pharmCoupons.map((c, i) => (
                      <>
                        <CouponCard key={c.id} coupon={c} />
                        {i === 3 && <AdCard key="ad-pharm" />}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AD BEFORE FOOTER */}
          <div className="ad-strip-wrap">
            <div className="ad-strip">
              <div className="ad-label">\u05e4\u05e8\u05e1\u05d5\u05de\u05ea</div>
              <div className="ad-content">
                <div className="ad-icon">\ud83c\udfaf</div>
                <div className="ad-text"><b>Google Ads \u2014 728\u00d790</b> | Leaderboard Banner</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">\u05e7\u05d5\u05e4\u05d5\u05df<span>+</span></div>
              <p>\u05db\u05dc \u05d4\u05e7\u05d5\u05e4\u05d5\u05e0\u05d9\u05dd \u05d5\u05d4\u05de\u05d1\u05e6\u05e2\u05d9\u05dd \u05e9\u05dc \u05d4\u05e8\u05e9\u05ea\u05d5\u05ea \u05d4\u05d2\u05d3\u05d5\u05dc\u05d5\u05ea \u05d1\u05de\u05e7\u05d5\u05dd \u05d0\u05d7\u05d3. \u05de\u05ea\u05e2\u05d3\u05db\u05e0\u05d9\u05dd \u05de\u05d3\u05d9 \u05d9\u05d5\u05dd.</p>
            </div>
            <div className="footer-col">
              <h5>\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d5\u05ea</h5>
              <a href="#">\ud83d\udecd\ufe0f \u05e1\u05d5\u05e4\u05e8\u05de\u05e8\u05e7\u05d8</a>
              <a href="#">\ud83d\udc8a \u05e4\u05d0\u05e8\u05dd \u05d5\u05d1\u05e8\u05d9\u05d0\u05d5\u05ea</a>
              <a href="#">\ud83d\udc84 \u05d8\u05d9\u05e4\u05d5\u05d7</a>
              <a href="#">\ud83d\udcf1 \u05d0\u05dc\u05e7\u05d8\u05e8\u05d5\u05e0\u05d9\u05e7\u05d4</a>
              <a href="#">\ud83d\udc3e \u05d7\u05d9\u05d5\u05ea \u05de\u05d7\u05de\u05d3</a>
            </div>
            <div className="footer-col">
              <h5>\u05d4\u05d0\u05ea\u05e8</h5>
              <Link href="/contact">\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8</Link>
              <Link href="/privacy">\u05de\u05d3\u05d9\u05e0\u05d9\u05d5\u05ea \u05e4\u05e8\u05d8\u05d9\u05d5\u05ea</Link>
              <Link href="/terms">\u05ea\u05e0\u05d0\u05d9 \u05e9\u05d9\u05de\u05d5\u05e9</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>\u00a9 2025 \u05e7\u05d5\u05e4\u05d5\u05df+ \u2014 \u05db\u05dc \u05d4\u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05e9\u05de\u05d5\u05e8\u05d5\u05ea</span>
            <div className="footer-links">
              <Link href="/privacy">\u05e4\u05e8\u05d8\u05d9\u05d5\u05ea</Link>
              <Link href="/terms">\u05ea\u05e0\u05d0\u05d9\u05dd</Link>
              <Link href="/contact">\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; }
        body { font-family: 'Heebo', sans-serif; background: #FFF8F3; color: #1A1A1A; direction: rtl; }
        a { text-decoration: none; color: inherit; }
        button { font-family: 'Heebo', sans-serif; cursor: pointer; border: none; background: none; }
        :root {
          --red: #E8321A; --red-dk: #C42810; --red-lt: #FF5A3D;
          --cream: #FFF8F3; --warm: #FFF0E6; --navy: #1A1A2E;
          --gray: #F5F0EC; --gray2: #E8E0D8; --muted: #7A6E68; --white: #FFFFFF;
        }
        .topbar { background: var(--navy); padding: 8px 24px; display: flex; align-items: center; justify-content: center; gap: 24px; font-size: 12px; color: rgba(255,255,255,.6); }
        .topbar b { color: rgba(255,255,255,.9); }
        .sep { opacity: .3; }
        header { background: var(--white); border-bottom: 1px solid var(--gray2); position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; gap: 24px; }
        .logo { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 900; color: var(--navy); flex-shrink: 0; }
        .logo span { color: var(--red); }
        .search-wrap { flex: 1; max-width: 440px; position: relative; }
        .search-wrap input { width: 100%; background: var(--gray); border: 2px solid transparent; border-radius: 50px; padding: 11px 20px 11px 48px; font-family: 'Heebo', sans-serif; font-size: 14px; color: #1A1A1A; outline: none; transition: all .2s; }
        .search-wrap input:focus { border-color: var(--red); background: var(--white); box-shadow: 0 0 0 4px rgba(232,50,26,.08); }
        .search-wrap input::placeholder { color: var(--muted); }
        .search-ico { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 16px; opacity: .4; }
        .main-nav { display: flex; gap: 4px; margin-right: auto; }
        .nav-link { padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--muted); transition: all .18s; white-space: nowrap; }
        .nav-link:hover { background: var(--gray); color: var(--navy); }
        .nav-link.active { background: var(--red); color: var(--white); }
        .hero { background: linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #1A1A2E 100%); padding: 56px 24px 72px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(232,50,26,.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(255,90,61,.08) 0%, transparent 50%); }
        .hero-inner { max-width: 1280px; margin: 0 auto; position: relative; display: flex; align-items: center; gap: 60px; }
        .hero-copy { flex: 1; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); border-radius: 50px; padding: 6px 18px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,.7); margin-bottom: 20px; letter-spacing: .5px; }
        .hero-badge span { color: var(--red-lt); }
        .hero h1 { font-family: 'Rubik', sans-serif; font-size: 52px; font-weight: 900; color: var(--white); line-height: 1.1; margin-bottom: 16px; }
        .hero h1 em { color: var(--red-lt); font-style: normal; }
        .hero-sub { font-size: 17px; color: rgba(255,255,255,.5); line-height: 1.7; max-width: 420px; margin-bottom: 36px; }
        .hero-cta { display: inline-flex; align-items: center; gap: 10px; background: var(--red); color: var(--white); border-radius: 50px; padding: 15px 32px; font-size: 16px; font-weight: 800; box-shadow: 0 8px 24px rgba(232,50,26,.4); transition: all .2s; font-family: 'Heebo', sans-serif; }
        .hero-cta:hover { background: var(--red-lt); transform: translateY(-2px); }
        .hero-stats { display: flex; gap: 40px; margin-top: 36px; }
        .hstat strong { font-family: 'Rubik', sans-serif; font-size: 32px; font-weight: 900; color: var(--white); display: block; }
        .hstat span { font-size: 12px; color: rgba(255,255,255,.38); }
        .hero-chains { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 20px; padding: 20px; min-width: 280px; flex-shrink: 0; backdrop-filter: blur(10px); }
        .hc-title { font-size: 10px; font-weight: 800; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }
        .hc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .hc-btn { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 12px 10px; text-align: center; transition: all .2s; cursor: pointer; }
        .hc-0:hover { background: #F5A623; border-color: #F5A623; }
        .hc-1:hover { background: #2DB86A; border-color: #2DB86A; }
        .hc-2:hover { background: #1565C0; border-color: #1565C0; }
        .hc-3:hover { background: #E53935; border-color: #E53935; }
        .hc-4:hover { background: #7B1FA2; border-color: #7B1FA2; }
        .hc-5:hover { background: #FF6F00; border-color: #FF6F00; }
        .hc-btn:hover { transform: scale(1.03); }
        .hc-btn-name { font-size: 13px; font-weight: 700; color: var(--white); display: block; }
        .hc-btn-count { font-size: 10px; color: rgba(255,255,255,.35); margin-top: 2px; display: block; }
        .chips-section { padding: 24px 24px 0; max-width: 1280px; margin: 0 auto; }
        .chips-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .chips-row::-webkit-scrollbar { display: none; }
        .chip { flex-shrink: 0; display: flex; align-items: center; gap: 8px; background: var(--white); border: 2px solid var(--gray2); border-radius: 50px; padding: 8px 18px; font-size: 13.5px; font-weight: 700; color: var(--navy); transition: all .18s; cursor: pointer; white-space: nowrap; }
        .chip:hover, .chip.on { background: var(--navy); border-color: var(--navy); color: var(--white); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(26,26,46,.2); }
        .chip-num { background: var(--gray); color: var(--muted); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 50px; transition: all .18s; }
        .chip.on .chip-num, .chip:hover .chip-num { background: rgba(255,255,255,.15); color: rgba(255,255,255,.7); }
        .section { padding: 40px 24px; max-width: 1280px; margin: 0 auto; }
        .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .section-title { font-family: 'Rubik', sans-serif; font-size: 22px; font-weight: 900; color: var(--navy); display: flex; align-items: center; gap: 10px; }
        .section-title .dot { width: 8px; height: 28px; background: var(--red); border-radius: 4px; display: block; }
        .see-all { font-size: 13px; font-weight: 700; color: var(--red); display: flex; align-items: center; gap: 4px; transition: gap .18s; }
        .see-all:hover { gap: 8px; }
        .scroll-container { position: relative; overflow: visible; }
        .scroll-row { display: flex; gap: 16px; overflow-x: auto; overflow-y: visible; padding: 12px 4px; scrollbar-width: none; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
        .scroll-row::-webkit-scrollbar { display: none; }
        .coupon-card { background: var(--white); border-radius: 20px; overflow: visible; border: 2px solid var(--gray2); box-shadow: 0 2px 12px rgba(0,0,0,.06); transition: transform .25s, box-shadow .25s, border-color .25s; cursor: pointer; flex-shrink: 0; width: 260px; scroll-snap-align: start; display: flex; flex-direction: column; }
        .coupon-card .card-img { border-radius: 18px 18px 0 0; overflow: hidden; }
        .coupon-card .card-footer { border-radius: 0 0 18px 18px; overflow: hidden; }
        .coupon-card.expired { opacity: .55; filter: grayscale(.7); pointer-events: none; }
        .coupon-card.expired:hover { transform: none !important; }
        .card-badge-status.exp { background: #EEEEEE; color: #757575; }
        .coupon-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,.16); border-color: var(--red); }
        .card-img { width: 100%; height: 160px; position: relative; flex-shrink: 0; }
        .card-img-bg { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 60px; transition: transform .4s; }
        .card-img-photo { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
        .coupon-card:hover .card-img-bg, .coupon-card:hover .card-img-photo { transform: scale(1.08); }
        .card-badge-chain { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,.65); backdrop-filter: blur(6px); color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 5px; z-index: 2; }
        .chain-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .card-badge-status { position: absolute; top: 12px; left: 12px; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; z-index: 2; }
        .hot { background: #FFE8E5; color: #D42B0F; }
        .new { background: #E5FFE8; color: #0F8A1E; }
        .lim { background: #FFF5E5; color: #B06000; }
        .card-discount-badge { position: absolute; bottom: 12px; right: 12px; background: var(--red); color: white; font-family: 'Rubik', sans-serif; font-size: 20px; font-weight: 900; padding: 6px 14px; border-radius: 12px; box-shadow: 0 4px 12px rgba(232,50,26,.4); z-index: 2; }
        .card-body { padding: 16px; flex: 1; }
        .card-title { font-size: 15px; font-weight: 700; color: var(--navy); line-height: 1.4; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-meta { font-size: 11.5px; color: var(--muted); }
        .card-footer { padding: 12px 16px; border-top: 1px solid var(--gray); display: flex; gap: 10px; background: var(--white); }
        .btn-details { flex: 1; background: var(--navy); color: var(--white); border-radius: 10px; padding: 10px; font-size: 13px; font-weight: 800; text-align: center; transition: background .18s; }
        .btn-details:hover { background: var(--red); }
        .btn-code { background: var(--gray); color: var(--navy); border-radius: 10px; padding: 10px 14px; font-size: 12px; font-weight: 800; font-family: 'Rubik', sans-serif; letter-spacing: 1px; transition: all .18s; white-space: nowrap; }
        .btn-code.revealed { background: #FFF3E0; color: #E65100; letter-spacing: 2px; }
        .btn-code.copied { background: #E8F5E9; color: #2E7D32; letter-spacing: normal; }
        .btn-code:hover { background: #e0e0e0; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .no-results { text-align: center; color: var(--muted); padding: 40px; font-size: 18px; }
        .ad-card { background: #F0F4FF; border: 2px dashed #C0CFEA !important; cursor: default; justify-content: center; align-items: center; min-height: 340px; position: relative; }
        .ad-card:hover { transform: none !important; box-shadow: none !important; border-color: #C0CFEA !important; }
        .ad-card-label { position: absolute; top: 12px; right: 12px; background: #C0CFEA; color: #536070; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; padding: 2px 8px; border-radius: 4px; }
        .ad-card-inner { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; }
        .ad-card-icon { font-size: 36px; opacity: .3; }
        .ad-card-text { font-size: 14px; font-weight: 700; color: #536070; }
        .ad-card-sub { font-size: 11px; color: #96AABF; }
        .ad-strip-wrap { padding: 0 24px; max-width: 1280px; margin: 0 auto 8px; }
        .ad-strip { background: #F0F4FF; border: 1.5px dashed #C0CFEA; border-radius: 16px; padding: 16px 24px; text-align: center; position: relative; }
        .ad-label { position: absolute; top: 8px; left: 14px; background: #C0CFEA; color: #536070; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; padding: 2px 7px; border-radius: 4px; }
        .ad-content { display: flex; align-items: center; justify-content: center; gap: 16px; padding-top: 6px; }
        .ad-icon { font-size: 28px; opacity: .25; }
        .ad-text { font-size: 13px; color: #536070; }
        .ad-text b { color: #1A1A2E; }
        .scroll-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: var(--white); border: 1.5px solid var(--gray2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.1); z-index: 10; transition: all .2s; }
        .scroll-arrow:hover { background: var(--red); color: white; border-color: var(--red); }
        .arr-right { right: -20px; }
        .arr-left { left: -20px; }
        .promo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .promo-card { border-radius: 20px; overflow: hidden; position: relative; cursor: pointer; height: 240px; transition: transform .25s, box-shadow .25s; }
        .promo-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.18); }
        .promo-card-bg { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 80px; transition: transform .4s; }
        .promo-card:hover .promo-card-bg { transform: scale(1.06); }
        .promo-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 55%); }
        .promo-card-content { position: absolute; bottom: 16px; right: 16px; left: 16px; }
        .promo-chain { font-size: 14px; font-weight: 900; color: rgba(255,255,255,.95); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; text-shadow: 0 1px 4px rgba(0,0,0,.4); }
        .promo-title { font-family: 'Rubik', sans-serif; font-size: 18px; font-weight: 900; color: white; line-height: 1.3; margin-bottom: 10px; }
        .promo-discount { display: inline-block; background: var(--red); color: white; font-family: 'Rubik', sans-serif; font-size: 14px; font-weight: 800; padding: 7px 16px; border-radius: 8px; }
        .pharm-section { background: var(--warm); padding: 4px 0 8px; }
        footer { background: var(--navy); color: rgba(255,255,255,.8); padding: 48px 24px 28px; margin-top: 20px; }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,.12); margin-bottom: 24px; }
        .footer-logo { font-family: 'Rubik', sans-serif; font-size: 24px; font-weight: 900; color: var(--white); margin-bottom: 10px; }
        .footer-logo span { color: var(--red-lt); }
        .footer-brand p { font-size: 13px; line-height: 1.7; color: rgba(255,255,255,.7); max-width: 220px; }
        .footer-col h5 { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 14px; letter-spacing: .5px; text-transform: uppercase; }
        .footer-col a { display: block; font-size: 13px; margin-bottom: 9px; color: rgba(255,255,255,.72); transition: color .15s; }
        .footer-col a:hover { color: #fff; }
        .footer-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 12px; color: rgba(255,255,255,.6); }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { color: rgba(255,255,255,.6); transition: color .15s; }
        .footer-links a:hover { color: #fff; }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  const coupons = await getCoupons();
  return { props: { coupons }, revalidate: 3600 };
}
",
      "path": "/mnt/user-data/outputs/couponplus-v2/pages/index.js