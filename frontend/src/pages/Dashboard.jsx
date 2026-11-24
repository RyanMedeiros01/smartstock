import { Link } from 'react-router-dom';
import { Package, Boxes, AlertTriangle, ArrowLeftRight, DollarSign, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { useStock } from '../context/StockContext';
import { historicoMensal, CATEGORIAS } from '../data/mock';
import Card from '../components/ui/Card';
import KpiCard from '../components/ui/KpiCard';
import { TipoBadge } from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { moeda, numero, dataHora } from '../utils/format';

const CORES = ['#1a56db', '#60a5fa', '#93c5fd', '#cbd5e1'];

export default function Dashboard() {
  const { produtos, movimentacoes, indicadores, carregando, nomeProduto } = useStock();

  if (carregando) {
    return (
      <div className="grid grid-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} height={112} />)}</div>
    );
  }

  const porCategoria = CATEGORIAS.map((c) => ({
    name: c,
    value: produtos.filter((p) => p.categoria === c).reduce((s, p) => s + p.quantidade * p.preco, 0),
  }));
  const totalValor = porCategoria.reduce((s, c) => s + c.value, 0) || 1;

  return (
    <>
      <div className="grid grid-4">
        <KpiCard icon={Package} label="Total de produtos" value={numero(indicadores.totalProdutos)} hint={`${CATEGORIAS.length} categorias`} hintColor="var(--muted)" />
        <KpiCard icon={Boxes} label="Quantidade em estoque" value={`${numero(indicadores.totalUnidades)} un.`} hint={moeda(indicadores.valorEstoque)} tone="var(--success)" toneBg="var(--success-50)" />
        <KpiCard icon={AlertTriangle} label="Estoque baixo" value={indicadores.criticos.length} hint={indicadores.criticos.length ? 'Precisam de reposição' : 'Tudo em dia'} hintColor={indicadores.criticos.length ? 'var(--danger)' : 'var(--success)'} tone="var(--danger)" toneBg="var(--danger-50)" />
        <KpiCard icon={ArrowLeftRight} label="Movimentações" value={numero(movimentacoes.length)} hint={`↓ ${numero(indicadores.entradas)}  ·  ↑ ${numero(indicadores.saidas)} un.`} hintColor="var(--muted)" tone="var(--warning)" toneBg="var(--warning-50)" />
      </div>

      <div className="grid grid-3">
        <Card title="Entradas x Saídas" subtitle="Últimos 6 meses (unidades)">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={historicoMensal} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} width={36} />
                <Tooltip cursor={{ fill: 'var(--surface-2)' }} contentStyle={{ borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="entradas" name="Entradas" fill="#1a56db" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" name="Saídas" fill="#93b4f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Alertas de reposição" icon={Bell} actions={<span className="badge badge--danger">{indicadores.criticos.length}</span>}>
          {indicadores.criticos.length === 0 && <p className="card__sub">Nenhum produto abaixo do mínimo 🎉</p>}
          {indicadores.criticos.slice(0, 4).map((p) => {
            const pct = Math.min(100, (p.quantidade / p.estoque_minimo) * 100);
            return (
              <div className="list-item" key={p.id}>
                <span className="list-item__icon" style={{ background: 'var(--danger-50)', color: 'var(--danger)' }}><AlertTriangle size={17} /></span>
                <div className="list-item__body">
                  <b style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome}</b>
                  <small>{p.quantidade} un. · mínimo {p.estoque_minimo}</small>
                  <div className="progress" style={{ marginTop: 6 }}><i style={{ width: `${pct}%`, background: p.quantidade === 0 ? 'var(--danger)' : 'var(--warning)' }} /></div>
                </div>
              </div>
            );
          })}
          <Link to="/relatorios?tipo=criticos" className="card__sub" style={{ display: 'block', marginTop: 10, color: 'var(--brand)', fontWeight: 600 }}>Ver relatório completo →</Link>
        </Card>
      </div>

      <div className="grid grid-3">
        <Card title="Movimentações recentes" actions={<Link to="/movimentacoes" className="card__sub" style={{ color: 'var(--brand)', fontWeight: 600 }}>Ver todas →</Link>}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Produto</th><th>Tipo</th><th className="num">Qtd.</th><th>Data</th><th className="hide-sm">Usuário</th></tr></thead>
              <tbody>
                {movimentacoes.slice(0, 5).map((m) => (
                  <tr key={m.id}>
                    <td>{nomeProduto(m.produto_id)}</td>
                    <td><TipoBadge tipo={m.tipo} /></td>
                    <td className="num">{m.quantidade}</td>
                    <td>{dataHora(m.data)}</td>
                    <td className="hide-sm">{m.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Valor por categoria" icon={DollarSign}>
          <div style={{ height: 170 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={porCategoria} dataKey="value" innerRadius={50} outerRadius={78} paddingAngle={2} stroke="none">
                  {porCategoria.map((_, i) => <Cell key={i} fill={CORES[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => moeda(v)} contentStyle={{ borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {porCategoria.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: CORES[i], marginRight: 8 }} />{c.name}</span>
              <b>{Math.round((c.value / totalValor) * 100)}%</b>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
