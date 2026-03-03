export default function Badge({ color, children, size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`${sizeClasses} font-semibold rounded-full inline-flex items-center`}
      style={{ backgroundColor: `${color}25`, color, border: `1px solid ${color}40` }}
    >
      {children}
    </span>
  );
}