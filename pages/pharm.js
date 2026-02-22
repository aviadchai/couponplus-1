import Head from 'next/head';
import Layout from '../components/Layout';
import CouponCard, { AdCard } from '../components/CouponCard';
import { getCoupons } from '../lib/sheets';
import { useState } from 'react';

export default function Pharm({ coupons }) {
  const [search, setSearch] = useState('');
  const filtered = coupons.filter(c => !search || c.name.includes(search) || c.chain.includes(search));
  return (
    <Layout>
      <Head><title>פארם וקוסמטיקה | קופון+</title></Head>
      <div className="page-hero">
        <h1>💊 פארם וקוסמטיקה</h1>
        <p>{filtered.length} מבצעים בפארם, טיפוח וקוסמטיקה</p>
        <div className="hero-search">
          <input type="text" placeholder="חפש מוצר פארם..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="section">
        <div className="cards-grid">
          {filtered.map((c, i) => <div key={c.id}><CouponCard coupon={c} />{(i+1)%8===0&&<AdCard/>}</div>)}
          {filtered.length === 0 && <p className="no-results">לא נמצאו מבצעים בפארם</p>}
        </div>
      </div>
      <style jsx>{`
        .page-hero{background:linear-gradient(135deg,#4A148C,#7B1FA2);padding:44px 24px;text-align:center;color:#fff}
        .page-hero h1{font-family:'Rubik',sans-serif;font-size:36px;font-weight:900;margin-bottom:6px}
        .page-hero p{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:16px}
        .hero-search{max-width:400px;margin:0 auto}
        .hero-search input{width:100%;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.15);border-radius:50px;padding:11px 20px;font-family:'Heebo',sans-serif;font-size:14px;color:#fff;outline:none}
        .hero-search input::placeholder{color:rgba(255,255,255,.35)}
        .section{padding:32px 24px;max-width:1280px;margin:0 auto}
        .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
        .no-results{text-align:center;color:#7A6E68;padding:40px;font-size:18px;grid-column:1/-1}
        @media(max-width:768px){.page-hero{padding:32px 16px}.page-hero h1{font-size:26px}.section{padding:20px 16px}.cards-grid{grid-template-columns:repeat(2,1fr);gap:10px}}
        @media(max-width:400px){.cards-grid{grid-template-columns:1fr}}
      `}</style>
    </Layout>
  );
}
export async function getStaticProps() {
  const all = await getCoupons();
  const coupons = all.filter(c => ['פארם ובריאות','טיפוח וקוסמטיקה','טואלטיקה'].includes(c.category));
  return { props: { coupons }, revalidate: 60 };
}
