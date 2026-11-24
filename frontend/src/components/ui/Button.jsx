export default function Button({ variant = 'default', size, block, icon: Icon, children, className = '', ...props }) {
  const cls = ['btn', variant !== 'default' && `btn--${variant}`, size && `btn--${size}`, block && 'btn--block', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={cls} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
