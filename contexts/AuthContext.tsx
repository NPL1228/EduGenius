'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    username: string;
    email?: string;
    fullName?: string;
    isGuest: boolean;
}

interface RegisteredUser {
    email: string;
    username: string;
    fullName: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => boolean;
    register: (email: string, fullName: string, password: string) => { success: boolean; error?: string };
    loginAsGuest: (guestName: string) => void;
    logout: () => void;
    updateProfile: (data: { username?: string; fullName?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_CREDENTIALS = {
    username: 'user123',
    password: 'user123'
};

const REGISTERED_USERS_KEY = 'registeredUsers';

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

    const getRegisteredUsers = (): RegisteredUser[] => {
        const users = localStorage.getItem(REGISTERED_USERS_KEY);
        return users ? JSON.parse(users) : [];
    };

    const register = (email: string, fullName: string, password: string): { success: boolean; error?: string } => {
        const registeredUsers = getRegisteredUsers();

        // Check if email already exists
        if (registeredUsers.some(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }

        // Add new user
        const newUser: RegisteredUser = {
            email,
            username: email, // Use email as username
            fullName,
            password
        };

        registeredUsers.push(newUser);
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));

        // Auto-login after registration
        const loggedInUser: User = {
            username: fullName,
            email,
            fullName,
            isGuest: false
        };
        setUser(loggedInUser);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        return { success: true };
    };

    const login = (username: string, password: string): boolean => {
        // First check registered users
        const registeredUsers = getRegisteredUsers();
        const foundUser = registeredUsers.find(
            u => (u.email === username || u.username === username) && u.password === password
        );

        if (foundUser) {
            const newUser: User = {
                username: foundUser.fullName,
                email: foundUser.email,
                fullName: foundUser.fullName,
                isGuest: false
            };
            setUser(newUser);
            setIsLoggedIn(true);
            localStorage.setItem('user', JSON.stringify(newUser));
            return true;
        }

        // Fall back to demo credentials
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

    const updateProfile = (data: { username?: string; fullName?: string }) => {
        if (!user) return;

        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // If registered user, update the registered list too
        if (!user.isGuest && user.email) {
            const registeredUsers = getRegisteredUsers();
            const index = registeredUsers.findIndex(u => u.email === user.email);
            if (index !== -1) {
                if (data.username) registeredUsers[index].username = data.username;
                if (data.fullName) registeredUsers[index].fullName = data.fullName;
                localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, register, loginAsGuest, logout, updateProfile }}>
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
