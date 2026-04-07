import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const backPath = localStorage.getItem('sc_token') ? '/feed' : '/login';

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      form.email.trim().length >= 5 &&
      form.subject.trim().length >= 3 &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const data = await api('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      setFeedback({
        type: 'success',
        message: data.message || 'Message envoye avec succes.',
      });
      setForm(initialForm);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Impossible d\'envoyer le message.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 20% 20%, #fff1e8 0%, #fff 42%), linear-gradient(145deg, #fff 0%, #f8fafc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .contact-card {
          animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-input:focus {
          border-color: #ea580c !important;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.14);
          background: #fff;
        }
        .contact-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(234, 88, 12, 0.28);
        }
        @media (max-width: 800px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-side {
            order: 2;
          }
        }
      `}</style>

      <div className="contact-card contact-grid" style={{
        width: '100%',
        maxWidth: '980px',
        display: 'grid',
        gridTemplateColumns: '0.95fr 1.05fr',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
      }}>
        <aside className="contact-side" style={{
          background: 'linear-gradient(165deg, #0f172a 0%, #1e293b 60%, #7c2d12 100%)',
          color: '#fff',
          padding: '36px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 12px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.12)',
              fontSize: '0.78rem',
              fontWeight: '700',
              letterSpacing: '0.2px',
            }}>
              SakanCampus Support
            </div>

            <h1 style={{
              margin: '14px 0 10px',
              fontSize: '2.05rem',
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              fontWeight: '900',
            }}>
              Contact Us
            </h1>

            <p style={{ margin: 0, color: 'rgba(226, 232, 240, 0.9)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              Utilise ce formulaire pour nous signaler un bug, poser une question ou envoyer un feedback.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.88rem',
            }}>
              Reponse typique: moins de 24h.
            </div>
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.88rem',
            }}>
              Si c'est un bug, ajoute des details clairs (et une capture si possible).
            </div>
          </div>

          <Link
            to={backPath}
            style={{
              color: '#fdba74',
              fontWeight: '700',
              fontSize: '0.88rem',
              textDecoration: 'none',
              width: 'fit-content',
            }}
          >
            {backPath === '/feed' ? '← Retour au feed' : '← Retour a la connexion'}
          </Link>
        </aside>

        <section style={{ padding: '34px 30px', background: '#fff' }}>
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '700' }}>Nom</label>
              <input
                className="contact-input"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ex: Ahmed El Idrissi"
                style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px', outline: 'none', transition: 'all 0.2s', fontSize: '0.92rem', background: '#f8fafc' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '700' }}>Email</label>
              <input
                className="contact-input"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Ex: ahmed@gmail.com"
                style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px', outline: 'none', transition: 'all 0.2s', fontSize: '0.92rem', background: '#f8fafc' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '700' }}>Sujet</label>
              <input
                className="contact-input"
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value.slice(0, 140))}
                placeholder="Ex: Probleme de connexion"
                style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px', outline: 'none', transition: 'all 0.2s', fontSize: '0.92rem', background: '#f8fafc' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '700' }}>Message</label>
              <textarea
                className="contact-input"
                value={form.message}
                onChange={(e) => updateField('message', e.target.value.slice(0, 5000))}
                rows={6}
                placeholder="Decris ton besoin en details..."
                style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px', outline: 'none', transition: 'all 0.2s', fontSize: '0.92rem', background: '#f8fafc', resize: 'vertical', minHeight: '135px' }}
                required
              />
              <div style={{ textAlign: 'right', fontSize: '0.74rem', color: '#94a3b8', fontWeight: '700' }}>
                {form.message.length}/5000
              </div>
            </div>

            {feedback.message && (
              <div style={{
                borderRadius: '12px',
                padding: '10px 12px',
                fontSize: '0.86rem',
                fontWeight: '700',
                border: feedback.type === 'success' ? '1px solid #86efac' : '1px solid #fecaca',
                color: feedback.type === 'success' ? '#166534' : '#b91c1c',
                background: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
              }}>
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="contact-btn"
              style={{
                marginTop: '2px',
                border: 'none',
                borderRadius: '12px',
                padding: '13px 16px',
                color: '#fff',
                background: loading ? '#f97316aa' : 'linear-gradient(135deg, #ea580c, #fb923c)',
                fontWeight: '800',
                fontSize: '0.9rem',
                cursor: !canSubmit || loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 8px 20px rgba(234, 88, 12, 0.22)',
              }}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
