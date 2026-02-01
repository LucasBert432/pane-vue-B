import api from "./api";

const authService = {
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
      return response;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      return response;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await api.post("/auth/logout");
      return response;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  },

  async verifyToken() {
    try {
      const response = await api.get("/auth/verify");
      return response;
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      throw error;
    }
  },

  setAuthData(data) {
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  },

  getAuthData() {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");

    return {
      token,
      user: userStr ? JSON.parse(userStr) : null,
    };
  },

  clearAuthData() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  isAuthenticated() {
    const { token, user } = this.getAuthData();
    return !!(token && user);
  },
};

export default authService;
