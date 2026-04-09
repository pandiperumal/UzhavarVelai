import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [lang, setLang] = useState('ta');
  const [mounted, setMounted] = useState(false);

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
      title: 'உழவர் வேலை',
      welcome: 'உழவர் வேலைக்கு வரவேற்கிறோம்',
      subtitle: 'தமிழ்நாடு விவசாய தளம் - விவசாயிகள், தொழிலாளர்கள், இயந்திர உரிமையாளர்கள் & நடுவர்களை இணைக்கிறது',
      getStarted: 'தொடங்குங்கள்',
      features: 'தள அம்சங்கள்',
      farmers: 'விவசாயிகள்',
      farmersDesc: 'விவசாய தேவைகளுக்கு தொழிலாளர்களையும் இயந்திரங்களையும் பணியமர்த்துங்கள்',
      labour: 'தொழிலாளி',
      labourDesc: 'உங்களுக்கு அருகில் விவசாய வேலைகளைக் கண்டறியவும்',
      machinery: 'இயந்திர உரிமையாளர்கள்',
      machineryDesc: 'உங்கள் விவசாய உபகரணங்களை வாடகைக்கு வைக்கவும்',
      intermediary: 'நடுவர்கள்',
      intermediaryDesc: 'விவசாயிகளை தொழிலாளர்களுடன் இணைத்து கமிஷன் சம்பாதிக்கவும்',
      tagline: 'இணைப்பதால் வளர்ச்சி',
      login: 'உள்நுழைய',
      register: 'பதிவு செய்க',
      browseWorkers: 'தொழிலாளர்களை பார்க்க',
      findWork: 'வேலை தேடுகிறேன்',
      postJob: 'வேலை வெளியிடுகிறேன்',
      adminLogin: 'நிர்வாகி',
      footer: '© 2024 உழவர் வேலை - இணைப்பதால் வளர்ச்சி'
    },
    en: {
      title: 'UzhavarVelai',
      welcome: 'Welcome to UzhavarVelai.com',
      subtitle: 'Tamil Nadu Agricultural Platform - Connecting Farmers, Labour, Machinery Owners & Intermediaries',
      getStarted: 'Get Started',
      features: 'Platform Features',
      farmers: 'Farmers',
      farmersDesc: 'Hire workers and rent machinery for your farming needs',
      labour: 'Labour',
      labourDesc: 'Find agricultural work opportunities near you',
      machinery: 'Machinery Owners',
      machineryDesc: 'Rent out your agricultural equipment',
      intermediary: 'Intermediaries',
      intermediaryDesc: 'Connect farmers with workers and earn commission',
      tagline: 'Growth Through Connection',
      login: 'Login',
      register: 'Register',
      browseWorkers: 'Browse Workers',
      findWork: 'I am looking for work',
      postJob: 'I am posting a job',
      adminLogin: 'Admin',
      footer: '© 2024 UzhavarVelai.com - Growth Through Connection'
    }
  };

  const txt = t[lang];

  if (!mounted) return null;

  return (
    <div>
      <nav style={{ background: '#2e7d32', padding: '15px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            🌾 {txt.title}
          </Link>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none', padding: '8px 20px', border: '1px solid white', borderRadius: '5px' }}>{txt.login}</Link>
            <Link href="/register" style={{ color: '#2e7d32', textDecoration: 'none', padding: '8px 20px', background: 'white', borderRadius: '5px' }}>{txt.register}</Link>
            <Link href="/browse" style={{ color: 'white', textDecoration: 'none', padding: '8px 20px', border: '1px solid white', borderRadius: '5px' }}>{txt.browseWorkers}</Link>
            <Link href="/admin/login" style={{ color: '#fff', textDecoration: 'none', padding: '8px 16px', background: '#d32f2f', borderRadius: '5px', fontSize: '0.9rem' }}>{txt.adminLogin}</Link>
            <button onClick={toggleLang} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
              {lang === 'ta' ? 'EN' : 'தமிழ்'}
            </button>
          </div>
        </div>
      </nav>

      <section style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white', padding: '120px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold' }}>{txt.welcome}</h1>
          <p style={{ fontSize: '1.4rem', opacity: 0.9, marginBottom: '40px' }}>{txt.subtitle}</p>
          <Link href="/register" style={{ display: 'inline-block', padding: '18px 50px', background: 'white', color: '#2e7d32', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {txt.getStarted}
          </Link>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '60px', fontSize: '2rem', color: '#333' }}>{txt.features}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '35px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌾</div>
              <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '1.3rem' }}>{txt.farmers}</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>{txt.farmersDesc}</p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '35px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👷</div>
              <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '1.3rem' }}>{txt.labour}</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>{txt.labourDesc}</p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '35px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚜</div>
              <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '1.3rem' }}>{txt.machinery}</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>{txt.machineryDesc}</p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '35px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤝</div>
              <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '1.3rem' }}>{txt.intermediary}</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>{txt.intermediaryDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#1b5e20', color: 'white', padding: '40px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>{txt.footer}</p>
        </div>
      </footer>
    </div>
  );
}
