import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

// ── קבועים ────────────────────────────────────────────────────────
const CHAINS = ['רמי לוי','שופרסל','מגה','ויקטורי','יינות ביתן','חצי חינם','יוחננוף','אושר עד','מחסני השוק','Super-Pharm','NewPharm','כללית מושלם','AliExpress','Shein','Amazon','eBay','Temu','אחר'];
const CATEGORIES = ['סופרמרקט','פארם ובריאות','טיפוח וקוסמטיקה','טואלטיקה','אלקטרוניקה','בית ומטבח','אופנה','חיות מחמד','בינלאומי','קופוני-מוצר','אחר'];
const TYPES = ['קוד קופון','קישור להטבה','קוד + קישור'];
const BADGES = ['','חם','חדש','מוגבל','פסח','שבועות','ראש השנה','סוכות','חנוכה','פורים'];

const EMPTY_FORM = {
  id: '', name: '', chain: '', category: '', discount: '',
  type: 'קוד קופון', code: '', url: '', expiry: '', badge: '',
  image: '', description: '', pdf: '', is_active: true,
};

const EMPTY_SLIDE = {
  title: '', subtitle: '', tag: '', discount: '',
  type: 'קישור להטבה', code: '', url: '', image: '',
  coupon_id: '', is_active: true, sort_order: 0,
};

const EMPTY_ANN = { text: '', url: '', is_clickable: false, is_active: true, sort_order: 0 };

const SLIDE_TAGS = ['','סופרמרקט','פארם ובריאות','טיפוח וקוסמטיקה','אלקטרוניקה','בית ומטבח','אופנה','חיות מחמד','בינלאומי','🔥 חם','✨ חדש'];

