import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowLeftRight, FileBarChart, Settings, LogOut, Boxes, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MENU = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
  { to: '/relatorios', label: 'Relatórios', icon: FileBarChart },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  return (
    <>
      <div className={`backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar__logo"><span><Boxes size={19} /></span>SmartStock</div>
        <nav className="sidebar__nav">
          {MENU.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="sidebar__link" onClick={onClose}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <button className="sidebar__link" style={{ border: 0, background: 'none', cursor: 'pointer' }} onClick={logout}>
            <LogOut size={18} /> Sair
          </button>
        </nav>
        <div className="sidebar__ai">
          <b><Bot size={15} /> Assistente IA</b>
          Pergunte sobre seu estoque em linguagem natural.
          <br /><em>Em breve · Dia 9</em>
        </div>
      </aside>
    </>
  );
}
