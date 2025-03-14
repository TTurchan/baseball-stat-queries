import React from 'react';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import { BattingStats, PitchingStats, StatType } from '../types';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

interface StatisticsTableProps {
    data: (BattingStats | PitchingStats)[];
    statType: StatType;
    loading: boolean;
    customColumns?: GridColDef[];
}

const formatNumber = (value: number | null, decimals: number = 3) => {
    if (value === null) return '-';
    return value.toFixed(decimals);
};

const battingColumns: GridColDef[] = [
    { field: 'name', headerName: 'Player', width: 200, sortable: true },
    { field: 'team', headerName: 'Team', width: 130, sortable: true },
    { field: 'position', headerName: 'Position', width: 100, sortable: true },
    { field: 'at_bats', headerName: 'AB', width: 100, sortable: true },
    { field: 'hits', headerName: 'H', width: 100, sortable: true },
    { field: 'runs', headerName: 'R', width: 100, sortable: true },
    { field: 'rbis', headerName: 'RBI', width: 100, sortable: true },
    { field: 'home_runs', headerName: 'HR', width: 100, sortable: true },
    { 
        field: 'batting_average', 
        headerName: 'AVG', 
        width: 100, 
        sortable: true,
        valueFormatter: (params: GridValueFormatterParams) => formatNumber(params.value as number, 3)
    }
];

const pitchingColumns: GridColDef[] = [
    { field: 'name', headerName: 'Player', width: 200, sortable: true },
    { field: 'team', headerName: 'Team', width: 130, sortable: true },
    { field: 'games', headerName: 'Games', width: 100, sortable: true },
    { 
        field: 'innings_pitched', 
        headerName: 'IP', 
        width: 100, 
        sortable: true,
        valueFormatter: (params: GridValueFormatterParams) => formatNumber(params.value as number, 1)
    },
    { field: 'hits_allowed', headerName: 'H', width: 100, sortable: true },
    { field: 'runs_allowed', headerName: 'R', width: 100, sortable: true },
    { field: 'earned_runs', headerName: 'ER', width: 100, sortable: true },
    { field: 'walks', headerName: 'BB', width: 100, sortable: true },
    { field: 'strikeouts', headerName: 'K', width: 100, sortable: true },
    { 
        field: 'era', 
        headerName: 'ERA', 
        width: 100, 
        sortable: true,
        valueFormatter: (params: GridValueFormatterParams) => formatNumber(params.value as number, 2)
    },
    { 
        field: 'velocity', 
        headerName: 'Velo', 
        width: 100, 
        sortable: true,
        valueFormatter: (params: GridValueFormatterParams) => formatNumber(params.value as number, 1)
    },
    { 
        field: 'spin_rate', 
        headerName: 'Spin Rate', 
        width: 120, 
        sortable: true,
        valueFormatter: (params: GridValueFormatterParams) => formatNumber(params.value as number, 0)
    },
];

export const StatisticsTable: React.FC<StatisticsTableProps> = ({ 
    data, 
    statType, 
    loading,
    customColumns 
}) => {
    const columns = customColumns || (statType === 'batting' ? battingColumns : pitchingColumns);

    const handleExport = () => {
        const headers = columns.map(col => col.headerName).join(',');
        const rows = data.map(row => 
            columns.map(col => row[col.field as keyof typeof row]).join(',')
        );
        const csv = [headers, ...rows].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${statType}_stats.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Tooltip title="Export to CSV">
                    <IconButton onClick={handleExport} color="primary">
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                        },
                        sorting: {
                            sortModel: [{ field: 'name', sort: 'asc' }],
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    loading={loading}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.player_id}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            fontSize: '0.875rem',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                        },
                    }}
                />
            </div>
        </Box>
    );
}; 