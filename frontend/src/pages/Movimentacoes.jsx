import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Check, Search } from 'lucide-react';
import { useStock } from '../context/StockContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import { TipoBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { dataHora, numero } from '../utils/format';

export default function Movimentacoes() {
  const { produtos, movimentacoes, registrarMovimentacao, nomeProduto, indicadores } = useStock();
  const [tipo, setTipo] = useState('ENTRADA');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroBusca, setFiltroBusca] = useState('');

  const produto = produtos.find((p) => p.id === Number(produtoId));
  const qtd = Number(quantidade) || 0;
  const saldoApos = produto ? produto.quantidade + (tipo === 'ENTRADA' ? qtd : -qtd) : null;

  const historico = useMemo(() => movimentacoes.filter((m) =>
    (!filtroTipo || m.tipo === filtroTipo) && nomeProduto(m.produto_id).toLowerCase().includes(filtroBusca.toLowerCase())
  ), [movimentacoes, filtroTipo, filtroBusca, nomeProduto]);

  async function registrar(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await registrarMovimentacao({ produto_id: Number(produtoId), tipo, quantidade: qtd, observacao });
      setQuantidade('');
      setObservacao('');
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  let previa = null;
  if (produto && qtd > 0) {
    if (saldoApos < 0) previa = <div className="alert alert--danger"><span>Saldo insuficiente: disponível {produto.quantidade} un.</span></div>;
    else if (saldoApos <= produto.estoque_minimo) previa = <div className="alert alert--warning"><span>Saldo após a {tipo === 'ENTRADA' ? 'entrada' : 'saída'}: <b>{saldoApos} un.</b><br />⚠ Ficará abaixo do mínimo ({produto.estoque_minimo}) e gerará alerta de reposição.</span></div>;
    else previa = <div className="alert alert--success"><span>Saldo após a {tipo === 'ENTRADA' ? 'entrada' : 'saída'}: <b>{saldoApos} un.</b><br />✓ Nível de estoque normal.</span></div>;
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 380px) minmax(0, 1fr)' }} data-layout="mov">
      <Card title="Nova movimentação">
        <form onSubmit={registrar} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="segmented" role="tablist">
            <button type="button" className={tipo === 'ENTRADA' ? 'on-in' : ''} onClick={() => setTipo('ENTRADA')}><ArrowDownToLine size={16} /> Entrada</button>
            <button type="button" className={tipo === 'SAIDA' ? 'on-out' : ''} onClick={() => setTipo('SAIDA')}><ArrowUpFromLine size={16} /> Saída</button>
          </div>
          <Field label="Produto *" hint={produto && `Saldo atual: ${produto.quantidade} un. · Mínimo: ${produto.estoque_minimo} un.`}>
            <select id="produto" value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
              <option value="">Selecione o produto...</option>
              {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </Field>
          <Field label="Quantidade *" id="quantidade" type="number" min="1" placeholder="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          <Field label="Observação" as="textarea" id="obs" placeholder={tipo === 'ENTRADA' ? 'Ex.: NF 4521 – Fornecedor Kabum' : 'Ex.: Pedido #8812 – venda balcão'} value={observacao} onChange={(e) => setObservacao(e.target.value)} />
          {previa}
          {erro && <div className="alert alert--danger">{erro}</div>}
          <Button type="submit" variant={tipo === 'ENTRADA' ? 'success' : 'danger'} block icon={Check} disabled={!produto || qtd <= 0 || salvando}>
            {salvando ? 'Registrando...' : tipo === 'ENTRADA' ? 'Registrar entrada' : 'Registrar saída'}
          </Button>
        </form>
      </Card>

      <Card
        title="Histórico de movimentações"
        actions={<div style={{ display: 'flex', gap: 8 }}><span className="badge badge--success">↓ {numero(indicadores.entradas)} un.</span><span className="badge badge--danger">↑ {numero(indicadores.saidas)} un.</span></div>}
      >
        <div className="toolbar">
          <label className="input-icon" style={{ flex: '1 1 200px' }}><Search size={16} /><input placeholder="Filtrar por produto..." value={filtroBusca} onChange={(e) => setFiltroBusca(e.target.value)} /></label>
          <select className="select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} aria-label="Tipo">
            <option value="">Todos os tipos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SAIDA">Saídas</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Data</th><th>Produto</th><th>Tipo</th><th className="num">Qtd.</th><th>Usuário</th></tr></thead>
            <tbody>
              {historico.slice(0, 10).map((m) => (
                <tr key={m.id}>
                  <td>#{String(m.id).slice(-4)}</td>
                  <td>{dataHora(m.data)}</td>
                  <td>{nomeProduto(m.produto_id)}</td>
                  <td><TipoBadge tipo={m.tipo} /></td>
                  <td className="num" style={{ fontWeight: 600, color: m.tipo === 'ENTRADA' ? 'var(--success)' : 'var(--danger)' }}>{m.tipo === 'ENTRADA' ? '+' : '−'}{m.quantidade}</td>
                  <td>{m.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!historico.length && <EmptyState message="Nenhuma movimentação encontrada" />}
        </div>
        <p className="pager">Mostrando {Math.min(10, historico.length)} de {historico.length} movimentações</p>
      </Card>
    </div>
  );
}
