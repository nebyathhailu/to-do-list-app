export default function Input({ label, className = '', error = null, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-1.5 font-['Syne']"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 ${error ? 'ring-1 ring-red-500' : ''} ${className}`}
        style={{
          backgroundColor: 'var(--bg-surface-60)',
          border: `1px solid ${error ? '#f87171' : 'var(--border-subtle)'}`,
          color: 'var(--text-primary)',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.outline = 'none'; }}
        onBlur={e => { e.currentTarget.style.borderColor = error ? '#f87171' : 'var(--border-subtle)'; }}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}