import api from "./api";

const dashboardService = {
  async getDashboardSummary() {
    try {
      const response = await api.get("/dashboard/summary");
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getAccountBalance() {
    try {
      const response = await api.get("/dashboard/balance");
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getRecentTransactions(limit = 10) {
    try {
      const response = await api.get("/dashboard/recent-transactions", {
        params: { limit },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getInvestments() {
    try {
      const response = await api.get("/investments");
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getCreditCards() {
    try {
      const response = await api.get("/user/cards");
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
