import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLogin() {
  const [lang, setLang] = useState('ta');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    phone: 'admin',
    password: '1234'
  });

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
    ta: {
      title: '🌾 உழவர் வேலை நிர்வாகம்', subtitle: 'நிர்வாகி உள்நுழைய', username: 'பயனர் பெயர்', password: 'கடவுச்சொல்',
      login: 'உள்நுழைய', loggingIn: 'உள்நுழையுகிறது...', backHome: '← முகப்புக்குத் திரும்பு',
      loginFailed: 'உள்நுழைய தோல்வி', connectionError: 'இணைப்பு பிழை'
    },
    en: {
      title: '🌾 UzhavarVelai Admin', subtitle: 'Admin Login', username: 'Username', password: 'Password',
      login: 'Login', loggingIn: 'Logging in...', backHome: '← Back to Home',
      loginFailed: 'Login failed', connectionError: 'Connection error'
    }
  };

  const txt = t[lang];

  if (!mounted) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      console.log('API URL:', API_URL);
      
      const res = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      console.log('Response:', data);
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminId', data.admin.id);
        localStorage.setItem('adminName', data.admin.name);
        window.location.href = '/admin/dashboard';
      } else {
        setMessage({ type: 'error', text: data.message || txt.loginFailed });
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage({ type: 'error', text: txt.connectionError });
    }
    
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', margin: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '10px' }}>{txt.title}</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>{txt.subtitle}</p>

        {message.text && (
          <div style={{ padding: '10px', borderRadius: '5px', marginBottom: '20px', background: '#ffebee', color: '#f44336' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{txt.username}</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required 
              style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{txt.password}</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required 
              style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '5px', fontSize: '1rem' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer' }}>
            {loading ? txt.loggingIn : txt.login}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link href="/" style={{ color: '#2e7d32' }}>{txt.backHome}</Link>
          <button onClick={toggleLang} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid #2e7d32', color: '#2e7d32', borderRadius: '5px', cursor: 'pointer' }}>
            {lang === 'ta' ? 'EN' : 'தமிழ்'}
          </button>
        </div>
      </div>
    </div>
  );
}
