import Head from 'next/head';
import Layout from '../../components/Layout';
import CouponCard, { AdCard } from '../../components/CouponCard';
import { getCoupons } from '../../lib/sheets';
import { useState } from 'react';

const META = {
  'סופרמרקט':{'emoji':'🛍️','color':'#1A1A2E'},
  'פארם ובריאות':{'emoji':'💊','color':'#4A148C'},
  'טיפוח וקוסמטיקה':{'emoji':'💄','color':'#880E4F'},
  'טואלטיקה':{'emoji':'🧴','color':'#006064'},
  'אלקטרוניקה':{'emoji':'📱','color':'#1565C0'},
  'בית ומטבח':{'emoji':'🏠','color':'#4E342E'},
  'אופנה':{'emoji':'👗','color':'#AD1457'},
  'חיות מחמד':{'emoji':'🐾','color':'#2E7D32'},
};

export default function CategoryPage({ coupons, category }) {
  const [search, setSearch] = useState('');
  const meta = META[category] || { emoji: '🏷️', color: '#1A1A2E' };
  const filtered = coupons.filter(c => !search || c.name.includes(search) || c.chain.includes(search));
  return (
    <Layout>
      <Head><title>{meta.emoji} {category} | קופון+</title></Head>
      <div className="page-hero" style={{ background: `linear-gradient(135deg, ${meta.color}ee, ${meta.color}99)` }}>
        <h1>{meta.emoji} {category}</h1>
        <p>{filtered.length} מבצעים פעילים</p>
        <div className="hero-search">
          <input type="text" placeholder={`חפש ב${category}...`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="section">
        {filtered.length === 0
          ? <div className="empty"><div>{meta.emoji}</div><p>עדיין אין קופונים בקטגוריה זו</p></div>
          : <div className="cards-grid">{filtered.map((c,i) => <div key={c.id}><CouponCard coupon={c}/>{(i+1)%8===0&&<AdCard/>}</div>)}</div>
        }
      </div>
      <style jsx>{`
        .page-hero{padding:44px 24px;text-align:center;color:#fff}
        .page-hero h1{font-family:'Rubik',sans-serif;font-size:36px;font-weight:900;margin-bottom:6px}
        .page-hero p{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:16px}
        .hero-search{max-width:400px;margin:0 auto}
        .hero-search input{width:100%;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.2);border-radius:50px;padding:11px 20px;font-family:'Heebo',sans-serif;font-size:14px;color:#fff;outline:none}
        .hero-search input::placeholder{color:rgba(255,255,255,.35)}
        .section{padding:32px 24px;max-width:1280px;margin:0 auto}
        .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}
        .empty{text-align:center;padding:60px 24px;font-size:48px}
        .empty p{font-size:16px;color:#7A6E68;margin-top:12px}
        @media(max-width:768px){.page-hero{padding:32px 16px}.page-hero h1{font-size:26px}.section{padding:20px 16px}.cards-grid{grid-template-columns:repeat(2,1fr);gap:10px}}
        @media(max-width:400px){.cards-grid{grid-template-columns:1fr}}
      `}</style>
    </Layout>
  );
}
export async function getStaticPaths() {
  return {
    paths: Object.keys({'סופרמרקט':1,'פארם ובריאות':1,'טיפוח וקוסמטיקה':1,'טואלטיקה':1,'אלקטרוניקה':1,'בית ומטבח':1,'אופנה':1,'חיות מחמד':1}).map(s => ({ params: { slug: s } })),
    fallback: 'blocking',
  };
}
export async function getStaticProps({ params }) {
  const all = await getCoupons();
  const coupons = all.filter(c => c.category === params.slug);
  return { props: { coupons, category: params.slug }, revalidate: 60 };
}
