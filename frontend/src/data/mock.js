// =============================================================
// Dados mockados (Atividade 7)
// Seguem exatamente o modelo do banco definido na Atividade 6:
//   produtos(id, nome, categoria, quantidade, estoque_minimo, preco, data_cadastro)
//   movimentacoes(id, produto_id, tipo, quantidade, data)
// Na Atividade 8 estes dados virão da API REST.
// =============================================================

export const CATEGORIAS = ['Eletrônicos', 'Periféricos', 'Acessórios', 'Escritório'];

export const usuarioMock = {
  nome: 'Ryan Medeiros',
  email: 'ryan@smartstock.com',
  perfil: 'Administrador',
};

export const produtosMock = [
  { id: 1, nome: 'Notebook Dell Inspiron 15', categoria: 'Eletrônicos', quantidade: 18, estoque_minimo: 5, preco: 3899.9, data_cadastro: '2026-10-02T09:14:00' },
  { id: 2, nome: 'Mouse sem fio Logitech M170', categoria: 'Periféricos', quantidade: 4, estoque_minimo: 10, preco: 79.9, data_cadastro: '2026-10-02T09:20:00' },
  { id: 3, nome: 'Teclado mecânico Redragon', categoria: 'Periféricos', quantidade: 22, estoque_minimo: 8, preco: 249.9, data_cadastro: '2026-10-05T14:02:00' },
  { id: 4, nome: 'Monitor LG 24" Full HD', categoria: 'Eletrônicos', quantidade: 3, estoque_minimo: 4, preco: 899.0, data_cadastro: '2026-10-11T10:30:00' },
  { id: 5, nome: 'Cabo HDMI 2m', categoria: 'Acessórios', quantidade: 120, estoque_minimo: 30, preco: 24.9, data_cadastro: '2026-10-15T08:45:00' },
  { id: 6, nome: 'Papel A4 Chamex (resma)', categoria: 'Escritório', quantidade: 12, estoque_minimo: 15, preco: 32.5, data_cadastro: '2026-10-20T16:10:00' },
  { id: 7, nome: 'Headset JBL Quantum 100', categoria: 'Periféricos', quantidade: 35, estoque_minimo: 10, preco: 189.9, data_cadastro: '2026-11-03T11:00:00' },
  { id: 8, nome: 'SSD Kingston 480GB', categoria: 'Eletrônicos', quantidade: 27, estoque_minimo: 8, preco: 229.0, data_cadastro: '2026-11-10T13:25:00' },
  { id: 9, nome: 'Webcam Logitech C920', categoria: 'Periféricos', quantidade: 9, estoque_minimo: 6, preco: 459.0, data_cadastro: '2026-11-12T09:40:00' },
  { id: 10, nome: 'Adaptador USB-C Hub 7 em 1', categoria: 'Acessórios', quantidade: 0, estoque_minimo: 5, preco: 149.9, data_cadastro: '2026-11-14T15:05:00' },
  { id: 11, nome: 'Grampeador Tilibra 26/6', categoria: 'Escritório', quantidade: 40, estoque_minimo: 10, preco: 29.9, data_cadastro: '2026-11-18T10:00:00' },
  { id: 12, nome: 'Roteador TP-Link Archer C6', categoria: 'Eletrônicos', quantidade: 14, estoque_minimo: 5, preco: 279.0, data_cadastro: '2026-11-20T17:30:00' },
];

const M = (id, produto_id, tipo, quantidade, data, usuario) => ({ id, produto_id, tipo, quantidade, data, usuario });

export const movimentacoesMock = [
  M(1032, 2, 'SAIDA', 6, '2026-11-24T13:42:00', 'Ana Souza'),
  M(1031, 5, 'ENTRADA', 150, '2026-11-24T10:15:00', 'Ryan Medeiros'),
  M(1030, 4, 'SAIDA', 2, '2026-11-23T17:08:00', 'Ana Souza'),
  M(1029, 1, 'SAIDA', 2, '2026-11-23T15:30:00', 'Carlos Lima'),
  M(1028, 1, 'ENTRADA', 20, '2026-11-23T09:02:00', 'Ryan Medeiros'),
  M(1027, 6, 'SAIDA', 8, '2026-11-22T16:45:00', 'Carlos Lima'),
  M(1026, 3, 'ENTRADA', 12, '2026-11-22T11:20:00', 'Ryan Medeiros'),
  M(1025, 7, 'SAIDA', 5, '2026-11-21T14:10:00', 'Ana Souza'),
  M(1024, 10, 'SAIDA', 5, '2026-11-20T10:00:00', 'Carlos Lima'),
  M(1023, 9, 'ENTRADA', 10, '2026-11-19T09:30:00', 'Ryan Medeiros'),
  M(1022, 8, 'SAIDA', 3, '2026-11-18T15:50:00', 'Ana Souza'),
  M(1021, 12, 'ENTRADA', 14, '2026-11-17T08:20:00', 'Ryan Medeiros'),
];

// Série mensal para o gráfico do dashboard
export const historicoMensal = [
  { mes: 'Jun', entradas: 410, saidas: 320 },
  { mes: 'Jul', entradas: 380, saidas: 350 },
  { mes: 'Ago', entradas: 520, saidas: 410 },
  { mes: 'Set', entradas: 470, saidas: 430 },
  { mes: 'Out', entradas: 590, saidas: 470 },
  { mes: 'Nov', entradas: 640, saidas: 520 },
];
