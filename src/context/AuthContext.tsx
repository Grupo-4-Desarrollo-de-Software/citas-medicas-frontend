import { useEffect, useState, type ReactNode } from 'react';
import { authApi } from '../services/api';
import { AuthContext } from './AuthContextType';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return authApi.isAuthenticated();
  });

  const login = (token: string, user: { id: number; email: string; name?: string }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
  };

  // Verificar el estado de autenticación al montar el componente
  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
