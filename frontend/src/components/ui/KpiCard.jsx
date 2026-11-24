import Card from './Card';

export default function KpiCard({ icon: Icon, label, value, hint, hintColor = 'var(--success)', tone = 'var(--brand)', toneBg = 'var(--brand-50)' }) {
  return (
    <Card className="kpi">
      <div className="kpi__icon" style={{ background: toneBg, color: tone }}><Icon size={22} /></div>
      <div>
        <p className="kpi__label">{label}</p>
        <p className="kpi__value">{value}</p>
        {hint && <p className="kpi__hint" style={{ color: hintColor }}>{hint}</p>}
      </div>
    </Card>
  );
}
