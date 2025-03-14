import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { FilterForm } from './components/FilterForm';
import { StatisticsTable } from './components/StatisticsTable';
import { NaturalLanguageSearch } from './components/NaturalLanguageSearch';
import { fetchStatistics } from './services/api';
import { processNaturalLanguageQuery } from './services/nlp';
import { BattingStats, PitchingStats, StatType } from './types';

function App() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<(BattingStats | PitchingStats)[]>([]);
    const [statType, setStatType] = useState<StatType>('batting');
    const [columns, setColumns] = useState<any[]>([]);
    const [usingCustomColumns, setUsingCustomColumns] = useState(false);

    const handleFilterChange = async (filters: {
        statType: StatType;
        season?: number;
        team?: string;
        minGames?: number;
    }) => {
        setLoading(true);
        setError(null);
        setStatType(filters.statType);
        setUsingCustomColumns(false);

        try {
            const response = await fetchStatistics(filters.statType, {
                season: filters.season,
                team: filters.team,
                minGames: filters.minGames
            });

            if (response.success) {
                setData(response.data);
            } else {
                setError(response.error || 'Failed to fetch statistics');
            }
        } catch (err) {
            setError('An error occurred while fetching statistics');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNaturalLanguageSearch = async (query: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await processNaturalLanguageQuery(query);
            if (response.success) {
                setData(response.data);
                setColumns(response.columns);
                setUsingCustomColumns(true);
            } else {
                setError(response.error || 'Failed to process query');
            }
        } catch (err) {
            setError('An error occurred while processing your query');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load initial data
        handleFilterChange({
            statType: 'batting',
            season: new Date().getFullYear()
        });
    }, []);

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Baseball Statistics
                </Typography>
                
                <NaturalLanguageSearch
                    onSearch={handleNaturalLanguageSearch}
                    loading={loading}
                />

                <FilterForm
                    onFilterChange={handleFilterChange}
                    loading={loading}
                />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <StatisticsTable
                        data={data}
                        statType={statType}
                        loading={loading}
                        customColumns={usingCustomColumns ? columns : undefined}
                    />
                )}
            </Box>
        </Container>
    );
}

export default App;
