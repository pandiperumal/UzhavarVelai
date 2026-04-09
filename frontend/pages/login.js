import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Login() {
  const [lang, setLang] = useState('ta');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({ phone: '', password: '' });

  useEffect(() => {
    const saved = localStorage.getItem('uzhavar_lang');
    if (saved) setLang(saved);
    setMounted(true);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'ta' ? 'en' : 'ta';
    setLang(newLang);
    localStorage.setItem('uzhavar_lang', newLang);
  };

  const t = {
    ta: { title: 'உழவர் வேலை', login: 'உள்நுழைய', subtitle: 'உங்கள் கணக்கை அணுகவும்', phone: 'தொலைபேசி எண்', password: 'கடவுச்சொல்', noAccount: 'கணக்கு இல்லையா?', register: 'பதிவு செய்க', logging: 'உள்நுழையும்...', failed: 'உள்நுழைவு தோல்வி', error: 'தொடர்பு பிழை. மீண்டும் முயற்சிக்கவும்.', success: 'உள்நுழைவு வெற்றி!', adminLogin: 'நிர்வாகி உள்நுழைய' },
    en: { title: 'UzhavarVelai', login: 'Login', subtitle: 'Access your account', phone: 'Phone Number', password: 'Password', noAccount: "Don't have an account?", register: 'Register', logging: 'Logging in...', failed: 'Login failed', error: 'Connection error. Try again.', success: 'Login successful!', adminLogin: 'Admin Login' }
  };

  const txt = t[lang];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userPhone', formData.phone);
        window.location.href = '/dashboard';
      } else {
        setMessage({ type: 'error', text: data.message || txt.failed });
      }
    } catch (err) {
      setMessage({ type: 'error', text: txt.error });
    }
    setLoading(false);
  };

  if (!mounted) return null;

  return (
    <div>
      <nav style={{ background: '#2e7d32', padding: '15px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🌾 {txt.title}</Link>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/register" style={{ color: 'white', textDecoration: 'none' }}>{txt.register}</Link>
            <button onClick={toggleLang} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
              {lang === 'ta' ? 'EN' : 'தமிழ்'}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f5f5f5' }}>
        <div style={{ background: 'white', padding: '50px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
          <h2 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '10px', fontSize: '1.8rem' }}>{txt.login}</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>{txt.subtitle}</p>

          {message.text && (
            <div style={{ padding: '12px', borderRadius: '6px', marginBottom: '20px', background: message.type === 'error' ? '#ffebee' : '#e8f5e9', color: message.type === 'error' ? '#f44336' : '#4caf50', textAlign: 'center' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>{txt.phone}</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>{txt.password}</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: '500' }}>
              {loading ? txt.logging : txt.login}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <p style={{ color: '#666' }}>{txt.noAccount} <Link href="/register" style={{ color: '#2e7d32', fontWeight: '500' }}>{txt.register}</Link></p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <Link href="/admin/login" style={{ color: '#8d6e63', fontSize: '0.9rem' }}>{txt.adminLogin}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
