import { createContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, isLoading, login, logout } = useAuth();
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
