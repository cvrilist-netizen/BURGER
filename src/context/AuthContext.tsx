import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { UserAppRole } from '../types';
import { loginWithGoogle, logoutUser, getUserRole, onAuthListener } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserAppRole;
  loading: boolean;
  isAdmin: boolean;
  isCook: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserAppRole>('customer');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRole = async (currentUser: User | null) => {
    try {
      const currentRole = await getUserRole(currentUser);
      setRole(currentRole);
    } catch {
      setRole('customer');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthListener(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchRole(currentUser);
      } else {
        setRole('customer');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const loggedUser = await loginWithGoogle();
      await fetchRole(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setRole('customer');
  };

  const refreshRole = async () => {
    if (user) {
      await fetchRole(user);
    }
  };

  const isAdmin = role === 'admin';
  const isCook = role === 'cook' || role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAdmin,
        isCook,
        login,
        logout,
        refreshRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
