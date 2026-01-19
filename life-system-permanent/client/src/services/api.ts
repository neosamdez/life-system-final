import axios, { AxiosInstance } from "axios";

// 1. Definição da URL (Segura: Tenta a variável, se falhar usa o link direto)
const API_URL =
  import.meta.env.VITE_API_URL || "https://life-system-backend.onrender.com";

console.log("🔗 API conectada em:", API_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
}

// 👇 AQUI ESTAVA O ERRO: Adicionei '/api/v1' em todas as rotas para bater com o Backend

export const authService = {
  login: async (credentials: any): Promise<any> => {
    // Antes: /auth/login -> Agora: /api/v1/auth/login
    const response = await api.post("/api/v1/auth/login", credentials);
    return response.data;
  },
  register: async (userData: any): Promise<any> => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export const questService = {
  list: async (): Promise<any[]> => {
    const response = await api.get("/api/v1/quests");
    return response.data;
  },
  complete: async (questId: number): Promise<any> => {
    const response = await api.patch(`/api/v1/quests/${questId}/complete`);
    return response.data;
  },
  create: async (questData: any): Promise<any> => {
    const response = await api.post("/api/v1/quests", questData);
    return response.data;
  },
};

export const playerService = {
  getStats: async (): Promise<any> => {
    const response = await api.get("/api/v1/player/stats");
    return response.data;
  },
  updateStats: async (stats: any): Promise<any> => {
    const response = await api.patch("/api/v1/player/stats", stats);
    return response.data;
  },
};

export default api;
