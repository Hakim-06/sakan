import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('email') || '').trim().toLowerCase();
  }, [location.search]);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const verifyCode = async () => {
    setError('');
    setInfo('');

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) throw new Error('Saisis ton email.');
      if (code.trim().length !== 6) throw new Error('Entre un code à 6 chiffres.');

      setLoading(true);
      const res = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code: code.trim() }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json().catch(() => ({}))
        : {};

      if (!res.ok) throw new Error(data.message || 'Vérification impossible.');

      if (data?.token && data?.user) {
        localStorage.setItem('sc_token', data.token);
        localStorage.setItem('sc_user', JSON.stringify(data.user));
        setInfo(data.message || 'Email vérifié. Redirection...');
        setCode('');
        setTimeout(() => {
          navigate('/profil', { replace: true });
        }, 500);
        return;
      }

      setInfo(data.message || 'Email vérifié avec succès.');
      setCode('');
      setTimeout(() => {
        navigate(`/login?verifiedEmail=${encodeURIComponent(normalizedEmail)}`, { replace: true });
      }, 900);
    } catch (err) {
      setError(err.message || 'Erreur de vérification.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setError('');
    setInfo('');

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) throw new Error('Saisis ton email.');

      setResending(true);
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json().catch(() => ({}))
        : {};

      if (!res.ok) throw new Error(data.message || 'Impossible de renvoyer le code.');

      setInfo(data.message || 'Nouveau code envoyé.');
      if (data.devVerificationCode) {
        setCode(String(data.devVerificationCode));
        setInfo(`Mode dev: code = ${data.devVerificationCode}`);
      }
      setCooldown(60);
    } catch (err) {
      setError(err.message || 'Erreur lors du renvoi du code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0b1120 0%, #0f172a 40%, #111827 100%)', display: 'grid', placeItems: 'center', padding: '18px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @media (max-width: 720px){
          .ve-card{padding:20px 14px !important;border-radius:16px !important}
        }
      `}</style>

      <div className="ve-card" style={{ width: '100%', maxWidth: '460px', background: 'white', borderRadius: '22px', border: '1px solid #e5e7eb', padding: '28px 24px', boxShadow: '0 30px 60px rgba(2,6,23,0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg,#ea580c,#f97316)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 900 }}>SC</div>
          <div>
            <div style={{ fontSize: '1.04rem', fontWeight: 900, color: '#0f172a' }}>Vérification Email</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>SakanCampus</div>
          </div>
        </div>

        <p style={{ margin: '0 0 14px', color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Après ton inscription, entre le code reçu par email pour activer ton compte.
        </p>

        <div style={{ display: 'grid', gap: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            style={{ width: '100%', padding: '12px 13px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }}
          />

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Code à 6 chiffres"
            style={{ width: '100%', padding: '12px 13px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', letterSpacing: '4px', textAlign: 'center', fontSize: '1rem', fontWeight: 900, outline: 'none' }}
          />
        </div>

        {error && (
          <div style={{ marginTop: '12px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', fontSize: '0.83rem', fontWeight: 700 }}>
            {error}
          </div>
        )}

        {info && (
          <div style={{ marginTop: '12px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '10px 12px', fontSize: '0.83rem', fontWeight: 700 }}>
            {info}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
          <button
            type="button"
            onClick={verifyCode}
            disabled={loading || code.length !== 6}
            style={{ border: 'none', borderRadius: '10px', padding: '11px', color: 'white', background: loading || code.length !== 6 ? '#94a3b8' : 'linear-gradient(135deg,#ea580c,#f97316)', cursor: loading || code.length !== 6 ? 'default' : 'pointer', fontWeight: 800 }}
          >
            {loading ? 'Vérification...' : 'Valider'}
          </button>
          <button
            type="button"
            onClick={resendCode}
            disabled={resending || cooldown > 0}
            style={{ borderRadius: '10px', padding: '11px', border: '1px solid #cbd5e1', color: '#1e293b', background: resending || cooldown > 0 ? '#f1f5f9' : 'white', cursor: resending || cooldown > 0 ? 'default' : 'pointer', fontWeight: 800 }}
          >
            {cooldown > 0 ? `Renvoyer (${cooldown}s)` : (resending ? 'Envoi...' : 'Renvoyer code')}
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{ width: '100%', marginTop: '10px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
        >
          Retour connexion
        </button>
      </div>
    </div>
  );
}
