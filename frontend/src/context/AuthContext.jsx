import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [stats, setStats]     = useState(null);  // ← add stats to context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    api.get('/user')
      .then((res) => {
        setUser(res.data.user);               
        setStats(res.data.stats);             // ← store stats separately
        localStorage.setItem('user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setStats(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (credentials, guestTask = null) => {
    const res = await api.post('/login', { ...credentials, guest_task: guestTask });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);

    // Fetch stats after login
    const statsRes = await api.get('/user');
    setStats(statsRes.data.stats);

    return res;
  };

  const register = async (data, guestTask = null) => {
    const res = await api.post('/register', { ...data, guest_task: guestTask });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);

    // Fetch stats after register
    const statsRes = await api.get('/user');
    setStats(statsRes.data.stats);

    return res;
  };

  const logout = async () => {
    await api.post('/logout').catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setStats(null);
  };

  return (
    <AuthContext.Provider value={{ user, stats, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);