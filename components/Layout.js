import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/',            label: 'ראשי',       emoji: '🏠' },
  { href: '/deals',       label: 'מבצעים',     emoji: '🔥' },
  { href: '/international', label: 'בינלאומי', emoji: '🌍' },
  { href: '/contact',     label: 'צור קשר',    emoji: '✉️' },
];

const FOOTER_CATS = [
  { href: '/deals',                        label: '🔥 כל המבצעים' },
  { href: '/pharm',                        label: '💊 פארם ובריאות' },
  { href: '/category/סופרמרקט',           label: '🛍️ סופרמרקט' },
  { href: '/category/טיפוח וקוסמטיקה',   label: '💄 טיפוח' },
  { href: '/category/אלקטרוניקה',         label: '📱 אלקטרוניקה' },
  { href: '/international',               label: '🌍 בינלאומי' },
];

export default function Layout({ children }) {
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  function isActive(href) {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  }

  return (
    <>
      {/* ══ TOP BAR ══ */}
      <div className="topbar">
        <span>✂️ קופון+</span>
        <span className="sep">|</span>
        <span>כל הקופונים במקום אחד</span>
        <span className="sep">|</span>
        <span>מתעדכן מדי יום</span>
      </div>

      {/* ══ HEADER ══ */}
      <header>
        <div className="header-inner">
          <Link href="/" className="logo">קופון<span>+</span></Link>

          {/* Desktop nav */}
          <nav className="desk-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className={`nav-link${isActive(l.href) ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Hamburger */}
          <button className="burger" onClick={() => setOpen(!open)} aria-label="תפריט">
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="mob-menu">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`mob-link${isActive(l.href) ? ' active' : ''}`}
                onClick={() => setOpen(false)}>
                <span className="mob-emoji">{l.emoji}</span>{l.label}
              </Link>
            ))}
            <div className="mob-divider" />
            <div className="mob-sec-title">קטגוריות</div>
            {FOOTER_CATS.map(c => (
              <Link key={c.href} href={c.href} className="mob-link" onClick={() => setOpen(false)}>
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ══ MAIN ══ */}
      <main>{children}</main>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="ft-inner">
          <div className="ft-top">
            <div className="ft-brand">
              <div className="ft-logo">קופון<span>+</span></div>
              <p>כל הקופונים והמבצעים של הרשתות הגדולות במקום אחד. מתעדכנים מדי יום.</p>
            </div>
            <div className="ft-col">
              <h5>קטגוריות</h5>
              {FOOTER_CATS.map(c => (
                <Link key={c.href} href={c.href}>{c.label}</Link>
              ))}
            </div>
            <div className="ft-col">
              <h5>האתר</h5>
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href}>{l.emoji} {l.label}</Link>
              ))}
              <Link href="/privacy">🔒 מדיניות פרטיות</Link>
              <Link href="/terms">📋 תנאי שימוש</Link>
            </div>
          </div>
          <div className="ft-bottom">
            <span>© 2025 קופון+ — כל הזכויות שמורות</span>
            <div className="ft-links">
              <Link href="/privacy">פרטיות</Link>
              <Link href="/terms">תנאים</Link>
              <Link href="/contact">צור קשר</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ══ BOTTOM MOBILE NAV ══ */}
      <nav className="bot-nav">
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} className={`bot-item${isActive(l.href) ? ' active' : ''}`}>
            <span className="bot-emoji">{l.emoji}</span>
            <span className="bot-lbl">{l.label}</span>
          </Link>
        ))}
      </nav>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100%; }
        body { font-family: 'Heebo', sans-serif; background: #FFF8F3; color: #1A1A1A; direction: rtl; }
        a { text-decoration: none; color: inherit; }
        button { font-family: 'Heebo', sans-serif; cursor: pointer; border: none; background: none; }
        img { max-width: 100%; display: block; }
        main { padding-bottom: 70px; }
        :root {
          --red: #E8321A; --red-lt: #FF5A3D; --navy: #1A1A2E;
          --gray: #F5F0EC; --gray2: #E8E0D8; --muted: #7A6E68; --white: #fff;
        }

        /* TOPBAR */
        .topbar { background: var(--navy); padding: 7px 16px; display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 12px; color: rgba(255,255,255,.55); flex-wrap: wrap; }
        .sep { opacity: .25; }

        /* HEADER */
        header { background: var(--white); border-bottom: 1px solid var(--gray2); position: sticky; top: 0; z-index: 200; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header-inner { max-width: 1280px; margin: 0 auto; padding: 0 20px; height: 64px; display: flex; align-items: center; gap: 20px; }
        .logo { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 900; color: var(--navy); flex-shrink: 0; }
        .logo span { color: var(--red); }
        .desk-nav { display: flex; gap: 2px; margin-right: auto; }
        .nav-link { padding: 8px 14px; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--muted); transition: all .18s; white-space: nowrap; }
        .nav-link:hover { background: var(--gray); color: var(--navy); }
        .nav-link.active { background: var(--red); color: #fff; }
        .burger { display: none; font-size: 22px; color: var(--navy); padding: 8px; border-radius: 8px; margin-right: auto; line-height: 1; }

        /* MOBILE MENU */
        .mob-menu { position: absolute; top: 64px; right: 0; left: 0; background: var(--white); border-bottom: 2px solid var(--gray2); box-shadow: 0 8px 24px rgba(0,0,0,.12); z-index: 199; padding: 8px 0 16px; max-height: 80vh; overflow-y: auto; }
        .mob-link { display: flex; align-items: center; gap: 10px; padding: 12px 24px; font-size: 15px; font-weight: 600; color: var(--navy); transition: background .15s; }
        .mob-link:hover, .mob-link.active { background: var(--gray); color: var(--red); }
        .mob-emoji { font-size: 18px; width: 24px; text-align: center; }
        .mob-divider { height: 1px; background: var(--gray2); margin: 8px 24px; }
        .mob-sec-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 4px 24px 8px; }

        /* FOOTER */
        footer { background: var(--navy); color: rgba(255,255,255,.75); padding: 48px 20px 28px; margin-top: 24px; }
        .ft-inner { max-width: 1280px; margin: 0 auto; }
        .ft-top { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,.1); margin-bottom: 24px; }
        .ft-logo { font-family: 'Rubik', sans-serif; font-size: 24px; font-weight: 900; color: #fff; margin-bottom: 10px; }
        .ft-logo span { color: var(--red-lt); }
        .ft-brand p { font-size: 13px; line-height: 1.7; color: rgba(255,255,255,.55); max-width: 220px; }
        .ft-col h5 { font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 14px; letter-spacing: .5px; text-transform: uppercase; }
        .ft-col a { display: block; font-size: 13px; margin-bottom: 9px; color: rgba(255,255,255,.6); transition: color .15s; }
        .ft-col a:hover { color: #fff; }
        .ft-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 12px; color: rgba(255,255,255,.4); }
        .ft-links { display: flex; gap: 20px; }
        .ft-links a { color: rgba(255,255,255,.4); transition: color .15s; }
        .ft-links a:hover { color: #fff; }

        /* BOTTOM MOBILE NAV */
        .bot-nav { display: none; position: fixed; bottom: 0; right: 0; left: 0; background: var(--white); border-top: 1px solid var(--gray2); box-shadow: 0 -4px 16px rgba(0,0,0,.08); z-index: 300; height: 62px; }
        .bot-item { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 2px; color: var(--muted); transition: color .18s; padding: 6px 0; }
        .bot-item.active { color: var(--red); }
        .bot-emoji { font-size: 19px; line-height: 1; }
        .bot-lbl { font-size: 9px; font-weight: 700; }

        /* CARDS GRID — global so all pages use same */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 16px; }

        /* SECTION wrapper */
        .section { padding: 24px 20px 32px; max-width: 1280px; margin: 0 auto; }
        .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .section-title { font-family: 'Rubik', sans-serif; font-size: 20px; font-weight: 900; color: var(--navy); display: flex; align-items: center; gap: 10px; }
        .section-title .dot { width: 6px; height: 24px; background: var(--red); border-radius: 3px; flex-shrink: 0; }
        .no-results { text-align: center; color: var(--muted); padding: 40px; font-size: 16px; grid-column: 1/-1; }

        /* AD STRIP */
        .ad-wrap { padding: 10px 20px; max-width: 1280px; margin: 0 auto; }
        .ad-strip { background: #F0F4FF; border: 1.5px dashed #C0CFEA; border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; justify-content: center; gap: 12px; position: relative; min-height: 60px; }
        .ad-tag { position: absolute; top: 6px; right: 10px; background: #C0CFEA; color: #536070; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 2px 6px; border-radius: 3px; }

        /* RESPONSIVE */
        @media (min-width: 769px) {
          .burger { display: none; }
          .bot-nav { display: none; }
          main { padding-bottom: 0; }
        }
        @media (max-width: 768px) {
          .topbar { font-size: 11px; gap: 8px; padding: 6px 12px; }
          .sep { display: none; }
          .header-inner { padding: 0 16px; height: 58px; }
          .desk-nav { display: none; }
          .burger { display: flex; align-items: center; justify-content: center; }
          .logo { font-size: 22px; }
          .ft-top { grid-template-columns: 1fr; gap: 24px; }
          .ft-bottom { flex-direction: column; gap: 8px; text-align: center; }
          .ft-links { justify-content: center; }
          footer { padding-bottom: 80px; }
          .bot-nav { display: flex; }
          .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .section { padding: 16px; }
          .ad-wrap { padding: 8px 16px; }
        }
        @media (max-width: 380px) {
          .cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
