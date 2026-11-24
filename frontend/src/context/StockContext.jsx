import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../services/api';
import { ehCritico } from '../utils/format';

const StockContext = createContext(null);

// Estado global do estoque: produtos, movimentações e ações (CRUD + entrada/saída).
export function StockProvider({ children }) {
  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all([api.listarProdutos(), api.listarMovimentacoes()]).then(([p, m]) => {
      setProdutos(p);
      setMovimentacoes(m);
      setCarregando(false);
    });
  }, []);

  const avisar = useCallback((mensagem, tipo = 'success') => {
    setToast({ mensagem, tipo, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  async function salvarProduto(dados) {
    if (dados.id) {
      const atualizado = await api.atualizarProduto(dados.id, dados);
      setProdutos((ps) => ps.map((p) => (p.id === dados.id ? { ...p, ...atualizado } : p)));
      avisar('Produto atualizado com sucesso');
    } else {
      const novo = await api.criarProduto(dados);
      setProdutos((ps) => [novo, ...ps]);
      avisar('Produto cadastrado com sucesso');
    }
  }

  async function excluirProduto(id) {
    // RN04: produto com movimentações não pode ser excluído
    if (movimentacoes.some((m) => m.produto_id === id)) {
      avisar('Este produto possui movimentações e não pode ser excluído', 'error');
      return false;
    }
    await api.excluirProduto(id);
    setProdutos((ps) => ps.filter((p) => p.id !== id));
    avisar('Produto excluído');
    return true;
  }

  async function registrarMovimentacao({ produto_id, tipo, quantidade, observacao }) {
    const produto = produtos.find((p) => p.id === produto_id);
    if (!produto) throw new Error('Selecione um produto');
    if (quantidade <= 0) throw new Error('A quantidade deve ser maior que zero'); // RN05
    if (tipo === 'SAIDA' && quantidade > produto.quantidade) // RN01
      throw new Error(`Saldo insuficiente: há apenas ${produto.quantidade} un.`);

    const mov = await api.registrarMovimentacao({ produto_id, tipo, quantidade, observacao, usuario: 'Ryan Medeiros' });
    const novoSaldo = produto.quantidade + (tipo === 'ENTRADA' ? quantidade : -quantidade);
    setMovimentacoes((ms) => [mov, ...ms]);
    setProdutos((ps) => ps.map((p) => (p.id === produto_id ? { ...p, quantidade: novoSaldo } : p)));

    if (novoSaldo <= produto.estoque_minimo) avisar(`Alerta: ${produto.nome} ficou abaixo do mínimo`, 'warning');
    else avisar(tipo === 'ENTRADA' ? 'Entrada registrada' : 'Saída registrada');
  }

  const indicadores = useMemo(() => {
    const criticos = produtos.filter(ehCritico);
    return {
      totalProdutos: produtos.length,
      totalUnidades: produtos.reduce((s, p) => s + p.quantidade, 0),
      valorEstoque: produtos.reduce((s, p) => s + p.quantidade * p.preco, 0),
      criticos,
      entradas: movimentacoes.filter((m) => m.tipo === 'ENTRADA').reduce((s, m) => s + m.quantidade, 0),
      saidas: movimentacoes.filter((m) => m.tipo === 'SAIDA').reduce((s, m) => s + m.quantidade, 0),
    };
  }, [produtos, movimentacoes]);

  const nomeProduto = useCallback((id) => produtos.find((p) => p.id === id)?.nome ?? 'Produto removido', [produtos]);

  return (
    <StockContext.Provider
      value={{ produtos, movimentacoes, carregando, indicadores, salvarProduto, excluirProduto, registrarMovimentacao, nomeProduto, toast, avisar }}
    >
      {children}
    </StockContext.Provider>
  );
}

export const useStock = () => useContext(StockContext);
