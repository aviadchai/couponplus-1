import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <Head>
        <title>צור קשר | קופון+</title>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </Head>
      <header>
        <div className="header-inner">
          <Link href="/" className="logo">קופון<span>+</span></Link>
          <nav className="main-nav">
            <Link href="/" className="nav-link">קופונים</Link>
            <Link href="/contact" className="nav-link active">צור קשר</Link>
          </nav>
        </div>
      </header>
      <div className="page-wrap">
        <div className="contact-box">
          <h1>צור קשר</h1>
          <p className="sub">שאלות, הצעות לשיתוף פעולה, או שגיאה באתר? נשמח לשמוע!</p>
          {sent ? (
            <div className="success-msg">✅ תודה! פנייתך התקבלה, נחזור אליך בהקדם.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>שם מלא</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="ישראל ישראלי" />
              <label>אימייל</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="israel@email.co.il" />
              <label>הודעה</label>
              <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="כתוב את הודעתך כאן..."></textarea>
              <button type="submit">שליחה →</button>
            </form>
          )}
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
        .page-wrap { max-width: 640px; margin: 60px auto; padding: 0 24px; }
        .contact-box { background: white; border-radius: 24px; padding: 48px; box-shadow: 0 4px 32px rgba(0,0,0,.08); }
        h1 { font-family: 'Rubik', sans-serif; font-size: 32px; font-weight: 900; color: var(--navy); margin-bottom: 8px; }
        .sub { color: var(--muted); font-size: 15px; margin-bottom: 32px; line-height: 1.6; }
        label { display: block; font-size: 13px; font-weight: 700; color: var(--navy); margin-bottom: 6px; margin-top: 20px; }
        input, textarea { width: 100%; background: var(--gray); border: 2px solid transparent; border-radius: 12px; padding: 12px 16px; font-family: 'Heebo', sans-serif; font-size: 15px; color: #1A1A1A; outline: none; transition: all .2s; resize: vertical; }
        input:focus, textarea:focus { border-color: var(--red); background: white; box-shadow: 0 0 0 4px rgba(232,50,26,.08); }
        button[type=submit] { margin-top: 28px; width: 100%; background: var(--red); color: white; border-radius: 12px; padding: 15px; font-family: 'Heebo', sans-serif; font-size: 16px; font-weight: 800; cursor: pointer; transition: background .2s; border: none; }
        button[type=submit]:hover { background: #C42810; }
        .success-msg { background: #E8F5E9; color: #2E7D32; border-radius: 12px; padding: 20px; font-size: 16px; font-weight: 700; text-align: center; }
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
