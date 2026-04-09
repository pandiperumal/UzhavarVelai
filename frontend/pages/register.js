import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Register() {
  const [lang, setLang] = useState('ta');
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
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
      title: 'பதிவு', subtitle1: 'உங்கள் கணக்கை உருவாக்குங்கள்', subtitle2: 'உங்கள் தொலைபேசி எண்ணை சரிபார்க்கவும்',
      phone: 'தொலைபேசி எண்', password: 'கடவுச்சொல்', confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
      otpText: 'உங்கள் தொலைபேசிக்கு அனுப்பப்பட்ட OTP ஐ உள்ளிடவும்', register: 'பதிவு செய்க',
      verifying: 'சரிபார்க்கிறது...', submit: 'சமர்ப்பிக்கவும்', already: 'ஏற்கனவே கணக்கு உள்ளதா?', login: 'உள்நுழைய',
      passwordsMismatch: 'கடவுச்சொல் பொருந்தவில்லை', passwordMin: 'கடவுச்சொல் குறைந்தது 4 எழுத்துக்களாக இருக்க வேண்டும்',
      otpSuccess: 'பதிவு வெற்றி! OTP:', invalidOtp: 'தவறான OTP', connectionError: 'இணைப்பு பிழை. மீண்டும் முயற்சிக்கவும்.'
    },
    en: {
      title: 'Register', subtitle1: 'Create your account', subtitle2: 'Verify your phone number',
      phone: 'Phone Number', password: 'Password', confirmPassword: 'Confirm Password',
      otpText: 'Enter the OTP sent to your phone', register: 'Register',
      verifying: 'Verifying...', submit: 'Submit', already: 'Already have an account?', login: 'Login',
      passwordsMismatch: 'Passwords do not match', passwordMin: 'Password must be at least 4 characters',
      otpSuccess: 'Registration successful! OTP:', invalidOtp: 'Invalid OTP', connectionError: 'Connection error. Please try again.'
    }
  };

  const txt = t[lang];

  if (!mounted) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      setMessage({ type: 'error', text: txt.passwordsMismatch });
      return;
    }
    
    if (formData.password.length < 4) {
      setLoading(false);
      setMessage({ type: 'error', text: txt.passwordMin });
      return;
    }
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, password: formData.password, role: 'farmer' })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        setMessage({ type: 'success', text: `${txt.otpSuccess} ${data.otp}` });
        setStep(2);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: txt.connectionError });
    }
    setLoading(false);
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: formData.otp })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userPhone', formData.phone);
        window.location.href = '/dashboard';
      } else {
        setMessage({ type: 'error', text: data.message || txt.invalidOtp });
      }
    } catch (err) {
      setMessage({ type: 'error', text: txt.connectionError });
    }
    setLoading(false);
  };

  return (
    <div>
      <nav style={{ background: '#2e7d32', padding: '15px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            🌾 UzhavarVelai
          </Link>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>{txt.login}</Link>
            <button onClick={toggleLang} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
              {lang === 'ta' ? 'EN' : 'தமிழ்'}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f5f5f5' }}>
        <div style={{ background: 'white', padding: '50px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
          <h2 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '10px', fontSize: '1.8rem' }}>{txt.title}</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            {step === 1 ? txt.subtitle1 : txt.subtitle2}
          </p>

          {message.text && (
            <div style={{ padding: '12px', borderRadius: '6px', marginBottom: '20px', background: message.type === 'error' ? '#ffebee' : '#e8f5e9', color: message.type === 'error' ? '#f44336' : '#4caf50', textAlign: 'center' }}>
              {message.text}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmitStep1}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>{txt.phone}</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required 
                  style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>{txt.password}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required 
                  style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>{txt.confirmPassword}</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required 
                  style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: '500' }}>
                {loading ? txt.submit : txt.register}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOTPVerify}>
              <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                <p style={{ color: '#666', marginBottom: '20px' }}>{txt.otpText}</p>
                <input type="text" name="otp" value={formData.otp} onChange={handleChange} required maxLength="6" 
                  style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '5px' }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: '500' }}>
                {loading ? txt.verifying : txt.register}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <p style={{ color: '#666' }}>{txt.already} <Link href="/login" style={{ color: '#2e7d32', fontWeight: '500' }}>{txt.login}</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
