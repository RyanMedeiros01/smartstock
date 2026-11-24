import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardList, AlertTriangle, ArrowLeftRight, Download, Printer, Bot } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStock } from '../context/StockContext';
import { CATEGORIAS } from '../data/mock';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { StatusBadge, TipoBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { moeda, numero, dataHora, statusEstoque, exportarCSV } from '../utils/format';

const TIPOS = [
  { id: 'produtos', titulo: 'Produtos cadastrados', desc: 'Posição e valor de todos os itens', icon: ClipboardList },
  { id: 'criticos', titulo: 'Estoque baixo', desc: 'Itens no mínimo ou abaixo', icon: AlertTriangle },
  { id: 'movimentacoes', titulo: 'Resumo das movimentações', desc: 'Entradas e saídas por produto', icon: ArrowLeftRight },
];

export default function Relatorios() {
  const { produtos, movimentacoes, indicadores, nomeProduto } = useStock();
  const [params, setParams] = useSearchParams();
  const tipo = params.get('tipo') ?? 'produtos';
  const [categoria, setCategoria] = useState('');

  const base = produtos.filter((p) => !categoria || p.categoria === categoria);
  const criticos = base.filter((p) => p.quantidade <= p.estoque_minimo);

  const resumoMov = useMemo(() => {
    const mapa = {};
    movimentacoes.forEach((m) => {
      const r = (mapa[m.produto_id] ??= { produto: nomeProduto(m.produto_id), entradas: 0, saidas: 0, qtd: 0 });
      r[m.tipo === 'ENTRADA' ? 'entradas' : 'saidas'] += m.quantidade;
      r.qtd += 1;
    });
    return Object.values(mapa).sort((a, b) => b.entradas + b.saidas - (a.entradas + a.saidas));
  }, [movimentacoes, nomeProduto]);

  function exportar() {
    const linhas = {
      produtos: base.map((p) => ({ Produto: p.nome, Categoria: p.categoria, Quantidade: p.quantidade, Preço: p.preco, 'Valor total': (p.quantidade * p.preco).toFixed(2), Status: statusEstoque(p).rotulo })),
      criticos: criticos.map((p) => ({ Produto: p.nome, Quantidade: p.quantidade, Mínimo: p.estoque_minimo, 'Repor (sugestão)': p.estoque_minimo * 2 - p.quantidade })),
      movimentacoes: resumoMov.map((r) => ({ Produto: r.produto, Entradas: r.entradas, Saídas: r.saidas, Movimentações: r.qtd })),
    }[tipo];
    exportarCSV(`relatorio-${tipo}`, linhas);
  }

  const valorTotal = base.reduce((s, p) => s + p.quantidade * p.preco, 0);
  const atual = TIPOS.find((t) => t.id === tipo);

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {TIPOS.map(({ id, titulo, desc, icon: Icon }) => (
          <button key={id} className={`report-tab ${tipo === id ? 'on' : ''}`} onClick={() => setParams({ tipo: id })}>
            <span className="report-tab__icon"><Icon size={20} /></span>
            <div><b>{titulo}</b><small>{desc}</small></div>
          </button>
        ))}
      </div>

      <Card
        title={atual.titulo}
        subtitle={`Gerado em ${new Date().toLocaleString('pt-BR')}`}
        actions={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {tipo !== 'movimentacoes' && (
              <select className="select" value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoria">
                <option value="">Todas as categorias</option>
                {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            )}
            <Button icon={Printer} onClick={() => window.print()}>PDF</Button>
            <Button variant="primary" icon={Download} onClick={exportar}>Exportar CSV</Button>
          </div>
        }
      >
        <div className="grid grid-4" style={{ marginBottom: 18 }}>
          <div className="stat"><p>Produtos</p><b>{numero(base.length)}</b></div>
          <div className="stat"><p>Unidades em estoque</p><b>{numero(base.reduce((s, p) => s + p.quantidade, 0))}</b></div>
          <div className="stat"><p>Valor total</p><b>{moeda(valorTotal)}</b></div>
          <div className="stat" style={{ background: 'var(--danger-50)', color: 'var(--danger-700)' }}><p style={{ color: 'inherit' }}>Estoque baixo</p><b>{criticos.length}</b></div>
        </div>

        {tipo === 'produtos' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Produto</th><th>Categoria</th><th className="num">Qtd.</th><th className="num">Preço</th><th className="num">Valor total</th><th>Status</th></tr></thead>
              <tbody>
                {base.map((p) => (
                  <tr key={p.id}><td><b>{p.nome}</b></td><td>{p.categoria}</td><td className="num">{p.quantidade}</td><td className="num">{moeda(p.preco)}</td><td className="num"><b>{moeda(p.quantidade * p.preco)}</b></td><td><StatusBadge produto={p} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tipo === 'criticos' && (
          criticos.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Produto</th><th>Categoria</th><th className="num">Atual</th><th className="num">Mínimo</th><th className="num">Faltam</th><th className="num">Sugestão de compra</th><th>Status</th></tr></thead>
                <tbody>
                  {criticos.map((p) => (
                    <tr key={p.id}><td><b>{p.nome}</b></td><td>{p.categoria}</td><td className="num">{p.quantidade}</td><td className="num">{p.estoque_minimo}</td><td className="num" style={{ color: 'var(--danger)', fontWeight: 600 }}>{Math.max(0, p.estoque_minimo - p.quantidade)}</td><td className="num"><b>{p.estoque_minimo * 2 - p.quantidade} un.</b></td><td><StatusBadge produto={p} /></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState message="Nenhum produto com estoque baixo 🎉" />
        )}

        {tipo === 'movimentacoes' && (
          <div className="grid grid-2">
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={resumoMov.slice(0, 6)} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--line)" />
                  <XAxis type="number" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                  <YAxis type="category" dataKey="produto" width={150} tick={{ fill: 'var(--muted)', fontSize: 11 }} tickFormatter={(v) => (v.length > 22 ? v.slice(0, 22) + '…' : v)} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="entradas" name="Entradas" stackId="a" fill="#16a34a" />
                  <Bar dataKey="saidas" name="Saídas" stackId="a" fill="#dc2626" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Produto</th><th className="num">Entradas</th><th className="num">Saídas</th><th className="num">Mov.</th></tr></thead>
                <tbody>
                  {resumoMov.map((r) => (
                    <tr key={r.produto}><td>{r.produto}</td><td className="num" style={{ color: 'var(--success)' }}>+{r.entradas}</td><td className="num" style={{ color: 'var(--danger)' }}>−{r.saidas}</td><td className="num">{r.qtd}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="card__sub" style={{ marginTop: 10 }}>Última movimentação: {movimentacoes[0] && <>{dataHora(movimentacoes[0].data)} · <TipoBadge tipo={movimentacoes[0].tipo} /></>}</p>
            </div>
          </div>
        )}

        <div className="alert alert--ai" style={{ marginTop: 18 }}>
          <Bot size={18} />
          <span><b>Resumo com IA (em breve – Dia 9):</b> {indicadores.criticos.length} produto(s) precisam de reposição. O agente vai sugerir quantidades com base no histórico de saídas.</span>
        </div>
      </Card>
    </>
  );
}
