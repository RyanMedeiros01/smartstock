import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Download } from 'lucide-react';
import { useStock } from '../context/StockContext';
import { CATEGORIAS } from '../data/mock';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProdutoForm from '../components/ProdutoForm';
import { moeda, data, statusEstoque, exportarCSV } from '../utils/format';

const POR_PAGINA = 8;

export default function Produtos() {
  const { produtos, salvarProduto, excluirProduto } = useStock();
  const [params] = useSearchParams();
  const [busca, setBusca] = useState(params.get('busca') ?? '');
  const [categoria, setCategoria] = useState('');
  const [status, setStatus] = useState('');
  const [pagina, setPagina] = useState(1);
  const [editando, setEditando] = useState(null); // null = fechado, {} = novo, produto = edição
  const [excluindo, setExcluindo] = useState(null);

  const filtrados = useMemo(() => produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) &&
    (!categoria || p.categoria === categoria) &&
    (!status || (status === 'critico' ? p.quantidade <= p.estoque_minimo : statusEstoque(p).chave === status))
  ), [produtos, busca, categoria, status]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const visiveis = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  function exportar() {
    exportarCSV('produtos', filtrados.map((p) => ({ ID: p.id, Nome: p.nome, Categoria: p.categoria, Quantidade: p.quantidade, 'Estoque mínimo': p.estoque_minimo, Preço: p.preco, Status: statusEstoque(p).rotulo })));
  }

  return (
    <Card>
      <div className="toolbar">
        <label className="input-icon" style={{ flex: '1 1 240px', maxWidth: 340 }}>
          <Search size={16} />
          <input placeholder="Buscar por nome..." value={busca} onChange={(e) => { setBusca(e.target.value); setPagina(1); }} />
        </label>
        <select className="select" value={categoria} onChange={(e) => { setCategoria(e.target.value); setPagina(1); }} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="select" value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }} aria-label="Status">
          <option value="">Todos os status</option>
          <option value="normal">Normal</option>
          <option value="atencao">Atenção</option>
          <option value="critico">Crítico / zerado</option>
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <Button icon={Download} onClick={exportar} title="Exportar CSV"><span className="hide-sm">Exportar</span></Button>
          <Button variant="primary" icon={Plus} onClick={() => setEditando({})}>Novo produto</Button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Produto</th><th>Categoria</th><th className="num">Qtd.</th><th className="num">Mínimo</th><th className="num">Preço</th><th>Status</th><th>Cadastro</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {visiveis.map((p) => (
              <tr key={p.id}>
                <td>#{String(p.id).slice(-3).padStart(3, '0')}</td>
                <td><b>{p.nome}</b></td>
                <td>{p.categoria}</td>
                <td className="num">{p.quantidade}</td>
                <td className="num">{p.estoque_minimo}</td>
                <td className="num">{moeda(p.preco)}</td>
                <td><StatusBadge produto={p} /></td>
                <td>{data(p.data_cadastro)}</td>
                <td>
                  <div className="actions">
                    <Button size="sm" className="btn--icon" onClick={() => setEditando(p)} aria-label={`Editar ${p.nome}`}><Pencil size={15} /></Button>
                    <Button size="sm" className="btn--icon" onClick={() => setExcluindo(p)} aria-label={`Excluir ${p.nome}`}><Trash2 size={15} color="var(--danger)" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visiveis.length && <EmptyState message="Nenhum produto encontrado com esses filtros" />}
      </div>

      <div className="pager">
        <span>Mostrando {visiveis.length} de {filtrados.length} produtos</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>‹ Anterior</Button>
          <Button size="sm" variant="primary" style={{ pointerEvents: 'none' }}>{pagina} / {totalPaginas}</Button>
          <Button size="sm" disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>Próxima ›</Button>
        </div>
      </div>

      <ProdutoForm produto={editando} onClose={() => setEditando(null)} onSave={async (d) => { await salvarProduto(d); setEditando(null); }} />

      <ConfirmDialog
        open={!!excluindo}
        title="Excluir produto"
        message={<>Tem certeza que deseja excluir <b>{excluindo?.nome}</b>? Esta ação não pode ser desfeita.</>}
        confirmText="Excluir"
        onClose={() => setExcluindo(null)}
        onConfirm={async () => { await excluirProduto(excluindo.id); setExcluindo(null); }}
      />
    </Card>
  );
}
