import axios from 'axios';
import { FilterOptions, BattingStats, PitchingStats } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN || 'dev-token'}`
    }
});

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