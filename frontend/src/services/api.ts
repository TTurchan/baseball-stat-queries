import axios from 'axios';
import { FilterOptions, BattingStats, PitchingStats, StatType } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN || 'dev-token'}`
    }
});

interface StatsResponse {
    success: boolean;
    data: (BattingStats | PitchingStats)[];
    error?: string;
}

interface PlayerStatsResponse {
    success: boolean;
    data: {
        player: {
            id: number;
            name: string;
            team: string;
            position: string;
        };
        stats: (BattingStats | PitchingStats)[];
    };
    error?: string;
}

interface SearchResponse {
    success: boolean;
    data: Array<{
        id: number;
        name: string;
        team: string;
        position: string;
    }>;
}

export const getStatistics = async (filters: FilterOptions): Promise<(BattingStats | PitchingStats)[]> => {
    const response = await api.get('/statistics', { params: filters });
    return response.data;
};

export const getTeams = async () => {
    const response = await api.get('/teams');
    return response.data;
};

export const getPlayers = async (query: string) => {
    const response = await api.get('/players', { params: { query } });
    return response.data;
};

export const exportStatistics = async (filters: FilterOptions): Promise<Blob> => {
    const response = await api.get('/statistics/export', {
        params: filters,
        responseType: 'blob'
    });
    return response.data;
};

export const fetchStatistics = async (
    statType: StatType,
    filters: {
        season?: number;
        team?: string;
        minGames?: number;
        minAtBats?: number;
        minInnings?: number;
        minHits?: number;
        minHomeRuns?: number;
        minStrikeouts?: number;
    }
): Promise<StatsResponse> => {
    try {
        const params = new URLSearchParams();
        if (filters.season) params.append('season', filters.season.toString());
        if (filters.team) params.append('team', filters.team);
        if (filters.minGames) params.append('min_games', filters.minGames.toString());
        if (filters.minAtBats) params.append('min_at_bats', filters.minAtBats.toString());
        if (filters.minInnings) params.append('min_innings', filters.minInnings.toString());
        if (filters.minHits) params.append('min_hits', filters.minHits.toString());
        if (filters.minHomeRuns) params.append('min_home_runs', filters.minHomeRuns.toString());
        if (filters.minStrikeouts) params.append('min_strikeouts', filters.minStrikeouts.toString());

        const response = await api.get(`/stats/${statType}?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return {
            success: false,
            data: [],
            error: 'Failed to fetch statistics'
        };
    }
};

export const fetchPlayerStats = async (
    playerId: number,
    statType: StatType,
    season?: number
): Promise<PlayerStatsResponse> => {
    try {
        const params = new URLSearchParams();
        params.append('type', statType);
        if (season) params.append('season', season.toString());

        const response = await api.get(`/stats/player/${playerId}?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching player statistics:', error);
        return {
            success: false,
            data: {
                player: {
                    id: playerId,
                    name: '',
                    team: '',
                    position: ''
                },
                stats: []
            },
            error: 'Failed to fetch player statistics'
        };
    }
};

export const searchPlayers = async (query: string): Promise<SearchResponse> => {
    try {
        const params = new URLSearchParams();
        params.append('q', query);

        const response = await api.get(`/players/search?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error searching players:', error);
        return {
            success: false,
            data: []
        };
    }
}; 