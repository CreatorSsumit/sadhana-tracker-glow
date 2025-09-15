import { useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem('sadhna_auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('sadhna_users') || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (user && password === 'password') { // Simple password check for demo
      const authState = { isAuthenticated: true, user };
      setAuth(authState);
      localStorage.setItem('sadhna_auth', JSON.stringify(authState));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem('sadhna_auth');
  };

  const registerUser = (name: string, email: string): boolean => {
    const users = JSON.parse(localStorage.getItem('sadhna_users') || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('sadhna_users', JSON.stringify(users));
    return true;
  };

  // Initialize admin user if none exists
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('sadhna_users') || '[]');
    if (users.length === 0) {
      const adminUser: User = {
        id: 'admin1',
        name: 'Admin',
        email: 'admin@sadhna.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('sadhna_users', JSON.stringify([adminUser]));
    }
  }, []);

  return { auth, login, logout, registerUser };
};