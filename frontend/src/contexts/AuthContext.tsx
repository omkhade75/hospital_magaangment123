import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/services/api';

interface User {
  id: number;
  email: string;
  role: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null, error: any }>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ user: User | null, error: any }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = api.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.get('/api/auth/me');
        setUser(userData);
      } catch (err) {
        api.clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post('/api/auth/login', { email, password });
      api.setToken(data.token);
      setUser(data.user);
      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role = 'patient') => {
    try {
      const data = await api.post('/api/auth/register', { email, password, fullName, role });
      api.setToken(data.token);
      setUser(data.user);
      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err };
    }
  };

  const signOut = () => {
    api.clearToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
