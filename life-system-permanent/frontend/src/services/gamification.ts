import api from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
console.log("🎮 Gamification Service URL:", API_URL);

// Types (should match backend schemas)
export interface PlayerStats {
    id: number;
    user_id: number;
    level: number;
    current_xp: number;
    hp: number;
    strength: number;
    intelligence: number;
    focus: number;
}

export interface Quest {
    id: number;
    user_id: number;
    title: number;
    description: string;
    difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
    xp_reward: number;
    attribute_reward: 'STR' | 'INT' | 'FOC' | null;
    is_completed: boolean;
    due_date: string | null;
}

export interface QuestCompleteResponse {
    quest: Quest;
    xp_gained: number;
    level_up: boolean;
    new_level: number | null;
    old_level: number | null;
    message: string;
    attribute_updated: string;
}

export const gamificationService = {
    getStats: async (token?: string): Promise<PlayerStats> => {
        // Note: The 'api' instance interceptor handles the token from localStorage automatically.
        // If a token is passed explicitly (e.g. SSR), we might need to handle it, 
        // but for client-side dashboard, the interceptor is enough.
        const response = await api.get('/api/v1/stats');
        return response.data;
    },

    getQuests: async (token?: string): Promise<Quest[]> => {
        const response = await api.get('/api/v1/quests');
        return response.data;
    },

    completeQuest: async (questId: number, token?: string): Promise<QuestCompleteResponse> => {
        const response = await api.post(`/api/v1/quests/${questId}/complete`);
        return response.data;
    },
};
