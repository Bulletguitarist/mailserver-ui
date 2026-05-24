import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Activity as ActivityIcon, CheckCircle, XCircle, LogOut, Key } from 'lucide-react';

const iconMap = {
  login_success:  <CheckCircle size={16} color="#1e8449" />,
  login_failed:   <XCircle size={16} color="#c0392b" />,
  logout:         <LogOut size={16} color="#d35400" />,
  otp_setup:      <Key size={16} color="#2E86C1" />,
  otp_verified:   <CheckCircle size={16} color="#2E86C1" />,
  otp_failed:     <XCircle size={16} color="#c0392b" />,
};

export default function Activity() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/auth/activity')
      .then(({ data }) => setLogs(data.activity || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login Activity</h2>
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : logs.length === 0 ? (
        <div style={styles.empty}><ActivityIcon size={48} color="#ccc" /><p>No activity yet</p></div>
      ) : (
        <div style={styles.list}>
          {logs.map((log, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.row}>
                {iconMap[log.action] || <ActivityIcon size={16} />}
                <span style={styles.action}>{log.action.replace(/_/g, ' ')}</span>
                <span style={styles.date}>{new Date(log.created_at).toLocaleString()}</span>
              </div>
              <div style={styles.meta}>
                <span>IP: {log.ip_address || 'unknown'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { flex: 1, padding: 32, background: '#f0f4f8', minHeight: '100vh' },
  title: { fontSize: 24, fontWeight: 700, color: '#1E3A5F', marginBottom: 24 },
  loading: { textAlign: 'center', padding: 60, color: '#777' },
  empty: { textAlign: 'center', padding: 60, color: '#aaa' },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: { background: '#fff', borderRadius: 10, padding: '14px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  row: { display: 'flex', alignItems: 'center', gap: 10 },
  action: { flex: 1, fontWeight: 600, fontSize: 14, color: '#333', textTransform: 'capitalize' },
  date: { color: '#aaa', fontSize: 12 },
  meta: { marginTop: 6, fontSize: 12, color: '#999' },
};