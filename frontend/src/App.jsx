import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Movimentacoes from './pages/Movimentacoes';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';

function RotaPrivada({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { usuario } = useAuth();
  return (
    // HashRouter: funciona no GitHub Pages sem configuração extra de servidor
    <HashRouter>
      <Routes>
        <Route path="/login" element={usuario ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route element={<RotaPrivada><AppLayout /></RotaPrivada>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
        <Route path="*" element={<Navigate to={usuario ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </HashRouter>
  );
}
