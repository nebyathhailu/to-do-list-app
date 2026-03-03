import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api from '../utils/api';

const fieldCls = 'w-full px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none bg-[var(--bg-deep)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:border-[var(--border-strong)]';
const labelCls = 'block text-[16px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1.5';

function RegisterPrompt({ message, onDismiss, onNavigate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-[rgba(27,14,32,0.85)]">
      <div className="bg-(--bg-surface) border border-(--border-mid) rounded-2xl p-8 sm:p-10 max-w-sm w-full text-center shadow-2xl">
        <div className="text-3xl mb-4">✦</div>
        <h3 className="text-lg font-extrabold text-(--text-primary) mb-2">{message}</h3>
        <p className="text-xs text-(--text-muted) leading-relaxed mb-7">
          Create a free account to unlock all features and save your tasks permanently.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onNavigate('/register')}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all bg-(--accent) text-(--accent-text) hover:bg-(--accent-hover)"
          >
            Create Free Account
          </button>
          <button
            onClick={() => onNavigate('/login')}
            className="w-full py-2.5 rounded-xl text-xs transition-all border border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) hover:border-(--border-strong)"
          >
            Already have an account? Log in
          </button>
          <button onClick={onDismiss} className="text-xs text-(--text-faint) hover:text-(--text-muted) transition-colors mt-1">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [guestTask, setGuestTask]         = useLocalStorage('guest_task', null);
  const [showPrompt, setShowPrompt]       = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [categories, setCategories]       = useState([]);
  const [catLoading, setCatLoading]       = useState(true);
  const [form, setForm] = useState({ title: '', description: '', category_id: '', due_date: '' });
  const [subtasks, setSubtasks]           = useState([]);
  const [subtaskInput, setSubtaskInput]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
        if (data.length > 0) setForm(prev => ({ ...prev, category_id: String(data[0].id) }));
        setCatLoading(false);
      })
      .catch(() => setCatLoading(false));
  }, []);

  const triggerPrompt = msg => { setPromptMessage(msg); setShowPrompt(true); };

  const addSubtask = () => {
    const trimmed = subtaskInput.trim();
    if (!trimmed) return;
    setSubtasks(prev => [...prev, { id: Date.now(), title: trimmed }]);
    setSubtaskInput('');
  };

  const removeSubtask = id => setSubtasks(prev => prev.filter(s => s.id !== id));

  const handleSubtaskKeyDown = e => {
    if (e.key === 'Enter') { e.preventDefault(); addSubtask(); }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (guestTask) { triggerPrompt('Want to add more tasks?'); return; }
    setGuestTask({
      title:       form.title,
      description: form.description || null,
      category_id: parseInt(form.category_id, 10),
      due_date:    form.due_date || null,
      subtasks:    subtasks.map(s => ({ title: s.title })),
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4
      bg-(--bg-base)
      bg-[radial-gradient(ellipse_75%_55%_at_15%_15%,rgba(141,119,168,0.2),transparent),radial-gradient(ellipse_60%_50%_at_85%_80%,rgba(196,173,221,0.13),transparent),radial-gradient(ellipse_50%_40%_at_55%_45%,rgba(68,51,74,0.22),transparent)]">

      {showPrompt && (
        <RegisterPrompt
          message={promptMessage}
          onDismiss={() => setShowPrompt(false)}
          onNavigate={path => navigate(path, { state: { fromGuest: true } })}
        />
      )}

      {/* Nav above card */}
      <div className="w-full sm:w-[88vw] lg:w-[80vw] max-w-5xl flex justify-between items-center mb-4 px-1">
        <span className="text-sm font-extrabold uppercase tracking-[0.15em] text-(--text-muted)">✦ To-Do App</span>
        <button
          onClick={() => navigate('/login')}
          className="text-xs border border-(--border-subtle) rounded-lg px-4 py-2 text-(--text-muted)
            hover:border-(--border-strong) hover:text-(--text-primary) transition-all"
        >
          Log in
        </button>
      </div>

      {/* Main card */}
      <div className="w-full sm:w-[88vw] lg:w-[80vw] max-w-5xl flex flex-col md:flex-row
        rounded-2xl overflow-hidden shadow-2xl
        bg-(--bg-surface) border border-(--border-subtle)
        md:min-h-[80vh]">

        {/* Left branding — hidden on mobile */}
        <div className="hidden md:flex flex-col justify-between relative overflow-hidden
          flex-1 p-10 lg:p-14
          bg-linear-to-br from-(--bg-base) to-(--bg-surface)
          border-r border-(--border-subtle)">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full
            bg-[radial-gradient(circle,rgba(141,119,168,0.14),transparent_70%)] pointer-events-none" />
          <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full
            bg-[radial-gradient(circle,rgba(196,173,221,0.07),transparent_70%)] pointer-events-none" />

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-(--text-muted) mb-6">
              Task management, simplified
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-(--text-primary) mb-5">
              Plan with<br /><span className="text-(--text-muted)">clarity.</span>
            </h1>
            <p className="text-sm text-(--text-muted) leading-relaxed max-w-xs mb-6">
              Organize tasks by energy and priority. Stop feeling overwhelmed — start making progress that matters.
            </p>
            <div className="flex flex-col gap-3">
              {['Auto-reschedule overdue tasks', 'Break tasks into subtasks', 'Track streaks & productivity', 'Color-coded energy categories'].map(feat => (
                <div key={feat} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-(--accent) shrink-0" />
                  <span className="text-xs text-(--text-secondary)">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote pinned to bottom */}
          <div className="p-4 rounded-xl mt-4  bg-(--bg-surface-30) border border-(--border-subtle)">
            <p className="text-xs italic text-(--text-faint) leading-relaxed">
              "You don't have to see the whole staircase, just take the first step."
            </p>
            <p className="text-[10px] text-(--text-faint) mt-2 tracking-wide">— Martin Luther King Jr.</p>
          </div>
        </div>

        {/* Right: form or saved state */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
          <div className="w-full max-w-sm">

            {/* Mobile logo */}
            <p className="md:hidden text-xs font-bold uppercase tracking-[0.18em] text-(--text-muted) mb-6">
              ✦ To-Do App
            </p>

            {guestTask ? (
              /* Saved task state */
              <div className="p-7 rounded-2xl bg-(--bg-surface-60) border border-(--border-subtle)">
                <div className="text-3xl mb-4">✓</div>
                <h2 className="text-xl font-extrabold text-(--text-primary) mb-2">Task saved!</h2>
                <p className="text-xs text-(--text-muted) leading-relaxed mb-2">
                  <span className="font-semibold text-(--text-secondary)">"{guestTask.title}"</span>{' '}
                  is ready. Register to save it permanently.
                </p>

                {/* Show saved subtasks if any */}
                {guestTask.subtasks?.length > 0 && (
                  <div className="mb-6 mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--text-muted) mb-2">
                      Subtasks ({guestTask.subtasks.length})
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {guestTask.subtasks.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-(--text-secondary)">
                          <div className="w-1 h-1 rounded-full bg-(--border-strong) shrink-0" />
                          {s.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => navigate('/register', { state: { fromGuest: true } })}
                    className="w-full py-3 rounded-xl text-sm font-bold transition-all bg-(--accent) text-(--accent-text) hover:bg-(--accent-hover)"
                  >
                    Create Free Account →
                  </button>
                  <button
                    onClick={() => triggerPrompt('Register to view your productivity summary')}
                    className="w-full py-2.5 rounded-xl text-xs transition-all border border-(--border-subtle) text-(--text-secondary) hover:border-(--border-strong)"
                  >
                    📊 View Summary
                  </button>
                  <button
                    onClick={() => triggerPrompt('Add more tasks by creating an account')}
                    className="w-full py-2.5 rounded-xl text-xs transition-all border border-(--border-subtle) text-(--text-secondary) hover:border-(--border-strong)"
                  >
                    + Add another task
                  </button>
                </div>
              </div>
            ) : (
              /* Guest task form */
              <>
              <div className='flex justify-between items-center'>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-(--text-primary) mb-2">Try it now</h2>
                  <p className="text-center text-xs text-(--text-muted)">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-(--text-secondary) font-semibold underline underline-offset-2 hover:text-(--text-primary) transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className={labelCls}>Task title</label>
                    <input
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="Add a task you want to accomplish"
                      className={`${fieldCls} placeholder:italic placeholder:text-[16px]`} required
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      Description <span className="normal-case font-normal text-(--text-faint)">(optional)</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Add some details..."
                      rows={2}
                      className={`${fieldCls} resize-none placeholder:italic placeholder:text-[16px]`}
                    />
                  </div>

                  {/* Subtasks */}
                  <div>
                    <label className={labelCls}>
                      Subtasks <span className="normal-case font-normal text-(--text-faint)">(optional)</span>
                    </label>

                    {/* Existing subtasks list */}
                    {subtasks.length > 0 && (
                      <div className="flex flex-col gap-1.5 mb-2">
                        {subtasks.map(s => (
                          <div
                            key={s.id}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                            style={{ backgroundColor: 'var(--bg-surface-30)', border: '1px solid var(--border-subtle)' }}
                          >
                            <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                            <span className="flex-1 text-(--text-secondary)">{s.title}</span>
                            <button
                              type="button"
                              onClick={() => removeSubtask(s.id)}
                              className="text-(--text-faint) hover:text-red-400 transition-colors text-sm leading-none"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Subtask input row */}
                    <div className="flex gap-2">
                      <input
                        value={subtaskInput}
                        onChange={e => setSubtaskInput(e.target.value)}
                        onKeyDown={handleSubtaskKeyDown}
                        placeholder="Add a subtask, press Enter"
                        className={`${fieldCls} flex-1 placeholder:text-[16px] placeholder:italic`}
                      />
                      <button
                        type="button"
                        onClick={addSubtask}
                        disabled={!subtaskInput.trim()}
                        className="px-3 py-2.5 rounded-lg text-sm font-bold transition-all shrink-0
                          disabled:opacity-30 disabled:cursor-not-allowed"
style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-mid)', color: 'var(--text-primary)' }}                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className={labelCls}>Category</label>
                      <select
                        value={form.category_id}
                        onChange={e => setForm({ ...form, category_id: e.target.value })}
                        className={`${fieldCls} ${catLoading ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
                        disabled={catLoading} required
                      >
                        {catLoading
                          ? <option value="">Loading...</option>
                          : <>
                              <option value="">Select...</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </>
                        }
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className={labelCls}>Due Date</label>
                      <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className={fieldCls} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={catLoading || !form.category_id}
                    className="w-full mt-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all
                      bg-(--accent) text-(--accent-text) hover:bg-(--accent-hover)
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Task →
                  </button>
                </form>

              
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}