import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('smartstock_usuario')); } catch { return null; }
  });

  async function login(email, senha) {
    const { token, usuario } = await api.login(email, senha);
    localStorage.setItem('smartstock_token', token);
    localStorage.setItem('smartstock_usuario', JSON.stringify(usuario));
    setUsuario(usuario);
  }

  function logout() {
    localStorage.removeItem('smartstock_token');
    localStorage.removeItem('smartstock_usuario');
    setUsuario(null);
  }

  return <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
