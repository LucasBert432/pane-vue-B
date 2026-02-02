import { ref } from "vue";
import { defineStore } from "pinia";
import { apiClient } from "@/services/api";
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
  createdAt: string;
  hasAdvisor: boolean;
  advisorName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiSuccessResponse {
  success: true;
  data: AuthResponse;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface LoginCredentials {
  cpf: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  country: string;
  password: string;
  hasAdvisor?: boolean;
  advisorName?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const { error: showError } = useToast();

  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    try {
      isLoading.value = true;
      error.value = null;

      const apiResponse = await apiClient.post<ApiResponse>(
        "/auth/login",
        credentials,
      );

      if (!apiResponse.success) {
        const message = apiResponse.error.message;
        error.value = message;
        showError("Erro no login", message);
        return { success: false, error: message };
      }

      user.value = apiResponse.data.user;
      token.value = apiResponse.data.token;

      localStorage.setItem("auth_token", apiResponse.data.token);
      localStorage.setItem("user", JSON.stringify(apiResponse.data.user));

      return { success: true, data: apiResponse.data };
    } catch (err: any) {
      const message = err?.message || "Erro ao fazer login";

      error.value = message;
      showError("Erro no login", message);

      return { success: false, error: message };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (
    userData: RegisterData,
  ): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    try {
      isLoading.value = true;
      error.value = null;

      const apiResponse = await apiClient.post<ApiResponse>(
        "/auth/register",
        userData,
      );

      if (!apiResponse.success) {
        const message = apiResponse.error.message;
        error.value = message;
        showError("Erro no cadastro", message);
        return { success: false, error: message };
      }

      user.value = apiResponse.data.user;
      token.value = apiResponse.data.token;

      localStorage.setItem("auth_token", apiResponse.data.token);
      localStorage.setItem("user", JSON.stringify(apiResponse.data.user));

      return { success: true, data: apiResponse.data };
    } catch (err: any) {
      const message = err?.message || "Erro ao realizar cadastro";

      error.value = message;
      showError("Erro no cadastro", message);

      return { success: false, error: message };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
    } finally {
      user.value = null;
      token.value = null;
      error.value = null;

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  };

  const verifyToken = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) return false;

    try {
      const apiResponse = await apiClient.get<ApiResponse>("/auth/verify");

      if (apiResponse.success) {
        user.value = apiResponse.data.user;
        token.value = storedToken;
        return true;
      }

      await logout();
      return false;
    } catch {
      await logout();
      return false;
    }
  };

  const initializeFromStorage = () => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser) as User;
      } catch {
        logout();
      }
    }
  };

  return {
    user,
    token,
    error,
    isLoading,
    login,
    register,
    logout,
    verifyToken,
    initializeFromStorage,
  };
});
