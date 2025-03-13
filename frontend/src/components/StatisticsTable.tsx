import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BattingStats, PitchingStats, StatType } from '../types';

interface StatisticsTableProps {
    data: (BattingStats | PitchingStats)[];
    statType: StatType;
    loading: boolean;
}

const battingColumns: GridColDef[] = [
    { field: 'name', headerName: 'Player', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'games', headerName: 'Games', width: 100 },
    { field: 'at_bats', headerName: 'AB', width: 100 },
    { field: 'hits', headerName: 'H', width: 100 },
    { field: 'runs', headerName: 'R', width: 100 },
    { field: 'rbis', headerName: 'RBI', width: 100 },
    { field: 'home_runs', headerName: 'HR', width: 100 },
    { field: 'batting_average', headerName: 'AVG', width: 100 },
    { field: 'exit_velocity', headerName: 'Exit Velo', width: 120 },
    { field: 'launch_angle', headerName: 'Launch Angle', width: 120 },
];

const pitchingColumns: GridColDef[] = [
    { field: 'name', headerName: 'Player', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'games', headerName: 'Games', width: 100 },
    { field: 'innings_pitched', headerName: 'IP', width: 100 },
    { field: 'hits_allowed', headerName: 'H', width: 100 },
    { field: 'runs_allowed', headerName: 'R', width: 100 },
    { field: 'earned_runs', headerName: 'ER', width: 100 },
    { field: 'walks', headerName: 'BB', width: 100 },
    { field: 'strikeouts', headerName: 'K', width: 100 },
    { field: 'era', headerName: 'ERA', width: 100 },
    { field: 'velocity', headerName: 'Velo', width: 100 },
    { field: 'spin_rate', headerName: 'Spin Rate', width: 120 },
];

export const StatisticsTable: React.FC<StatisticsTableProps> = ({ data, statType, loading }) => {
    const columns = statType === 'batting' ? battingColumns : pitchingColumns;

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                loading={loading}
                disableSelectionOnClick
                getRowId={(row) => row.player_id}
            />
        </div>
    );
}; 