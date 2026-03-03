import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const [guestTask, setGuestTask] = useLocalStorage('guest_task', null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await login({ email, password }, guestTask);
      setGuestTask(null); navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4
      bg-(--bg-base) 
      bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(141,119,168,0.18),transparent),radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(196,173,221,0.12),transparent),radial-gradient(ellipse_40%_40%_at_60%_30%,rgba(68,51,74,0.25),transparent)]">

      {/* Card — full width on mobile, 88vw on tablet, 80vw on desktop */}
      <div className="w-full sm:w-[88vw] lg:w-[80vw] max-w-5xl flex flex-col md:flex-row
        rounded-2xl overflow-hidden shadow-2xl
        bg-(--bg-surface) border border-(--border-subtle)
        md:min-h-[75vh]">

        {/* Left branding — hidden on mobile */}
        <div className="hidden md:flex flex-col justify-center relative overflow-hidden
          flex-1 p-10 lg:p-14
          bg-linear-to-br from-(--bg-base) to-(--bg-surface)
          border-r border-(--border-subtle)">
          {/* Deco orbs */}
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full
            bg-[radial-gradient(circle,rgba(141,119,168,0.15),transparent_70%)] pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full
            bg-[radial-gradient(circle,rgba(196,173,221,0.07),transparent_70%)] pointer-events-none" />

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--text-muted) mb-10">
            ✦ To-Do App
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-(--text-primary) mb-5">
            Welcome<br /><span className="text-(--text-muted)">back.</span>
          </h1>
          <p className="text-sm text-(--text-muted) leading-relaxed max-w-xs mb-10">
            Your tasks are waiting. Pick up right where you left off.
          </p>
          <div className="flex flex-col gap-3 mb-16">
            {['Track your streaks', 'Manage subtasks', 'Auto-reschedule overdue tasks'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-(--accent) shrink-0" />
                <span className="text-xs text-(--text-secondary)">{f}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-(--bg-surface-30) border border-(--border-subtle)">
            <p className="text-xs italic text-(--text-faint) leading-relaxed">
              "The secret of getting ahead is getting started."
            </p>
            <p className="text-[10px] text-(--text-faint) mt-2 tracking-wide">— Mark Twain</p>
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <p className="md:hidden text-xs font-bold uppercase tracking-[0.18em] text-(--text-muted) mb-6">
              ✦ To-Do App
            </p>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-(--text-primary) mb-2">Sign in</h2>
            <p className="text-sm text-(--text-muted) mb-7">
              {location.state?.fromGuest ? 'Log in to save your task and continue.' : 'Enter your credentials to continue.'}
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-500/10 border border-red-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              <button
                type="submit" disabled={loading}
                className="w-full mt-2 py-3 rounded-xl text-sm font-bold tracking-wide transition-all
                  bg-(--accent) text-(--accent-text) hover:bg-(--accent-hover)
                  disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-(--border-subtle)" />
              <span className="text-xs text-(--text-faint)">or</span>
              <div className="flex-1 h-px bg-(--border-subtle)" />
            </div>

            <p className="text-center text-xs text-(--text-muted)">
              Don't have an account?{' '}
              <Link to="/register" className="text-(--text-secondary) font-semibold underline underline-offset-2 hover:text-(--text-primary) transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}