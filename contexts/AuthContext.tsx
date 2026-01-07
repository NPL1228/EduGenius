'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    username: string;
    isGuest: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => boolean;
    loginAsGuest: (guestName: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_CREDENTIALS = {
    username: 'user123',
    password: 'user123'
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
        }
    }, []);

    const login = (username: string, password: string): boolean => {
        // Check demo credentials
        if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
            const newUser: User = {
                username: username,
                isGuest: false
            };
            setUser(newUser);
            setIsLoggedIn(true);
            localStorage.setItem('user', JSON.stringify(newUser));
            return true;
        }
        return false;
    };

    const loginAsGuest = (guestName: string) => {
        const newUser: User = {
            username: guestName,
            isGuest: true
        };
        setUser(newUser);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, loginAsGuest, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
