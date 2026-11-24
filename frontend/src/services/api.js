// =============================================================
// Camada de serviço (API)
// -------------------------------------------------------------
// Hoje (Atividade 7) as funções devolvem dados mockados, com
// um pequeno atraso para simular a rede.
// Na Atividade 8 basta trocar USE_MOCK para false e configurar
// VITE_API_URL: as telas não precisam mudar.
// =============================================================
import { produtosMock, movimentacoesMock } from '../data/mock';

const USE_MOCK = true;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

async function http(path, options = {}) {
  const token = localStorage.getItem('smartstock_token');
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).mensagem || 'Erro na requisição');
  return res.status === 204 ? null : res.json();
}

export const api = {
  // POST /auth/login
  async login(email, senha) {
    if (!USE_MOCK) return http('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
    await delay(600);
    if (!email || senha.length < 4) throw new Error('E-mail ou senha inválidos');
    return { token: 'mock-jwt-token', usuario: { nome: 'Ryan Medeiros', email, perfil: 'Administrador' } };
  },

  // GET /produtos
  async listarProdutos() {
    if (!USE_MOCK) return http('/produtos');
    await delay();
    return structuredClone(produtosMock);
  },
  // POST /produtos
  async criarProduto(dados) {
    if (!USE_MOCK) return http('/produtos', { method: 'POST', body: JSON.stringify(dados) });
    await delay();
    return { ...dados, id: Date.now(), data_cadastro: new Date().toISOString() };
  },
  // PUT /produtos/:id
  async atualizarProduto(id, dados) {
    if (!USE_MOCK) return http(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
    await delay();
    return { ...dados, id };
  },
  // DELETE /produtos/:id
  async excluirProduto(id) {
    if (!USE_MOCK) return http(`/produtos/${id}`, { method: 'DELETE' });
    await delay();
    return null;
  },

  // GET /movimentacoes
  async listarMovimentacoes() {
    if (!USE_MOCK) return http('/movimentacoes');
    await delay();
    return structuredClone(movimentacoesMock);
  },
  // POST /movimentacoes
  async registrarMovimentacao(dados) {
    if (!USE_MOCK) return http('/movimentacoes', { method: 'POST', body: JSON.stringify(dados) });
    await delay();
    return { ...dados, id: Date.now(), data: new Date().toISOString() };
  },
};
