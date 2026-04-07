import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



  

// L-Modoun
const moroccanCities = [
  "Agadir","Béni Mellal","Casablanca","El Jadida","Errachidia","Essaouira","Fès",
  "Guelmim","Ifrane","Kénitra","Khouribga","Laâyoune","Larache","Marrakech",
  "Meknès","Mohammedia","Nador","Ouarzazate","Oujda","Rabat","Safi","Salé",
  "Settat","Tanger","Taroudant","Taza","Témara","Tétouan","Tiznit","Zagora"
];

// Les Tags
const tags = [
  { id: 'Calme',       label: 'Calme' },
  { id: 'Studieux',    label: 'Studieux' },
  { id: 'Tolérant',    label: 'Tolérant' },
  { id: 'Sportif',     label: 'Sportif' },
  { id: 'Fêtard',      label: 'Fêtard' },
  { id: 'Maniaque',    label: 'Maniaque' },
  { id: 'Lève-tôt',    label: 'Lève-tôt' },
  { id: 'Couche-tard', label: 'Couche-tard' },
  { id: 'Gourmand',    label: 'Gourmand' },
  { id: 'Gamer',       label: 'Gamer' },
];
// L-Icône dyal l-Kamera (ICamera)
const ICamera = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);
const IUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const ICal = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const ISchool = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
);
const IPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const IZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);
const ISparkles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
);

const ICheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IEdit = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

