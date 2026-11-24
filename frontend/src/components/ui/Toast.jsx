import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useStock } from '../../context/StockContext';

const ICONS = { success: CheckCircle2, warning: AlertTriangle, error: XCircle };

export default function Toast() {
  const { toast } = useStock();
  if (!toast) return null;
  const Icon = ICONS[toast.tipo];
  return (
    <div key={toast.id} className={`toast toast--${toast.tipo}`} role="status">
      <Icon size={18} /> {toast.mensagem}
    </div>
  );
}
