import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { RefreshCw, Shield, ShieldAlert, X, Lock, Unlock } from 'lucide-react';

export default function Inbox() {
  const [emails, setEmails]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [decrypted, setDecrypted]   = useState('');

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/mail/inbox');
      setEmails(data.emails || []);
    } catch {
      toast.error('Failed to fetch inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInbox(); }, []);

  const openEmail = async (email) => {
    try {
      setSelected(email);
      setPrivateKey('');
      setDecrypted('');
      if (!email.is_read) {
        await api.patch(`/api/mail/${email.id}/read`);
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_read: 1 } : e));
      }
    } catch (err) {
      console.error('Error opening email:', err);
    }
  };

  const decryptEmail = async (email) => {
    try {
      if (!privateKey) {
        toast.error('Please enter your private key!');
        return;
      }
      const { data } = await api.post('/api/mail/decrypt', {
        encryptedBody: email.body_encrypted,
        privateKey,
      });
      setDecrypted(data.decrypted);
      toast.success('Decrypted! 🔓');
    } catch (err) {
      toast.error('Decryption failed — wrong private key?');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return dateStr; }
  };

  return (
    <div style={styles.container}>
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ flex: 1 }}>
                <div style={styles.modalSubject}>{selected.subject || '(no subject)'}</div>
                <div style={styles.modalMeta}>From: {selected.from_address || 'Unknown'}</div>
                <div style={styles.modalMeta}>
                  To: {(() => { try { return JSON.parse(selected.to_addresses || '[]').join(', '); } catch { return selected.to_addresses; } })()}
                </div>
                <div style={styles.modalMeta}>Date: {formatDate(selected.received_at || selected.created_at)}</div>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelected(null)}><X size={20} /></button>
            </div>

            <div style={styles.modalEncryption}>
              {selected.is_encrypted
                ? <span style={styles.encTag}><Lock size={12} /> End-to-End Encrypted</span>
                : <span style={styles.plainTag}><Unlock size={12} /> Not Encrypted</span>}
            </div>

            {selected.is_encrypted ? (
              <div>
                <div style={styles.modalBody}>
                  🔒 This message is encrypted. Enter your private key to decrypt.
                </div>
                <div style={{ marginTop: 12 }}>
                  <textarea
                    style={styles.privateKeyInput}
                    placeholder="Paste your private key here..."
                    value={privateKey}
                    onChange={e => setPrivateKey(e.target.value)}
                  />
                  <button
                    style={styles.decryptBtn}
                    onClick={() => decryptEmail(selected)}
                  >
                    🔓 Decrypt Message
                  </button>
                  {decrypted && (
                    <div style={styles.decryptedBody}>
                      {decrypted}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={styles.modalBody}>
                {selected.body_encrypted || '(empty message)'}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.title}>Inbox</h2>
        <button style={styles.refreshBtn} onClick={fetchInbox}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Fetching emails...</div>
      ) : emails.length === 0 ? (
        <div style={styles.empty}>No emails yet</div>
      ) : (
        <div style={styles.list}>
          {emails.map((email, i) => (
            <div key={i} style={{
              ...styles.emailCard,
              borderLeft: email.is_read ? '4px solid transparent' : '4px solid #2E86C1',
              cursor: 'pointer',
            }} onClick={() => openEmail(email)}>
              <div style={styles.emailTop}>
                <span style={styles.from}>{email.from_address || 'Unknown'}</span>
                <span style={styles.date}>{formatDate(email.received_at || email.created_at)}</span>
              </div>
              <div style={{ ...styles.subject, fontWeight: email.is_read ? 400 : 700 }}>
                {email.subject || '(no subject)'}
              </div>
              <div style={styles.tags}>
                {email.spam?.isSpam
                  ? <span style={styles.tagSpam}><ShieldAlert size={12} /> SPAM</span>
                  : <span style={styles.tagClean}><Shield size={12} /> Clean</span>}
                <span style={styles.tagScore}>Score: {email.spam?.score ?? 0}</span>
                {email.is_encrypted
                  ? <span style={styles.encTag}><Lock size={12} /> Encrypted</span>
                  : <span style={styles.plainTag}><Unlock size={12} /> Not Encrypted</span>}
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
  emailCard: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' },
  emailTop: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  from: { fontWeight: 600, color: '#1E3A5F', fontSize: 14 },
  date: { color: '#aaa', fontSize: 12 },
  subject: { fontSize: 15, color: '#333', marginBottom: 10 },
  tags: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tagSpam: { display: 'flex', alignItems: 'center', gap: 4, background: '#fde8e8', color: '#c0392b', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  tagClean: { display: 'flex', alignItems: 'center', gap: 4, background: '#e8f8f0', color: '#1e8449', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  tagScore: { background: '#eef', color: '#555', padding: '2px 8px', borderRadius: 20, fontSize: 11 },
  encTag: { display: 'flex', alignItems: 'center', gap: 4, background: '#e8f0fe', color: '#2E86C1', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  plainTag: { display: 'flex', alignItems: 'center', gap: 4, background: '#fff8e8', color: '#d35400', padding: '2px 8px', borderRadius: 20, fontSize: 11 },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16 },
  modalSubject: { fontSize: 20, fontWeight: 700, color: '#1E3A5F', marginBottom: 8 },
  modalMeta: { fontSize: 13, color: '#777', marginBottom: 4 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#777', padding: 4, flexShrink: 0 },
  modalEncryption: { marginBottom: 16 },
  modalBody: { fontSize: 15, color: '#333', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: '#f8f9fa', padding: 16, borderRadius: 8 },
  privateKeyInput: { width: '100%', height: 80, padding: 10, borderRadius: 8, border: '1px solid #ddd', fontFamily: 'monospace', fontSize: 12, resize: 'vertical', boxSizing: 'border-box' },
  decryptBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#1e8449', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 8, width: '100%' },
  decryptedBody: { marginTop: 12, fontSize: 15, color: '#1e8449', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: '#e8f8f0', padding: 16, borderRadius: 8, border: '1px solid #1e8449' },
};