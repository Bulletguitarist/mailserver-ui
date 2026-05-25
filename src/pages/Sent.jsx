import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { RefreshCw, Lock, Unlock, X } from 'lucide-react';

export default function Sent() {
  const [emails, setEmails]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchSent = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/mail/sent');
      setEmails(data.emails || []);
    } catch {
      toast.error('Failed to fetch sent emails');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSent(); }, []);

  return (
    <div style={styles.container}>
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalSubject}>{selected.subject || '(no subject)'}</div>
                <div style={styles.modalMeta}>To: {(selected.to_addresses || []).join(', ')}</div>
                <div style={styles.modalMeta}>Sent: {selected.sent_at || selected.created_at}</div>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div style={styles.modalEncryption}>
              {selected.encrypted
                ? <span style={styles.encTag}><Lock size={12} /> Encrypted</span>
                : <span style={styles.plainTag}><Unlock size={12} /> Not encrypted</span>}
            </div>
          </div>
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.title}>Sent</h2>
        <button style={styles.refreshBtn} onClick={fetchSent}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : emails.length === 0 ? (
        <div style={styles.empty}>No sent emails yet</div>
      ) : (
        <div style={styles.list}>
          {emails.map((email, i) => (
            <div key={i} style={styles.emailCard} onClick={() => setSelected(email)}>
              <div style={styles.emailTop}>
                <span style={styles.to}>To: {(email.to_addresses || []).join(', ')}</span>
                <span style={styles.date}>{email.sent_at || email.created_at}</span>
              </div>
              <div style={styles.subject}>{email.subject || '(no subject)'}</div>
              <div style={styles.tags}>
                {email.encrypted
                  ? <span style={styles.encTag}><Lock size={12} /> Encrypted</span>
                  : <span style={styles.plainTag}><Unlock size={12} /> Not encrypted</span>}
                <span style={styles.statusTag}>{email.status || 'sent'}</span>
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
  empty: { textAlign: 'center', padding: 60, color: '#aaa', fontSize: 16 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  emailCard: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' },
  emailTop: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  to: { fontWeight: 600, color: '#1E3A5F', fontSize: 14 },
  date: { color: '#aaa', fontSize: 12 },
  subject: { fontSize: 15, color: '#333', marginBottom: 10, fontWeight: 500 },
  tags: { display: 'flex', gap: 8 },
  encTag: { display: 'flex', alignItems: 'center', gap: 4, background: '#e8f0fe', color: '#2E86C1', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  plainTag: { display: 'flex', alignItems: 'center', gap: 4, background: '#fff8e8', color: '#d35400', padding: '2px 8px', borderRadius: 20, fontSize: 11 },
  statusTag: { background: '#e8f8f0', color: '#1e8449', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalSubject: { fontSize: 20, fontWeight: 700, color: '#1E3A5F', marginBottom: 8 },
  modalMeta: { fontSize: 13, color: '#777', marginBottom: 4 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#777', padding: 4 },
  modalEncryption: { marginBottom: 16 },
};