// ── Helper: בניית ID אוטומטי ──────────────────────────────────────
function nextId(coupons) {
  const nums = coupons
    .map(c => parseInt(c.id?.replace('coup_', ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `coup_${String(max + 1).padStart(2, '0')}`;
}

// ── העלאת תמונה ל-Cloudinary ─────────────────────────────────────
async function uploadToCloudinary(file, onProgress) {
  const CLOUD  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!CLOUD || !PRESET) throw new Error('Cloudinary לא מוגדר ב-.env');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', PRESET);
  fd.append('folder', 'couponplus');
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = e => onProgress && onProgress(Math.round(e.loaded / e.total * 100));
    xhr.onload = () => {
      const d = JSON.parse(xhr.responseText);
      if (xhr.status === 200) resolve(d.secure_url);
      else reject(new Error(d.error?.message || 'שגיאת העלאה'));
    };
    xhr.onerror = () => reject(new Error('שגיאת רשת'));
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`);
    xhr.send(fd);
  });
}

export default function AdminDashboard({ initialCoupons, initialSlides, initialAnnouncements }) {
  const router = useRouter();
  const [tab,           setTab]           = useState('coupons'); // 'coupons' | 'slides' | 'ticker'
  const [coupons,       setCoupons]       = useState(initialCoupons);
  const [slides,        setSlides]        = useState(initialSlides);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [search,      setSearch]      = useState('');
  const [filterBadge, setFilterBadge] = useState('');
  const [filterCat,   setFilterCat]   = useState('');
  const [modal,       setModal]       = useState(null); // null | 'add' | 'edit' | 'slide-add' | 'slide-edit' | 'ann-add' | 'ann-edit'
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [slideForm,   setSlideForm]   = useState(EMPTY_SLIDE);
  const [annForm,     setAnnForm]     = useState(EMPTY_ANN);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(null);
  const [imgProgress, setImgProgress] = useState(0);
  const [imgTab,      setImgTab]      = useState('upload'); // 'upload' | 'url'
  const [toast,       setToast]       = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  // ── סינון ─────────────────────────────────────────────────────
  const filtered = coupons.filter(c => {
    const s = search.toLowerCase();
    const ms = !s || c.name?.toLowerCase().includes(s) || c.chain?.toLowerCase().includes(s) || c.id?.toLowerCase().includes(s);
    const mb = !filterBadge || c.badge === filterBadge;
    const mc = !filterCat || c.category === filterCat;
    return ms && mb && mc;
  });

  // ── סטטיסטיקות ───────────────────────────────────────────────
  const stats = {
    total:   coupons.length,
    active:  coupons.filter(c => c.is_active).length,
    expired: coupons.filter(c => !c.is_active).length,
    special: coupons.filter(c => c.badge && !['חם','חדש','מוגבל',''].includes(c.badge)).length,
  };

  // ── פתיחת טופס הוספה ─────────────────────────────────────────
  function openAdd() {
    setForm({ ...EMPTY_FORM, id: nextId(coupons) });
    setImgTab('upload');
    setModal('add');
  }

  // ── פתיחת טופס עריכה ─────────────────────────────────────────
  function openEdit(coupon) {
    setForm({ ...coupon });
    setImgTab(coupon.image?.startsWith('http') ? 'url' : 'upload');
    setModal('edit');
  }

  // ── שינוי שדה טופס ───────────────────────────────────────────
  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  // ── העלאת תמונה ──────────────────────────────────────────────
  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgProgress(1);
    try {
      const url = await uploadToCloudinary(file, setImgProgress);
      setField('image', url);
      setImgProgress(0);
    } catch (err) {
      alert('שגיאת העלאה: ' + err.message);
      setImgProgress(0);
    }
  }

  // ── שמירת קופון ──────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = modal === 'edit';
      const url  = isEdit ? `/api/admin/coupons/${form.id}` : '/api/admin/coupons';
      const method = isEdit ? 'PUT' : 'POST';
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'שגיאה');
      }
      const saved = await res.json();
      setCoupons(prev =>
        isEdit
          ? prev.map(c => c.id === saved.id ? saved : c)
          : [saved, ...prev]
      );
      setModal(null);
      showToast(isEdit ? '✅ קופון עודכן' : '✅ קופון נוסף');
    } catch (err) {
      alert('שגיאה: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── מחיקת קופון ──────────────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm(`למחוק קופון ${id}?`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      setCoupons(prev => prev.filter(c => c.id !== id));
      showToast('🗑 קופון נמחק');
    } catch {
      alert('שגיאת מחיקה');
    } finally {
      setDeleting(null);
    }
  }

  // ── החלפת is_active ───────────────────────────────────────────
  async function toggleActive(coupon) {
    const updated = { ...coupon, is_active: !coupon.is_active };
    await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setCoupons(prev => prev.map(c => c.id === coupon.id ? updated : c));
  }

  // ── יציאה ────────────────────────────────────────────────────
  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin');
  }

  // ── סליידר ────────────────────────────────────────────────────
  function openSlideAdd() {
    setSlideForm({ ...EMPTY_SLIDE, sort_order: slides.length });
    setImgTab('upload');
    setModal('slide-add');
  }

  function openSlideEdit(slide) {
    setSlideForm({ ...slide });
    setImgTab(slide.image ? 'url' : 'upload');
    setModal('slide-edit');
  }

  async function handleSaveSlide(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = modal === 'slide-edit';
      const url    = isEdit ? `/api/admin/slides/${slideForm.id}` : '/api/admin/slides';
      const res    = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const saved = await res.json();
      setSlides(prev => isEdit ? prev.map(s => s.id === saved.id ? saved : s) : [...prev, saved]);
      setModal(null);
      showToast(isEdit ? '✅ שקף עודכן' : '✅ שקף נוסף');
    } catch (err) {
      alert('שגיאה: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSlide(id) {
    if (!confirm('למחוק שקף זה?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
      setSlides(prev => prev.filter(s => s.id !== id));
      showToast('🗑 שקף נמחק');
    } catch { alert('שגיאת מחיקה'); }
    finally { setDeleting(null); }
  }

  async function toggleSlideActive(slide) {
    const updated = { ...slide, is_active: !slide.is_active };
    await fetch(`/api/admin/slides/${slide.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setSlides(prev => prev.map(s => s.id === slide.id ? updated : s));
  }

  // ── הודעות טיקר ───────────────────────────────────────────────
  function openAnnAdd() {
    setAnnForm({ ...EMPTY_ANN, sort_order: announcements.length });
    setModal('ann-add');
  }

  function openAnnEdit(ann) {
    setAnnForm({ ...ann });
    setModal('ann-edit');
  }

  async function handleSaveAnn(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = modal === 'ann-edit';
      const url    = isEdit ? `/api/admin/announcements/${annForm.id}` : '/api/admin/announcements';
      const res    = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annForm),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const saved = await res.json();
      setAnnouncements(prev => isEdit ? prev.map(a => a.id === saved.id ? saved : a) : [...prev, saved]);
      setModal(null);
      showToast(isEdit ? '✅ הודעה עודכנה' : '✅ הודעה נוספה');
    } catch (err) {
      alert('שגיאה: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAnn(id) {
    if (!confirm('למחוק הודעה זו?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      showToast('🗑 הודעה נמחקה');
    } catch { alert('שגיאת מחיקה'); }
    finally { setDeleting(null); }
  }

  async function toggleAnnActive(ann) {
    const updated = { ...ann, is_active: !ann.is_active };
    await fetch(`/api/admin/announcements/${ann.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setAnnouncements(prev => prev.map(a => a.id === ann.id ? updated : a));
  }

  const showCode = form.type === 'קוד קופון' || form.type === 'קוד + קישור';
  const showUrl  = form.type === 'קישור להטבה' || form.type === 'קוד + קישור';
  const slideShowCode = slideForm.type === 'קוד קופון' || slideForm.type === 'קוד + קישור';
  const slideShowUrl  = slideForm.type === 'קישור להטבה' || slideForm.type === 'קוד + קישור';

  return (
    <>
      <Head>
        <title>לוח ניהול | קופון פלוס</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;900&family=Rubik:wght@700;900&display=swap" rel="stylesheet" />
      </Head>

      {/* ═══ HEADER ═══ */}
      <header className="hdr">
        <div className="hdr-inner">
          <div className="hdr-logo">
            <span className="logo-box">+</span>
            <span className="logo-lbl">קופון פלוס — ניהול</span>
          </div>
          <div className="hdr-actions">
            <a href="/" target="_blank" className="btn-site">🌐 לאתר</a>
            <button onClick={handleLogout} className="btn-logout">יציאה</button>
          </div>
        </div>
      </header>

      <main className="main">

        {/* ═══ TABS ═══ */}
        <div className="tabs">
          <button className={`tab${tab==='coupons'?' active':''}`} onClick={() => setTab('coupons')}>🏷️ קופונים ({coupons.length})</button>
          <button className={`tab${tab==='slides'?' active':''}`} onClick={() => setTab('slides')}>🖼️ סליידר ({slides.filter(s=>s.is_active).length} פעילים)</button>
          <button className={`tab${tab==='ticker'?' active':''}`} onClick={() => setTab('ticker')}>📢 טיקר ({announcements.filter(a=>a.is_active).length} פעילים)</button>
        </div>

        {/* ═══ SLIDES TAB ═══ */}
        {tab === 'slides' && (
          <div>
            <div className="toolbar">
              <div style={{flex:1,fontSize:13,color:'#7A6E68',fontWeight:600}}>עד 3 שקפים פעילים מוצגים בסליידר הראשי</div>
              <button className="btn-add" onClick={openSlideAdd} disabled={slides.filter(s=>s.is_active).length >= 3}>
                + הוסף שקף {slides.filter(s=>s.is_active).length >= 3 ? '(מקסימום 3)' : ''}
              </button>
            </div>
            <div className="slides-grid">
              {slides.length === 0 && <div className="empty-row" style={{padding:40,textAlign:'center',color:'#9E9E9E'}}>אין שקפים עדיין</div>}
              {slides.map(s => (
                <div key={s.id} className={`slide-card${!s.is_active?' inactive':''}`}>
                  <div className="slide-preview" style={{backgroundImage: s.image ? `url(${s.image})` : 'none', background: s.image ? undefined : 'linear-gradient(135deg,#1A1A2E,#E8321A)'}}>
                    {s.discount && <div className="slide-discount">{s.discount}</div>}
                    {s.tag && <div className="slide-tag">{s.tag}</div>}
                  </div>
                  <div className="slide-info">
                    <div className="slide-title">{s.title || '(ללא כותרת)'}</div>
                    {s.subtitle && <div className="slide-sub">{s.subtitle}</div>}
                    <div className="slide-meta">
                      {s.code && <span className="slide-badge">קוד: {s.code}</span>}
                      {s.url && <span className="slide-badge">🔗 קישור</span>}
                      {s.coupon_id && <span className="slide-badge">→ {s.coupon_id}</span>}
                    </div>
                  </div>
                  <div className="slide-actions">
                    <button className={`toggle-btn ${s.is_active?'on':'off'}`} onClick={() => toggleSlideActive(s)}>
                      {s.is_active ? 'פעיל' : 'כבוי'}
                    </button>
                    <button className="btn-edit" onClick={() => openSlideEdit(s)}>✏ עריכה</button>
                    <button className="btn-del" onClick={() => handleDeleteSlide(s.id)} disabled={deleting===s.id}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TICKER TAB ═══ */}
        {tab === 'ticker' && (
          <div>
            <div className="toolbar">
              <div style={{flex:1,fontSize:13,color:'#7A6E68',fontWeight:600}}>הודעות מופיעות ברצועה הגוללת בראש האתר</div>
              <button className="btn-add" onClick={openAnnAdd}>+ הוסף הודעה</button>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>סדר</th>
                    <th style={{width:'100%'}}>טקסט ההודעה</th>
                    <th>פעיל</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.length === 0 && (
                    <tr><td colSpan={4} className="empty-row">אין הודעות עדיין</td></tr>
                  )}
                  {announcements.map(a => (
                    <tr key={a.id} className={!a.is_active ? 'row-inactive' : ''}>
                      <td style={{textAlign:'center',color:'#9E9E9E',fontSize:13}}>{a.sort_order ?? '—'}</td>
                      <td style={{fontWeight:600,direction:'rtl'}}>{a.text}</td>
                      <td>
                        <button className={`toggle-btn ${a.is_active?'on':'off'}`} onClick={() => toggleAnnActive(a)}>
                          {a.is_active ? 'פעיל' : 'כבוי'}
                        </button>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="btn-edit" onClick={() => openAnnEdit(a)}>✏ עריכה</button>
                          <button className="btn-del" onClick={() => handleDeleteAnn(a.id)} disabled={deleting===a.id}>
                            {deleting===a.id ? '...' : '🗑'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ STATS + TABLE (coupons tab only) ═══ */}
        {tab === 'coupons' && <><div className="stats-row">
          <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-lbl">סה״כ קופונים</div></div>
          <div className="stat-card green"><div className="stat-num">{stats.active}</div><div className="stat-lbl">פעילים</div></div>
          <div className="stat-card red"><div className="stat-num">{stats.expired}</div><div className="stat-lbl">לא פעילים</div></div>
          <div className="stat-card gold"><div className="stat-num">{stats.special}</div><div className="stat-lbl">קופוני חג</div></div>
        </div>

        {/* ═══ TOOLBAR ═══ */}
        <div className="toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 חיפוש לפי שם, רשת, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="filter-sel" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">כל הקטגוריות</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="filter-sel" value={filterBadge} onChange={e => setFilterBadge(e.target.value)}>
            <option value="">כל הבאדג׳ים</option>
            {BADGES.filter(Boolean).map(b => <option key={b}>{b}</option>)}
          </select>
          <button className="btn-add" onClick={openAdd}>+ הוסף קופון</button>
        </div>

        {/* ═══ TABLE ═══ */}
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>שם הקופון</th>
                <th>רשת</th>
                <th>קטגוריה</th>
                <th>הנחה</th>
                <th>Badge</th>
                <th>תוקף</th>
                <th>פעיל</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="empty-row">לא נמצאו קופונים</td></tr>
              )}
              {filtered.map(c => (
                <tr key={c.id} className={!c.is_active ? 'row-inactive' : ''}>
                  <td><span className="id-pill">{c.id}</span></td>
                  <td className="td-name">
                    {c.image && <img src={c.image} alt="" className="tbl-thumb" />}
                    {c.name}
                  </td>
                  <td>{c.chain}</td>
                  <td>{c.category}</td>
                  <td><b>{c.discount}</b></td>
                  <td>{c.badge && <span className="badge-pill">{c.badge}</span>}</td>
                  <td className={!c.expiry ? '' : 'td-expiry'}>{c.expiry || '—'}</td>
                  <td>
                    <button
                      className={`toggle-btn ${c.is_active ? 'on' : 'off'}`}
                      onClick={() => toggleActive(c)}
                      title={c.is_active ? 'לחץ לכיבוי' : 'לחץ להפעלה'}
                    >
                      {c.is_active ? 'פעיל' : 'כבוי'}
                    </button>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-edit" onClick={() => openEdit(c)}>✏ עריכה</button>
                      <button
                        className="btn-del"
                        onClick={() => handleDelete(c.id)}
                        disabled={deleting === c.id}
                      >
                        {deleting === c.id ? '...' : '🗑'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tbl-count">{filtered.length} קופונים מוצגים</div>
        </>}

      </main>

      {/* ═══ SLIDE MODAL ═══ */}
      {(modal === 'slide-add' || modal === 'slide-edit') && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-hdr">
              <h2>{modal === 'slide-add' ? '➕ הוסף שקף' : '✏ עריכת שקף'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveSlide} className="form">

              <div className="field">
                <label>כותרת ראשית <span className="req">*</span></label>
                <input value={slideForm.title} onChange={e => setSlideForm(f=>({...f,title:e.target.value}))} placeholder="לדוגמה: חסכו 20% ברמי לוי" required />
              </div>

              <div className="form-row">
                <div className="field">
                  <label>כותרת משנה</label>
                  <input value={slideForm.subtitle} onChange={e => setSlideForm(f=>({...f,subtitle:e.target.value}))} placeholder="טקסט קטן מתחת לכותרת" />
                </div>
                <div className="field">
                  <label>תגית</label>
                  <select value={slideForm.tag} onChange={e => setSlideForm(f=>({...f,tag:e.target.value}))}>
                    {SLIDE_TAGS.map(t => <option key={t} value={t}>{t || 'ללא תגית'}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>הנחה (טקסט גדול)</label>
                  <input value={slideForm.discount} onChange={e => setSlideForm(f=>({...f,discount:e.target.value}))} placeholder="20% / 50₪ / 1+1" />
                </div>
                <div className="field">
                  <label>סוג</label>
                  <select value={slideForm.type} onChange={e => setSlideForm(f=>({...f,type:e.target.value}))}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                {slideShowCode && (
                  <div className="field">
                    <label>קוד קופון</label>
                    <input value={slideForm.code} onChange={e => setSlideForm(f=>({...f,code:e.target.value}))} placeholder="SAVE20" style={{letterSpacing:'2px',fontWeight:700}} />
                  </div>
                )}
                {slideShowUrl && (
                  <div className="field" style={{flex:2}}>
                    <label>קישור</label>
                    <input type="url" value={slideForm.url} onChange={e => setSlideForm(f=>({...f,url:e.target.value}))} placeholder="https://..." />
                  </div>
                )}
              </div>

              <div className="field">
                <label>ID קופון (לחיצה תעביר לדף הקופון)</label>
                <input value={slideForm.coupon_id} onChange={e => setSlideForm(f=>({...f,coupon_id:e.target.value}))} placeholder="coup_01" />
              </div>

              <div className="field">
                <label>תמונת רקע</label>
                <div className="img-tabs">
                  <button type="button" className={`img-tab${imgTab==='upload'?' active':''}`} onClick={()=>setImgTab('upload')}>📁 העלאת קובץ</button>
                  <button type="button" className={`img-tab${imgTab==='url'?' active':''}`} onClick={()=>setImgTab('url')}>🔗 הדבק URL</button>
                </div>
                {imgTab === 'upload' ? (
                  <div className="upload-box">
                    <input type="file" accept="image/*" onChange={async e => {
                      const file = e.target.files?.[0]; if (!file) return;
                      setImgProgress(1);
                      try { const url = await uploadToCloudinary(file, setImgProgress); setSlideForm(f=>({...f,image:url})); setImgProgress(0); }
                      catch(err) { alert('שגיאת העלאה: ' + err.message); setImgProgress(0); }
                    }} id="slide-img-file" style={{display:'none'}} />
                    <label htmlFor="slide-img-file" className="upload-label">
                      {imgProgress > 0 ? <span>מעלה... {imgProgress}%</span> : <span>לחץ לבחירת תמונה (מומלץ 1280×480)</span>}
                    </label>
                    {imgProgress > 0 && <div className="progress-bar"><div style={{width:`${imgProgress}%`}} /></div>}
                  </div>
                ) : (
                  <input type="url" value={slideForm.image} onChange={e => setSlideForm(f=>({...f,image:e.target.value}))} placeholder="https://..." />
                )}
                {slideForm.image && (
                  <div className="img-preview">
                    <img src={slideForm.image} alt="תצוגה מקדימה" style={{width:160,height:60,objectFit:'cover'}} />
                    <button type="button" className="img-remove" onClick={() => setSlideForm(f=>({...f,image:''}))}>✕ הסר</button>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="field">
                  <label>סדר תצוגה</label>
                  <input type="number" value={slideForm.sort_order} onChange={e => setSlideForm(f=>({...f,sort_order:parseInt(e.target.value)||0}))} min={0} max={10} />
                </div>
                <div className="field-inline" style={{flex:2,justifyContent:'flex-start',paddingTop:24}}>
                  <label>
                    <input type="checkbox" checked={slideForm.is_active} onChange={e => setSlideForm(f=>({...f,is_active:e.target.checked}))} />
                    <span>שקף פעיל (מוצג בסליידר)</span>
                  </label>
                </div>
              </div>

              <div className="form-footer">
                <button type="button" className="btn-cancel" onClick={() => setModal(null)}>ביטול</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'שומר...' : modal === 'slide-add' ? '✅ הוסף שקף' : '💾 שמור'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ ANN MODAL ═══ */}
      {(modal === 'ann-add' || modal === 'ann-edit') && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{maxWidth:480}}>
            <div className="modal-hdr">
              <h2>{modal === 'ann-add' ? '➕ הוסף הודעה' : '✏ עריכת הודעה'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveAnn} className="form">
              <div className="field">
                <label>טקסט ההודעה <span className="req">*</span></label>
                <input
                  value={annForm.text}
                  onChange={e => setAnnForm(f=>({...f,text:e.target.value}))}
                  placeholder="לדוגמה: קופון חדש! 20% הנחה ברמי לוי"
                  required
                />
              </div>
              <div className="field-inline">
                <label>
                  <input type="checkbox" checked={!!annForm.is_clickable} onChange={e => setAnnForm(f=>({...f,is_clickable:e.target.checked}))} />
                  <span>הודעה לחיצה (מובילה לקישור)</span>
                </label>
              </div>
              {annForm.is_clickable && (
                <div className="field">
                  <label>קישור</label>
                  <input
                    type="url"
                    value={annForm.url || ''}
                    onChange={e => setAnnForm(f=>({...f,url:e.target.value}))}
                    placeholder="https://..."
                  />
                </div>
              )}
              <div className="form-row">
                <div className="field" style={{flex:'0 0 120px'}}>
                  <label>סדר תצוגה</label>
                  <input
                    type="number"
                    value={annForm.sort_order}
                    onChange={e => setAnnForm(f=>({...f,sort_order:parseInt(e.target.value)||0}))}
                    min={0} max={99}
                  />
                </div>
                <div className="field-inline" style={{flex:1,justifyContent:'flex-start',paddingTop:24}}>
                  <label>
                    <input type="checkbox" checked={annForm.is_active} onChange={e => setAnnForm(f=>({...f,is_active:e.target.checked}))} />
                    <span>הודעה פעילה (מוצגת בטיקר)</span>
                  </label>
                </div>
              </div>
              <div className="form-footer">
                <button type="button" className="btn-cancel" onClick={() => setModal(null)}>ביטול</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'שומר...' : modal === 'ann-add' ? '✅ הוסף הודעה' : '💾 שמור'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ MODAL ═══ */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-hdr">
              <h2>{modal === 'add' ? '➕ הוסף קופון חדש' : `✏ עריכת ${form.id}`}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="form">

              {/* ── שורה 1: ID + שם ── */}
              <div className="form-row">
                <div className="field" style={{flex:'0 0 130px'}}>
                  <label>ID <span className="req">*</span></label>
                  <input value={form.id} onChange={e => setField('id', e.target.value)} placeholder="coup_01" required disabled={modal === 'edit'} />
                </div>
                <div className="field" style={{flex:1}}>
                  <label>שם הקופון <span className="req">*</span></label>
                  <input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="לדוגמה: 20% הנחה על כל הרשת" required />
                </div>
              </div>

              {/* ── שורה 2: רשת + קטגוריה + סוג ── */}
              <div className="form-row">
                <div className="field">
                  <label>רשת / מותג <span className="req">*</span></label>
                  <select value={form.chain} onChange={e => setField('chain', e.target.value)} required>
                    <option value="">בחר רשת...</option>
                    {CHAINS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>קטגוריה</label>
                  <select value={form.category} onChange={e => setField('category', e.target.value)}>
                    <option value="">בחר קטגוריה...</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>סוג <span className="req">*</span></label>
                  <select value={form.type} onChange={e => setField('type', e.target.value)}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* ── שורה 3: הנחה + Badge + תוקף ── */}
              <div className="form-row">
                <div className="field">
                  <label>הנחה</label>
                  <input value={form.discount} onChange={e => setField('discount', e.target.value)} placeholder="20% / 50₪ / 1+1" />
                </div>
                <div className="field">
                  <label>Badge / תגית</label>
                  <select value={form.badge} onChange={e => setField('badge', e.target.value)}>
                    <option value="">ללא תגית</option>
                    {BADGES.filter(Boolean).map(b => <option key={b}>{b}</option>)}
                  </select>
                  <span className="hint">תגית חג = יופיע גם בדף Special</span>
                </div>
                <div className="field">
                  <label>תוקף עד</label>
                  <input type="date" value={
                    form.expiry
                      ? form.expiry.split('/').reverse().join('-')
                      : ''
                  } onChange={e => {
                    if (!e.target.value) { setField('expiry', ''); return; }
                    const [y,m,d] = e.target.value.split('-');
                    setField('expiry', `${d}/${m}/${y}`);
                  }} />
                </div>
              </div>

              {/* ── קוד / קישור (תלוי בסוג) ── */}
              <div className="form-row">
                {showCode && (
                  <div className="field">
                    <label>קוד קופון</label>
                    <input value={form.code} onChange={e => setField('code', e.target.value)} placeholder="SAVE20" style={{letterSpacing:'2px',fontWeight:700}} />
                  </div>
                )}
                {showUrl && (
                  <div className="field" style={{flex:2}}>
                    <label>קישור להטבה</label>
                    <input type="url" value={form.url} onChange={e => setField('url', e.target.value)} placeholder="https://..." />
                  </div>
                )}
              </div>

              {/* ── תמונה ── */}
              <div className="field">
                <label>תמונה</label>
                <div className="img-tabs">
                  <button type="button" className={`img-tab${imgTab==='upload'?' active':''}`} onClick={()=>setImgTab('upload')}>📁 העלאת קובץ</button>
                  <button type="button" className={`img-tab${imgTab==='url'?' active':''}`} onClick={()=>setImgTab('url')}>🔗 הדבק URL</button>
                </div>
                {imgTab === 'upload' ? (
                  <div className="upload-box">
                    <input type="file" accept="image/*" onChange={handleImageFile} id="img-file" style={{display:'none'}} />
                    <label htmlFor="img-file" className="upload-label">
                      {imgProgress > 0
                        ? <span>מעלה... {imgProgress}%</span>
                        : <span>לחץ לבחירת תמונה</span>
                      }
                    </label>
                    {imgProgress > 0 && (
                      <div className="progress-bar"><div style={{width:`${imgProgress}%`}} /></div>
                    )}
                  </div>
                ) : (
                  <input type="url" value={form.image} onChange={e => setField('image', e.target.value)} placeholder="https://res.cloudinary.com/..." />
                )}
                {form.image && (
                  <div className="img-preview">
                    <img src={form.image} alt="תצוגה מקדימה" />
                    <button type="button" className="img-remove" onClick={() => setField('image', '')}>✕ הסר</button>
                  </div>
                )}
              </div>

              {/* ── תיאור ── */}
              <div className="field">
                <label>תיאור מורחב</label>
                <textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={3} placeholder="פרטים נוספים על הקופון..." />
              </div>

              {/* ── PDF ── */}
              <div className="field">
                <label>PDF מבצעים (URL)</label>
                <input type="url" value={form.pdf} onChange={e => setField('pdf', e.target.value)} placeholder="https://..." />
              </div>

              {/* ── פעיל ── */}
              <div className="field-inline">
                <label>
                  <input type="checkbox" checked={form.is_active} onChange={e => setField('is_active', e.target.checked)} />
                  <span>קופון פעיל (מוצג באתר)</span>
                </label>
              </div>

              {/* ── כפתורים ── */}
              <div className="form-footer">
                <button type="button" className="btn-cancel" onClick={() => setModal(null)}>ביטול</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'שומר...' : modal === 'add' ? '✅ הוסף קופון' : '💾 שמור שינויים'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      {toast && <div className="toast">{toast}</div>}

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Heebo', sans-serif; direction: rtl; background: #F5F0EC; color: #1A1A2E; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        /* HEADER */
        .hdr { background: #1A1A2E; position: sticky; top: 0; z-index: 100; }
        .hdr-inner { max-width: 1400px; margin: 0 auto; padding: 0 24px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
        .hdr-logo { display: flex; align-items: center; gap: 10px; }
        .logo-box { width: 32px; height: 32px; background: #E8321A; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: #fff; }
        .logo-lbl { font-size: 15px; font-weight: 700; color: #fff; }
        .hdr-actions { display: flex; gap: 10px; }
        .btn-site { padding: 7px 14px; background: rgba(255,255,255,.1); color: #fff; border-radius: 8px; font-size: 13px; font-weight: 600; transition: background .18s; }
        .btn-site:hover { background: rgba(255,255,255,.2); }
        .btn-logout { padding: 7px 14px; background: #E8321A; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Heebo', sans-serif; }

        /* MAIN */
        .main { max-width: 1400px; margin: 0 auto; padding: 24px 20px 60px; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
        .stat-card { background: #fff; border-radius: 16px; padding: 18px 20px; border: 1.5px solid #E8E0D8; }
        .stat-card.green { border-color: #A5D6A7; background: #F1FFF4; }
        .stat-card.red   { border-color: #FFCDD2; background: #FFF5F5; }
        .stat-card.gold  { border-color: #FFE082; background: #FFFDE7; }
        .stat-num { font-family: 'Rubik', sans-serif; font-size: 32px; font-weight: 900; color: #1A1A2E; }
        .stat-lbl { font-size: 12px; color: #7A6E68; margin-top: 2px; }

        /* TOOLBAR */
        .toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
        .search-input { flex: 1; min-width: 200px; padding: 10px 14px; border: 2px solid #E8E0D8; border-radius: 10px; font-size: 14px; font-family: 'Heebo', sans-serif; outline: none; background: #fff; }
        .search-input:focus { border-color: #1A1A2E; }
        .filter-sel { padding: 10px 12px; border: 2px solid #E8E0D8; border-radius: 10px; font-size: 13px; font-family: 'Heebo', sans-serif; background: #fff; cursor: pointer; outline: none; }
        .btn-add { padding: 10px 20px; background: #E8321A; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; white-space: nowrap; font-family: 'Heebo', sans-serif; }
        .btn-add:hover { background: #FF5A3D; }

        /* TABLE */
        .tbl-wrap { background: #fff; border-radius: 16px; border: 1.5px solid #E8E0D8; overflow-x: auto; }
        .tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
        .tbl thead th { background: #1A1A2E; color: #fff; padding: 12px 14px; text-align: right; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .tbl tbody tr { border-bottom: 1px solid #F0ECE8; transition: background .15s; }
        .tbl tbody tr:hover { background: #FAF7F5; }
        .tbl tbody tr:last-child { border-bottom: none; }
        .tbl td { padding: 10px 14px; vertical-align: middle; }
        .row-inactive { opacity: .55; }
        .id-pill { background: #F0ECE8; color: #7A6E68; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; font-family: monospace; }
        .td-name { display: flex; align-items: center; gap: 8px; font-weight: 600; max-width: 260px; }
        .tbl-thumb { width: 36px; height: 36px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .badge-pill { background: #FFF0EE; color: #D42B0F; font-size: 11px; font-weight: 800; padding: 2px 9px; border-radius: 20px; }
        .empty-row { text-align: center; padding: 40px; color: #9E9E9E; font-size: 15px; }
        .toggle-btn { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: 'Heebo', sans-serif; }
        .toggle-btn.on { background: #E8F5E9; color: #2E7D32; }
        .toggle-btn.off { background: #FFEBEE; color: #C62828; }
        .row-actions { display: flex; gap: 6px; }
        .btn-edit { padding: 5px 10px; background: #E3F2FD; color: #1565C0; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Heebo', sans-serif; white-space: nowrap; }
        .btn-del { width: 30px; height: 30px; background: #FFEBEE; color: #C62828; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
        .tbl-count { margin-top: 10px; font-size: 12px; color: #9E9E9E; text-align: left; }

        /* MODAL */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 200; display: flex; align-items: flex-start; justify-content: center; padding: 20px; overflow-y: auto; }
        .modal { background: #fff; border-radius: 20px; width: 100%; max-width: 720px; margin: auto; box-shadow: 0 24px 80px rgba(0,0,0,.3); }
        .modal-hdr { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1.5px solid #F0ECE8; }
        .modal-hdr h2 { font-size: 18px; font-weight: 900; }
        .modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #7A6E68; width: 32px; height: 32px; }

        /* FORM */
        .form { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .form-row { display: flex; gap: 14px; flex-wrap: wrap; }
        .field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 130px; }
        label { font-size: 13px; font-weight: 700; color: #1A1A2E; }
        .req { color: #E8321A; }
        .hint { font-size: 11px; color: #E8321A; font-weight: 600; margin-top: 2px; }
        input[type=text], input[type=url], input[type=date], select, textarea {
          padding: 10px 12px; border: 2px solid #E8E0D8; border-radius: 10px;
          font-size: 13px; font-family: 'Heebo', sans-serif; outline: none;
          transition: border-color .18s; background: #fff; width: 100%;
        }
        input:focus, select:focus, textarea:focus { border-color: #1A1A2E; }
        input:disabled { background: #F5F5F5; color: #9E9E9E; cursor: not-allowed; }
        textarea { resize: vertical; }

        /* IMAGE */
        .img-tabs { display: flex; gap: 6px; margin-bottom: 8px; }
        .img-tab { padding: 6px 14px; border: 2px solid #E8E0D8; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; background: #fff; font-family: 'Heebo', sans-serif; transition: all .18s; }
        .img-tab.active { background: #1A1A2E; color: #fff; border-color: #1A1A2E; }
        .upload-box { border: 2px dashed #E8E0D8; border-radius: 10px; padding: 20px; text-align: center; }
        .upload-label { display: block; cursor: pointer; font-size: 13px; color: #7A6E68; }
        .progress-bar { height: 4px; background: #F0ECE8; border-radius: 4px; margin-top: 8px; overflow: hidden; }
        .progress-bar div { height: 100%; background: #E8321A; border-radius: 4px; transition: width .3s; }
        .img-preview { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
        .img-preview img { width: 80px; height: 80px; object-fit: cover; border-radius: 10px; border: 1.5px solid #E8E0D8; }
        .img-remove { background: #FFEBEE; color: #C62828; border: none; border-radius: 8px; padding: 5px 10px; font-size: 12px; font-weight: 700; cursor: pointer; }

        /* INLINE CHECKBOX */
        .field-inline label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; }
        .field-inline input[type=checkbox] { width: 18px; height: 18px; accent-color: #E8321A; cursor: pointer; }

        /* FORM FOOTER */
        .form-footer { display: flex; gap: 10px; justify-content: flex-end; padding-top: 8px; border-top: 1.5px solid #F0ECE8; }
        .btn-cancel { padding: 11px 22px; background: #F5F0EC; color: #1A1A2E; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Heebo', sans-serif; }
        .btn-save { padding: 11px 28px; background: #E8321A; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Heebo', sans-serif; }
        .btn-save:disabled { opacity: .6; cursor: not-allowed; }

        /* TOAST */
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1A1A2E; color: #fff; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; z-index: 300; box-shadow: 0 8px 24px rgba(0,0,0,.3); }

        /* TABS */
        .tabs { display:flex; gap:6px; margin-bottom:20px; border-bottom:2px solid #E8E0D8; padding-bottom:0; }
        .tab { padding:10px 20px; background:none; border:none; border-bottom:3px solid transparent; font-size:14px; font-weight:700; color:#7A6E68; cursor:pointer; font-family:'Heebo',sans-serif; margin-bottom:-2px; transition:all .18s; }
        .tab.active { color:#1A1A2E; border-bottom-color:#E8321A; }
        .tab:hover:not(.active) { color:#1A1A2E; }

        /* SLIDES */
        .slides-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; }
        .slide-card { background:#fff; border-radius:16px; border:1.5px solid #E8E0D8; overflow:hidden; }
        .slide-card.inactive { opacity:.55; }
        .slide-preview { height:100px; background-size:cover; background-position:center; position:relative; display:flex; align-items:flex-end; padding:10px 14px; }
        .slide-discount { font-family:'Rubik',sans-serif; font-size:28px; font-weight:900; color:#fff; text-shadow:0 2px 8px rgba(0,0,0,.5); }
        .slide-tag { position:absolute; top:8px; right:10px; background:rgba(232,50,26,.9); color:#fff; font-size:10px; font-weight:800; padding:2px 10px; border-radius:20px; }
        .slide-info { padding:12px 14px; }
        .slide-title { font-size:14px; font-weight:800; color:#1A1A2E; margin-bottom:3px; }
        .slide-sub { font-size:12px; color:#7A6E68; margin-bottom:6px; }
        .slide-meta { display:flex; gap:6px; flex-wrap:wrap; }
        .slide-badge { background:#F0ECE8; color:#7A6E68; font-size:11px; font-weight:600; padding:2px 8px; border-radius:20px; }
        .slide-actions { display:flex; gap:6px; padding:10px 14px; border-top:1px solid #F0ECE8; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .toolbar { flex-direction: column; }
          .form-row { flex-direction: column; }
          .slides-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { verifyToken } = await import('../../lib/auth');
  const { createAdminClient } = await import('../../lib/supabase');

  const token = req.cookies?.admin_auth;
  if (!verifyToken(token)) {
    return { redirect: { destination: '/admin', permanent: false } };
  }

  const sb = createAdminClient();
  const [{ data: coupons }, { data: slides }, { data: announcements }] = await Promise.all([
    sb.from('coupons').select('*').order('created_at', { ascending: false }),
    sb.from('slides').select('*').order('sort_order'),
    sb.from('announcements').select('*').order('sort_order'),
  ]);

  return { props: { initialCoupons: coupons || [], initialSlides: slides || [], initialAnnouncements: announcements || [] } };
}
