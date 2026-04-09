import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState('ta');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [labours, setLabours] = useState([]);
  const [machineries, setMachineries] = useState([]);
  const [intermediaries, setIntermediaries] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState({ type: '', text: '' });

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
      welcome: 'வரவேற்பு', logout: 'வெளியேறு', dashboard: 'டாஷ்போர்டு', bookings: 'முன்பதிவுகள்',
      farmers: 'விவசாயிகள்', labours: 'தொழிலாளர்கள்', machinery: 'இயந்திரங்கள்', intermediaries: 'நடுவர்கள்',
      totalBookings: 'மொத்த முன்பதிவுகள்', pending: 'நிலுவையில்', completed: 'முடிவடைந்தவை',
      statusUpdated: 'நிலை புதுப்பிக்கப்பட்டது!', statusFailed: 'புதுப்பித்தல் தோல்வி',
      deleteConfirm: 'நீக்க விரும்புகிறீர்களா?', deletedSuccess: 'வெற்றிகரமாக நீக்கப்பட்டது!', deleteFailed: 'நீக்கல் தோல்வி',
      noBookings: 'முன்பதிவுகள் இல்லை', noFarmers: 'விவசாயிகள் இல்லை', noLabours: 'தொழிலாளர்கள் இல்லை',
      noMachinery: 'இயந்திரங்கள் இல்லை', noIntermediaries: 'நடுவர்கள் இல்லை',
      loading: 'ஏற்றுகிறது...', id: 'ID', farmer: 'விவசாயி', type: 'வகை', work: 'வேலை', date: 'தேதி', status: 'நிலை', actions: 'செயல்கள்',
      name: 'பெயர்', phone: 'தொலைபேசி', district: 'மாவட்டம்', taluk: 'தாலுகா', land: 'நிலம்', delete: 'நீக்கு',
      wage: 'கூலி', owner: 'உரிமையாளர்', vehicleNo: 'வாகன எண்', rate: 'கட்டணம்', experience: 'அனுபவம்', years: 'ஆண்டுகள்',
      pendingStatus: 'நிலுவையில்', accepted: 'ஏற்றுக்கொள்ளப்பட்ட', inProgress: 'செயல்பாட்டில்', completedStatus: 'முடிவடைந்த', cancelled: 'ரத்து',
      footer: '© 2024 உழவர் வேலை - தமிழ்நாடு விவசாய தளம்'
    },
    en: {
      welcome: 'Welcome', logout: 'Logout', dashboard: 'Dashboard', bookings: 'Bookings',
      farmers: 'Farmers', labours: 'Labours', machinery: 'Machinery', intermediaries: 'Intermediaries',
      totalBookings: 'Total Bookings', pending: 'Pending', completed: 'Completed',
      statusUpdated: 'Status updated!', statusFailed: 'Update failed',
      deleteConfirm: 'Are you sure you want to delete?', deletedSuccess: 'Deleted successfully!', deleteFailed: 'Delete failed',
      noBookings: 'No bookings found', noFarmers: 'No farmers found', noLabours: 'No labours found',
      noMachinery: 'No machinery found', noIntermediaries: 'No intermediaries found',
      loading: 'Loading...', id: 'ID', farmer: 'Farmer', type: 'Type', work: 'Work', date: 'Date', status: 'Status', actions: 'Actions',
      name: 'Name', phone: 'Phone', district: 'District', taluk: 'Taluk', land: 'Land', delete: 'Delete',
      wage: 'Wage', owner: 'Owner', vehicleNo: 'Vehicle No', rate: 'Rate', experience: 'Experience', years: 'years',
      pendingStatus: 'Pending', accepted: 'Accepted', inProgress: 'In Progress', completedStatus: 'Completed', cancelled: 'Cancelled',
      footer: '© 2024 UzhavarVelai.com - Tamil Nadu Agricultural Platform'
    }
  };

  const txt = t[lang];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      fetchData();
    }
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      const res = await fetch(`${API_URL}/api/admin/verify-admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Not authorized');
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'dashboard') {
        const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers });
        setStats(await statsRes.json());
      } else if (activeTab === 'bookings') {
        const bookingsRes = await fetch(`${API_URL}/api/admin/bookings`, { headers });
        const data = await bookingsRes.json();
        setBookings(data.bookings);
      } else if (activeTab === 'farmers') {
        const farmersRes = await fetch(`${API_URL}/api/farmer?active=true`, { headers });
        setFarmers(await farmersRes.json());
      } else if (activeTab === 'labours') {
        const laboursRes = await fetch(`${API_URL}/api/labour?active=true`, { headers });
        setLabours(await laboursRes.json());
      } else if (activeTab === 'machinery') {
        const machineryRes = await fetch(`${API_URL}/api/machinery?active=true`, { headers });
        setMachineries(await machineryRes.json());
      } else if (activeTab === 'intermediaries') {
        const intermediaryRes = await fetch(`${API_URL}/api/intermediary?active=true`, { headers });
        setIntermediaries(await intermediaryRes.json());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
    router.push('/admin/login');
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_URL}/api/admin/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      setMessage({ type: 'success', text: txt.statusUpdated });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: txt.statusFailed });
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(txt.deleteConfirm)) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_URL}/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: txt.deletedSuccess });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: txt.deleteFailed });
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>{txt.loading}</div>;
  }

  if (!mounted) return null;

  return (
    <div>
      <nav style={{ background: '#2e7d32', padding: '15px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🌾 UzhavarVelai Admin</Link>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span>{txt.welcome}, {localStorage.getItem('adminName')}</span>
            <button onClick={toggleLang} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
              {lang === 'ta' ? 'EN' : 'தமிழ்'}
            </button>
            <button onClick={handleLogout} style={{ padding: '8px 20px', background: '#8d6e63', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {txt.logout}
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard">
        <div className="container">
          {message.text && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('dashboard')} style={{ padding: '10px 20px', background: activeTab === 'dashboard' ? '#2e7d32' : '#ddd', color: activeTab === 'dashboard' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {txt.dashboard}
            </button>
            <button onClick={() => setActiveTab('bookings')} style={{ padding: '10px 20px', background: activeTab === 'bookings' ? '#2e7d32' : '#ddd', color: activeTab === 'bookings' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {txt.bookings}
            </button>
            <button onClick={() => setActiveTab('farmers')} style={{ padding: '10px 20px', background: activeTab === 'farmers' ? '#2e7d32' : '#ddd', color: activeTab === 'farmers' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {txt.farmers} ({farmers.length})
            </button>
            <button onClick={() => setActiveTab('labours')} style={{ padding: '10px 20px', background: activeTab === 'labours' ? '#2e7d32' : '#ddd', color: activeTab === 'labours' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {txt.labours} ({labours.length})
            </button>
            <button onClick={() => setActiveTab('machinery')} style={{ padding: '10px 20px', background: activeTab === 'machinery' ? '#2e7d32' : '#ddd', color: activeTab === 'machinery' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {txt.machinery} ({machineries.length})
            </button>
            <button onClick={() => setActiveTab('intermediaries')} style={{ padding: '10px 20px', background: activeTab === 'intermediaries' ? '#2e7d32' : '#ddd', color: activeTab === 'intermediaries' ? 'white' : 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {txt.intermediaries} ({intermediaries.length})
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: '#2e7d32', margin: 0 }}>{stats.farmers || 0}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>{txt.farmers}</p>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: '#2e7d32', margin: 0 }}>{stats.labours || 0}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>{txt.labours}</p>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: '#2e7d32', margin: 0 }}>{stats.machineries || 0}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>{txt.machinery}</p>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: '#2e7d32', margin: 0 }}>{stats.intermediaries || 0}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>{txt.intermediaries}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: '#ff9800', margin: 0 }}>{stats.totalBookings || 0}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>{txt.totalBookings}</p>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: '#ff9800', margin: 0 }}>{stats.pendingBookings || 0}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>{txt.pending}</p>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '2.5rem', color: '#4caf50', margin: 0 }}>{stats.completedBookings || 0}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>{txt.completed}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.id}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.farmer}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.type}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.work}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.date}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.status}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{booking._id.slice(-6)}</td>
                      <td style={{ padding: '15px' }}>{booking.farmerId?.name || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>{booking.bookingType}</td>
                      <td style={{ padding: '15px' }}>{booking.workTypeTamil || booking.workType}</td>
                      <td style={{ padding: '15px' }}>{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                      <td style={{ padding: '15px' }}>{booking.status}</td>
                      <td style={{ padding: '15px' }}>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          style={{ padding: '5px' }}
                        >
                          <option value="pending">{txt.pendingStatus}</option>
                          <option value="accepted">{txt.accepted}</option>
                          <option value="in_progress">{txt.inProgress}</option>
                          <option value="completed">{txt.completedStatus}</option>
                          <option value="cancelled">{txt.cancelled}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>{txt.noBookings}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'farmers' && (
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.name}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.phone}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.district}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.taluk}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.land}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.map(f => (
                    <tr key={f._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{f.name}</td>
                      <td style={{ padding: '15px' }}>{f.phone}</td>
                      <td style={{ padding: '15px' }}>{f.districtTamil || f.district}</td>
                      <td style={{ padding: '15px' }}>{f.talukTamil || f.taluk}</td>
                      <td style={{ padding: '15px' }}>{f.landArea} {f.landUnit}</td>
                      <td style={{ padding: '15px' }}>
                        <button onClick={() => handleDelete('farmer', f._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                          {txt.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {farmers.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>{txt.noFarmers}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'labours' && (
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.name}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.phone}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.district}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.taluk}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.wage}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {labours.map(l => (
                    <tr key={l._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{l.name}</td>
                      <td style={{ padding: '15px' }}>{l.phone}</td>
                      <td style={{ padding: '15px' }}>{l.districtTamil || l.district}</td>
                      <td style={{ padding: '15px' }}>{l.talukTamil || l.taluk}</td>
                      <td style={{ padding: '15px' }}>₹{l.dailyWage}</td>
                      <td style={{ padding: '15px' }}>
                        <button onClick={() => handleDelete('labour', l._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                          {txt.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {labours.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>{txt.noLabours}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'machinery' && (
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.owner}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.phone}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.type}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.vehicleNo}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.rate}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {machineries.map(m => (
                    <tr key={m._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{m.ownerName}</td>
                      <td style={{ padding: '15px' }}>{m.phone}</td>
                      <td style={{ padding: '15px' }}>{m.machineryTypeTamil || m.machineryType}</td>
                      <td style={{ padding: '15px' }}>{m.vehicleNumber}</td>
                      <td style={{ padding: '15px' }}>₹{m.dailyRate}</td>
                      <td style={{ padding: '15px' }}>
                        <button onClick={() => handleDelete('machinery', m._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                          {txt.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {machineries.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>{txt.noMachinery}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'intermediaries' && (
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.name}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.phone}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.district}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.taluk}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.experience}</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>{txt.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {intermediaries.map(i => (
                    <tr key={i._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{i.name}</td>
                      <td style={{ padding: '15px' }}>{i.phone}</td>
                      <td style={{ padding: '15px' }}>{i.districtTamil || i.district}</td>
                      <td style={{ padding: '15px' }}>{i.talukTamil || i.taluk}</td>
                      <td style={{ padding: '15px' }}>{i.experience} {txt.years}</td>
                      <td style={{ padding: '15px' }}>
                        <button onClick={() => handleDelete('intermediary', i._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                          {txt.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {intermediaries.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>{txt.noIntermediaries}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <footer style={{ background: '#1b5e20', color: 'white', padding: '20px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
          <p>{txt.footer}</p>
        </div>
      </footer>
    </div>
  );
}
