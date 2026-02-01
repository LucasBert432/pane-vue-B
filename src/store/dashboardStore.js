import { defineStore } from "pinia";
import dashboardService from "@/services/dashboardService";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    dashboardData: null,
    balanceData: null,
    recentTransactions: [],
    investments: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    totalBalance: (state) => state.dashboardData?.totalBalance || 0,
    availableBalance: (state) => state.balanceData?.checking?.available || 0,
    hasNotifications: (state) => state.dashboardData?.notifications > 0,
    notificationCount: (state) => state.dashboardData?.notifications || 0,
  },

  actions: {
    async fetchDashboardData() {
      this.isLoading = true;
      this.error = null;

      try {
        const [summary, balance, transactions] = await Promise.all([
          dashboardService.getDashboardSummary(),
          dashboardService.getAccountBalance(),
          dashboardService.getRecentTransactions(),
        ]);

        this.dashboardData = summary.data;
        this.balanceData = balance.data;
        this.recentTransactions = transactions.data;
      } catch (error) {
        this.error = error.message;
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchInvestments() {
      try {
        const response = await dashboardService.getInvestments();
        this.investments = response.data;
      } catch (error) {
        console.error("Erro ao carregar investimentos:", error);
      }
    },

    async fetchCreditCards() {
      try {
        const response = await dashboardService.getCreditCards();
        return response.data;
      } catch (error) {
        console.error("Erro ao carregar cartões:", error);
        return [];
      }
    },

    clearData() {
      this.dashboardData = null;
      this.balanceData = null;
      this.recentTransactions = [];
      this.investments = [];
    },
  },
});
