
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

// Types for our users
export interface User {
  id: string;
  username: string;
  email: string;
}

// Types for auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from a backend
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "shin",
    email: "shin@1027",
  }
];

// Create the Auth provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in via localStorage
    const storedUser = localStorage.getItem("sleepitron_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("sleepitron_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would validate against a backend
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (foundUser && password === "0618") {
        setUser(foundUser);
        localStorage.setItem("sleepitron_user", JSON.stringify(foundUser));
        toast.success("登入成功");
      } else {
        toast.error("登入失敗，請檢查帳號密碼");
        throw new Error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would create a user in the backend
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email,
      };

      // For demo purposes, we'll just log in the user
      setUser(newUser);
      localStorage.setItem("sleepitron_user", JSON.stringify(newUser));
      toast.success("帳號創建成功");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sleepitron_user");
    toast.success("已登出");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
