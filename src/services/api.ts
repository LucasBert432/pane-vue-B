import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { useToast } from "@/composables/useToast";
import router from "@/router";

interface ApiError {
  status: number;
  message: string;
  code: string;
  data?: any;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.data,
    );

    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const toast = useToast();

    if (error.response) {
      const { status, data } = error.response as {
        status: number;
        data: any;
      };

      if (status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");

        const currentPath = router.currentRoute.value.path;

        if (currentPath !== "/" && currentPath !== "/login") {
          toast.error("Sessão expirada", "Faça login novamente para continuar");

          router.push("/login");
        }
      }

      if (status === 500) {
        toast.error(
          "Erro no servidor",
          "Ocorreu um erro interno. Tente novamente mais tarde.",
        );
      }

      if (status === 503) {
        toast.error(
          "Serviço indisponível",
          "O serviço está temporariamente indisponível.",
        );
      }

      const apiError: ApiError = {
        status,
        message: data?.error?.message || data?.message || "Erro no servidor",
        code: data?.error?.code || "SERVER_ERROR",
        data,
      };

      return Promise.reject(apiError);
    }

    if (error.request) {
      toast.error(
        "Conexão perdida",
        "Não foi possível conectar ao servidor. Verifique sua internet.",
      );

      const apiError: ApiError = {
        status: 503,
        message: "Serviço indisponível. Verifique se o BFF está rodando.",
        code: "SERVICE_UNAVAILABLE",
      };

      return Promise.reject(apiError);
    }

    toast.error(
      "Erro na requisição",
      "Ocorreu um erro ao processar sua solicitação.",
    );

    const apiError: ApiError = {
      status: 500,
      message: error.message,
      code: "REQUEST_ERROR",
    };

    return Promise.reject(apiError);
  },
);

export default api;
