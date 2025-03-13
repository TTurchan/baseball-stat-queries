from flask import jsonify, request
from app.api import bp
from app.api.auth import token_auth
from app import cache
from app.models import Player, Team, Game
from app.utils.statcast import get_statcast_data

@bp.route('/statistics', methods=['GET'])
@token_auth.login_required
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_statistics():
    # Get query parameters
    stat_type = request.args.get('stat_type', 'batting')
    season = request.args.get('season')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    team_ids = request.args.getlist('team_ids[]')
    player_ids = request.args.getlist('player_ids[]')
    
    # Validate parameters
    if not season and not (start_date and end_date):
        return jsonify({'error': 'Either season or date range must be specified'}), 400
    
    # Get data from Statcast API
    try:
        data = get_statcast_data(
            stat_type=stat_type,
            season=season,
            start_date=start_date,
            end_date=end_date,
            team_ids=team_ids,
            player_ids=player_ids
        )
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/statistics/export', methods=['GET'])
@token_auth.login_required
def export_statistics():
    # Similar to get_statistics but returns CSV format
    # Implementation will be added later
    pass 