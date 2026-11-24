import { statusEstoque } from '../../utils/format';

export default function Badge({ color = 'info', children }) {
  return <span className={`badge badge--${color}`}>{children}</span>;
}

export function StatusBadge({ produto }) {
  const s = statusEstoque(produto);
  return <Badge color={s.cor}>{s.rotulo}</Badge>;
}

export function TipoBadge({ tipo }) {
  return tipo === 'ENTRADA' ? <Badge color="success">↓ Entrada</Badge> : <Badge color="danger">↑ Saída</Badge>;
}
