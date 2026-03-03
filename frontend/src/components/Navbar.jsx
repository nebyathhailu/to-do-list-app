import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(27,14,32,0.8)' }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="text-2xl mb-3">👋</div>
          <h3
            className="text-lg font-bold font-['Syne']"
            style={{ color: 'var(--text-primary)' }}
          >
            Log out?
          </h3>
          <p
            className="text-sm mt-1 font-['DM_Sans']"
            style={{ color: 'var(--text-muted)' }}
          >
            Are you sure you want to log out of To-Do App?
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium font-['DM_Sans'] transition-all"
            style={{
              backgroundColor: 'var(--bg-surface-60)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold font-['DM_Sans'] transition-all"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-text)',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <nav
        className="sticky top-0 z-40"
        style={{ backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight font-['Syne']"
            style={{ color: 'var(--text-secondary)' }}
          >
            To-Do App
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg transition-all text-lg"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Toggle theme"
            >
              {darkMode ? '☀' : '☾'}
            </button>

        {user ? (
          <div className="flex items-center gap-3">
            <span
              className="text-sm hidden sm:block font-['DM_Sans']"
              style={{ color: 'var(--text-muted)' }}
            >
              {`Hi, ${user.name}`}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-xs font-medium font-['DM_Sans'] transition-all px-2 py-1 rounded-lg"
              style={{ color: 'var(--text-faint)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-faint)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Logout
            </button>
          </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-sm px-3 py-1.5">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="text-sm px-3 py-1.5">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}