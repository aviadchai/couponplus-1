import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../lib/supabase';

export default function ShoppingPanel() {
  const router = useRouter();
  const [user,  setUser]  = useState(null);
  const [count, setCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user ?? null;
      setUser(u);
      if (u) {
        supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', u.id)
          .then(({ count: c }) => setCount(c || 0));
      }
    });
  }, []);

  return (
    <>
      <button className="fab" onClick={() => router.push('/shopping')}>
        🛒
      </button>

      <style jsx>{`
        .fab {
          position: fixed; bottom: 80px; left: 20px;
          width: 58px; height: 58px;
          background: #1A1A2E;
          color: #fff; font-size: 24px;
          border-radius: 50%; border: none; cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,.25);
          display: flex; align-items: center; justify-content: center;
          transition: transform .2s, box-shadow .2s;
          z-index: 500; position: fixed;
        }
        .fab:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(0,0,0,.3); }
        .fab-badge {
          position: absolute; top: -4px; right: -4px;
          background: #E8321A; color: #fff;
          font-size: 11px; font-weight: 900;
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rubik', sans-serif;
        }
        @media (min-width: 769px) { .fab { bottom: 32px; } }
      `}</style>
    </>
  );
}
