import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Terms() {
  return (
    <Layout>
      <Head><title>תנאי שימוש | קופון+</title></Head>
      <div className="page-wrap">
        <div className="box">
          <h1>📋 תנאי שימוש</h1>
          <p className="updated">עודכן: פברואר 2025</p>
          <h2>1. קבלת התנאים</h2>
          <p>בשימוש באתר קופון+ אתה מסכים לתנאים המפורטים כאן.</p>
          <h2>2. תיאור השירות</h2>
          <p>קופון+ הוא אתר אגרגציה של קופונים ומבצעים. המידע מסופק לצרכי מידע בלבד ואינו מהווה התחייבות לזמינות המבצעים.</p>
          <h2>3. דיוק המידע</h2>
          <p>אנו עושים מאמצים לוודא שהמידע מדויק, אך יש לוודא תנאי מבצע ישירות מול הרשת הרלוונטית.</p>
          <h2>4. קניין רוחני</h2>
          <p>כל תוכן האתר מוגן בזכויות יוצרים. אין לשכפל ללא אישור בכתב.</p>
          <h2>5. הגבלת אחריות</h2>
          <p>קופון+ לא יהיה אחראי לכל נזק הנובע משימוש באתר.</p>
          <h2>6. יצירת קשר</h2>
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
