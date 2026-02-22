import Head from 'next/head';
import Layout from '../components/Layout';
import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  return (
    <Layout>
      <Head><title>צור קשר | קופון+</title></Head>
      <div className="page-wrap">
        <div className="box">
          <h1>✉️ צור קשר</h1>
          <p className="sub">שאלות, הצעות לשיתוף פעולה, או שגיאה? נשמח לשמוע!</p>
          {sent ? (
            <div className="success">✅ תודה! פנייתך התקבלה, נחזור אליך בהקדם.</div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
              <label>שם מלא</label>
              <input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="ישראל ישראלי" />
              <label>אימייל</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="israel@email.co.il" />
              <label>הודעה</label>
              <textarea required rows={5} value={form.message} onChange={e => setForm({...form,message:e.target.value})} placeholder="כתוב את הודעתך כאן..." />
              <button type="submit">שליחה →</button>
            </form>
          )}
        </div>
      </div>
      <style jsx>{`
        .page-wrap{max-width:600px;margin:48px auto;padding:0 16px}
        .box{background:#fff;border-radius:24px;padding:40px;box-shadow:0 4px 32px rgba(0,0,0,.08)}
        h1{font-family:'Rubik',sans-serif;font-size:28px;font-weight:900;color:#1A1A2E;margin-bottom:8px}
        .sub{color:#7A6E68;font-size:15px;margin-bottom:28px;line-height:1.6}
        label{display:block;font-size:13px;font-weight:700;color:#1A1A2E;margin-bottom:6px;margin-top:18px}
        input,textarea{width:100%;background:#F5F0EC;border:2px solid transparent;border-radius:12px;padding:12px 16px;font-family:'Heebo',sans-serif;font-size:15px;color:#1A1A1A;outline:none;transition:all .2s;resize:vertical}
        input:focus,textarea:focus{border-color:#E8321A;background:#fff;box-shadow:0 0 0 4px rgba(232,50,26,.08)}
        button{margin-top:24px;width:100%;background:#E8321A;color:#fff;border-radius:12px;padding:14px;font-family:'Heebo',sans-serif;font-size:16px;font-weight:800;cursor:pointer;border:none;transition:background .2s}
        button:hover{background:#C42810}
        .success{background:#E8F5E9;color:#2E7D32;border-radius:12px;padding:20px;font-size:15px;font-weight:700;text-align:center}
        @media(max-width:768px){.page-wrap{margin:24px auto}.box{padding:24px 20px}}
      `}</style>
    </Layout>
  );
}