// 2. L-COMPOSANT DYALK KAY-BDA HNA 👇
export default function Profil() {
  const navigate = useNavigate();
  
  // Les variables dyalk (States)
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [ecole, setEcole] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [selTags, setSelTags] = useState([]);
  
  const [cityQ, setCityQ] = useState(''); // Li zedna 9bila
  const [img, setImg] = useState(null);   // ✅ ZID HADI HNA L-TSWIRA
  const [budget, setBudget] = useState(''); 
  const [focused, setFocused] = useState(null);
  const [saving, setSaving] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [gen, setGen] = useState(false);
  const fileRef = useRef(null);
   
  const generateBio = async () => {
    if (!name || selTags.length === 0) {
      alert("⚠️ Kteb s-smiya w khtar les tags!");
      return;
    }

    const token = localStorage.getItem('sc_token');
    if (!token) {
      alert("Session salat. 3awed login.");
      return;
    }

    setGen(true);
    
    try {
      const traitsLabels = selTags.map(id => tags.find(t => t.id === id)?.label || id);
      const res = await fetch('/api/ai/bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          name,
          age: age ? Number(age) : undefined,
          gender,
          ecole,
          traits: traitsLabels,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json().catch(() => ({}))
        : {};

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Generation bio impossible.');
      }

      setBio((data.bio || '').trim());

    } catch (err) {
      console.error('AI error:', err);
      alert("W9e3 mochkil: " + err.message);
    } finally {
      setGen(false);
    }
  };

   const toggleTag = (id) => {
     setSelTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : prev.length < 4 ? [...prev, id] : prev);
   };

   const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  

  // ------------------------------------------------------------------
  // (L-koud dyalk kay-kemmel mn hna b handleSave w l-HTML dyalk li l-ta7t)

  const handleSave = async () => {
    if (!name || !age || +age < 18) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('sc_token');

      // 1. Upload photo
      if (img && img.startsWith('data:')) {
        const formData = new FormData();
        const blob = await fetch(img).then(r => r.blob());
        formData.append('photo', blob, 'profile.jpg');
        await fetch('/api/upload/profile', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token },
          body: formData,
        });
      }

      // 2. Sauvegarde le profil complet
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          name, age: +age, ecole, gender, city, budget: +budget, bio, phone: '', traits: selTags,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // ✅ Ila koulchi daze mzyan f l-Backend:
      const stored = JSON.parse(localStorage.getItem('sc_user') || '{}');
      localStorage.setItem('sc_user', JSON.stringify({...stored, profileComplete: true}));

      navigate('/feed');
    } catch (err) {
      console.error('Save profile error:', err.message);
      // ❌ Hiyedna dik l-navigate l-bzzez! Daba ghadi i-goul lik chnou l-error l-7a9i9i
      alert("Mochkil f s-serveur (Backend)! T2eked bli les Routes dyal l-profile m-9addin f Node.js. \nErreur: " + err.message);
    } finally {
      setSaving(false);
    }
  };
  // L-7esba dyal l-Barre de progression (Percentage)
  // L-7esba li zedna 9bila
  let filledFields = 0;
  if (name) filledFields++;
  if (age) filledFields++;
  if (gender) filledFields++;
  if (ecole) filledFields++;
  if (budget) filledFields++;
  if (city) filledFields++;
  if (bio) filledFields++;
  if (selTags.length > 0) filledFields++;
  
  const pct = Math.round((filledFields / 7) * 100); 
  
  // 👇 ZID HAD S-STER HNA NICHAN 👇
  const pctColor = pct > 75 ? '#22c55e' : pct > 40 ? '#f97316' : '#ef4444';
  
  // return ( ...0%)

  const filteredCities = moroccanCities.filter(c => c.toLowerCase().includes(cityQ.toLowerCase()));

  const inp = (f) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '13px 14px 13px 42px', borderRadius: '12px',
    background: focused === f ? '#fff' : '#f8fafc',
    border: `1.5px solid ${focused === f ? '#ea580c' : '#e2e8f0'}`,
    boxShadow: focused === f ? '0 0 0 3px rgba(234,88,12,0.1)' : 'none',
    color: '#0f172a', fontSize: '0.9rem', fontWeight: '500', outline: 'none',
    fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s',
  });
  

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f8fafc 0%,#eef2f7 100%)', fontFamily:"'DM Sans','Segoe UI',sans-serif", display:'flex', flexDirection:'column', alignItems:'center', padding:'36px 20px 60px' }}>
      <style>{`
        *{box-sizing:border-box}
        body,html{margin:0!important;padding:0!important}
        #root{max-width:100%!important;width:100%!important;margin:0!important;padding:0!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .pr-inp::placeholder{color:#94a3b8}
        .pr-tag{transition:all 0.2s cubic-bezier(0.16,1,0.3,1);cursor:pointer;user-select:none}
        .pr-tag:hover:not(.on){transform:translateY(-2px);box-shadow:0 4px 12px rgba(234,88,12,0.15)!important;border-color:#ea580c!important;color:#ea580c!important}
        .pr-city:hover{background:#fef7f4;color:#ea580c;padding-left:20px}
        .pr-submit:hover:not(:disabled){transform:translateY(-2px)!important;box-shadow:0 14px 32px rgba(234,88,12,0.45)!important}
        .pr-submit:active:not(:disabled){transform:scale(0.98)!important}
        .pr-photo:hover .pr-photo-overlay{opacity:1!important}
        .pr-photo:hover img{filter:brightness(0.6)!important}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:99px}
        input[type=range]{-webkit-appearance:none;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#ea580c;border:3px solid white;box-shadow:0 2px 8px rgba(234,88,12,0.4);cursor:pointer;transition:transform 0.15s}
        input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2)}
        input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#ea580c;border:3px solid white;cursor:pointer}
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ width:'100%', maxWidth:'840px', marginBottom:'28px', animation:'fadeUp 0.4s ease' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'40px', height:'40px', background:'linear-gradient(135deg,#ea580c,#f97316)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(234,88,12,0.35)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.15rem', fontWeight:'900', color:'#0f172a', letterSpacing:'-0.3px' }}>Sakan<span style={{ color:'#ea580c' }}>Campus</span></span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'0.8rem', color:'#64748b', fontWeight:'600' }}>Complétion</span>
            <div style={{ width:'100px', height:'7px', background:'#e2e8f0', borderRadius:'99px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${pctColor},${pctColor}bb)`, borderRadius:'99px', transition:'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
            </div>
            <span style={{ fontSize:'0.8rem', fontWeight:'800', color:pctColor }}>{pct}%</span>
          </div>
        </div>

        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'2.4rem', fontWeight:'800', color:'#0f172a', margin:'20px 0 6px', letterSpacing:'-0.8px', lineHeight:1.15 }}>
          Créez votre{' '}
          <span style={{ backgroundImage:'linear-gradient(90deg,#ea580c,#f97316)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'shimmer 3s linear infinite' }}>profil</span>
        </h1>
        <p style={{ color:'#64748b', fontSize:'0.95rem', margin:0 }}>Aidez l'IA à vous trouver le colocataire parfait.</p>
      </div>

      {/* ── MAIN CARD ── */}
      <div style={{ width:'100%', maxWidth:'840px', background:'white', borderRadius:'28px', border:'1px solid #e8edf3', boxShadow:'0 16px 50px rgba(15,23,42,0.08)', overflow:'hidden', display:'grid', gridTemplateColumns:'280px 1fr', animation:'fadeUp 0.5s 0.1s ease both' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ background:'linear-gradient(160deg,#0f172a 0%,#1e2944 100%)', padding:'36px 28px', display:'flex', flexDirection:'column', gap:'22px', minHeight:'600px' }}>

          {/* PHOTO */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' }}>
            <div className="pr-photo" style={{ position:'relative', cursor:'pointer', width:'100px', height:'100px' }} onClick={()=>fileRef.current.click()}>
              <div style={{ width:'100%', height:'100%', borderRadius:'50%', border: img ? '3px solid #ea580c' : '2.5px dashed rgba(255,255,255,0.2)', overflow:'hidden', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: img ? '0 8px 28px rgba(234,88,12,0.45)' : 'none', transition:'all 0.3s' }}>
                {img ? <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'filter 0.25s' }} /> : <span style={{ color:'rgba(255,255,255,0.3)' }}><ICamera /></span>}
              </div>
              <div className="pr-photo-overlay" style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,0.45)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.25s', gap:'4px' }}>
                <span style={{ color:'white' }}><ICamera /></span>
                <span style={{ color:'white', fontSize:'0.58rem', fontWeight:'800', letterSpacing:'0.5px' }}>CHANGER</span>
              </div>
              <div style={{ position:'absolute', bottom:'3px', right:'3px', width:'26px', height:'26px', background:'#ea580c', borderRadius:'50%', border:'2.5px solid #0f172a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImg} />
            </div>
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', fontWeight:'600' }}>Clique pour ajouter</span>
          </div>

          {/* PREVIEW */}
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'18px' }}>
            <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.65rem', fontWeight:'800', letterSpacing:'1.2px', marginBottom:'14px', textTransform:'uppercase' }}>Aperçu du profil</div>
            {[
              [<IUser/>, name || '—'],
              [<ISchool/>, ecole || '—'],
              [<IPin/>, city || '—'],
              [<IZap/>, budget ? `${budget} DH/mois` : '—'],
            ].map(([icon, val], i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'10px' }}>
                <span style={{ color:'#ea580c', display:'flex', flexShrink:0 }}>{icon}</span>
                <span style={{ color: val==='—' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)', fontSize:'0.82rem', fontWeight:'600', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{val}</span>
              </div>
            ))}
            {selTags.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginTop:'4px' }}>
                {selTags.map(id=>(
                  <span key={id} style={{ background:'rgba(234,88,12,0.18)', border:'1px solid rgba(234,88,12,0.3)', color:'#fb923c', fontSize:'0.67rem', fontWeight:'700', padding:'3px 8px', borderRadius:'20px' }}>
                    {tags.find(t=>t.id===id).label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CHECKLIST */}
          <div>
            <div style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.64rem', fontWeight:'800', letterSpacing:'1.1px', marginBottom:'12px', textTransform:'uppercase' }}>Checklist</div>
            {[
              ['Prénom & âge', !!name && !!age && +age >= 18],
              ['École', !!ecole],
              ['Ville & genre', !!city && !!gender],
              ['Traits', selTags.length > 0],
              ['Bio', bio.length > 20],
              ['Photo', !!img],
            ].map(([label, done])=>(
              <div key={label} style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'8px' }}>
                <div style={{ width:'17px', height:'17px', borderRadius:'50%', background: done ? '#22c55e' : 'rgba(255,255,255,0.07)', border: done ? 'none' : '1.5px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s' }}>
                  {done && <ICheck />}
                </div>
                <span style={{ fontSize:'0.78rem', fontWeight:'600', color: done ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)', textDecoration: done ? 'line-through' : 'none', transition:'all 0.3s' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div style={{ padding:'36px 32px', overflowY:'auto', maxHeight:'90vh' }}>

          {/* NOM + AGE */}
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'14px', marginBottom:'18px' }}>
            <div>
              <label style={{ fontSize:'0.74rem', fontWeight:'800', color:'#475569', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                <span style={{ color:'#ea580c' }}><IUser /></span> Prénom *
              </label>
              <div style={{ position:'relative' }}>
                <input className="pr-inp" type="text" placeholder="Ex: Youssef" value={name} onChange={e=>setName(e.target.value)}
                  onFocus={()=>setFocused('name')} onBlur={()=>setFocused(null)} style={inp('name')} />
                <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color: focused==='name'?'#ea580c':'#cbd5e1', transition:'color 0.2s', display:'flex' }}><IUser /></span>
              </div>
            </div>
            <div>
              <label style={{ fontSize:'0.74rem', fontWeight:'800', color:'#475569', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                <span style={{ color:'#ea580c' }}><ICal /></span> Âge
              </label>
              <div style={{ position:'relative' }}>
                <input className="pr-inp" type="number" min="18" placeholder="21" value={age} onChange={e=>setAge(e.target.value)}
                  onFocus={()=>setFocused('age')} onBlur={()=>setFocused(null)} style={inp('age')} />
                <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color: focused==='age'?'#ea580c':'#cbd5e1', transition:'color 0.2s', display:'flex' }}><ICal /></span>
              </div>
            </div>
          </div>

          {/* ECOLE */}
          <div style={{ marginBottom:'18px' }}>
            <label style={{ fontSize:'0.74rem', fontWeight:'800', color:'#475569', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
              <span style={{ color:'#ea580c' }}><ISchool /></span> École / Université
            </label>
            <div style={{ position:'relative' }}>
              <input className="pr-inp" type="text" placeholder="Ex: ENCG Settat, FST Casa..." value={ecole} onChange={e=>setEcole(e.target.value)}
                onFocus={()=>setFocused('ecole')} onBlur={()=>setFocused(null)} style={inp('ecole')} />
              <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color: focused==='ecole'?'#ea580c':'#cbd5e1', transition:'color 0.2s', display:'flex' }}><ISchool /></span>
            </div>
          </div>

          {/* GENDER + VILLE */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'18px' }}>
            <div>
              <label style={{ fontSize:'0.74rem', fontWeight:'800', color:'#475569', marginBottom:'8px', display:'block', textTransform:'uppercase', letterSpacing:'0.5px' }}>Je suis</label>
              <div style={{ display:'flex', gap:'8px' }}>
                {[['Homme','#3b82f6','#eff6ff','#1e40af'],['Femme','#ec4899','#fdf2f8','#be185d']].map(([l,ac,bg,tc])=>(
                  <button key={l} onClick={()=>setGender(l)} style={{ flex:1, padding:'12px 8px', borderRadius:'12px', border:`1.5px solid ${gender===l?ac:'#e2e8f0'}`, background: gender===l?bg:'white', color: gender===l?tc:'#64748b', fontWeight:'700', fontSize:'0.85rem', cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ position:'relative' }}>
              <label style={{ fontSize:'0.74rem', fontWeight:'800', color:'#475569', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                <span style={{ color:'#ea580c' }}><IPin /></span> Ville cible
              </label>
              <div style={{ position:'relative' }}>
                <input className="pr-inp" type="text" placeholder="Rechercher..." value={city || cityQ}
                  onFocus={()=>{ setCityOpen(true); setFocused('city'); }}
                  onBlur={()=>{ setTimeout(()=>setCityOpen(false),150); setFocused(null); }}
                  onChange={e=>{ setCityQ(e.target.value); setCity(''); setCityOpen(true); }}
                  style={inp('city')} />
                <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color: focused==='city'?'#ea580c':'#cbd5e1', transition:'color 0.2s', display:'flex' }}><IPin /></span>
              </div>
              {cityOpen && filteredCities.length > 0 && (
                <div style={{ position:'absolute', top:'100%', left:0, right:0, zIndex:50, background:'white', border:'1.5px solid #e2e8f0', borderRadius:'14px', boxShadow:'0 16px 40px rgba(0,0,0,0.12)', marginTop:'5px', maxHeight:'180px', overflowY:'auto', animation:'scaleIn 0.15s ease' }}>
                  {filteredCities.slice(0,7).map(c=>(
                    <div key={c} className="pr-city" style={{ padding:'10px 16px', cursor:'pointer', color:'#334155', fontSize:'0.86rem', fontWeight:'500', transition:'all 0.15s', display:'flex', alignItems:'center', gap:'8px' }}
                      onClick={()=>{ setCity(c); setCityQ(c); setCityOpen(false); }}>
                      <span style={{ color:'#ea580c', display:'flex' }}><IPin /></span>{c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BUDGET */}
          <div style={{ marginBottom:'18px', background:'#f8fafc', borderRadius:'16px', padding:'18px 20px', border:'1px solid #e8edf3' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <label style={{ fontSize:'0.74rem', fontWeight:'800', color:'#475569', textTransform:'uppercase', letterSpacing:'0.5px', display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ color:'#ea580c' }}><IZap /></span> Budget max
              </label>
              <div>
                <span style={{ fontWeight:'900', color:'#ea580c', fontSize:'1.25rem' }}>{budget.toLocaleString()}</span>
                <span style={{ color:'#94a3b8', fontSize:'0.78rem', fontWeight:'600' }}> DH/mois</span>
              </div>
            </div>
            <input type="range" min="500" max="5000" step="100" value={budget} onChange={e=>setBudget(+e.target.value)}
              style={{ width:'100%', height:'6px', borderRadius:'10px', background:`linear-gradient(to right,#ea580c ${((budget-500)/4500)*100}%,#e2e8f0 ${((budget-500)/4500)*100}%)`, margin:'0 0 8px' }} />
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.72rem', color:'#94a3b8', fontWeight:'600' }}>500 DH</span>
              <span style={{ fontSize:'0.72rem', color:'#94a3b8', fontWeight:'600' }}>5 000 DH</span>
            </div>
          </div>

          {/* TAGS */}
          <div style={{ marginBottom:'18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
              <label style={{ fontSize:'0.74rem', fontWeight:'800', color:'#475569', textTransform:'uppercase', letterSpacing:'0.5px', display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ color:'#ea580c' }}><IStar /></span> Mes traits
              </label>
              <span style={{ fontSize:'0.72rem', fontWeight:'800', color: selTags.length >= 4 ? '#ea580c' : '#94a3b8', background:'#f1f5f9', padding:'2px 8px', borderRadius:'20px' }}>{selTags.length}/4</span>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {tags.map(t=>{
                const on = selTags.includes(t.id);
                return (
                  <span key={t.id} className={`pr-tag ${on?'on':''}`} onClick={()=>toggleTag(t.id)}
                    style={{ padding:'8px 14px', borderRadius:'20px', background: on ? '#ea580c' : 'white', color: on ? 'white' : '#475569', border:`1.5px solid ${on?'#ea580c':'#e2e8f0'}`, fontWeight:'700', fontSize:'0.8rem', boxShadow: on ? '0 4px 12px rgba(234,88,12,0.3)' : 'none', transform: on ? 'scale(1.04)' : 'scale(1)' }}>
                    {t.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* BIO */}
          <div style={{ marginBottom:'26px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
              <label style={{ fontSize:'0.74rem', fontWeight:'800', color:'#475569', textTransform:'uppercase', letterSpacing:'0.5px', display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ color:'#ea580c' }}><IEdit /></span> Bio
              </label>
              {/* BOUTONA DYAL IA (GEMINI) */}
<button 
  type="button" 
  onClick={generateBio} 
  disabled={gen} 
  style={{ 
    marginTop: '10px',
    padding: '10px 15px', 
    borderRadius: '10px', 
    background: gen ? '#cbd5e1' : 'linear-gradient(135deg, #8b5cf6, #d946ef)', 
    color: 'white', 
    fontWeight: '700', 
    fontSize: '0.85rem', 
    border: 'none', 
    cursor: gen ? 'default' : 'pointer', 
    fontFamily: 'inherit', 
    boxShadow: gen ? 'none' : '0 4px 15px rgba(139,92,246,0.3)', 
    transition: 'all 0.3s', 
    display: 'inline-flex', 
    alignItems: 'center', 
    gap: '8px' 
  }}
>
  {gen ? (
    <>
      <span style={{ width:'12px', height:'12px', border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }}></span>
      Génération en cours...
    </>
  ) : (
    <>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z"/>
      </svg>
      Générer par IA
    </>
  )}
</button>
            </div>
            <textarea className="pr-inp" value={bio} onChange={e=>setBio(e.target.value)}
              onFocus={()=>setFocused('bio')} onBlur={()=>setFocused(null)}
              placeholder="Décrivez-vous, vos habitudes, ce que vous cherchez..." rows="4"
              style={{ ...inp('bio'), padding:'13px 14px', resize:'none', minHeight:'95px', display:'block', letterSpacing:'normal' }} />
            <div style={{ textAlign:'right', fontSize:'0.71rem', color: bio.length >= 280 ? '#ef4444' : '#94a3b8', marginTop:'4px', fontWeight:'600' }}>{bio.length}/300</div>
          </div>

          {/* SAVE */}
          <button className="pr-submit" onClick={handleSave} disabled={saving || !name || !age || +age < 18}
            style={{ width:'100%', padding:'16px', borderRadius:'15px', background: saving ? '#fed7aa' : 'linear-gradient(135deg,#ea580c,#f97316)', color:'white', fontWeight:'800', fontSize:'0.96rem', border:'none', cursor: saving||!name?'default':'pointer', fontFamily:'inherit', boxShadow:'0 8px 24px rgba(234,88,12,0.38)', transition:'all 0.3s', letterSpacing:'0.2px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
            {saving
              ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Enregistrement...</>
              : <>Enregistrer et continuer <IArrow /></>
            }
          </button>
        </div>
      </div>
    </div>
  );
}