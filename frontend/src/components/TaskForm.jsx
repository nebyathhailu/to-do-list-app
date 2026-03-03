import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import Button from './ui/Button';
import Input from './ui/Input';
import api from '../utils/api';

export default function TaskForm({ onTaskAdded, initialData = null, compact = false }) {
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);
  const { request, loading } = useApi();

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category_id: initialData?.category_id || '',
    due_date: initialData?.due_date || '',
  });

  const [subtasks, setSubtasks] = useState(
    initialData?.subtasks?.map(s => ({
      id: s.id,
      title: s.title,
      is_completed: s.is_completed,
    })) || []
  );
  const [newSubtask, setNewSubtask] = useState('');
  const [showDescription, setShowDescription] = useState(!!initialData?.description);

  // Use axios directly — avoids stale closure issues with useApi's request function
  const fetchCategories = () => {
    setCatLoading(true);
    setCatError(false);
    api.get('/categories')
      .then((res) => {
        const data = res.data;
        setCategories(Array.isArray(data) ? data : []);
        setCatLoading(false);
      })
      .catch((err) => {
        console.error('Categories fetch failed:', err);
        setCatError(true);
        setCatLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { title: newSubtask.trim(), is_completed: false }]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (index) => setSubtasks(subtasks.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, subtasks };
      if (initialData) {
        await request('put', `/tasks/${initialData.id}`, payload);
      } else {
        await request('post', '/tasks', payload);
      }
      onTaskAdded();
      setForm({ title: '', description: '', category_id: '', due_date: '' });
      setSubtasks([]);
      setShowDescription(false);
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-surface-60)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    fontFamily: 'Syne, sans-serif',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        label="Task Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="What needs to be done?"
        required
      />

      {!showDescription ? (
        <button
          type="button"
          onClick={() => setShowDescription(true)}
          className="text-xs underline underline-offset-2 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          + Add description
        </button>
      ) : (
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional details..."
            rows={3}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          />
        </div>
      )}

      <div className="flex gap-3">

        {/* Category */}
        <div className="flex-1">
          <label style={labelStyle}>Category</label>
          {catError ? (
            <div style={{ fontSize: 12, padding: '8px 0' }}>
              <span style={{ color: '#f87171' }}>Failed to load. </span>
              <button
                type="button"
                onClick={fetchCategories}
                style={{ color: 'var(--accent)', textDecoration: 'underline', fontSize: 12 }}
              >
                Retry
              </button>
            </div>
          ) : (
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              style={{
                ...inputStyle,
                opacity: catLoading ? 0.6 : 1,
                cursor: catLoading ? 'wait' : 'pointer',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              required
              disabled={catLoading}
            >
              <option value="">
                {catLoading ? 'Loading...' : 'Select category...'}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Due Date */}
        <div className="flex-1">
          <label style={labelStyle}>Due Date</label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          />
        </div>
      </div>

      {/* Subtasks */}
      {!compact && (
        <div>
          <label style={labelStyle}>Subtasks</label>
          <div className="space-y-2 mb-2">
            {subtasks.map((sub, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--bg-base)' }}
              >
                <span className="flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {sub.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeSubtask(i)}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addSubtask(); }
              }}
              placeholder="Add a subtask..."
              style={{ ...inputStyle, flex: 1 }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            />
            <button
              type="button"
              onClick={addSubtask}
              className="px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
            >
              +
            </button>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading || catLoading}>
        {loading ? 'Saving...' : (initialData ? 'Update Task' : 'Add Task')}
      </Button>

    </form>
  );
}