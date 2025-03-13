import React, { useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Grid,
    Autocomplete,
    Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FilterOptions, StatType, Team, Player } from '../types';
import { getTeams, getPlayers } from '../services/api';

interface FilterFormProps {
    onSubmit: (filters: FilterOptions) => void;
    loading: boolean;
}

export const FilterForm: React.FC<FilterFormProps> = ({ onSubmit, loading }) => {
    const [statType, setStatType] = useState<StatType>('batting');
    const [season, setSeason] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            stat_type: statType,
            season: season || undefined,
            start_date: startDate?.toISOString().split('T')[0],
            end_date: endDate?.toISOString().split('T')[0],
            team_ids: selectedTeams.map(team => team.id),
            player_ids: selectedPlayers.map(player => player.id),
        });
    };

    const handleTeamSearch = async () => {
        const teamsData = await getTeams();
        setTeams(teamsData);
    };

    const handlePlayerSearch = async (query: string) => {
        if (query.length >= 2) {
            const playersData = await getPlayers(query);
            setPlayers(playersData);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Stat Type</InputLabel>
                        <Select
                            value={statType}
                            label="Stat Type"
                            onChange={(e) => setStatType(e.target.value as StatType)}
                        >
                            <MenuItem value="batting">Batting</MenuItem>
                            <MenuItem value="pitching">Pitching</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Season"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        placeholder="e.g., 2023"
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={setEndDate}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Autocomplete
                        multiple
                        options={teams}
                        getOptionLabel={(option) => option.name}
                        value={selectedTeams}
                        onChange={(_, newValue) => setSelectedTeams(newValue)}
                        onOpen={handleTeamSearch}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Teams"
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Autocomplete
                        multiple
                        options={players}
                        getOptionLabel={(option) => option.name}
                        value={selectedPlayers}
                        onChange={(_, newValue) => setSelectedPlayers(newValue)}
                        onInputChange={(_, value) => handlePlayerSearch(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Players"
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Loading...' : 'Generate Statistics'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}; 