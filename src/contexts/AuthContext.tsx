import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, employeeId?: string, department?: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendOTP: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  });

  // Mock user data - In real app, this would be from a backend
  const mockUsers: (User & { password: string })[] = [
    {
      id: '1',
      email: 'admin@company.com',
      name: 'Admin User',
      role: 'admin',
      password: 'admin123',
    },
    {
      id: '2',
      email: 'john.doe@company.com',
      name: 'John Doe',
      role: 'employee',
      employeeId: 'EMP001',
      department: 'Engineering',
      password: 'employee123',
    },
  ];

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setAuthState({
        user: userWithoutPassword,
        isLoading: false,
        isAuthenticated: true,
      });
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    name: string,
    employeeId?: string,
    department?: string
  ): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: email.includes('admin') ? 'admin' : 'employee',
      employeeId,
      department,
    };
    
    setAuthState({
      user: newUser,
      isLoading: false,
      isAuthenticated: true,
    });
    return true;
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock OTP verification (in real app, verify with backend)
    const isValid = otp === '123456';
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return isValid;
  }, []);

  const sendOTP = useCallback(async (email: string): Promise<boolean> => {
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`OTP sent to ${email}: 123456`);
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    verifyOTP,
    logout,
    sendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};