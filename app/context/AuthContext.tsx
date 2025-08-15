'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define types for the decoded JWT token and user object
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: {}) => void;
  logout: () => void;
}

// Define the types for the props, including the children prop
interface AuthProviderProps {
  children: ReactNode;  // Specify that children will be of type ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  }, []);

  const login = (user: any) => {
    setUser(user)
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
