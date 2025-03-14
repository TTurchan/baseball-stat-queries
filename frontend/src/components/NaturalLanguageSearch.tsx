import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Paper,
    Typography,
    CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface NaturalLanguageSearchProps {
    onSearch: (query: string) => Promise<void>;
    loading: boolean;
}

export const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onSearch, loading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            await onSearch(query);
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Natural Language Query
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ask questions in plain English like "Show me the top 10 batting averages from the 2023 season" 
                or "Give me the batting statlines of the top 10 best single seasons by bWar for position players over the past 15 years"
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Enter your query..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={loading}
                        multiline
                        rows={2}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !query.trim()}
                        sx={{ minWidth: '120px' }}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}; 