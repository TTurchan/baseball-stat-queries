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
    Paper,
    Typography,
    Collapse,
    IconButton,
    Tooltip
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { StatType } from '../types';

interface FilterFormProps {
    onFilterChange: (filters: {
        statType: StatType;
        season?: number;
        team?: string;
        minGames?: number;
        minAtBats?: number;
        minInnings?: number;
        minHits?: number;
        minHomeRuns?: number;
        minStrikeouts?: number;
    }) => void;
    loading: boolean;
}

const teams = [
    'ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CIN', 'CLE', 'COL', 'DET', 'HOU',
    'KC', 'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM', 'NYY', 'OAK', 'PHI',
    'PIT', 'SD', 'SEA', 'SF', 'STL', 'TB', 'TEX', 'TOR', 'WAS'
];

export const FilterForm: React.FC<FilterFormProps> = ({ onFilterChange, loading }) => {
    const [statType, setStatType] = useState<StatType>('batting');
    const [season, setSeason] = useState<number>(new Date().getFullYear());
    const [team, setTeam] = useState<string>('');
    const [minGames, setMinGames] = useState<number>(0);
    const [minAtBats, setMinAtBats] = useState<number>(0);
    const [minInnings, setMinInnings] = useState<number>(0);
    const [minHits, setMinHits] = useState<number>(0);
    const [minHomeRuns, setMinHomeRuns] = useState<number>(0);
    const [minStrikeouts, setMinStrikeouts] = useState<number>(0);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filters: any = {
            statType,
            season,
            team: team || undefined,
            minGames: minGames || undefined
        };

        if (statType === 'batting') {
            if (minAtBats) filters.minAtBats = minAtBats;
            if (minHits) filters.minHits = minHits;
            if (minHomeRuns) filters.minHomeRuns = minHomeRuns;
        } else {
            if (minInnings) filters.minInnings = minInnings;
            if (minStrikeouts) filters.minStrikeouts = minStrikeouts;
        }

        onFilterChange(filters);
    };

    const handleReset = () => {
        setStatType('batting');
        setSeason(new Date().getFullYear());
        setTeam('');
        setMinGames(0);
        setMinAtBats(0);
        setMinInnings(0);
        setMinHits(0);
        setMinHomeRuns(0);
        setMinStrikeouts(0);
        setShowAdvanced(false);
        onFilterChange({
            statType: 'batting',
            season: new Date().getFullYear()
        });
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Filter Statistics
                </Typography>
                <Tooltip title={showAdvanced ? "Hide Advanced Filters" : "Show Advanced Filters"}>
                    <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                        {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Tooltip>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
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
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Season"
                            value={season}
                            onChange={(e) => setSeason(Number(e.target.value))}
                            inputProps={{ min: 2000, max: new Date().getFullYear() }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Team</InputLabel>
                            <Select
                                value={team}
                                label="Team"
                                onChange={(e) => setTeam(e.target.value)}
                            >
                                <MenuItem value="">All Teams</MenuItem>
                                {teams.map((team) => (
                                    <MenuItem key={team} value={team}>
                                        {team}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Minimum Games"
                            value={minGames}
                            onChange={(e) => setMinGames(Number(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
                                Advanced Filters
                            </Typography>
                            <Grid container spacing={2}>
                                {statType === 'batting' ? (
                                    <>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Minimum At Bats"
                                                value={minAtBats}
                                                onChange={(e) => setMinAtBats(Number(e.target.value))}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Minimum Hits"
                                                value={minHits}
                                                onChange={(e) => setMinHits(Number(e.target.value))}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Minimum Home Runs"
                                                value={minHomeRuns}
                                                onChange={(e) => setMinHomeRuns(Number(e.target.value))}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Minimum Innings Pitched"
                                                value={minInnings}
                                                onChange={(e) => setMinInnings(Number(e.target.value))}
                                                inputProps={{ min: 0, step: 0.1 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Minimum Strikeouts"
                                                value={minStrikeouts}
                                                onChange={(e) => setMinStrikeouts(Number(e.target.value))}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </Collapse>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                disabled={loading}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                Apply Filters
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}; 