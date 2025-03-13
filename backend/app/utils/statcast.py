import requests
from datetime import datetime
from flask import current_app
from app.models import Player, Team, Game, BattingStats, PitchingStats
from app import db

def get_statcast_data(stat_type, season=None, start_date=None, end_date=None, team_ids=None, player_ids=None):
    """
    Fetch data from Statcast API and process it for our application.
    """
    headers = {
        'Authorization': f'Bearer {current_app.config["STATCAST_API_KEY"]}'
    }
    
    # Build query parameters
    params = {}
    if season:
        params['season'] = season
    if start_date:
        params['start_date'] = start_date
    if end_date:
        params['end_date'] = end_date
    if team_ids:
        params['team_ids'] = ','.join(team_ids)
    if player_ids:
        params['player_ids'] = ','.join(player_ids)
    
    # Determine endpoint based on stat type
    endpoint = f"{current_app.config['STATCAST_API_URL']}/{'batting' if stat_type == 'batting' else 'pitching'}"
    
    try:
        response = requests.get(endpoint, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Process and format the data
        return process_statcast_data(data, stat_type)
    except requests.exceptions.RequestException as e:
        current_app.logger.error(f"Error fetching Statcast data: {str(e)}")
        raise

def process_statcast_data(data, stat_type):
    """
    Process raw Statcast data into our application's format.
    """
    processed_data = []
    
    for item in data:
        if stat_type == 'batting':
            processed_item = {
                'player_id': item.get('player_id'),
                'name': item.get('player_name'),
                'team': item.get('team'),
                'games': item.get('games'),
                'at_bats': item.get('at_bats'),
                'hits': item.get('hits'),
                'runs': item.get('runs'),
                'rbis': item.get('rbis'),
                'home_runs': item.get('home_runs'),
                'batting_average': item.get('batting_average'),
                'exit_velocity': item.get('exit_velocity'),
                'launch_angle': item.get('launch_angle')
            }
        else:  # pitching
            processed_item = {
                'player_id': item.get('player_id'),
                'name': item.get('player_name'),
                'team': item.get('team'),
                'games': item.get('games'),
                'innings_pitched': item.get('innings_pitched'),
                'hits_allowed': item.get('hits_allowed'),
                'runs_allowed': item.get('runs_allowed'),
                'earned_runs': item.get('earned_runs'),
                'walks': item.get('walks'),
                'strikeouts': item.get('strikeouts'),
                'era': item.get('era'),
                'velocity': item.get('velocity'),
                'spin_rate': item.get('spin_rate')
            }
        
        processed_data.append(processed_item)
    
    return processed_data

def update_local_database(stat_type, data):
    """
    Update local database with new Statcast data.
    """
    for item in data:
        if stat_type == 'batting':
            stats = BattingStats(
                player_id=item['player_id'],
                game_id=item['game_id'],
                at_bats=item['at_bats'],
                hits=item['hits'],
                runs=item['runs'],
                rbis=item['rbis'],
                home_runs=item['home_runs'],
                batting_average=item['batting_average']
            )
        else:  # pitching
            stats = PitchingStats(
                player_id=item['player_id'],
                game_id=item['game_id'],
                innings_pitched=item['innings_pitched'],
                hits_allowed=item['hits_allowed'],
                runs_allowed=item['runs_allowed'],
                earned_runs=item['earned_runs'],
                walks=item['walks'],
                strikeouts=item['strikeouts'],
                era=item['era']
            )
        
        db.session.add(stats)
    
    db.session.commit() 