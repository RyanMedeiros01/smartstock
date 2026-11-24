export default function Field({ label, hint, error, as = 'input', children, ...props }) {
  const Tag = as;
  return (
    <div className="field">
      {label && <label htmlFor={props.id}>{label}</label>}
      {children ?? <Tag {...props} />}
      {error ? <span className="field__error">{error}</span> : hint && <span className="field__hint">{hint}</span>}
    </div>
  );
}
