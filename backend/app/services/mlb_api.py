import requests
from datetime import datetime
from typing import Dict, List, Optional
from app import db
from app.models import Player, BattingStats, PitchingStats

class MLBAPIService:
    BASE_URL = "https://statsapi.mlb.com/api/v1"
    
    @staticmethod
    def _make_request(endpoint: str, params: Optional[Dict] = None) -> Dict:
        """Make a request to the MLB API"""
        url = f"{MLBAPIService.BASE_URL}/{endpoint}"
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def get_player_stats(player_id: int, season: int, stat_type: str) -> Dict:
        """Fetch player statistics from MLB API"""
        if stat_type == 'batting':
            endpoint = f"stats"
            params = {
                'stats': 'regularSeason',
                'group': 'hitting',
                'playerPool': 'All',
                'playerId': player_id,
                'season': season
            }
        else:  # pitching
            endpoint = f"stats"
            params = {
                'stats': 'regularSeason',
                'group': 'pitching',
                'playerPool': 'All',
                'playerId': player_id,
                'season': season
            }
        
        return MLBAPIService._make_request(endpoint, params)
    
    @staticmethod
    def search_players(query: str) -> List[Dict]:
        """Search for players by name"""
        endpoint = "search"
        params = {
            'query': query,
            'type': 'player'
        }
        response = MLBAPIService._make_request(endpoint, params)
        return response.get('searchResults', [])
    
    @staticmethod
    def get_team_roster(team_id: int) -> List[Dict]:
        """Get team roster"""
        endpoint = f"teams/{team_id}/roster"
        response = MLBAPIService._make_request(endpoint)
        return response.get('roster', [])
    
    @staticmethod
    def sync_player_stats(player_id: int, season: int, stat_type: str) -> None:
        """Sync player statistics from MLB API to local database"""
        try:
            # Get player from database or create new one
            player = Player.query.get(player_id)
            if not player:
                return
            
            # Fetch stats from MLB API
            stats_data = MLBAPIService.get_player_stats(player_id, season, stat_type)
            
            if not stats_data.get('stats'):
                return
            
            stats = stats_data['stats'][0].get('splits', [])
            if not stats:
                return
            
            stat_data = stats[0]
            
            if stat_type == 'batting':
                # Create or update batting stats
                batting_stats = BattingStats.query.filter_by(
                    player_id=player_id,
                    season=season
                ).first()
                
                if not batting_stats:
                    batting_stats = BattingStats(player_id=player_id, season=season)
                
                # Update batting stats
                batting_stats.games = stat_data.get('stat', {}).get('gamesPlayed', 0)
                batting_stats.at_bats = stat_data.get('stat', {}).get('atBats', 0)
                batting_stats.hits = stat_data.get('stat', {}).get('hits', 0)
                batting_stats.runs = stat_data.get('stat', {}).get('runs', 0)
                batting_stats.rbis = stat_data.get('stat', {}).get('rbi', 0)
                batting_stats.home_runs = stat_data.get('stat', {}).get('homeRuns', 0)
                batting_stats.batting_average = stat_data.get('stat', {}).get('avg', 0)
                
                # Advanced stats (if available)
                if 'exitVelocity' in stat_data.get('stat', {}):
                    batting_stats.exit_velocity = stat_data['stat']['exitVelocity']
                if 'launchAngle' in stat_data.get('stat', {}):
                    batting_stats.launch_angle = stat_data['stat']['launchAngle']
                
                db.session.add(batting_stats)
                
            else:  # pitching
                # Create or update pitching stats
                pitching_stats = PitchingStats.query.filter_by(
                    player_id=player_id,
                    season=season
                ).first()
                
                if not pitching_stats:
                    pitching_stats = PitchingStats(player_id=player_id, season=season)
                
                # Update pitching stats
                pitching_stats.games = stat_data.get('stat', {}).get('gamesPlayed', 0)
                pitching_stats.innings_pitched = stat_data.get('stat', {}).get('inningsPitched', 0)
                pitching_stats.hits_allowed = stat_data.get('stat', {}).get('hits', 0)
                pitching_stats.runs_allowed = stat_data.get('stat', {}).get('runs', 0)
                pitching_stats.earned_runs = stat_data.get('stat', {}).get('earnedRuns', 0)
                pitching_stats.walks = stat_data.get('stat', {}).get('baseOnBalls', 0)
                pitching_stats.strikeouts = stat_data.get('stat', {}).get('strikeOuts', 0)
                pitching_stats.era = stat_data.get('stat', {}).get('era', 0)
                
                # Advanced stats (if available)
                if 'velocity' in stat_data.get('stat', {}):
                    pitching_stats.velocity = stat_data['stat']['velocity']
                if 'spinRate' in stat_data.get('stat', {}):
                    pitching_stats.spin_rate = stat_data['stat']['spinRate']
                
                db.session.add(pitching_stats)
            
            db.session.commit()
            
        except Exception as e:
            db.session.rollback()
            raise e 