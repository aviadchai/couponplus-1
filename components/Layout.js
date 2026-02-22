import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'ראשי', emoji: '🏠' },
  { href: '/deals', label: 'מבצעים', emoji: '🔥' },
  { href: '/pharm', label: 'פארם', emoji: '💊' },
  { href: '/category/סופרמרקט', label: 'סופר', emoji: '🛍️' },
  { href: '/category/אלקטרוניקה', label: 'אלקטרוניקה', emoji: '📱' },
  { href: '/contact', label: 'צור קשר', emoji: '✉️' },
];

const CATEGORIES = [
  { href: '/deals', label: '🔥 כל המבצעים' },
  { href: '/pharm', label: '💊 פארם ובריאות' },
  { href: '/category/סופרמרקט', label: '🛍️ סופרמרקט' },
  { href: '/category/טיפוח וקוסמטיקה', label: '💄 טיפוח וקוסמטיקה' },
  { href: '/category/טואלטיקה', label: '🧴 טואלטיקה' },
  { href: '/category/אלקטרוניקה', label: '📱 אלקטרוניקה' },
  { href: '/category/בית ומטבח', label: '🏠 בית ומטבח' },
  { href: '/category/אופנה', label: '👗 אופנה' },
  { href: '/category/חיות מחמד', label: '🐾 חיות מחמד' },
];

