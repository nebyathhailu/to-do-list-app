import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Input from '../components/ui/Input';

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const [guestTask, setGuestTask] = useLocalStorage('guest_task', null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrors({});
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match' }); return;
    }
    setLoading(true);
    try {
      await register(form, guestTask); setGuestTask(null); navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else setErrors({ general: data?.message || 'Something went wrong.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4
      bg-(--bg-base)
      bg-[radial-gradient(ellipse_70%_55%_at_80%_10%,rgba(141,119,168,0.16),transparent),radial-gradient(ellipse_55%_45%_at_15%_85%,rgba(196,173,221,0.11),transparent),radial-gradient(ellipse_45%_35%_at_40%_50%,rgba(68,51,74,0.2),transparent)]">

      <div className="w-full sm:w-[88vw] lg:w-[80vw] max-w-5xl flex flex-col md:flex-row
        rounded-2xl overflow-hidden shadow-2xl
        bg-(--bg-surface) border border-(--border-subtle)
        md:min-h-[80vh] max-h-[95vh] overflow-y-auto">

        {/* Left branding */}
        <div className="hidden md:flex flex-col justify-center relative overflow-hidden
          flex-1 p-10 lg:p-14
          bg-linear-to-br from-(--bg-base) to-(--bg-surface)
          border-r border-(--border-subtle)">
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full
            bg-[radial-gradient(circle,rgba(141,119,168,0.13),transparent_70%)] pointer-events-none" />
          <div className="absolute top-8 right-8 w-24 h-24 rounded-full
            bg-[radial-gradient(circle,rgba(196,173,221,0.06),transparent_70%)] pointer-events-none" />

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--text-muted) mb-10">
            ✦ To-Do App
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-(--text-primary) mb-5">
            Start your<br /><span className="text-(--text-muted)">journey.</span>
          </h1>
          <p className="text-sm text-(--text-muted) leading-relaxed max-w-xs mb-8">
            Free forever. No credit card required. Join and start making progress that matters.
          </p>

          {guestTask && (
            <div className="mb-8 p-4 rounded-xl max-w-xs bg-(--bg-surface-60) border border-(--border-subtle)">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--text-muted) mb-1">
                Saving your task
              </p>
              <p className="text-xs font-medium text-(--text-secondary)">"{guestTask.title}"</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {[
              { step: '01', text: 'Create your free account' },
              { step: '02', text: 'Add tasks by energy level' },
              { step: '03', text: 'Track your progress' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3">
                <span className="text-[10px] font-extrabold text-(--accent) tracking-wide min-w-5">{step}</span>
                <span className="text-xs text-(--text-secondary)">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:px-14 overflow-y-auto">
          <div className="w-full max-w-sm">
            <p className="md:hidden text-xs font-bold uppercase tracking-[0.18em] text-(--text-muted) mb-6">
              ✦ To-Do App
            </p>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-(--text-primary) mb-2">Create account</h2>
            <p className="text-sm text-(--text-muted) mb-6">
              {location.state?.fromGuest ? 'Register to save your task and get started.' : 'Fill in the details below to get started.'}
            </p>

            {errors.general && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-500/10 border border-red-500/30">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input label="Name"             name="name"                  value={form.name}                  onChange={handleChange} placeholder="Jane Doe"         required error={errors.name?.[0]} />
              <Input label="Email"            name="email"     type="email" value={form.email}                 onChange={handleChange} placeholder="you@example.com"  required error={errors.email?.[0]} />
              <Input label="Password"         name="password"  type="password" value={form.password}           onChange={handleChange} placeholder="Min. 6 characters" required error={errors.password?.[0]} />
              <Input label="Confirm Password" name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} placeholder="Repeat password" required error={errors.password_confirmation} />
              <button
                type="submit" disabled={loading}
                className="w-full mt-2 py-3 rounded-xl text-sm font-bold tracking-wide transition-all
                  bg-(--accent) text-(--accent-text) hover:bg-(--accent-hover)
                  disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-(--border-subtle)" />
              <span className="text-xs text-(--text-faint)">or</span>
              <div className="flex-1 h-px bg-(--border-subtle)" />
            </div>

            <p className="text-center text-xs text-(--text-muted)">
              Already have an account?{' '}
              <Link to="/login" className="text-(--text-secondary) font-semibold underline underline-offset-2 hover:text-(--text-primary) transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}