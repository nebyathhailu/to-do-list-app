export default function Button({ children, variant = 'primary', className = '', style = {}, ...props }) {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-['DM_Sans'] text-sm";

  const styles = {
    primary: {
      backgroundColor: 'var(--accent)',
      color: 'var(--accent-text)',
    },
    secondary: {
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)',
    },
    danger: {
      backgroundColor: 'rgba(239,68,68,0.15)',
      color: '#f87171',
      border: '1px solid rgba(239,68,68,0.3)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-muted)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text-muted)',
      border: '1px solid var(--border-strong)',
    },
  };

  return (
    <button
      className={`${base} ${className}`}
      style={{ ...styles[variant], ...style }}
      onMouseEnter={e => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--bg-surface-60)';
        if (variant === 'ghost' || variant === 'outline') e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
      }}
      onMouseLeave={e => {
        Object.assign(e.currentTarget.style, styles[variant]);
      }}
      {...props}
    >
      {children}
    </button>
  );
}