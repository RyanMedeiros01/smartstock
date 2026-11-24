import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, Check, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';

const VANTAGENS = [
  'Dashboard com indicadores em tempo real',
  'Alertas automáticos de estoque mínimo',
  'Relatórios gerenciais em segundos',
  'Assistente de IA integrado (em breve)',
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'ryan@smartstock.com', senha: '' });
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErro('Informe um e-mail válido');
    if (form.senha.length < 4) return setErro('A senha deve ter pelo menos 4 caracteres');
    setCarregando(true);
    try {
      await login(form.email, form.senha);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login">
      <section className="login__hero">
        <div className="sidebar__logo" style={{ padding: 0 }}><span><Boxes size={19} /></span>SmartStock</div>
        <h2>Seu estoque sob controle,<br />com inteligência.</h2>
        <p>Controle produtos, movimentações e indicadores em um só lugar, com alertas automáticos de reposição.</p>
        <ul>
          {VANTAGENS.map((v) => <li key={v}><span><Check size={13} /></span>{v}</li>)}
        </ul>
      </section>

      <div className="login__form-wrap">
        <form className="login__form" onSubmit={entrar} noValidate>
          <h1>Bem-vindo de volta 👋</h1>
          <p>Entre com sua conta para acessar o painel.</p>

          <Field label="E-mail" id="email" type="email" autoComplete="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <Field label="Senha">
            <div className="pass-wrap">
              <input id="senha" type={verSenha ? 'text' : 'password'} placeholder="Digite sua senha" autoComplete="current-password"
                value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })}
                style={{ height: 42, border: '1px solid var(--input)', borderRadius: 8, padding: '0 12px', background: 'var(--surface)' }} />
              <button type="button" onClick={() => setVerSenha(!verSenha)} aria-label="Mostrar senha">
                {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          <div className="login__opts">
            <label><input type="checkbox" defaultChecked /> Lembrar de mim</label>
            <a href="#/login" onClick={(e) => e.preventDefault()}>Esqueci minha senha</a>
          </div>

          {erro && <div className="alert alert--danger">{erro}</div>}

          <Button variant="primary" block type="submit" disabled={carregando}>
            {carregando ? <Loader2 size={18} className="spin" /> : <LogIn size={18} />}
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12.5 }}>
            Ambiente de demonstração: use qualquer senha com 4+ caracteres.
          </p>
        </form>
      </div>
    </div>
  );
}
