import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode]       = useState('login');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (document.getElementById('sc-gf')) return;
    const l = document.createElement('link');
    l.id = 'sc-gf';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800;9..40,900&family=Playfair+Display:wght@700;800&display=swap';
    document.head.appendChild(l);
  }, []);
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      // credentialResponse.credential houwa dak s-sarout (token) li 3tatna Google!
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }) 
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('sc_token', data.token);
        localStorage.setItem('sc_user', JSON.stringify(data.user));
        
        if (data.user.profileComplete) {
          navigate('/feed');
        } else {
          navigate('/profil');
        }
      } else {
        setError(data.message || 'Mochkil f Google Login');
      }
    } catch (err) {
      console.error('Erreur Backend:', err);
      setError('Serveur tafi awla mochkil f l-connexion.');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const body     = mode === 'register'
        ? { name, email, password }
        : { email, password };

      const res  = await fetch('/api' + endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'Erreur');

      // Sauvegarde token + user
      localStorage.setItem('sc_token', data.token);
      localStorage.setItem('sc_user',  JSON.stringify(data.user));

      // Routing intelligent:
      // - Inscription     → toujours /profil (setup initial)
      // - Connexion       → /feed si profil complet, sinon /profil
      if (mode === 'register') {
        navigate('/profil');
      } else {
        // profileComplete vient de la DB via l'API
        navigate(data.user.profileComplete ? '/feed' : '/profil');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (f) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 16px',
    borderRadius: '11px',
    background: focused === f ? '#ffffff' : '#f8fafc',
    border: `1.5px solid ${focused === f ? '#ea580c' : '#e2e8f0'}`,
    boxShadow: focused === f ? '0 0 0 3px rgba(234,88,12,0.1)' : 'none',
    color: '#0f172a',
    fontSize: '0.92rem',
    fontWeight: '500',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
  });

  const EyeOpen = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeOff = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', position: 'relative' }}>
      <style>{`
        *{box-sizing:border-box}
        body,html{margin:0!important;padding:0!important;overflow:hidden;background:#0b1120}
        #root{max-width:100%!important;width:100%!important;margin:0!important;padding:0!important}
        @keyframes fadeLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}
        @keyframes floatC{0%,100%{transform:translateY(-6px)}50%{transform:translateY(8px)}}
        @keyframes orb{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.85;transform:scale(1.1)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes dot{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
        .sc-placeholder::placeholder{color:#94a3b8}
        .sc-tab{transition:all 0.25s cubic-bezier(0.16,1,0.3,1)}
        .sc-social:hover{background:#f1f5f9!important;border-color:#d1d5db!important;transform:translateY(-1px)!important}
        .sc-link:hover{opacity:0.7}
        .sc-btn:hover:not(:disabled){transform:scale(1.02)!important;box-shadow:0 10px 28px rgba(234,88,12,0.5)!important}
        .sc-btn:active:not(:disabled){transform:scale(0.98)!important}
        .sc-eye:hover{color:#ea580c!important}
      `}</style>

      {/* ══ LEFT PANEL ═══════════════════════════════════════════════════ */}
      <div style={{
        flex: '1.15',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(150deg, #0b1120 0%, #0f172a 45%, #180e2a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '52px 44px',
      }}>

        {/* Orbs */}
        <div style={{ position:'absolute', top:'12%', left:'18%', width:'340px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle,rgba(234,88,12,0.2) 0%,transparent 70%)', filter:'blur(70px)', animation:'orb 5s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'18%', right:'12%', width:'270px', height:'270px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 70%)', filter:'blur(55px)', animation:'orb 7s ease-in-out infinite reverse', pointerEvents:'none' }} />

        {/* Floating card 1 */}
        <div style={{ position:'absolute', top:'9%', right:'7%', animation:'floatA 6s ease-in-out infinite', opacity:0.8 }}>
          <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'18px', padding:'13px 17px', display:'flex', alignItems:'center', gap:'11px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:'linear-gradient(135deg,#22c55e,#15803d)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div>
              <div style={{ color:'white', fontWeight:'800', fontSize:'0.82rem' }}>95% Compatibilité</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.68rem', marginTop:'2px' }}>Score IA · Anas, Settat</div>
            </div>
          </div>
        </div>

        {/* Floating card 2 */}
        <div style={{ position:'absolute', bottom:'22%', left:'3%', animation:'floatB 8s ease-in-out infinite', opacity:0.7 }}>
          <div style={{ background:'rgba(255,255,255,0.05)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'18px', padding:'13px 17px', display:'flex', alignItems:'center', gap:'11px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:'linear-gradient(135deg,#ea580c,#f97316)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <div style={{ color:'white', fontWeight:'800', fontSize:'0.82rem' }}>1 200 DH/mois</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.68rem', marginTop:'2px' }}>Settat · Disponible</div>
            </div>
          </div>
        </div>

        {/* Floating card 3 */}
        <div style={{ position:'absolute', top:'46%', right:'2%', animation:'floatC 7s ease-in-out infinite', opacity:0.65 }}>
          <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'11px 15px', display:'flex', alignItems:'center', gap:'9px' }}>
            <div style={{ display:'flex' }}>
              {[
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40',
              ].map((src, i) => (
                <img key={i} src={src} style={{ width:'24px', height:'24px', borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,255,255,0.15)', marginLeft: i ? '-7px' : '0' }} alt="" />
              ))}
            </div>
            <span style={{ color:'rgba(255,255,255,0.8)', fontWeight:'700', fontSize:'0.74rem' }}>+240 étudiants</span>
          </div>
        </div>

        {/* Hero content */}
        <div style={{ maxWidth:'460px', textAlign:'center', position:'relative', zIndex:1, animation:'fadeLeft 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', marginBottom:'40px' }}>
            <div style={{ width:'48px', height:'48px', background:'linear-gradient(135deg,#ea580c,#f97316)', borderRadius:'15px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(234,88,12,0.5)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span style={{ color:'white', fontSize:'1.5rem', fontWeight:'900', letterSpacing:'-0.5px' }}>
              Sakan<span style={{ color:'#f97316' }}>Campus</span>
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:'3.4rem', fontWeight:'800', margin:'0 0 18px', lineHeight:'1.1', letterSpacing:'-1.5px', color:'white' }}>
            Trouvez votre{' '}
            <span style={{ backgroundImage:'linear-gradient(90deg,#ea580c,#fb923c,#fbbf24)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'shimmer 3s linear infinite' }}>
              Colocataire
            </span>
            <br />Idéal.
          </h1>

          <p style={{ color:'rgba(148,163,184,0.85)', fontSize:'1rem', lineHeight:'1.8', marginBottom:'36px' }}>
            Propulsé par l'IA — nous analysons votre compatibilité pour vous trouver le profil parfait parmi les étudiants marocains.
          </p>

          <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
            {[['✦','Matching IA'],['✓','Étudiants vérifiés'],['⚡','Instantané']].map(([ic,lb]) => (
              <span key={lb} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', padding:'10px 18px', borderRadius:'30px', fontSize:'0.82rem', color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', gap:'7px', fontWeight:'500' }}>
                <span style={{ color:'#f97316' }}>{ic}</span>{lb}
              </span>
            ))}
          </div>
        </div>

        <div style={{ position:'absolute', bottom:'20px', color:'rgba(255,255,255,0.15)', fontSize:'0.7rem', letterSpacing:'0.8px' }}>
          © 2026 SakanCampus · Maroc
        </div>
      </div>

      {/* ══ RIGHT PANEL ══════════════════════════════════════════════════ */}
      <div style={{ flex:'1', minWidth:'0', background:'#f8fafc', display:'flex', justifyContent:'center', alignItems:'center', padding:'24px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:'420px', animation:'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1)' }}>

          {/* Tab switcher */}
          <div style={{ display:'flex', background:'#e9eef5', borderRadius:'14px', padding:'4px', marginBottom:'28px', gap:'4px' }}>
            {[['login','Se connecter'],['register',"S'inscrire"]].map(([m, label]) => (
              <button key={m} className="sc-tab" onClick={() => setMode(m)} style={{
                flex:1, padding:'11px', borderRadius:'11px', border:'none', cursor:'pointer',
                fontWeight:'700', fontSize:'0.87rem', fontFamily:'inherit',
                background: mode === m ? 'white' : 'transparent',
                color: mode === m ? '#0f172a' : '#94a3b8',
                boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                transform: mode === m ? 'scale(1)' : 'scale(0.97)',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Card */}
          <div style={{ background:'white', borderRadius:'24px', padding:'36px 32px', border:'1px solid #e8edf3', boxShadow:'0 4px 24px rgba(15,23,42,0.07)' }}>

            {/* Title */}
            <div style={{ marginBottom:'24px' }}>
              <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:'1.9rem', fontWeight:'800', color:'#0f172a', margin:'0 0 6px', letterSpacing:'-0.5px' }}>
                {mode === 'login' ? 'Bon retour 👋' : 'Créer un compte'}
              </h2>
              <p style={{ color:'#64748b', fontSize:'0.88rem', margin:0 }}>
                {mode === 'login' ? 'Connecte-toi à ton espace SakanCampus' : "Rejoins la communauté — c'est gratuit"}
              </p>
            </div>

            {/* Google */}
            {/* BOUTONA DYAL GOOGLE */}
<div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => {
      console.log('Login Failed');
      setError('Erreur d\'authentification Google.');
    }}
  />
</div>
            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
              <div style={{ flex:1, height:'1px', background:'#f1f5f9' }} />
              <span style={{ color:'#94a3b8', fontSize:'0.72rem', fontWeight:'700', letterSpacing:'1px', whiteSpace:'nowrap' }}>OU PAR EMAIL</span>
              <div style={{ flex:1, height:'1px', background:'#f1f5f9' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

              {mode === 'register' && (
                <input className="sc-placeholder" type="text" placeholder="Ton prénom" value={name} onChange={e => setName(e.target.value)}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} required style={inputStyle('name')} />
              )}

              <input className="sc-placeholder" type="email" placeholder="Adresse email" value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required style={inputStyle('email')} />

              <div style={{ position:'relative' }}>
                <input className="sc-placeholder" type={showPwd ? 'text' : 'password'} placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pwd')} onBlur={() => setFocused(null)} required
                  style={{ ...inputStyle('pwd'), paddingRight:'46px', letterSpacing: showPwd ? 'normal' : '2px' }} />
                <button type="button" className="sc-eye" onClick={() => setShowPwd(!showPwd)}
                  style={{ position:'absolute', right:'13px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center', padding:'2px', transition:'color 0.2s' }}>
                  {showPwd ? EyeOff : EyeOpen}
                </button>
              </div>

              {mode === 'login' && (
                <div style={{ textAlign:'right', marginTop:'-4px' }}>
                  <span style={{ fontSize:'0.82rem', color:'#ea580c', cursor:'pointer', fontWeight:'600' }}>Mot de passe oublié ?</span>
                </div>
              )}

              {error && (
                <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', padding:'10px 14px', fontSize:'0.84rem', color:'#dc2626', fontWeight:'600', display:'flex', alignItems:'center', gap:'8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button type="submit" className="sc-btn" disabled={loading} style={{
                width:'100%', padding:'15px', borderRadius:'13px',
                background: loading ? '#fed7aa' : 'linear-gradient(135deg,#ea580c 0%,#f97316 100%)',
                color:'white', fontWeight:'800', fontSize:'0.95rem', border:'none',
                cursor: loading ? 'default' : 'pointer',
                marginTop:'4px', fontFamily:'inherit',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(234,88,12,0.38)',
                transition:'all 0.25s', display:'flex', alignItems:'center', justifyContent:'center', gap:'9px', letterSpacing:'0.2px',
              }}>
                {loading ? (
                  <>
                    {[0,1,2].map(i => (
                      <span key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'white', animation:`dot 1.2s ease-in-out ${i*0.16}s infinite`, display:'inline-block' }} />
                    ))}
                    <span>Connexion...</span>
                  </>
                ) : (
                  mode === 'login' ? 'Se connecter →' : 'Créer mon compte →'
                )}
              </button>

            </form>
          </div>

          {/* Switch mode */}
          <p style={{ textAlign:'center', color:'#64748b', fontSize:'0.88rem', marginTop:'20px' }}>
            {mode === 'login' ? "Pas encore de compte ?" : "Déjà inscrit ?"}{' '}
            <span className="sc-link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={{ color:'#ea580c', fontWeight:'700', cursor:'pointer', transition:'opacity 0.15s' }}>
              {mode === 'login' ? "S'inscrire gratuitement" : "Se connecter"}
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}