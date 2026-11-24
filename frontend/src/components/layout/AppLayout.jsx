import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { MENU } from './Sidebar';
import Topbar from './Topbar';
import Toast from '../ui/Toast';

export default function AppLayout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenuAberto(false), [pathname]); // fecha o menu mobile ao trocar de página
  const titulo = MENU.find((m) => pathname.startsWith(m.to))?.label ?? 'SmartStock';
  const tituloCompleto = { Produtos: 'Gestão de Produtos', Movimentações: 'Movimentação de Estoque' }[titulo] ?? titulo;

  return (
    <div className="app">
      <Sidebar open={menuAberto} onClose={() => setMenuAberto(false)} />
      <div className="main">
        <Topbar title={tituloCompleto} onMenu={() => setMenuAberto(true)} />
        <main className="content" key={pathname}>
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
}
