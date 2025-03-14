from app import create_app, db
from app.models import Team, Player, Game, BattingStats
from datetime import datetime

def import_dodgers_stats():
    app = create_app()
    with app.app_context():
        # Get Dodgers team
        dodgers = Team.query.filter_by(abbreviation='LAD').first()
        if not dodgers:
            print("Dodgers team not found!")
            return

        # Create a test game
        game = Game(
            date=datetime(2024, 3, 1),
            home_team_id=dodgers.id,
            away_team_id=dodgers.id  # For testing purposes
        )
        db.session.add(game)
        db.session.commit()

        # Get all Dodgers players
        players = Player.query.filter_by(team_id=dodgers.id).all()
        
        # Create test batting stats for each player
        for player in players:
            batting_stats = BattingStats(
                player_id=player.id,
                game_id=game.id,
                season=2024,
                at_bats=4,
                hits=2,
                runs=1,
                rbis=1,
                home_runs=0,
                batting_average=0.500
            )
            db.session.add(batting_stats)
        
        db.session.commit()
        print("Test batting statistics imported successfully!")

if __name__ == '__main__':
    import_dodgers_stats() 