export default function Layout({ children, title, description }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <span>✂️ קופון+</span>
        <span className="sep">|</span>
        <span>כל הקופונים במקום אחד</span>
        <span className="sep">|</span>
        <span>מתעדכן מדי יום</span>
      </div>

      {/* HEADER */}
      <header>
        <div className="header-inner">
          <Link href="/" className="logo">קופון<span>+</span></Link>

          <nav className="main-nav desktop-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className={`nav-link ${router.pathname === l.href || router.asPath === l.href ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* MOBILE HAMBURGER */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="תפריט">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {menuOpen && (
          <div className="mobile-menu">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className={`mobile-link ${router.asPath === l.href ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <span className="ml-emoji">{l.emoji}</span>
                {l.label}
              </Link>
            ))}
            <div className="mobile-divider" />
            <div className="mobile-cats-title">קטגוריות</div>
            {CATEGORIES.map(c => (
              <Link key={c.href} href={c.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* BACK BUTTON - show on all pages except home */}
      {router.pathname !== '/' && (
        <div className="back-bar">
          <div className="back-bar-inner">
            <button onClick={() => router.back()} className="back-btn">→ חזרה</button>
            <Link href="/" className="back-home">🏠 ראשי</Link>
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">קופון<span>+</span></div>
              <p>כל הקופונים והמבצעים של הרשתות הגדולות במקום אחד. מתעדכנים מדי יום.</p>
            </div>
            <div className="footer-col">
              <h5>קטגוריות</h5>
              {CATEGORIES.slice(0, 5).map(c => (
                <Link key={c.href} href={c.href}>{c.label}</Link>
              ))}
            </div>
            <div className="footer-col">
              <h5>האתר</h5>
              <Link href="/contact">✉️ צור קשר</Link>
              <Link href="/privacy">🔒 מדיניות פרטיות</Link>
              <Link href="/terms">📋 תנאי שימוש</Link>
            </div>
          </div>
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

      {/* BOTTOM MOBILE NAV */}
      <nav className="bottom-nav">
        {NAV_LINKS.slice(0, 5).map(l => (
          <Link key={l.href} href={l.href} className={`bottom-nav-item ${router.asPath === l.href ? 'active' : ''}`}>
            <span className="bn-emoji">{l.emoji}</span>
            <span className="bn-label">{l.label}</span>
          </Link>
        ))}
      </nav>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; }
        body { font-family: 'Heebo', sans-serif; background: #FFF8F3; color: #1A1A1A; direction: rtl; }
        a { text-decoration: none; color: inherit; }
        button { font-family: 'Heebo', sans-serif; cursor: pointer; border: none; background: none; }
        main { padding-bottom: 80px; } /* space for bottom nav on mobile */
        :root {
          --red: #E8321A; --red-dk: #C42810; --red-lt: #FF5A3D;
          --cream: #FFF8F3; --warm: #FFF0E6; --navy: #1A1A2E;
          --gray: #F5F0EC; --gray2: #E8E0D8; --muted: #7A6E68; --white: #FFFFFF;
        }

        /* ══ TOPBAR ══ */
        .topbar { background: var(--navy); padding: 7px 24px; display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 12px; color: rgba(255,255,255,.55); }
        .sep { opacity: .25; }

        /* ══ HEADER ══ */
        header { background: var(--white); border-bottom: 1px solid var(--gray2); position: sticky; top: 0; z-index: 200; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; gap: 24px; }
        .logo { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 900; color: var(--navy); flex-shrink: 0; }
        .logo span { color: var(--red); }
        .desktop-nav { display: flex; gap: 4px; margin-right: auto; }
        .nav-link { padding: 8px 14px; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--muted); transition: all .18s; white-space: nowrap; }
        .nav-link:hover { background: var(--gray); color: var(--navy); }
        .nav-link.active { background: var(--red); color: #fff; }
        .hamburger { display: none; font-size: 22px; color: var(--navy); padding: 8px; border-radius: 8px; margin-right: auto; }

        /* ══ MOBILE MENU ══ */
        .mobile-menu { position: absolute; top: 64px; right: 0; left: 0; background: var(--white); border-bottom: 2px solid var(--gray2); box-shadow: 0 8px 24px rgba(0,0,0,.12); z-index: 199; padding: 8px 0 16px; max-height: 80vh; overflow-y: auto; }
        .mobile-link { display: flex; align-items: center; gap: 10px; padding: 12px 24px; font-size: 15px; font-weight: 600; color: var(--navy); transition: background .15s; }
        .mobile-link:hover, .mobile-link.active { background: var(--gray); color: var(--red); }
        .ml-emoji { font-size: 18px; width: 24px; text-align: center; }
        .mobile-divider { height: 1px; background: var(--gray2); margin: 8px 24px; }
        .mobile-cats-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 4px 24px 8px; }

        /* ══ BACK BAR ══ */
        .back-bar { background: var(--gray); border-bottom: 1px solid var(--gray2); }
        .back-bar-inner { max-width: 1280px; margin: 0 auto; padding: 8px 24px; display: flex; align-items: center; gap: 12px; }
        .back-btn { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--red); transition: gap .15s; background: none; border: none; cursor: pointer; }
        .back-btn:hover { gap: 10px; }
        .back-home { font-size: 13px; font-weight: 600; color: var(--muted); transition: color .15s; }
        .back-home:hover { color: var(--navy); }

        /* ══ FOOTER ══ */
        footer { background: var(--navy); color: rgba(255,255,255,.8); padding: 48px 24px 28px; margin-top: 20px; }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,.12); margin-bottom: 24px; }
        .footer-logo { font-family: 'Rubik', sans-serif; font-size: 24px; font-weight: 900; color: #fff; margin-bottom: 10px; }
        .footer-logo span { color: var(--red-lt); }
        .footer-brand p { font-size: 13px; line-height: 1.7; color: rgba(255,255,255,.6); max-width: 220px; }
        .footer-col h5 { font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 14px; letter-spacing: .5px; text-transform: uppercase; }
        .footer-col a { display: block; font-size: 13px; margin-bottom: 9px; color: rgba(255,255,255,.65); transition: color .15s; }
        .footer-col a:hover { color: #fff; }
        .footer-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 12px; color: rgba(255,255,255,.45); }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { color: rgba(255,255,255,.45); transition: color .15s; }
        .footer-links a:hover { color: #fff; }

        /* ══ BOTTOM MOBILE NAV ══ */
        .bottom-nav { display: none; position: fixed; bottom: 0; right: 0; left: 0; background: var(--white); border-top: 1px solid var(--gray2); box-shadow: 0 -4px 16px rgba(0,0,0,.08); z-index: 300; height: 64px; }
        .bottom-nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 3px; font-size: 10px; font-weight: 700; color: var(--muted); transition: color .18s; padding: 6px 0; }
        .bottom-nav-item.active { color: var(--red); }
        .bottom-nav-item:hover { color: var(--navy); }
        .bn-emoji { font-size: 20px; line-height: 1; }
        .bn-label { font-size: 9.5px; }

        /* ══ COUPON CARD (shared) ══ */
        .coupon-card { background: var(--white); border-radius: 20px; overflow: visible; border: 2px solid var(--gray2); box-shadow: 0 2px 12px rgba(0,0,0,.06); transition: transform .25s, box-shadow .25s, border-color .25s; cursor: pointer; display: flex; flex-direction: column; }
        .coupon-card .card-img { border-radius: 18px 18px 0 0; overflow: hidden; }
        .coupon-card .card-footer-bar { border-radius: 0 0 18px 18px; overflow: hidden; }
        .coupon-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,.14); border-color: var(--red); }
        .coupon-card.expired { opacity: .55; filter: grayscale(.7); pointer-events: none; }
        .coupon-card.expired:hover { transform: none; box-shadow: 0 2px 12px rgba(0,0,0,.06); border-color: var(--gray2); }
        .card-img { width: 100%; height: 160px; position: relative; flex-shrink: 0; }
        .card-img-bg { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 60px; transition: transform .4s; }
        .card-img-photo { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
        .coupon-card:hover .card-img-bg, .coupon-card:hover .card-img-photo { transform: scale(1.06); }
        .card-badge-chain { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.65); backdrop-filter: blur(6px); color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 5px; z-index: 2; }
        .chain-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .card-badge-status { position: absolute; top: 10px; left: 10px; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; z-index: 2; }
        .badge-hot { background: #FFE8E5; color: #D42B0F; }
        .badge-new { background: #E5FFE8; color: #0F8A1E; }
        .badge-lim { background: #FFF5E5; color: #B06000; }
        .badge-exp { background: #EEEEEE; color: #757575; }
        .card-discount-badge { position: absolute; bottom: 10px; right: 10px; background: var(--red); color: #fff; font-family: 'Rubik', sans-serif; font-size: 19px; font-weight: 900; padding: 5px 13px; border-radius: 12px; box-shadow: 0 4px 12px rgba(232,50,26,.35); z-index: 2; }
        .card-body { padding: 14px 16px; flex: 1; }
        .card-title { font-size: 14px; font-weight: 700; color: var(--navy); line-height: 1.4; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-meta { font-size: 11px; color: var(--muted); }
        .card-meta.expired-date { color: #E53935; }
        .card-footer-bar { padding: 10px 14px; border-top: 1px solid var(--gray); display: flex; gap: 8px; background: var(--white); }
        .btn-details { flex: 1; background: var(--navy); color: #fff; border-radius: 10px; padding: 9px 8px; font-size: 12.5px; font-weight: 800; text-align: center; transition: background .18s; }
        .btn-details:hover { background: var(--red); }
        .btn-details.expired { background: #9E9E9E; cursor: not-allowed; }
        .btn-code { background: var(--gray); color: var(--navy); border-radius: 10px; padding: 9px 12px; font-size: 11.5px; font-weight: 800; font-family: 'Rubik', sans-serif; letter-spacing: 1px; transition: all .18s; white-space: nowrap; }
        .btn-code.revealed { background: #FFF3E0; color: #E65100; letter-spacing: 2px; }
        .btn-code.copied { background: #E8F5E9; color: #2E7D32; letter-spacing: normal; }

        /* ══ RESPONSIVE ══ */
        @media (min-width: 769px) {
          .hamburger { display: none; }
          .bottom-nav { display: none; }
          main { padding-bottom: 0; }
        }
        @media (max-width: 768px) {
          .topbar { font-size: 11px; gap: 8px; padding: 6px 12px; }
          .sep { display: none; }
          .header-inner { padding: 0 16px; height: 58px; }
          .desktop-nav { display: none; }
          .hamburger { display: flex; align-items: center; justify-content: center; }
          .logo { font-size: 22px; }
          .back-bar-inner { padding: 7px 16px; }
          .footer-top { grid-template-columns: 1fr; gap: 24px; }
          .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
          .footer-links { justify-content: center; }
          footer { padding-bottom: 80px; }
          .bottom-nav { display: flex; }
        }
      `}</style>
    </>
  );
}
