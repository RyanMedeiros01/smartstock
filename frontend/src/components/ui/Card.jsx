export default function Card({ title, subtitle, icon: Icon, actions, children, className = '', style }) {
  return (
    <section className={`card ${className}`} style={style}>
      {(title || actions) && (
        <header className="card__head">
          <div>
            {title && <h3 className="card__title">{Icon && <Icon size={17} />}{title}</h3>}
            {subtitle && <p className="card__sub">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
