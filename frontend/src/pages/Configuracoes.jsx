import { useState } from 'react';
import { Save, UserPlus, Workflow, Bot } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import Badge from '../components/ui/Badge';
import Switch from '../components/ui/Switch';
import { useTheme } from '../context/ThemeContext';
import { useStock } from '../context/StockContext';

const ABAS = ['Geral', 'Usuários', 'Notificações', 'Integrações'];
const USUARIOS = [
  { nome: 'Ryan Medeiros', email: 'ryan@smartstock.com', perfil: 'Administrador' },
  { nome: 'Ana Souza', email: 'ana@smartstock.com', perfil: 'Gestor' },
  { nome: 'Carlos Lima', email: 'carlos@smartstock.com', perfil: 'Operador' },
];

export default function Configuracoes() {
  const { tema, alternar } = useTheme();
  const { avisar } = useStock();
  const [aba, setAba] = useState('Geral');
  const [empresa, setEmpresa] = useState({ nome: 'Tech Distribuidora Ltda.', cnpj: '12.345.678/0001-90', email: 'contato@techdistribuidora.com.br' });
  const [notif, setNotif] = useState({ minimo: true, email: true, whatsapp: false, diario: true });

  const salvar = () => avisar('Configurações salvas');

  return (
    <>
      <div className="tabs">
        {ABAS.map((a) => <button key={a} className={aba === a ? 'on' : ''} onClick={() => setAba(a)}>{a}</button>)}
      </div>

      {aba === 'Geral' && (
        <div className="grid grid-2">
          <Card title="Dados da empresa">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Razão social" value={empresa.nome} onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })} />
              <div className="form-row">
                <Field label="CNPJ" value={empresa.cnpj} onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })} />
                <Field label="Moeda"><select defaultValue="BRL"><option value="BRL">Real (R$)</option></select></Field>
              </div>
              <Field label="E-mail de contato" type="email" value={empresa.email} onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })} />
            </div>
          </Card>
          <Card title="Aparência">
            <div className="setting">
              <div><b>Tema escuro</b><small>Alterna entre o tema claro e escuro</small></div>
              <Switch checked={tema === 'dark'} onChange={alternar} label="Tema escuro" />
            </div>
            <div className="setting">
              <div><b>Idioma</b><small>Português (Brasil)</small></div>
              <Badge>pt-BR</Badge>
            </div>
          </Card>
        </div>
      )}

      {aba === 'Usuários' && (
        <Card title="Usuários" actions={<Button variant="primary" size="sm" icon={UserPlus} onClick={() => avisar('Convite enviado (simulação)')}>Convidar</Button>}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th></tr></thead>
              <tbody>
                {USUARIOS.map((u) => (
                  <tr key={u.email}><td><b>{u.nome}</b></td><td>{u.email}</td><td><Badge>{u.perfil}</Badge></td><td><Badge color="success">Ativo</Badge></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {aba === 'Notificações' && (
        <Card title="Alertas e notificações">
          {[
            ['minimo', 'Alerta de estoque mínimo', 'Avisar quando quantidade ≤ mínimo'],
            ['email', 'Notificar por e-mail', 'gestor@smartstock.com'],
            ['whatsapp', 'Notificar por WhatsApp', 'Via automação N8N (Dia 9)'],
            ['diario', 'Relatório diário automático', 'Todos os dias às 08:00'],
          ].map(([k, t, d]) => (
            <div className="setting" key={k}>
              <div><b>{t}</b><small>{d}</small></div>
              <Switch checked={notif[k]} onChange={(v) => setNotif({ ...notif, [k]: v })} label={t} />
            </div>
          ))}
        </Card>
      )}

      {aba === 'Integrações' && (
        <Card title="Integrações" actions={<Badge color="warning">Dia 9</Badge>}>
          <div className="setting"><div><b style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Workflow size={16} /> N8N</b><small>Webhook para alertas e relatórios automáticos</small></div><Badge color="warning">Pendente</Badge></div>
          <div className="setting"><div><b style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Bot size={16} /> Agente de IA (Claude)</b><small>Consultas ao estoque em linguagem natural</small></div><Badge color="warning">Pendente</Badge></div>
        </Card>
      )}

      <div><Button variant="primary" icon={Save} onClick={salvar}>Salvar configurações</Button></div>
    </>
  );
}
