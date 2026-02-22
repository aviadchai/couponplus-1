import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>מדיניות פרטיות | קופון+</title>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </Head>
      <header>
        <div className="header-inner">
          <Link href="/" className="logo">קופון<span>+</span></Link>
          <nav className="main-nav">
            <Link href="/" className="nav-link">קופונים</Link>
            <Link href="/contact" className="nav-link">צור קשר</Link>
          </nav>
        </div>
      </header>
      <div className="page-wrap">
        <div className="content-box">
          <h1>מדיניות פרטיות</h1>
          <p className="updated">עודכן לאחרונה: פברואר 2025</p>
          <div className="content">
            <h2>1. מידע שאנו אוספים</h2>
            <p>אנו אוספים מידע שמסרת לנו באופן ישיר, כגון כאשר יצרת קשר דרך טופס יצירת הקשר. המידע כולל שם, כתובת אימייל ותוכן ההודעה.</p>
            <h2>2. שימוש בעוגיות</h2>
            <p>האתר משתמש בעוגיות (cookies) לצורך שיפור חווית הגלישה ולמדידת ביצועי האתר. אנו משתמשים ב-Google Analytics לניתוח תנועה. תוכל לבטל עוגיות בהגדרות הדפדפן שלך.</p>
            <h2>3. פרסומות</h2>
            <p>האתר מציג פרסומות באמצעות Google AdSense. גוגל עשויה להשתמש בעוגיות כדי להציג מודעות רלוונטיות. למידע נוסף ראה את <a href="https://policies.google.com/privacy" target="_blank">מדיניות הפרטיות של גוגל</a>.</p>
            <h2>4. שיתוף מידע עם צדדים שלישיים</h2>
            <p>אנו לא מוכרים, סוחרים או מעבירים את פרטיך האישיים לצדדים שלישיים ללא הסכמתך, למעט ספקי שירות המסייעים לנו בהפעלת האתר.</p>
            <h2>5. אבטחת מידע</h2>
            <p>אנו נוקטים באמצעי זהירות סבירים להגנה על המידע שלך. עם זאת, אין אפשרות להבטיח אבטחה מוחלטת של מידע המועבר דרך האינטרנט.</p>
            <h2>6. יצירת קשר</h2>
            <p>לשאלות בנוגע למדיניות הפרטיות, אנא <Link href="/contact">צור קשר</Link>.</p>
          </div>
        </div>
      </div>
      <footer>
        <div className="footer-inner">
          <div className="footer-bottom">
            <span>© 2025 קופון+</span>
            <div className="footer-links">
              <Link href="/privacy">פרטיות</Link>
              <Link href="/terms">תנאים</Link>
              <Link href="/contact">צור קשר</Link>
            </div>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Heebo', sans-serif; background: #FFF8F3; color: #1A1A1A; direction: rtl; }
        a { text-decoration: none; color: inherit; }
        :root { --red: #E8321A; --navy: #1A1A2E; --gray: #F5F0EC; --gray2: #E8E0D8; --muted: #7A6E68; --white: #FFFFFF; }
        header { background: var(--white); border-bottom: 1px solid var(--gray2); position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
        .header-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; gap: 24px; }
        .logo { font-family: 'Rubik', sans-serif; font-size: 26px; font-weight: 900; color: var(--navy); }
        .logo span { color: var(--red); }
        .main-nav { display: flex; gap: 4px; margin-right: auto; }
        .nav-link { padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--muted); transition: all .18s; }
        .nav-link:hover { background: var(--gray); color: var(--navy); }
        .nav-link.active { background: var(--red); color: #fff; }
        .page-wrap { max-width: 800px; margin: 60px auto; padding: 0 24px; }
        .content-box { background: white; border-radius: 24px; padding: 48px; box-shadow: 0 4px 32px rgba(0,0,0,.08); }
        h1 { font-family: 'Rubik', sans-serif; font-size: 32px; font-weight: 900; color: var(--navy); margin-bottom: 8px; }
        .updated { color: var(--muted); font-size: 13px; margin-bottom: 32px; }
        .content h2 { font-family: 'Rubik', sans-serif; font-size: 18px; font-weight: 700; color: var(--navy); margin: 28px 0 10px; }
        .content p { font-size: 15px; color: #444; line-height: 1.8; }
        .content a { color: var(--red); text-decoration: underline; }
        footer { background: var(--navy); padding: 24px; margin-top: 60px; }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-bottom { display: flex; justify-content: space-between; font-size: 12px; color: rgba(255,255,255,.6); }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { color: rgba(255,255,255,.6); }
        .footer-links a:hover { color: white; }
      `}</style>
    </>
  );
}
