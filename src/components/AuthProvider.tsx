"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check initial auth state
    const authStatus = authService.isAuthenticated();
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Protect admin routes
    if (!isLoading) {
      if (pathname.startsWith("/admin") && !isAuthenticated) {
        router.push("/login");
      }
      if (pathname === "/login" && isAuthenticated) {
        router.push("/admin");
      }
    }
  }, [pathname, isAuthenticated, isLoading, router]);

  const login = (token: string) => {
    setIsAuthenticated(true);
    router.push("/admin");
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    router.push("/login");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A0019]"></div></div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
