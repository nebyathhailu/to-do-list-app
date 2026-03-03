export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="fixed inset-0 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(27,14,32,0.75)' }}
          onClick={onClose}
        />
        <div
          className="relative rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <h3 className="text-lg font-bold font-['Syne']" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-xl leading-none transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ✕
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}