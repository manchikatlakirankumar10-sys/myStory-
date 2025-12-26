import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    token: string | null;
    role: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }

        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [token, role]);

    const login = (newToken: string, newRole: string) => {
        setToken(newToken);
        setRole(newRole);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            role,
            login,
            logout,
            isAuthenticated: !!token,
            isAdmin: role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
