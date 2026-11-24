import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem('smartstock_tema') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('smartstock_tema', tema);
  }, [tema]);

  const alternar = () => setTema((t) => (t === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{ tema, alternar }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
