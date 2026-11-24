import { PackageOpen } from 'lucide-react';

export default function EmptyState({ message = 'Nenhum registro encontrado' }) {
  return (
    <div className="empty">
      <PackageOpen size={36} strokeWidth={1.5} />
      <p style={{ marginTop: 8 }}>{message}</p>
    </div>
  );
}
