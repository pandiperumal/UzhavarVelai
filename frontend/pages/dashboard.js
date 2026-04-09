import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const router = useRouter();
  const [lang, setLang] = useState('ta');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState({
    farmer: null,
    labour: null,
    machinery: null,
    intermediary: null
  });
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [activeTab, setActiveTab] = useState('profiles');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    name: '', district: '', districtTamil: '', taluk: '', talukTamil: '',
    landArea: '', dailyWage: '', ownerName: '', vehicleNumber: '', machineryType: '',
    purpose: '', dailyRate: '', experience: '', licenseNumber: ''
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
      welcome: 'வரவேற்கிறோம்', dashboard: 'என் டாஷ்போர்டு', manageProfiles: 'வெவ்வேறு பாத்திரங்களுக்கான உங்கள் சுயவிவரங்களை நிர்வகிக்கவும்',
      logout: 'வெளியேறு', farmer: 'விவசாயி', labour: 'தொழிலாளி', machinery: 'இயந்திர உரிமையாளர்', intermediary: 'நடுவர்',
      notRegistered: 'பதிவு செய்யப்படவில்லை', addProfile: 'சுயவிவரம் சேர்', editProfile: 'சுயவிவரம் திருத்து',
      name: 'பெயர்', district: 'மாவட்டம்', taluk: 'தாலுக்கா', selectDistrict: 'மாவட்டம் தேர்வுசெய்', selectTaluk: 'தாலுக்கா தேர்வுசெய்',
      landArea: ' நிலப்பரப்பு (ஏக்கர்)', dailyWage: 'தினக் கூலி (₹)', ownerName: 'உரிமையாளர் பெயர்', vehicleNumber: 'வாகன எண்',
      machineryType: 'இயந்திர வகை', tractor: 'ட்ராக்டர்', harvester: 'அறுவடை இயந்திரம்', plough: 'உழவு', sprayer: 'தெளிப்பான்', pump: 'பம்ப் செட்',
      purpose: 'நோக்கம்', dailyRate: 'தினக் கட்டணம் (₹)', experience: 'அனுபவம் (ஆண்டுகள்)', licenseNumber: 'உரிம எண்',
      cancel: 'ரத்து', save: 'சேமி', saving: 'சேமிக்கிறது...', savedSuccess: 'சுயவிவரம் சேமிக்கப்பட்டது!', savedError: 'சேமிப்பதில் தோல்வி',
      connectionError: 'இணைப்பு பிழை', farmerProfile: 'விவசாயி சுயவிவரம்', labourProfile: 'தொழிலாளி சுயவிவரம்',
      machineryProfile: 'இயந்திர உரிமையாளர் சுயவிவரம்', intermediaryProfile: 'நடுவர் சுயவிவரம்', land: 'நிலம்', wage: 'தினக்கூலி', vehicle: 'வாகனம்',
      browseWorkers: 'தொழிலாளர்களை பார்க்க', myBookings: 'என் முன்பதிவுகள்', profiles: 'சுயவிவரங்கள்',
      workType: 'வேலை வகை', date: 'தேதி', status: 'நிலை', type: 'வகை', noBookings: 'முன்பதிவுகள் இல்லை',
      pending: 'நிலுவையில்', accepted: 'ஏற்றுக்கொள்ளப்பட்ட', inProgress: 'செயல்பாட்டில்', completed: 'முடிவடைந்த', cancelled: 'ரத்து'
    },
    en: {
      welcome: 'Welcome', dashboard: 'My Dashboard', manageProfiles: 'Manage your profiles for different roles',
      logout: 'Logout', farmer: 'Farmer', labour: 'Labour', machinery: 'Machinery Owner', intermediary: 'Intermediary',
      notRegistered: 'Not registered', addProfile: 'Add Profile', editProfile: 'Edit Profile',
      name: 'Name', district: 'District', taluk: 'Taluk', selectDistrict: 'Select District', selectTaluk: 'Select Taluk',
      landArea: 'Land Area (acres)', dailyWage: 'Daily Wage (₹)', ownerName: 'Owner Name', vehicleNumber: 'Vehicle Number',
      machineryType: 'Machinery Type', tractor: 'Tractor', harvester: 'Harvester', plough: 'Plough', sprayer: 'Sprayer', pump: 'Pump Set',
      purpose: 'Purpose', dailyRate: 'Daily Rate (₹)', experience: 'Experience (years)', licenseNumber: 'License Number',
      cancel: 'Cancel', save: 'Save', saving: 'Saving...', savedSuccess: 'Profile saved!', savedError: 'Failed to save',
      connectionError: 'Connection error', farmerProfile: 'Farmer Profile', labourProfile: 'Labour Profile',
      machineryProfile: 'Machinery Owner Profile', intermediaryProfile: 'Intermediary Profile', land: 'Land', wage: 'Wage', vehicle: 'Vehicle',
      browseWorkers: 'Browse Workers', myBookings: 'My Bookings', profiles: 'Profiles',
      workType: 'Work Type', date: 'Date', status: 'Status', type: 'Type', noBookings: 'No bookings found',
      pending: 'Pending', accepted: 'Accepted', inProgress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled'
    }
  };

  const txt = t[lang];

  useEffect(() => {
    checkAuth();
    fetchDistricts();
    fetchProfiles();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (formData.district) {
      fetchTaluks(formData.district);
      const selected = districts.find(d => d.district === formData.district);
      setFormData(prev => ({ ...prev, districtTamil: selected?.districtTamil || '' }));
    }
  }, [formData.district]);

  useEffect(() => {
    if (formData.district && formData.taluk) {
      const selected = taluks.find(t => t.name === formData.taluk);
      setFormData(prev => ({ ...prev, talukTamil: selected?.nameTamil || '' }));
    }
  }, [formData.taluk]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/geo/districts`);
      const data = await res.json();
      setDistricts(data);
    } catch (err) { console.error(err); }
  };

  const fetchTaluks = async (district) => {
    try {
      const res = await fetch(`${API_URL}/api/geo/taluks/${encodeURIComponent(district)}`);
      const data = await res.json();
      setTaluks(data);
    } catch (err) { console.error(err); }
  };

  const fetchProfiles = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
      const [farmerRes, labourRes, machineryRes, intermediaryRes] = await Promise.all([
        fetch(`${API_URL}/api/farmer?userId=${localStorage.getItem('userId')}`, { headers }),
        fetch(`${API_URL}/api/labour?userId=${localStorage.getItem('userId')}`, { headers }),
        fetch(`${API_URL}/api/machinery?userId=${localStorage.getItem('userId')}`, { headers }),
        fetch(`${API_URL}/api/intermediary?userId=${localStorage.getItem('userId')}`, { headers })
      ]);
      
      const [farmer, labour, machinery, intermediary] = await Promise.all([
        farmerRes.json(), labourRes.json(), machineryRes.json(), intermediaryRes.json()
      ]);
      
      setProfiles({
        farmer: farmer[0] || null,
        labour: labour[0] || null,
        machinery: machinery[0] || null,
        intermediary: intermediary[0] || null
      });
    } catch (err) { console.error(err); }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const res = await fetch(`${API_URL}/api/bookings?farmerId=${localStorage.getItem('userId')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPhone');
    router.push('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDistrictChange = (e) => {
    setFormData({ ...formData, district: e.target.value, taluk: '', talukTamil: '' });
    fetchTaluks(e.target.value);
  };

  const handleSubmitFarmer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/farmer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, userId: localStorage.getItem('userId'), phone: localStorage.getItem('userPhone') })
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: txt.savedSuccess });
        fetchProfiles();
        setActiveForm(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || txt.savedError });
      }
    } catch (err) {
      setMessage({ type: 'error', text: txt.connectionError });
    }
    setLoading(false);
  };

  const handleSubmitLabour = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/labour/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, userId: localStorage.getItem('userId'), phone: localStorage.getItem('userPhone') })
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: txt.savedSuccess });
        fetchProfiles();
        setActiveForm(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || txt.savedError });
      }
    } catch (err) {
      setMessage({ type: 'error', text: txt.connectionError });
    }
    setLoading(false);
  };

  const handleSubmitMachinery = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/machinery/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, userId: localStorage.getItem('userId'), phone: localStorage.getItem('userPhone') })
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: txt.savedSuccess });
        fetchProfiles();
        setActiveForm(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || txt.savedError });
      }
    } catch (err) {
      setMessage({ type: 'error', text: txt.connectionError });
    }
    setLoading(false);
  };

  const handleSubmitIntermediary = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/intermediary/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, userId: localStorage.getItem('userId'), phone: localStorage.getItem('userPhone') })
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: txt.savedSuccess });
        fetchProfiles();
        setActiveForm(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    }
    setLoading(false);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!mounted) return null;

  const ProfileCard = ({ titleKey, icon, profile, onAdd, onEdit }) => (
    <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '2rem', marginRight: '12px' }}>{icon}</span>
        <h3 style={{ color: '#2e7d32', margin: 0 }}>{txt[titleKey]}</h3>
      </div>
      {profile ? (
        <div style={{ color: '#666', fontSize: '0.95rem' }}>
          <p><strong>{txt.name}:</strong> {profile.name || profile.ownerName}</p>
          <p><strong>{txt.district}:</strong> {profile.districtTamil || profile.district}</p>
          <p><strong>{txt.taluk}:</strong> {profile.talukTamil || profile.taluk}</p>
          {profile.landArea && <p><strong>{txt.land}:</strong> {profile.landArea} acres</p>}
          {profile.dailyWage && <p><strong>{txt.wage}:</strong> ₹{profile.dailyWage}</p>}
          {profile.vehicleNumber && <p><strong>{txt.vehicle}:</strong> {profile.vehicleNumber}</p>}
        </div>
      ) : (
        <p style={{ color: '#999', marginBottom: '15px' }}>{txt.notRegistered}</p>
      )}
      <button onClick={profile ? onEdit : onAdd}
        style={{ padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%' }}>
        {profile ? txt.editProfile : txt.addProfile}
      </button>
    </div>
  );

  const FormModal = ({ titleKey, onClose, onSubmit, children }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
        <h3 style={{ marginBottom: '20px', color: '#2e7d32' }}>{txt[titleKey]}</h3>
        {children}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{txt.cancel}</button>
          <button onClick={onSubmit} disabled={loading} style={{ flex: 1, padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {loading ? txt.saving : txt.save}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#2e7d32', padding: '15px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🌾 UzhavarVelai</Link>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/browse" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', background: '#1565c0', borderRadius: '5px' }}>{txt.browseWorkers}</Link>
            <span>{txt.welcome}, {localStorage.getItem('userPhone')}</span>
            <button onClick={toggleLang} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
              {lang === 'ta' ? 'EN' : 'தமிழ்'}
            </button>
            <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#8d6e63', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{txt.logout}</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>{txt.dashboard}</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>{txt.manageProfiles}</p>

        {message.text && (
          <div style={{ padding: '15px', borderRadius: '6px', marginBottom: '20px', background: message.type === 'error' ? '#ffebee' : '#e8f5e9', color: message.type === 'error' ? '#f44336' : '#4caf50' }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('profiles')} style={{ padding: '10px 20px', background: activeTab === 'profiles' ? '#2e7d32' : '#ddd', color: activeTab === 'profiles' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {txt.profiles}
          </button>
          <button onClick={() => setActiveTab('bookings')} style={{ padding: '10px 20px', background: activeTab === 'bookings' ? '#2e7d32' : '#ddd', color: activeTab === 'bookings' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {txt.myBookings} ({bookings.length})
          </button>
        </div>

        {activeTab === 'profiles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <ProfileCard titleKey="farmer" icon="🌾" profile={profiles.farmer}
            onAdd={() => { setFormData({ name: '', district: '', districtTamil: '', taluk: '', talukTamil: '', landArea: '' }); setActiveForm('farmer'); }}
            onEdit={() => { setFormData({ name: profiles.farmer.name, district: profiles.farmer.district, districtTamil: profiles.farmer.districtTamil, taluk: profiles.farmer.taluk, talukTamil: profiles.farmer.talukTamil, landArea: profiles.farmer.landArea || '' }); setActiveForm('farmer'); }} />
          
          <ProfileCard titleKey="labour" icon="👷" profile={profiles.labour}
            onAdd={() => { setFormData({ name: '', district: '', districtTamil: '', taluk: '', talukTamil: '', dailyWage: '' }); setActiveForm('labour'); }}
            onEdit={() => { setFormData({ name: profiles.labour.name, district: profiles.labour.district, districtTamil: profiles.labour.districtTamil, taluk: profiles.labour.taluk, talukTamil: profiles.labour.talukTamil, dailyWage: profiles.labour.dailyWage || '' }); setActiveForm('labour'); }} />
          
          <ProfileCard titleKey="machinery" icon="🚜" profile={profiles.machinery}
            onAdd={() => { setFormData({ ownerName: '', district: '', districtTamil: '', taluk: '', talukTamil: '', vehicleNumber: '', machineryType: 'tractor', purpose: 'ploughing', dailyRate: '' }); setActiveForm('machinery'); }}
            onEdit={() => { setFormData({ ownerName: profiles.machinery.ownerName, district: profiles.machinery.district, districtTamil: profiles.machinery.districtTamil, taluk: profiles.machinery.taluk, talukTamil: profiles.machinery.talukTamil, vehicleNumber: profiles.machinery.vehicleNumber, machineryType: profiles.machinery.machineryType, purpose: profiles.machinery.purpose, dailyRate: profiles.machinery.dailyRate || '' }); setActiveForm('machinery'); }} />
          
          <ProfileCard titleKey="intermediary" icon="🤝" profile={profiles.intermediary}
            onAdd={() => { setFormData({ name: '', district: '', districtTamil: '', taluk: '', talukTamil: '', experience: '', licenseNumber: '' }); setActiveForm('intermediary'); }}
            onEdit={() => { setFormData({ name: profiles.intermediary.name, district: profiles.intermediary.district, districtTamil: profiles.intermediary.districtTamil, taluk: profiles.intermediary.taluk, talukTamil: profiles.intermediary.talukTamil, experience: profiles.intermediary.experience || '', licenseNumber: profiles.intermediary.licenseNumber || '' }); setActiveForm('intermediary'); }} />
        </div>
        )}

        {activeTab === 'bookings' && (
          <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f5f5f5' }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left' }}>#</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{txt.type}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{txt.workType}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{txt.date}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{txt.status}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>{txt.noBookings}</td></tr>
                ) : bookings.map((b, i) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>{i + 1}</td>
                    <td style={{ padding: '15px' }}>
                      {b.bookingType === 'labour' ? '👷 ' + txt.labour : b.bookingType === 'machinery' ? '🚜 ' + txt.machinery : '🤝 ' + txt.intermediary}
                    </td>
                    <td style={{ padding: '15px' }}>{b.workType}</td>
                    <td style={{ padding: '15px' }}>{b.scheduledDate ? new Date(b.scheduledDate).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ padding: '5px 10px', borderRadius: '15px', background: b.status === 'pending' ? '#fff3e0' : b.status === 'accepted' ? '#e3f2fd' : b.status === 'completed' ? '#e8f5e9' : '#ffebee', color: b.status === 'pending' ? '#e65100' : b.status === 'accepted' ? '#1565c0' : b.status === 'completed' ? '#2e7d32' : '#c62828' }}>
                        {b.status === 'pending' ? txt.pending : b.status === 'accepted' ? txt.accepted : b.status === 'in_progress' ? txt.inProgress : b.status === 'completed' ? txt.completed : txt.cancelled}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeForm === 'farmer' && (
        <FormModal titleKey="farmerProfile" onClose={() => setActiveForm(null)} onSubmit={handleSubmitFarmer}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.name}</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.district}</label>
            <select name="district" value={formData.district} onChange={handleDistrictChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="">{txt.selectDistrict}</option>
              {districts.map(d => <option key={d.district} value={d.district}>{d.districtTamil}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.taluk}</label>
            <select name="taluk" value={formData.taluk} onChange={handleChange} required disabled={!formData.district} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="">{txt.selectTaluk}</option>
              {taluks.map(t => <option key={t.name} value={t.name}>{t.nameTamil}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.landArea}</label>
            <input type="number" name="landArea" value={formData.landArea} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
        </FormModal>
      )}

      {activeForm === 'labour' && (
        <FormModal titleKey="labourProfile" onClose={() => setActiveForm(null)} onSubmit={handleSubmitLabour}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.name}</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.district}</label>
            <select name="district" value={formData.district} onChange={handleDistrictChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="">{txt.selectDistrict}</option>
              {districts.map(d => <option key={d.district} value={d.district}>{d.districtTamil}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.taluk}</label>
            <select name="taluk" value={formData.taluk} onChange={handleChange} required disabled={!formData.district} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="">{txt.selectTaluk}</option>
              {taluks.map(t => <option key={t.name} value={t.name}>{t.nameTamil}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.dailyWage}</label>
            <input type="number" name="dailyWage" value={formData.dailyWage} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
        </FormModal>
      )}

      {activeForm === 'machinery' && (
        <FormModal titleKey="machineryProfile" onClose={() => setActiveForm(null)} onSubmit={handleSubmitMachinery}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.ownerName}</label>
            <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.vehicleNumber}</label>
            <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required placeholder="TN 01 AB 1234" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.machineryType}</label>
            <select name="machineryType" value={formData.machineryType} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="tractor">{txt.tractor}</option>
              <option value="harvester">{txt.harvester}</option>
              <option value="plough">{txt.plough}</option>
              <option value="sprayer">{txt.sprayer}</option>
              <option value="pump">{txt.pump}</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.district}</label>
            <select name="district" value={formData.district} onChange={handleDistrictChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="">{txt.selectDistrict}</option>
              {districts.map(d => <option key={d.district} value={d.district}>{d.districtTamil}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.taluk}</label>
            <select name="taluk" value={formData.taluk} onChange={handleChange} required disabled={!formData.district} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="">{txt.selectTaluk}</option>
              {taluks.map(t => <option key={t.name} value={t.name}>{t.nameTamil}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.dailyRate}</label>
            <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
        </FormModal>
      )}

      {activeForm === 'intermediary' && (
        <FormModal titleKey="intermediaryProfile" onClose={() => setActiveForm(null)} onSubmit={handleSubmitIntermediary}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.name}</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.district}</label>
            <select name="district" value={formData.district} onChange={handleDistrictChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="">{txt.selectDistrict}</option>
              {districts.map(d => <option key={d.district} value={d.district}>{d.districtTamil}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.taluk}</label>
            <select name="taluk" value={formData.taluk} onChange={handleChange} required disabled={!formData.district} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="">{txt.selectTaluk}</option>
              {taluks.map(t => <option key={t.name} value={t.name}>{t.nameTamil}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.experience}</label>
            <input type="number" name="experience" value={formData.experience} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.licenseNumber}</label>
            <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          </div>
        </FormModal>
      )}
    </div>
  );
}
