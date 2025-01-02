// src/context/AuthContext.tsx

"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { postData, getData } from "@/core/api/apiHandler";
import { useRouter } from "next/navigation";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextProps extends AuthState {
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

interface LoginData {
  email: string;
  password: string;
  role: string;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  loading: true, // Initial loading state
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true, // Start with loading set to true
  });

  const router = useRouter();

  // Function to handle login
  const login = async (data: LoginData) => {
    try {
      const response = await postData("/login", data); // Unified login route

      if (response.data.success) {
        const userResponse = await getData("/verify-token");
        if (userResponse.data.success) {
          setAuth({
            isAuthenticated: true,
            user: userResponse.data.user,
            loading: false,
          });
          // Redirection handled in LoginComponent
        } else {
          throw new Error("Failed to retrieve user data");
        }
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setAuth((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      // Clear authentication state
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false,
      });

      // Remove the token from localStorage
      localStorage.removeItem("currentUserToken");

      // Redirect to the login page or another route
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getData("/verify-token");

        if (response && response.data.success) {
          setAuth({
            isAuthenticated: true,
            user: response.data.user,
            loading: false,
          });
        } else {
          setAuth({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
          // Do not redirect here
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuth({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
        // Do not redirect here
      }
    };

    checkAuth();
  }, []); // Empty dependency array to run only once on mount

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
