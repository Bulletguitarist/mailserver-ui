import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, Lock, Unlock } from 'lucide-react';

export default function Compose() {
  const [form, setForm]       = useState({ to: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/mail/send', form);
      setLastResult(data);
      toast.success('Email sent!');
      setForm({ to: '', subject: '', body: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Compose Email</h2>
      <div style={styles.card}>
        <form onSubmit={handleSend} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>To</label>
            <input style={styles.input} type="email" placeholder="recipient@example.com"
              value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Subject</label>
            <input style={styles.input} type="text" placeholder="Subject"
              value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Message</label>
            <textarea style={styles.textarea} placeholder="Write your message..."
              value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required rows={10} />
          </div>
          <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            <Send size={16} />
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
        {lastResult && (
          <div style={lastResult.encrypted ? styles.encryptedBadge : styles.plainBadge}>
            {lastResult.encrypted ? <Lock size={14} /> : <Unlock size={14} />}
            {lastResult.encrypted
              ? 'Email was end-to-end encrypted!'
              : 'Email sent (recipient has no public key — not encrypted)'}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { flex: 1, padding: 32, background: '#f0f4f8', minHeight: '100vh' },
  title: { fontSize: 24, fontWeight: 700, color: '#1E3A5F', marginBottom: 24 },
  card: { background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: 640 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#555' },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, outline: 'none' },
  textarea: { padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' },
  btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2E86C1', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  btnDisabled: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#aaa', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, cursor: 'not-allowed' },
  encryptedBadge: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 16px', background: '#e8f8f0', color: '#1e8449', borderRadius: 8, fontSize: 13, fontWeight: 600 },
  plainBadge: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 16px', background: '#fff8e8', color: '#d35400', borderRadius: 8, fontSize: 13 },
};