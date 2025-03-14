from app import create_app, db
from app.models import Team, Player, Game, BattingStats
from datetime import datetime

def test_database_setup():
    app = create_app()
    with app.app_context():
        print("\n=== Testing Database Setup ===")
        
        # Test Teams
        print("\nChecking Teams:")
        teams = Team.query.all()
        print(f"Total teams in database: {len(teams)}")
        for team in teams:
            print(f"- {team.name} ({team.abbreviation})")
        
        # Test Dodgers specifically
        print("\nChecking Dodgers Team:")
        dodgers = Team.query.filter_by(abbreviation='LAD').first()
        if dodgers:
            print(f"Found Dodgers team: {dodgers.name}")
            print(f"Team ID: {dodgers.id}")
        else:
            print("ERROR: Dodgers team not found!")
            return
        
        # Test Players
        print("\nChecking Dodgers Players:")
        players = Player.query.filter_by(team_id=dodgers.id).all()
        print(f"Total Dodgers players: {len(players)}")
        for player in players:
            print(f"- {player.name} (ID: {player.id})")
        
        # Test Games
        print("\nChecking Games:")
        games = Game.query.all()
        print(f"Total games in database: {len(games)}")
        for game in games:
            print(f"- Game on {game.date} (ID: {game.id})")
        
        # Test Batting Stats
        print("\nChecking Batting Stats:")
        batting_stats = BattingStats.query.all()
        print(f"Total batting stats records: {len(batting_stats)}")
        
        # Test specific player stats
        if players:
            print("\nChecking Stats for First Player:")
            player = players[0]
            player_stats = BattingStats.query.filter_by(player_id=player.id).all()
            print(f"Stats for {player.name}:")
            for stat in player_stats:
                print(f"- Game ID: {stat.game_id}")
                print(f"  At Bats: {stat.at_bats}")
                print(f"  Hits: {stat.hits}")
                print(f"  Runs: {stat.runs}")
                print(f"  RBIs: {stat.rbis}")
                print(f"  Home Runs: {stat.home_runs}")
                print(f"  Batting Average: {stat.batting_average}")
        
        # Test API endpoints
        print("\n=== Testing API Endpoints ===")
        client = app.test_client()
        
        # Test batting stats endpoint
        print("\nTesting Batting Stats Endpoint:")
        response = client.get('/api/stats/batting')
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.get_json()}")
        
        # Test with filters
        print("\nTesting Batting Stats with Filters:")
        response = client.get('/api/stats/batting?season=2024&team=LAD')
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.get_json()}")

if __name__ == '__main__':
    test_database_setup() 