import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { RefreshCw, Shield, ShieldAlert, Mail } from 'lucide-react';

export default function Inbox() {
  const [emails, setEmails]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/mail/inbox?limit=20');
      setEmails(data.emails || []);
    } catch {
      toast.error('Failed to fetch inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInbox(); }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Inbox</h2>
        <button style={styles.refreshBtn} onClick={fetchInbox}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
      {loading ? (
        <div style={styles.loading}>Fetching emails...</div>
      ) : emails.length === 0 ? (
        <div style={styles.empty}><Mail size={48} color="#ccc" /><p>No emails yet</p></div>
      ) : (
        <div style={styles.list}>
          {emails.map((email, i) => (
            <div key={i} style={styles.emailCard}>
              <div style={styles.emailTop}>
                <span style={styles.from}>{email.from || 'Unknown'}</span>
                <span style={styles.date}>{email.date ? new Date(email.date).toLocaleString() : ''}</span>
              </div>
              <div style={styles.subject}>{email.subject || '(no subject)'}</div>
              <div style={styles.preview}>{(email.text || '').slice(0, 100)}...</div>
              <div style={styles.tags}>
                {email.spam?.isSpam ? (
                  <span style={styles.tagSpam}><ShieldAlert size={12} /> SPAM</span>
                ) : (
                  <span style={styles.tagClean}><Shield size={12} /> Clean</span>
                )}
                <span style={styles.tagScore}>Score: {email.spam?.score ?? 0}</span>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, color: '#1E3A5F', margin: 0 },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#2E86C1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14 },
  loading: { textAlign: 'center', padding: 60, color: '#777' },
  empty: { textAlign: 'center', padding: 60, color: '#aaa' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  emailCard: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  emailTop: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  from: { fontWeight: 600, color: '#1E3A5F', fontSize: 14 },
  date: { color: '#aaa', fontSize: 12 },
  subject: { fontWeight: 600, fontSize: 15, color: '#333', marginBottom: 6 },
  preview: { color: '#777', fontSize: 13, marginBottom: 10 },
  tags: { display: 'flex', gap: 8 },
  tagSpam: { display: 'flex', alignItems: 'center', gap: 4, background: '#fde8e8', color: '#c0392b', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  tagClean: { display: 'flex', alignItems: 'center', gap: 4, background: '#e8f8f0', color: '#1e8449', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  tagScore: { background: '#eef', color: '#555', padding: '2px 8px', borderRadius: 20, fontSize: 11 },
};