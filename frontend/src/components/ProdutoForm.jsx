import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './ui/Modal';
import Field from './ui/Field';
import Button from './ui/Button';
import { CATEGORIAS } from '../data/mock';

const VAZIO = { nome: '', categoria: '', quantidade: 0, estoque_minimo: 1, preco: '' };

// Formulário reutilizado para cadastro e edição de produto
export default function ProdutoForm({ produto, onClose, onSave }) {
  const aberto = produto !== null;
  const edicao = !!produto?.id;
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (aberto) { setForm(edicao ? produto : VAZIO); setErros({}); }
  }, [produto]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  function validar() {
    const e = {};
    if (form.nome.trim().length < 3) e.nome = 'Informe o nome (mín. 3 caracteres)';
    if (!form.categoria) e.categoria = 'Selecione uma categoria';
    if (form.preco === '' || Number(form.preco) < 0) e.preco = 'Informe um preço válido';
    if (Number(form.estoque_minimo) < 0) e.estoque_minimo = 'Valor inválido';
    if (!edicao && Number(form.quantidade) < 0) e.quantidade = 'Valor inválido';
    setErros(e);
    return !Object.keys(e).length;
  }

  async function salvar(ev) {
    ev.preventDefault();
    if (!validar()) return;
    setSalvando(true);
    await onSave({ ...form, quantidade: Number(form.quantidade), estoque_minimo: Number(form.estoque_minimo), preco: Number(form.preco) });
    setSalvando(false);
  }

  const critico = edicao && produto.quantidade <= Number(form.estoque_minimo);

  return (
    <Modal
      open={aberto}
      title={edicao ? 'Editar produto' : 'Novo produto'}
      onClose={onClose}
      footer={<><Button onClick={onClose}>Cancelar</Button><Button variant="primary" onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : edicao ? 'Salvar alterações' : 'Cadastrar produto'}</Button></>}
    >
      <form onSubmit={salvar} style={{ display: 'contents' }}>
        <Field label="Nome do produto *" id="nome" value={form.nome} onChange={set('nome')} error={erros.nome} autoFocus />
        <Field label="Categoria *" error={erros.categoria}>
          <select id="categoria" value={form.categoria} onChange={set('categoria')}>
            <option value="">Selecione...</option>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <div className="form-row">
          <Field label={edicao ? 'Quantidade' : 'Quantidade inicial'} id="quantidade" type="number" min="0" value={form.quantidade}
            onChange={set('quantidade')} disabled={edicao} hint={edicao ? 'Altere via movimentação' : undefined} error={erros.quantidade} />
          <Field label="Estoque mínimo *" id="estoque_minimo" type="number" min="0" value={form.estoque_minimo} onChange={set('estoque_minimo')} error={erros.estoque_minimo} />
        </div>
        <Field label="Preço unitário (R$) *" id="preco" type="number" min="0" step="0.01" value={form.preco} onChange={set('preco')} error={erros.preco} />
        {critico && (
          <div className="alert alert--danger"><AlertTriangle size={16} /><span>Produto no estoque mínimo ou abaixo. Faltam <b>{Math.max(0, Number(form.estoque_minimo) - produto.quantidade)} un.</b> para o mínimo.</span></div>
        )}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
