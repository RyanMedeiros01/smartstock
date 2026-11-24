export const moeda = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const numero = (v) => Number(v || 0).toLocaleString('pt-BR');

export const dataHora = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export const data = (iso) => new Date(iso).toLocaleDateString('pt-BR');

// Regra de negócio RN03 (Atividade 6): crítico quando quantidade <= estoque_minimo
export function statusEstoque(p) {
  if (p.quantidade === 0) return { chave: 'zerado', rotulo: 'Zerado', cor: 'danger' };
  if (p.quantidade <= p.estoque_minimo) return { chave: 'critico', rotulo: 'Crítico', cor: 'danger' };
  if (p.quantidade <= p.estoque_minimo * 1.5) return { chave: 'atencao', rotulo: 'Atenção', cor: 'warning' };
  return { chave: 'normal', rotulo: 'Normal', cor: 'success' };
}

export const ehCritico = (p) => p.quantidade <= p.estoque_minimo;

export function exportarCSV(nome, linhas) {
  if (!linhas.length) return;
  const cab = Object.keys(linhas[0]);
  const csv = [cab.join(';'), ...linhas.map((l) => cab.map((c) => `"${String(l[c]).replace(/"/g, '""')}"`).join(';'))].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${nome}.csv` });
  a.click();
  URL.revokeObjectURL(a.href);
}
