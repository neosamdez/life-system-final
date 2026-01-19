import axios, { AxiosInstance } from 'axios';

// Definição da URL base (Vite Standard)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configuração da instância Axios
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Tipos básicos de resposta
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    [key: string]: any;
}

// Serviços de Autenticação
export const authService = {
    login: async (credentials: any): Promise<any> => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData: any): Promise<any> => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

// Serviços de Quests
export const questService = {
    list: async (): Promise<any[]> => {
        const response = await api.get('/quests');
        return response.data;
    },
    complete: async (questId: number): Promise<any> => {
        const response = await api.patch(`/quests/${questId}/complete`);
        return response.data;
    },
    create: async (questData: any): Promise<any> => {
        const response = await api.post('/quests', questData);
        return response.data;
    },
};

// Serviços do Jogador
export const playerService = {
    getStats: async (): Promise<any> => {
        const response = await api.get('/player/stats');
        return response.data;
    },
    updateStats: async (stats: any): Promise<any> => {
        const response = await api.patch('/player/stats', stats);
        return response.data;
    },
};

export default api;
