import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Privacy() {
  return (
    <Layout>
      <Head><title>מדיניות פרטיות | קופון+</title></Head>
      <div className="page-wrap">
        <div className="box">
          <h1>🔒 מדיניות פרטיות</h1>
          <p className="updated">עודכן: פברואר 2025</p>
          <h2>1. מידע שאנו אוספים</h2>
          <p>אנו אוספים מידע שמסרת לנו באופן ישיר דרך טופס יצירת הקשר — שם, אימייל ותוכן ההודעה.</p>
          <h2>2. עוגיות</h2>
          <p>האתר משתמש בעוגיות לשיפור חווית הגלישה ולמדידת ביצועים באמצעות Google Analytics.</p>
          <h2>3. פרסומות</h2>
          <p>האתר מציג פרסומות דרך Google AdSense. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">מדיניות הפרטיות של גוגל</a>.</p>
          <h2>4. שיתוף מידע</h2>
          <p>אנו לא מוכרים או מעבירים פרטיך לצדדים שלישיים ללא הסכמתך.</p>
          <h2>5. יצירת קשר</h2>
          <p>לשאלות: <Link href="/contact">צור קשר</Link>.</p>
        </div>
      </div>
      <style jsx>{`
        .page-wrap{max-width:760px;margin:48px auto;padding:0 16px}
        .box{background:#fff;border-radius:24px;padding:40px;box-shadow:0 4px 32px rgba(0,0,0,.08)}
        h1{font-family:'Rubik',sans-serif;font-size:28px;font-weight:900;color:#1A1A2E;margin-bottom:6px}
        .updated{color:#7A6E68;font-size:13px;margin-bottom:28px}
        h2{font-family:'Rubik',sans-serif;font-size:17px;font-weight:700;color:#1A1A2E;margin:24px 0 8px}
        p{font-size:15px;color:#444;line-height:1.8}
        a{color:#E8321A;text-decoration:underline}
        @media(max-width:768px){.page-wrap{margin:24px auto}.box{padding:24px 20px}}
      `}</style>
    </Layout>
  );
}
