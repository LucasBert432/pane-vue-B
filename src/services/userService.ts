import api from "./api";

export const userService = {
  async getProfile() {
    try {
      const response = await api.get("/user/profile");
      return response;
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(userData) {
    try {
      const response = await api.put("/user/profile", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getPreferences() {
    try {
      const response = await api.get("/user/preferences");
      return response;
    } catch (error) {
      console.error("Erro ao buscar preferências:", error);
      throw error;
    }
  },

  async updatePreferences(preferences) {
    try {
      const response = await api.put("/user/preferences", preferences);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
