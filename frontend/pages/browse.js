import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Browse() {
  const router = useRouter();
  const [lang, setLang] = useState('ta');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [labours, setLabours] = useState([]);
  const [machineries, setMachineries] = useState([]);
  const [intermediaries, setIntermediaries] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [activeTab, setActiveTab] = useState('labour');
  const [district, setDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingForm, setBookingForm] = useState({ workType: '', date: '', description: '' });

  useEffect(() => {
    const saved = localStorage.getItem('uzhavar_lang');
    if (saved) setLang(saved);
    setMounted(true);
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab, district]);

  const toggleLang = () => {
    const newLang = lang === 'ta' ? 'en' : 'ta';
    setLang(newLang);
    localStorage.setItem('uzhavar_lang', newLang);
  };

  const fetchDistricts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/geo/districts`);
      const data = await res.json();
      setDistricts(data);
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = district ? `?district=${encodeURIComponent(district)}` : '';
      const headers = {};
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      if (activeTab === 'labour') {
        const res = await fetch(`${API_URL}/api/labour${query}`, { headers });
        setLabours(await res.json());
      } else if (activeTab === 'machinery') {
        const res = await fetch(`${API_URL}/api/machinery${query}`, { headers });
        setMachineries(await res.json());
      } else if (activeTab === 'intermediary') {
        const res = await fetch(`${API_URL}/api/intermediary${query}`, { headers });
        setIntermediaries(await res.json());
      } else if (activeTab === 'farmer') {
        const res = await fetch(`${API_URL}/api/farmer${query}`, { headers });
        setFarmers(await res.json());
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleContact = (item, type) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setSelectedItem({ ...item, type });
    setBookingForm({ workType: '', date: '', description: '' });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    try {
      const res = await fetch(`${API_URL}/api/bookings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          farmerId: userId,
          bookingType: selectedItem.type,
          labourId: selectedItem.type === 'labour' ? selectedItem._id : null,
          machineryId: selectedItem.type === 'machinery' ? selectedItem._id : null,
          intermediaryId: selectedItem.type === 'intermediary' ? selectedItem._id : null,
          workType: bookingForm.workType,
          scheduledDate: bookingForm.date,
          description: bookingForm.description,
          status: 'pending'
        })
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: txt.bookingSuccess });
        setSelectedItem(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: txt.bookingFailed });
      }
    } catch (err) {
      setMessage({ type: 'error', text: txt.connectionError });
    }
  };

  const t = {
    ta: {
      title: 'தொழிலாளர்களை தேடுங்கள்', subtitle: 'விவசாய தொழிலாளிகள், இயந்திரங்கள் மற்றும் நடுவர்களைக் கண்டறியவும்',
      labour: 'தொழிலாளி', machinery: 'இயந்திரம்', intermediary: 'நடுவர்', farmer: 'விவசாயி',
      allDistricts: 'அனைத்து மாவட்டங்களும்', district: 'மாவட்டம்', name: 'பெயர்', phone: 'தொலைபேசி', taluk: 'தாலுக்கா',
      wage: 'தினக்கூலி', rate: 'கட்டணம்', experience: 'அனுபவம்', vehicleNo: 'வாகன எண்', landArea: 'நிலப்பரப்பு',
      contact: 'தொடர்பு கொள்ளவும்', book: 'முன்பதிவு செய்யவும்', cancel: 'ரத்து',
      workType: 'வேலை வகை', date: 'தேதி', description: 'விளக்கம்', submit: 'சமர்ப்பி',
      bookingSuccess: 'முன்பதிவு வெற்றி!', bookingFailed: 'முன்பதிவு தோல்வி', connectionError: 'இணைப்பு பிழை',
      noResults: 'முடிவுகள் இல்லை', loginToBook: 'முன்பதிவு செய்ய உள்நுழையவும்',
      ploughing: 'உழவு', harvesting: 'அறுவடை', planting: 'நடுதல்', spraying: 'தெளித்தல்', irrigation: 'நீர்ப்பாசனம்', transport: 'அனுப்புதல்',
      available: 'கிடைக்கும்', notSpecified: 'குறிப்பிடப்படவில்லை', years: 'ஆண்டுகள்', acres: 'ஏக்கர்', perDay: '/நாள்'
    },
    en: {
      title: 'Find Workers', subtitle: 'Find agricultural workers, machinery and intermediaries',
      labour: 'Labour', machinery: 'Machinery', intermediary: 'Intermediary', farmer: 'Farmer',
      allDistricts: 'All Districts', district: 'District', name: 'Name', phone: 'Phone', taluk: 'Taluk',
      wage: 'Daily Wage', rate: 'Rate', experience: 'Experience', vehicleNo: 'Vehicle No', landArea: 'Land Area',
      contact: 'Contact', book: 'Book Now', cancel: 'Cancel',
      workType: 'Work Type', date: 'Date', description: 'Description', submit: 'Submit',
      bookingSuccess: 'Booking successful!', bookingFailed: 'Booking failed', connectionError: 'Connection error',
      noResults: 'No results found', loginToBook: 'Login to book',
      ploughing: 'Ploughing', harvesting: 'Harvesting', planting: 'Planting', spraying: 'Spraying', irrigation: 'Irrigation', transport: 'Transport',
      available: 'Available', notSpecified: 'Not specified', years: 'years', acres: 'acres', perDay: '/day'
    }
  };

  const txt = t[lang];

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#2e7d32', padding: '15px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🌾 UzhavarVelai</Link>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>{txt.title}</Link>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>{lang === 'ta' ? 'உள்நுழைய' : 'Login'}</Link>
            <button onClick={toggleLang} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
              {lang === 'ta' ? 'EN' : 'தமிழ்'}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>{txt.title}</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>{txt.subtitle}</p>

        {message.text && (
          <div style={{ padding: '15px', borderRadius: '6px', marginBottom: '20px', background: message.type === 'error' ? '#ffebee' : '#e8f5e9', color: message.type === 'error' ? '#f44336' : '#4caf50' }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['labour', 'machinery', 'intermediary', 'farmer'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', background: activeTab === tab ? '#2e7d32' : '#ddd', color: activeTab === tab ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                {tab === 'labour' && '👷 '}{tab === 'machinery' && '🚜 '}{tab === 'intermediary' && '🤝 '}{tab === 'farmer' && '🌾 '}{txt[tab]}
              </button>
            ))}
          </div>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '5px', minWidth: '200px' }}>
            <option value="">{txt.allDistricts}</option>
            {districts.map(d => <option key={d.district} value={d.district}>{d.districtTamil}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>{lang === 'ta' ? 'ஏற்றுகிறது...' : 'Loading...'}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {activeTab === 'labour' && labours.map(labour => (
              <div key={labour._id} style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#2e7d32', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', marginRight: '15px' }}>👷</div>
                  <div>
                    <h3 style={{ color: '#333', margin: 0 }}>{labour.name}</h3>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>{labour.districtTamil || labour.district} • {labour.talukTamil || labour.taluk}</p>
                  </div>
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
                  <p><strong>{txt.wage}:</strong> ₹{labour.dailyWage || txt.notSpecified} {txt.perDay}</p>
                  <p><strong>{txt.phone}:</strong> {labour.phone}</p>
                  <p><strong>{txt.experience}:</strong> {labour.experience ? `${labour.experience} ${txt.years}` : txt.notSpecified}</p>
                </div>
                <button onClick={() => handleContact(labour, 'labour')} style={{ width: '100%', padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                  {txt.book}
                </button>
              </div>
            ))}

            {activeTab === 'machinery' && machineries.map(mach => (
              <div key={mach._id} style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#ff9800', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', marginRight: '15px' }}>🚜</div>
                  <div>
                    <h3 style={{ color: '#333', margin: 0 }}>{mach.ownerName}</h3>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>{mach.districtTamil || mach.district} • {mach.talukTamil || mach.taluk}</p>
                  </div>
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
                  <p><strong>{lang === 'ta' ? 'இயந்திரம்' : 'Machinery'}:</strong> {mach.machineryType}</p>
                  <p><strong>{txt.vehicleNo}:</strong> {mach.vehicleNumber}</p>
                  <p><strong>{txt.rate}:</strong> ₹{mach.dailyRate || txt.notSpecified} {txt.perDay}</p>
                  <p><strong>{txt.phone}:</strong> {mach.phone}</p>
                </div>
                <button onClick={() => handleContact(mach, 'machinery')} style={{ width: '100%', padding: '12px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                  {txt.book}
                </button>
              </div>
            ))}

            {activeTab === 'intermediary' && intermediaries.map(int => (
              <div key={int._id} style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#9c27b0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', marginRight: '15px' }}>🤝</div>
                  <div>
                    <h3 style={{ color: '#333', margin: 0 }}>{int.name}</h3>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>{int.districtTamil || int.district} • {int.talukTamil || int.taluk}</p>
                  </div>
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
                  <p><strong>{txt.experience}:</strong> {int.experience ? `${int.experience} ${txt.years}` : txt.notSpecified}</p>
                  <p><strong>{lang === 'ta' ? 'உரிம எண்' : 'License No'}:</strong> {int.licenseNumber || txt.notSpecified}</p>
                  <p><strong>{txt.phone}:</strong> {int.phone}</p>
                </div>
                <button onClick={() => handleContact(int, 'intermediary')} style={{ width: '100%', padding: '12px', background: '#9c27b0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                  {txt.contact}
                </button>
              </div>
            ))}

            {activeTab === 'farmer' && farmers.map(farm => (
              <div key={farm._id} style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#4caf50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', marginRight: '15px' }}>🌾</div>
                  <div>
                    <h3 style={{ color: '#333', margin: 0 }}>{farm.name}</h3>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>{farm.districtTamil || farm.district} • {farm.talukTamil || farm.taluk}</p>
                  </div>
                </div>
                <div style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
                  <p><strong>{txt.landArea}:</strong> {farm.landArea ? `${farm.landArea} ${txt.acres}` : txt.notSpecified}</p>
                  <p><strong>{txt.phone}:</strong> {farm.phone}</p>
                </div>
                <button onClick={() => handleContact(farm, 'farmer')} style={{ width: '100%', padding: '12px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                  {txt.contact}
                </button>
              </div>
            ))}

            {(activeTab === 'labour' && labours.length === 0) || 
             (activeTab === 'machinery' && machineries.length === 0) || 
             (activeTab === 'intermediary' && intermediaries.length === 0) || 
             (activeTab === 'farmer' && farmers.length === 0) ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#666' }}>
                {txt.noResults}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2e7d32' }}>
              {txt.book} - {selectedItem.name}
            </h3>
            <form onSubmit={handleBooking}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.workType}</label>
                <select value={bookingForm.workType} onChange={(e) => setBookingForm({...bookingForm, workType: e.target.value})} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <option value="">Select...</option>
                  <option value="ploughing">{txt.ploughing}</option>
                  <option value="harvesting">{txt.harvesting}</option>
                  <option value="planting">{txt.planting}</option>
                  <option value="spraying">{txt.spraying}</option>
                  <option value="irrigation">{txt.irrigation}</option>
                  <option value="transport">{txt.transport}</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.date}</label>
                <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{txt.description}</label>
                <textarea value={bookingForm.description} onChange={(e) => setBookingForm({...bookingForm, description: e.target.value})} rows="3" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setSelectedItem(null)} style={{ flex: 1, padding: '12px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{txt.cancel}</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{txt.submit}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
