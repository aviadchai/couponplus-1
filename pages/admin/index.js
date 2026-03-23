import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { verifyToken } from '../../lib/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const d = await res.json();
        setError(d.error || 'שגיאה בהתחברות');
      }
    } catch {
      setError('שגיאת חיבור לשרת');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>כניסה לניהול | קופון פלוס</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="page">
        <div className="card">
          <div className="logo">
            <span className="logo-icon">+</span>
            <span className="logo-text">קופון פלוס</span>
          </div>
          <h1>כניסה לניהול</h1>
          <p className="subtitle">רק למנהלים מורשים</p>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>שם משתמש</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="הכנס שם משתמש"
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label>סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="הכנס סיסמה"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'מתחבר...' : 'כניסה'}
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Heebo', sans-serif; direction: rtl; }`}</style>
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .card {
          background: #fff; border-radius: 24px;
          padding: 48px 40px; width: 100%; max-width: 420px;
          box-shadow: 0 24px 80px rgba(0,0,0,.4);
          text-align: center;
        }
        .logo {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 28px;
        }
        .logo-icon {
          width: 40px; height: 40px; background: #E8321A;
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-size: 26px; font-weight: 900; color: #fff; line-height: 1;
        }
        .logo-text { font-size: 22px; font-weight: 900; color: #1A1A2E; }
        h1 { font-size: 22px; font-weight: 900; color: #1A1A2E; margin-bottom: 6px; }
        .subtitle { font-size: 13px; color: #9E9E9E; margin-bottom: 32px; }
        .field { text-align: right; margin-bottom: 16px; }
        label { display: block; font-size: 13px; font-weight: 700; color: #1A1A2E; margin-bottom: 6px; }
        input {
          width: 100%; padding: 12px 14px; border: 2px solid #E8E0D8;
          border-radius: 12px; font-size: 14px; font-family: 'Heebo', sans-serif;
          outline: none; transition: border-color .18s; direction: ltr; text-align: left;
        }
        input:focus { border-color: #1A1A2E; }
        .error {
          background: #FFEBEE; color: #C62828; border-radius: 10px;
          padding: 10px 14px; font-size: 13px; font-weight: 600;
          margin-bottom: 16px; text-align: right;
        }
        .btn-login {
          width: 100%; padding: 14px; background: #E8321A; color: #fff;
          border: none; border-radius: 12px; font-size: 15px; font-weight: 800;
          cursor: pointer; transition: background .18s; font-family: 'Heebo', sans-serif;
          margin-top: 8px;
        }
        .btn-login:hover:not(:disabled) { background: #FF5A3D; }
        .btn-login:disabled { opacity: .6; cursor: not-allowed; }
      `}</style>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { verifyToken } = await import('../../lib/auth');
  const token = req.cookies?.admin_auth;
  if (verifyToken(token)) {
    return { redirect: { destination: '/admin/dashboard', permanent: false } };
  }
  return { props: {} };
}
