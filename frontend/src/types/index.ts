export interface Player {
    id: number;
    name: string;
    team_id: number;
    position: string;
}

export interface Team {
    id: number;
    name: string;
    abbreviation: string;
}

export interface BattingStats {
    player_id: number;
    name: string;
    team: string;
    games: number;
    at_bats: number;
    hits: number;
    runs: number;
    rbis: number;
    home_runs: number;
    batting_average: number;
    exit_velocity: number;
    launch_angle: number;
}

export interface PitchingStats {
    player_id: number;
    name: string;
    team: string;
    games: number;
    innings_pitched: number;
    hits_allowed: number;
    runs_allowed: number;
    earned_runs: number;
    walks: number;
    strikeouts: number;
    era: number;
    velocity: number;
    spin_rate: number;
}

export type StatType = 'batting' | 'pitching';

export interface FilterOptions {
    stat_type: StatType;
    season?: string;
    start_date?: string;
    end_date?: string;
    team_ids?: number[];
    player_ids?: number[];
} 