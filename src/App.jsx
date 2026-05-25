import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Inbox from './pages/Inbox';
import Compose from './pages/Compose';
import Sent from './pages/Sent';
import Activity from './pages/Activity';
import Keys from './pages/Keys';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, color: '#777' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/inbox"    element={<Inbox />} />
            <Route path="/compose"  element={<Compose />} />
            <Route path="/sent"     element={<Sent />} />
            <Route path="/spam"     element={<div style={{padding:32}}>Spam — coming soon</div>} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/keys"     element={<Keys />} />
            <Route path="*"         element={<Navigate to="/inbox" />} />
          </Route>
          <Route path="/"         element={<Navigate to="/inbox" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}