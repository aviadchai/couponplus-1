import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../components/Layout';
import CouponCard, { AdCard } from '../components/CouponCard';
import { getCoupons } from '../lib/sheets';

export default function Deals({ coupons }) {
  const [search, setSearch] = useState('');
  const [filterChain, setFilterChain] = useState('');
  const chains = [...new Set(coupons.map(c => c.chain))];
  const filtered = coupons.filter(c => {
    const ms = !search || c.name.includes(search) || c.chain.includes(search);
    const mc = !filterChain || c.chain === filterChain;
    return ms && mc;
  });

  return (
    <Layout>
      <Head><title>כל המבצעים | קופון+</title></Head>
      <div className="page-hero">
        <h1>🔥 כל המבצעים</h1>
        <p>{filtered.length} מבצעים פעילים</p>
        <div className="hero-search">
          <input type="text" placeholder="חפש מבצע..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="chain-chips">
          <span className={`cchip${!filterChain ? ' on' : ''}`} onClick={() => setFilterChain('')}>הכל</span>
          {chains.map(c => <span key={c} className={`cchip${filterChain === c ? ' on' : ''}`} onClick={() => setFilterChain(c === filterChain ? '' : c)}>{c}</span>)}
        </div>
      </div>
      <div className="section">
        <div className="cards-grid">
          {filtered.map((c, i) => (
            <div key={c.id}>
              <CouponCard coupon={c} />
              {(i + 1) % 8 === 0 && <AdCard />}
            </div>
          ))}
          {filtered.length === 0 && <p className="no-results">לא נמצאו מבצעים</p>}
        </div>
      </div>
      <style jsx>{`
        .page-hero{background:linear-gradient(135deg,#1A1A2E,#2D1B4E);padding:44px 24px;text-align:center;color:#fff}
        .page-hero h1{font-family:'Rubik',sans-serif;font-size:36px;font-weight:900;margin-bottom:6px}
        .page-hero p{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:16px}
        .hero-search{max-width:400px;margin:0 auto 16px}
        .hero-search input{width:100%;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.15);border-radius:50px;padding:11px 20px;font-family:'Heebo',sans-serif;font-size:14px;color:#fff;outline:none}
        .hero-search input::placeholder{color:rgba(255,255,255,.35)}
        .chain-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
        .cchip{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);padding:6px 16px;border-radius:50px;font-size:13px;font-weight:700;cursor:pointer;transition:all .18s}
        .cchip:hover,.cchip.on{background:#E8321A;border-color:#E8321A;color:#fff}
        .section{padding:32px 24px;max-width:1280px;margin:0 auto}
        .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}
        .no-results{text-align:center;color:#7A6E68;padding:40px;font-size:18px;grid-column:1/-1}
        @media(max-width:768px){
          .page-hero{padding:32px 16px}
          .page-hero h1{font-size:26px}
          .section{padding:20px 16px}
          .cards-grid{grid-template-columns:repeat(2,1fr);gap:10px}
        }
        @media(max-width:400px){.cards-grid{grid-template-columns:1fr}}
      `}</style>
    </Layout>
  );
}
export async function getStaticProps() {
  const coupons = await getCoupons();
  return { props: { coupons }, revalidate: 60 };
}
