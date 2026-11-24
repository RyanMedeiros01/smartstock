import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStock } from '../../context/StockContext';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ title, onMenu }) {
  const { usuario } = useAuth();
  const { indicadores } = useStock();
  const { tema, alternar } = useTheme();
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();
  const iniciais = usuario?.nome?.split(' ').map((p) => p[0]).slice(0, 2).join('') ?? 'U';

  function buscar(e) {
    e.preventDefault();
    navigate(`/produtos?busca=${encodeURIComponent(busca)}`);
  }

  return (
    <header className="topbar">
      <button className="icon-btn topbar__menu" onClick={onMenu} aria-label="Abrir menu"><Menu size={18} /></button>
      <h1>{title}</h1>
      <form className="topbar__search" onSubmit={buscar}>
        <Search size={16} />
        <input placeholder="Buscar produtos..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </form>
      <button className="icon-btn" onClick={alternar} aria-label="Alternar tema" title="Tema claro/escuro" style={{ marginLeft: 'auto' }}>
        {tema === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
      <button className="icon-btn" aria-label="Alertas de reposição" title="Alertas de reposição" onClick={() => navigate('/relatorios?tipo=criticos')}>
        <Bell size={18} />
        {indicadores.criticos.length > 0 && <span className="count">{indicadores.criticos.length}</span>}
      </button>
      <div className="user">
        <span className="avatar">{iniciais}</span>
        <div><b>{usuario?.nome}</b><small>{usuario?.perfil}</small></div>
      </div>
    </header>
  );
}
