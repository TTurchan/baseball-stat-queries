import { api } from './api';

export interface NLPResponse {
    success: boolean;
    data: any[];
    columns: {
        field: string;
        headerName: string;
        width: number;
        sortable?: boolean;
        valueFormatter?: (value: any) => string;
    }[];
    error?: string;
}

export const processNaturalLanguageQuery = async (query: string): Promise<NLPResponse> => {
    try {
        const response = await api.post('/nlp/query', { query });
        return response.data;
    } catch (error) {
        console.error('Error processing natural language query:', error);
        throw error;
    }
}; 