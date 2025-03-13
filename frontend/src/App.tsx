import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FilterForm } from './components/FilterForm';
import { StatisticsTable } from './components/StatisticsTable';
import { FilterOptions, BattingStats, PitchingStats } from './types';
import { getStatistics, exportStatistics } from './services/api';

function App() {
    const [data, setData] = useState<(BattingStats | PitchingStats)[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFilterSubmit = async (filters: FilterOptions) => {
        setLoading(true);
        try {
            const stats = await getStatistics(filters);
            setData(stats);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            // TODO: Add proper error handling
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (filters: FilterOptions) => {
        try {
            const blob = await exportStatistics(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'baseball_stats.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting statistics:', error);
            // TODO: Add proper error handling
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="xl">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Baseball Statistics Generator
                    </Typography>
                    
                    <FilterForm onSubmit={handleFilterSubmit} loading={loading} />
                    
                    {data.length > 0 && (
                        <>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleExport({ stat_type: 'batting' })}
                                >
                                    Export to CSV
                                </Button>
                            </Box>
                            
                            <StatisticsTable
                                data={data}
                                statType="batting"
                                loading={loading}
                            />
                        </>
                    )}
                </Box>
            </Container>
        </LocalizationProvider>
    );
}

export default App;
