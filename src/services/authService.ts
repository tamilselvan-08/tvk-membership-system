export const authService = {
  login: async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === "admin@tvk.in" && password === "admin123") {
      // In the future, this will return a JWT from Spring Boot backend
      const token = "mock-jwt-token-xyz-123";
      if (typeof window !== 'undefined') {
        localStorage.setItem("tvk_token", token);
      }
      return { success: true, token };
    }
    
    return { success: false, error: "Invalid credentials" };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("tvk_token");
    }
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem("tvk_token");
    }
    return false;
  }
};
