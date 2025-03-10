export const authService = {
  login: async (email: string, password: string) => {
    // Send login request
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (name: string, email: string, password: string, role: string) => {
    // Send registration request
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    return response.json();
  },

  getMe: async (token: string) => {
    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};
