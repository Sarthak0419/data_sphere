import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// User type matching backend schema
interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  profilePic?: string;
}

// Account with token for multi-account support
interface AccountSession {
  user: User;
  token: string;
}

// Auth context state shape
interface AuthContextType {
  user: User | null;
  accounts: AccountSession[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  logoutAccount: (userId: string) => void;
  switchAccount: (userId: string) => void;
  addAccount: () => void;
  updateProfilePic: (picUrl: string) => void;
  getTokenForAccount: (userId: string) => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000';

// Generate a random avatar URL based on user info
const generateProfilePic = (username: string): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=7494ec,5a7de0,4f46e5&backgroundType=gradientLinear`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<AccountSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing sessions on mount
  useEffect(() => {
    const storedAccounts = localStorage.getItem('accountSessions');
    const activeUserId = localStorage.getItem('activeUserId');
    
    if (storedAccounts) {
      const parsedAccounts: AccountSession[] = JSON.parse(storedAccounts).map((session: AccountSession) => ({
        ...session,
        user: {
          ...session.user,
          profilePic: session.user.profilePic || generateProfilePic(session.user.username)
        }
      }));
      setAccounts(parsedAccounts);
      
      // Set active user
      if (activeUserId) {
        const activeSession = parsedAccounts.find(s => s.user.id === activeUserId);
        if (activeSession) {
          setUser(activeSession.user);
        } else if (parsedAccounts.length > 0) {
          setUser(parsedAccounts[0].user);
          localStorage.setItem('activeUserId', parsedAccounts[0].user.id);
        }
      } else if (parsedAccounts.length > 0) {
        setUser(parsedAccounts[0].user);
        localStorage.setItem('activeUserId', parsedAccounts[0].user.id);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Save accounts to localStorage whenever they change
  const saveAccounts = (newAccounts: AccountSession[]) => {
    localStorage.setItem('accountSessions', JSON.stringify(newAccounts));
    setAccounts(newAccounts);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }

      const userWithPic: User = {
        ...data.user,
        profilePic: generateProfilePic(data.user.username)
      };

      const newSession: AccountSession = {
        user: userWithPic,
        token: data.token
      };

      // Update or add account session
      setAccounts(prev => {
        const existingIndex = prev.findIndex(s => s.user.id === userWithPic.id);
        let newAccounts: AccountSession[];
        
        if (existingIndex >= 0) {
          newAccounts = [...prev];
          newAccounts[existingIndex] = newSession;
        } else {
          newAccounts = [...prev, newSession];
        }
        
        saveAccounts(newAccounts);
        return newAccounts;
      });

      setUser(userWithPic);
      localStorage.setItem('activeUserId', userWithPic.id);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Registration failed' };
      }

      const userWithPic: User = {
        ...data.user,
        profilePic: generateProfilePic(data.user.username)
      };

      const newSession: AccountSession = {
        user: userWithPic,
        token: data.token
      };

      const newAccounts = [...accounts, newSession];
      saveAccounts(newAccounts);

      setUser(userWithPic);
      localStorage.setItem('activeUserId', userWithPic.id);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    if (!user) return;
    
    const newAccounts = accounts.filter(s => s.user.id !== user.id);
    saveAccounts(newAccounts);
    
    if (newAccounts.length > 0) {
      setUser(newAccounts[0].user);
      localStorage.setItem('activeUserId', newAccounts[0].user.id);
    } else {
      setUser(null);
      localStorage.removeItem('activeUserId');
    }
  };

  const logoutAccount = (userId: string) => {
    const newAccounts = accounts.filter(s => s.user.id !== userId);
    saveAccounts(newAccounts);
    
    if (user?.id === userId) {
      if (newAccounts.length > 0) {
        setUser(newAccounts[0].user);
        localStorage.setItem('activeUserId', newAccounts[0].user.id);
      } else {
        setUser(null);
        localStorage.removeItem('activeUserId');
      }
    }
  };

  const switchAccount = (userId: string) => {
    const session = accounts.find(s => s.user.id === userId);
    if (session) {
      setUser(session.user);
      localStorage.setItem('activeUserId', userId);
    }
  };

  const addAccount = () => {
    setUser(null);
    localStorage.removeItem('activeUserId');
  };

  const updateProfilePic = (picUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profilePic: picUrl };
      setUser(updatedUser);
      
      const newAccounts = accounts.map(session => 
        session.user.id === user.id 
          ? { ...session, user: updatedUser }
          : session
      );
      saveAccounts(newAccounts);
    }
  };

  const getTokenForAccount = (userId: string): string | null => {
    const session = accounts.find(s => s.user.id === userId);
    return session?.token || null;
  };

  const value: AuthContextType = {
    user,
    accounts,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    logoutAccount,
    switchAccount,
    addAccount,
    updateProfilePic,
    getTokenForAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
