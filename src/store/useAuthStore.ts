import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { AxiosResponse } from "axios";
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
  token?: string;
  hasAdvisor: boolean;
  advisorName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ApiSuccessResponse {
  success: true;
  data: AuthResponse;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

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
  const isLoading = ref<boolean>(false);

  const { error: showError } = useToast();

  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    try {
      error.value = null;
      isLoading.value = true;

      const response: AxiosResponse<ApiResponse> = await axios.post(
        "/api/auth/login",
        credentials,
      );

      const apiResponse = response.data;

      if (!apiResponse.success) {
        const errorMessage = apiResponse.error.message || "Erro ao fazer login";
        error.value = errorMessage;
        showError("Erro no login", errorMessage);
        return { success: false, error: errorMessage };
      }

      if (apiResponse.success && apiResponse.data) {
        const { user: userData, token: userToken } = apiResponse.data;

        user.value = userData;
        token.value = userToken;

        localStorage.setItem("auth_token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));

        return {
          success: true,
          data: apiResponse.data,
        };
      }

      const fallbackError = "Estrutura de resposta inválida";
      error.value = fallbackError;
      showError("Erro no login", fallbackError);
      return { success: false, error: fallbackError };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Erro ao fazer login";

      error.value = errorMessage;
      showError("Erro no login", errorMessage);

      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    userData: RegisterData,
  ): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    try {
      error.value = null;

      const response: AxiosResponse<ApiResponse> = await axios.post(
        "/api/auth/register",
        userData,
      );

      const apiResponse = response.data;

      if (!apiResponse.success) {
        const errorMessage =
          apiResponse.error.message || "Erro ao realizar cadastro";
        error.value = errorMessage;
        showError("Erro no cadastro", errorMessage);
        return { success: false, error: errorMessage };
      }

      if (apiResponse.success && apiResponse.data) {
        const { user: registeredUser, token: userToken } = apiResponse.data;

        user.value = registeredUser;
        token.value = userToken;

        localStorage.setItem("auth_token", userToken);
        localStorage.setItem("user", JSON.stringify(registeredUser));

        return {
          success: true,
          data: apiResponse.data,
        };
      }

      const fallbackError = "Estrutura de resposta inválida";
      error.value = fallbackError;
      showError("Erro no cadastro", fallbackError);
      return { success: false, error: fallbackError };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Erro ao realizar cadastro";

      error.value = errorMessage;
      showError("Erro no cadastro", errorMessage);

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    axios.post("/api/auth/logout").catch(console.error);
  };

  const verifyToken = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) return false;

    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(
        "/api/auth/verify",
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data?.user) {
        user.value = apiResponse.data.user;
        token.value = storedToken;
        return true;
      }

      logout();
      return false;
    } catch (err) {
      logout();
      return false;
    }
  };

  const initializeFromStorage = () => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        logout();
      }
    }
  };

  return {
    user,
    token,
    error,
    login,
    register,
    logout,
    verifyToken,
    initializeFromStorage,
    isLoading,
  };
});
