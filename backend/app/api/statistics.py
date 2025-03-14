from flask import Blueprint, jsonify, request
from app.models import Player, BattingStats, PitchingStats, Team
from app.services.mlb_api import MLBAPIService
from app import db
from sqlalchemy import and_

bp = Blueprint('statistics', __name__)

@bp.route('/stats/<stat_type>', methods=['GET'])
def get_statistics(stat_type):
    try:
        # Get query parameters
        season = request.args.get('season', type=int)
        team = request.args.get('team')
        min_games = request.args.get('min_games', type=int)
        
        # Advanced filters
        min_at_bats = request.args.get('min_at_bats', type=int)
        min_innings = request.args.get('min_innings', type=float)
        min_hits = request.args.get('min_hits', type=int)
        min_home_runs = request.args.get('min_home_runs', type=int)
        min_strikeouts = request.args.get('min_strikeouts', type=int)
        
        # Base query
        if stat_type == 'batting':
            query = db.session.query(Player, BattingStats).join(BattingStats)
            filters = [BattingStats.season == season] if season else []
            
            # Apply batting-specific filters
            if min_at_bats:
                filters.append(BattingStats.at_bats >= min_at_bats)
            if min_hits:
                filters.append(BattingStats.hits >= min_hits)
            if min_home_runs:
                filters.append(BattingStats.home_runs >= min_home_runs)
        else:  # pitching
            query = db.session.query(Player, PitchingStats).join(PitchingStats)
            filters = [PitchingStats.season == season] if season else []
            
            # Apply pitching-specific filters
            if min_innings:
                filters.append(PitchingStats.innings_pitched >= min_innings)
            if min_strikeouts:
                filters.append(PitchingStats.strikeouts >= min_strikeouts)
        
        # Apply common filters
        if team:
            team_obj = Team.query.filter_by(abbreviation=team).first()
            if team_obj:
                filters.append(Player.team_id == team_obj.id)
        if min_games:
            if stat_type == 'batting':
                filters.append(BattingStats.games >= min_games)
            else:
                filters.append(PitchingStats.games >= min_games)
        
        if filters:
            query = query.filter(and_(*filters))
        
        # Execute query
        results = query.all()
        
        # If no results and season is specified, try to fetch from MLB API
        if not results and season:
            try:
                # Search for players based on team if specified
                if team:
                    # Note: This is a simplified version. In a real implementation,
                    # you would need to map team names to MLB team IDs
                    team_roster = MLBAPIService.get_team_roster(team)
                    for player_data in team_roster:
                        MLBAPIService.sync_player_stats(
                            player_data['person']['id'],
                            season,
                            stat_type
                        )
                else:
                    # For now, we'll just sync a few popular players
                    # In a real implementation, you would want to sync all players
                    popular_players = [
                        {'id': 545361, 'name': 'Mike Trout'},  # Example player IDs
                        {'id': 677594, 'name': 'Shohei Ohtani'},
                        {'id': 677594, 'name': 'Aaron Judge'}
                    ]
                    for player in popular_players:
                        MLBAPIService.sync_player_stats(player['id'], season, stat_type)
                
                # Query again after syncing
                results = query.all()
            except Exception as e:
                # Log the error but continue with whatever results we have
                print(f"Error syncing with MLB API: {str(e)}")
        
        # Format response
        stats = []
        for player, stat in results:
            player_dict = player.to_dict()
            stat_dict = stat.to_dict()
            stats.append({**player_dict, **stat_dict})
        
        return jsonify({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/stats/player/<int:player_id>', methods=['GET'])
def get_player_stats(player_id):
    try:
        stat_type = request.args.get('type', 'batting')
        season = request.args.get('season', type=int)
        
        player = Player.query.get_or_404(player_id)
        
        if stat_type == 'batting':
            stats = BattingStats.query.filter_by(player_id=player_id)
        else:
            stats = PitchingStats.query.filter_by(player_id=player_id)
            
        if season:
            stats = stats.filter_by(season=season)
            
        stats = stats.all()
        
        # If no stats found and season is specified, try to fetch from MLB API
        if not stats and season:
            try:
                MLBAPIService.sync_player_stats(player_id, season, stat_type)
                # Query again after syncing
                if stat_type == 'batting':
                    stats = BattingStats.query.filter_by(player_id=player_id)
                else:
                    stats = PitchingStats.query.filter_by(player_id=player_id)
                if season:
                    stats = stats.filter_by(season=season)
                stats = stats.all()
            except Exception as e:
                # Log the error but continue with whatever results we have
                print(f"Error syncing with MLB API: {str(e)}")
        
        return jsonify({
            'success': True,
            'data': {
                'player': player.to_dict(),
                'stats': [stat.to_dict() for stat in stats]
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/players/search', methods=['GET'])
def search_players():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({
                'success': True,
                'data': []
            })
        
        # First search in our database
        db_players = Player.query.filter(
            Player.name.ilike(f'%{query}%')
        ).limit(10).all()
        
        # If we have results, return them
        if db_players:
            return jsonify({
                'success': True,
                'data': [player.to_dict() for player in db_players]
            })
        
        # If no results in database, try MLB API
        try:
            mlb_players = MLBAPIService.search_players(query)
            players = []
            
            for player_data in mlb_players:
                # Create player in our database
                player = Player(
                    id=player_data['id'],
                    name=player_data['name'],
                    team=player_data.get('currentTeam', {}).get('name'),
                    position=player_data.get('primaryPosition', {}).get('abbreviation')
                )
                db.session.add(player)
                players.append({
                    'id': player.id,
                    'name': player.name,
                    'team': player.team,
                    'position': player.position
                })
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'data': players
            })
            
        except Exception as e:
            print(f"Error searching MLB API: {str(e)}")
            return jsonify({
                'success': True,
                'data': []
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 