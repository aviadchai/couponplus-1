import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  IconDeals, IconSupermarket, IconPharm, IconBeauty, IconToiletries,
  IconElectronics, IconHome, IconFashion, IconPets, IconCouponProduct, IconInternational
} from './CategoryIcons';

const NAV_LINKS = [
  { href: '/',              label: 'ראשי',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { href: '/deals',         label: 'מבצעים',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
  { href: '/international', label: 'בינלאומי',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { href: '/contact',       label: 'צור קשר',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
];

const FOOTER_CATS = [
  { href: '/deals',                       label: 'כל המבצעים' },
  { href: '/category/סופרמרקט',          label: 'סופרמרקט' },
  { href: '/pharm',                       label: 'פארם ובריאות' },
  { href: '/category/טיפוח וקוסמטיקה',  label: 'טיפוח' },
  { href: '/category/אלקטרוניקה',        label: 'אלקטרוניקה' },
  { href: '/category/קופוני-מוצר',       label: 'קופוני מוצר' },
  { href: '/international',              label: 'בינלאומי' },
];

const SUB_CATS = [
  { href: '/deals',                       label: 'כל המבצעים',  Icon: IconDeals },
  { href: '/category/סופרמרקט',          label: 'סופרמרקט',    Icon: IconSupermarket },
  { href: '/category/קופוני-מוצר',       label: 'קופוני מוצר', Icon: IconCouponProduct },
  { href: '/pharm',                       label: 'פארם',         Icon: IconPharm },
  { href: '/category/טיפוח וקוסמטיקה',  label: 'טיפוח',        Icon: IconBeauty },
  { href: '/category/טואלטיקה',          label: 'טואלטיקה',    Icon: IconToiletries },
  { href: '/category/אלקטרוניקה',        label: 'אלקטרוניקה',  Icon: IconElectronics },
  { href: '/category/בית ומטבח',         label: 'בית ומטבח',   Icon: IconHome },
  { href: '/category/אופנה',             label: 'אופנה',        Icon: IconFashion },
  { href: '/category/חיות מחמד',         label: 'חיות מחמד',   Icon: IconPets },
  { href: '/international',              label: 'בינלאומי',     Icon: IconInternational },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function isActive(href) {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  }

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

          <nav className="desk-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className={`nav-link${isActive(l.href) ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="header-spacer" />

          <button className="burger" onClick={() => setOpen(!open)} aria-label="תפריט">
            {open ? '✕' : '☰'}
          </button>
        </div>

        {open && (
          <div className="mob-menu">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`mob-link${isActive(l.href) ? ' active' : ''}`}
                onClick={() => setOpen(false)}>
                <span className="mob-icon">{l.icon}</span>{l.label}
              </Link>
            ))}
            <div className="mob-divider" />
            <div className="mob-sec-title">קטגוריות</div>
            {SUB_CATS.map(c => (
              <Link key={c.href} href={c.href} className="mob-link" onClick={() => setOpen(false)}>
                <span className="mob-icon"><c.Icon size={16} /></span>{c.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* SUBNAV */}
      <div className="subnav">
        <div className="subnav-inner">
          {SUB_CATS.map(c => {
            const active = router.pathname === c.href || (c.href !== '/' && router.asPath.startsWith(c.href));
            return (
              <Link key={c.href} href={c.href} className={`subnav-item${active ? ' active' : ''}`}>
                <c.Icon size={13} />
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main>{children}</main>

      {/* FOOTER */}
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
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
              <Link href="/privacy">מדיניות פרטיות</Link>
              <Link href="/terms">תנאי שימוש</Link>
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

      {/* BOTTOM MOBILE NAV */}
      <nav className="bot-nav">
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} className={`bot-item${isActive(l.href) ? ' active' : ''}`}>
            <span className="mob-icon">{l.icon}</span>
            <span className="bot-lbl">{l.label}</span>
          </Link>
        ))}
      </nav>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100%; width: 100%; }
        body { font-family: 'Heebo', sans-serif; background: #FFF8F3; color: #1A1A1A; direction: rtl; }
        a { text-decoration: none; color: inherit; }
        button { font-family: 'Heebo', sans-serif; cursor: pointer; border: none; background: none; }
        img { max-width: 100%; display: block; }
        main { padding-bottom: 70px; }
        :root {
          --red: #E8321A; --red-lt: #FF5A3D; --navy: #1A1A2E;
          --gray: #F5F0EC; --gray2: #E8E0D8; --muted: #7A6E68; --white: #fff;
          --pad: 40px;
        }

        /* TOPBAR */
        .topbar { background: var(--navy); padding: 7px 16px; display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 12px; color: rgba(255,255,255,.55); flex-wrap: wrap; }
        .sep { opacity: .25; }

        /* HEADER */
        header { background: var(--white); border-bottom: 1px solid var(--gray2); position: sticky; top: 0; z-index: 200; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header-inner { max-width: 1280px; margin: 0 auto; padding: 0 var(--pad); height: 64px; display: flex; align-items: center; gap: 4px; }
        .logo { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 900; color: var(--navy); flex-shrink: 0; margin-left: 8px; }
        .logo span { color: var(--red); }
        .desk-nav { display: flex; gap: 2px; flex-shrink: 0; }
        .header-spacer { flex: 1; }
        .nav-link { padding: 8px 14px; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--muted); transition: all .18s; white-space: nowrap; }
        .nav-link:hover { background: var(--gray); color: var(--navy); }
        .nav-link.active { background: var(--red); color: #fff; }
        .burger { display: none; font-size: 22px; color: var(--navy); padding: 8px; border-radius: 8px; line-height: 1; flex-shrink: 0; }

        /* MOBILE MENU */
        .mob-menu { position: absolute; top: 64px; right: 0; left: 0; background: var(--white); border-bottom: 2px solid var(--gray2); box-shadow: 0 8px 24px rgba(0,0,0,.12); z-index: 199; padding: 8px 0 16px; max-height: 80vh; overflow-y: auto; }
        .mob-link { display: flex; align-items: center; gap: 10px; padding: 12px 24px; font-size: 15px; font-weight: 600; color: var(--navy); transition: background .15s; }
        .mob-link:hover, .mob-link.active { background: var(--gray); color: var(--red); }
        .mob-icon { display: flex; align-items: center; justify-content: center; width: 22px; flex-shrink: 0; color: var(--muted); }
        .mob-link:hover .mob-icon, .mob-link.active .mob-icon { color: var(--red); }
        .bot-item .mob-icon { color: inherit; }
        .mob-divider { height: 1px; background: var(--gray2); margin: 8px 24px; }
        .mob-sec-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 4px 24px 8px; }

        /* SUBNAV */
        .subnav { background: #fff; border-bottom: 1px solid var(--gray2); }
        .subnav-inner { max-width: 1280px; margin: 0 auto; padding: 0 var(--pad); display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        .subnav-inner::-webkit-scrollbar { display: none; }
        .subnav-item { flex-shrink: 0; display: flex; align-items: center; gap: 5px; padding: 9px 11px; font-size: 12px; font-weight: 600; color: var(--muted); white-space: nowrap; border-bottom: 2px solid transparent; transition: all .18s; }
        .subnav-item:hover { color: var(--navy); border-bottom-color: var(--gray2); }
        .subnav-item.active { color: var(--red); border-bottom-color: var(--red); font-weight: 800; }
        .subnav-item.active svg { stroke: var(--red); }

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
        .bot-lbl { font-size: 9px; font-weight: 700; }

        /* CARDS GRID */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 16px; }

        /* SECTION wrapper */
        .section { padding: 24px var(--pad) 32px; max-width: 1280px; margin: 0 auto; }
        .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .section-title { font-family: 'Rubik', sans-serif; font-size: 20px; font-weight: 900; color: var(--navy); display: flex; align-items: center; gap: 10px; }
        .section-title .dot { width: 6px; height: 24px; background: var(--red); border-radius: 3px; flex-shrink: 0; }
        .no-results { text-align: center; color: var(--muted); padding: 40px; font-size: 16px; grid-column: 1/-1; }

        /* AD STRIP */
        .ad-wrap { padding: 10px var(--pad); max-width: 1280px; margin: 0 auto; }
        .ad-strip { background: #F0F4FF; border: 1.5px dashed #C0CFEA; border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; justify-content: center; gap: 12px; position: relative; min-height: 60px; }
        .ad-tag { position: absolute; top: 6px; right: 10px; background: #C0CFEA; color: #536070; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 2px 6px; border-radius: 3px; }

        /* RESPONSIVE */
        @media (min-width: 769px) {
          .burger { display: none; }
          .bot-nav { display: none; }
          main { padding-bottom: 0; }
        }
        @media (max-width: 768px) {
          :root { --pad: 16px; }
          .topbar { font-size: 11px; gap: 8px; padding: 6px 12px; }
          .sep { display: none; }
          .header-inner { height: 58px; }
          .desk-nav { display: none; }
          .header-spacer { display: none; }
          .burger { display: flex; align-items: center; justify-content: center; }
          .logo { font-size: 22px; }
          .ft-top { grid-template-columns: 1fr; gap: 24px; }
          .ft-bottom { flex-direction: column; gap: 8px; text-align: center; }
          .ft-links { justify-content: center; }
          footer { padding-bottom: 80px; }
          .bot-nav { display: flex; }
          .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .subnav-inner { padding: 0 12px; }
        }
        @media (max-width: 380px) {
          .cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
