import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import { useToast } from "@/composables/useToast";

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  country: string;
  accountNumber: string;
  branch: string;
  clientSince: string;
  tier: string;
  hasAdvisor?: boolean;
  advisorName?: string;
  createdAt?: string;
  token?: string;
}

export interface LoginCredentials {
  cpf: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  email: string;
  phone: string;
  country: string;
  hasAdvisor?: boolean;
  advisorName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { error: showError } = useToast();

  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.name || "Usuário");
  const userAccount = computed(() => user.value?.accountNumber || "00000000-0");
  const userInitials = computed(() => {
    const name = user.value?.name || "Usuário";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  });

  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        credentials,
      );

      if (response.success && response.data) {
        user.value = response.data.user;
        token.value = response.data.token;

        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return { success: true, data: response.data };
      } else {
        error.value = response.message || "Erro ao fazer login";

        showError("Erro no login", error.value);

        return { success: false, error: error.value };
      }
    } catch (err: any) {
      console.error("Login store error:", err);
      error.value = err.message || "Erro ao fazer login";

      showError("Erro no login", error.value);

      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (
    userData: RegisterData,
  ): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        userData,
      );

      if (response.success && response.data) {
        user.value = response.data.user;
        token.value = response.data.token;

        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return { success: true, data: response.data };
      } else {
        error.value = response.message || "Erro ao realizar cadastro";

        showError("Erro no cadastro", error.value);

        return { success: false, error: error.value };
      }
    } catch (err: any) {
      console.error("Register store error:", err);
      error.value = err.message || "Erro ao realizar cadastro";

      showError("Erro no cadastro", error.value);

      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
      showError("Erro no logout", "Não foi possível fazer logout");
    } finally {
      clearAuth();
    }
  };

  const loadFromStorage = (): void => {
    try {
      const storedToken = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("user");

      if (storedToken && userStr) {
        token.value = storedToken;
        user.value = JSON.parse(userStr);
        console.log("Loaded from storage:", user.value?.name);
      }
    } catch (err) {
      console.error("Error loading from storage:", err);
      clearAuth();
    }
  };

  const clearAuth = (): void => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    userName,
    userAccount,
    userInitials,
    login,
    register,
    logout,
    loadFromStorage,
    clearAuth,
  };
});
