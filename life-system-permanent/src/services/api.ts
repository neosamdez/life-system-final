import axios, { AxiosInstance } from 'axios';

// Definição da URL base (Next.js Standard)
// Fallback seguro para evitar undefined
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

console.log('🔗 API conectada em:', API_URL);

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
    (config) => {
        // No Next.js (client-side), localStorage funciona igual
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Serviços de Autenticação
export const authService = {
    login: async (credentials: any): Promise<any> => {
        // Rota corrigida: /api/v1/auth/login (Backend foi ajustado para evitar /auth/auth)
        const response = await api.post('/api/v1/auth/login', credentials);
        return response.data;
    },
    register: async (userData: any): Promise<any> => {
        const response = await api.post('/api/v1/auth/register', userData);
        return response.data;
    },
    getMe: async (): Promise<any> => {
        const response = await api.get('/api/v1/auth/me');
        return response.data;
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
};

// Serviços de Quests
export const questService = {
    list: async (): Promise<any[]> => {
        const response = await api.get('/api/v1/quests');
        return response.data;
    },
    complete: async (questId: number): Promise<any> => {
        const response = await api.patch(`/api/v1/quests/${questId}/complete`);
        return response.data;
    },
    create: async (questData: any): Promise<any> => {
        const response = await api.post('/api/v1/quests', questData);
        return response.data;
    },
};

// Serviços do Jogador
export const playerService = {
    getStats: async (): Promise<any> => {
        const response = await api.get('/api/v1/player/stats');
        return response.data;
    },
    updateStats: async (stats: any): Promise<any> => {
        const response = await api.patch('/api/v1/player/stats', stats);
        return response.data;
    },
};

export default api;
