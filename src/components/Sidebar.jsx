import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Inbox, Send, Shield, Activity, Key, LogOut, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const links = [
  { to: '/inbox',    icon: Inbox,    label: 'Inbox'    },
  { to: '/compose',  icon: Mail,     label: 'Compose'  },
  { to: '/sent',     icon: Send,     label: 'Sent'     },
  { to: '/spam',     icon: Shield,   label: 'Spam'     },
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/keys',     icon: Key,      label: 'Keys'     },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <Mail size={24} color="#2E86C1" />
        <span style={styles.brandName}>SecureMail</span>
      </div>
      <div style={styles.userInfo}>
        <div style={styles.avatar}>{user?.display_name?.[0] || user?.email?.[0] || '?'}</div>
        <div>
          <div style={styles.userName}>{user?.display_name || 'User'}</div>
          <div style={styles.userEmail}>{user?.email}</div>
        </div>
      </div>
      <nav style={styles.nav}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.linkActive : {})
          })}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button style={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: { width: 220, background: '#1E3A5F', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 0' },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  brandName: { color: '#fff', fontSize: 20, fontWeight: 700 },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10, padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#2E86C1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', flexShrink: 0 },
  userName: { color: '#fff', fontSize: 13, fontWeight: 600 },
  userEmail: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  nav: { display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 12px', gap: 4 },
  link: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  linkActive: { background: 'rgba(46,134,193,0.3)', color: '#fff' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 8, margin: '0 12px', padding: '10px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14 },
};