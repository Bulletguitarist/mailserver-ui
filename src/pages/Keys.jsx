import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Key, Copy, AlertTriangle } from 'lucide-react';

export default function Keys() {
  const [status, setStatus]     = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    api.get('/api/keys/status').then(({ data }) => setStatus(data));
  }, []);

  const generateKeys = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/keys/generate');
      setPrivateKey(data.privateKey);
      setStatus({ hasKeys: true, publicKey: data.publicKey });
      toast.success('Keys generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Encryption Keys</h2>
      <div style={styles.card}>
        <div style={styles.statusRow}>
          <Key size={20} color={status?.hasKeys ? '#1e8449' : '#aaa'} />
          <span style={styles.statusText}>
            {status?.hasKeys ? '✅ Keypair active — E2E encryption enabled' : '⚠️ No keys yet'}
          </span>
        </div>
        {status?.hasKeys && (
          <div style={styles.keyBox}>
            <div style={styles.keyLabel}>Your Public Key</div>
            <div style={styles.keyValue}>{status.publicKey}</div>
            <button style={styles.copyBtn} onClick={() => copy(status.publicKey)}>
              <Copy size={12} /> Copy
            </button>
          </div>
        )}
        {!status?.hasKeys && (
          <button style={loading ? styles.btnDisabled : styles.btn} onClick={generateKeys} disabled={loading}>
            <Key size={16} /> {loading ? 'Generating...' : 'Generate Keypair'}
          </button>
        )}
        {privateKey && (
          <div style={styles.privateKeyBox}>
            <div style={styles.warning}>
              <AlertTriangle size={16} color="#d35400" />
              <strong>Save this private key NOW! It will not be shown again.</strong>
            </div>
            <div style={styles.keyValue}>{privateKey}</div>
            <button style={styles.copyBtn} onClick={() => copy(privateKey)}>
              <Copy size={12} /> Copy Private Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { flex: 1, padding: 32, background: '#f0f4f8', minHeight: '100vh' },
  title: { fontSize: 24, fontWeight: 700, color: '#1E3A5F', marginBottom: 24 },
  card: { background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 },
  statusRow: { display: 'flex', alignItems: 'center', gap: 10 },
  statusText: { fontSize: 15, fontWeight: 600, color: '#333' },
  keyBox: { background: '#f0f4f8', borderRadius: 8, padding: 16 },
  keyLabel: { fontSize: 12, fontWeight: 600, color: '#777', marginBottom: 6 },
  keyValue: { fontFamily: 'monospace', fontSize: 12, color: '#333', wordBreak: 'break-all', marginBottom: 10 },
  copyBtn: { display: 'flex', alignItems: 'center', gap: 4, background: '#2E86C1', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' },
  btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2E86C1', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  btnDisabled: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#aaa', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, cursor: 'not-allowed' },
  privateKeyBox: { background: '#fff8e8', borderRadius: 8, padding: 16, border: '1px solid #f0c060' },
  warning: { display: 'flex', alignItems: 'center', gap: 8, color: '#d35400', fontSize: 13, marginBottom: 10 },
};