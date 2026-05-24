import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

export default function Register() {
  const [form, setForm]       = useState({ email: '', password: '', display_name: '' });
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.email, form.password, form.display_name);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Mail size={40} color="#2E86C1" />
          <h1 style={styles.title}>SecureMail</h1>
          <p style={styles.subtitle}>Create your secure account</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <User size={16} color="#777" style={styles.icon} />
            <input style={styles.input} type="text" placeholder="Display name" value={form.display_name}
              onChange={e => setForm({ ...form, display_name: e.target.value })} />
          </div>
          <div style={styles.inputGroup}>
            <Mail size={16} color="#777" style={styles.icon} />
            <input style={styles.input} type="email" placeholder="Email address" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={styles.inputGroup}>
            <Lock size={16} color="#777" style={styles.icon} />
            <input style={styles.input} type="password" placeholder="Password (min 8 chars)" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            <UserPlus size={16} />
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  card: { background: '#fff', borderRadius: 16, padding: 40, width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' },
  header: { textAlign: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 700, color: '#1E3A5F', margin: '8px 0 4px' },
  subtitle: { color: '#777', fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  inputGroup: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: 12 },
  input: { width: '100%', padding: '12px 12px 12px 40px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2E86C1', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  btnDisabled: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#aaa', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, cursor: 'not-allowed' },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#777' },
  link: { color: '#2E86C1', fontWeight: 600, textDecoration: 'none' },
};