from app import create_app, db
from app.models import Team, Player, Game, BattingStats, PitchingStats
from datetime import datetime

def import_dodgers_stats():
    app = create_app()
    with app.app_context():
        # Get or create Dodgers team
        dodgers = Team.query.filter_by(abbreviation='LAD').first()
        if not dodgers:
            dodgers = Team(name='Los Angeles Dodgers', abbreviation='LAD')
            db.session.add(dodgers)
            db.session.commit()

        # 2024 Dodgers roster (as of March 2024)
        players = [
            # Catchers
            {'name': 'Will Smith', 'position': 'C'},
            {'name': 'Austin Barnes', 'position': 'C'},
            
            # Infielders
            {'name': 'Freddie Freeman', 'position': '1B'},
            {'name': 'Gavin Lux', 'position': '2B'},
            {'name': 'Mookie Betts', 'position': 'SS'},
            {'name': 'Max Muncy', 'position': '3B'},
            {'name': 'Miguel Rojas', 'position': 'SS'},
            {'name': 'Chris Taylor', 'position': 'IF'},
            
            # Outfielders
            {'name': 'Jason Heyward', 'position': 'RF'},
            {'name': 'James Outman', 'position': 'CF'},
            {'name': 'Teoscar Hernández', 'position': 'LF'},
            {'name': 'Manuel Margot', 'position': 'OF'},
            
            # Starting Pitchers
            {'name': 'Tyler Glasnow', 'position': 'SP'},
            {'name': 'Yoshinobu Yamamoto', 'position': 'SP'},
            {'name': 'Bobby Miller', 'position': 'SP'},
            {'name': 'James Paxton', 'position': 'SP'},
            {'name': 'Gavin Stone', 'position': 'SP'},
            
            # Relief Pitchers
            {'name': 'Evan Phillips', 'position': 'RP'},
            {'name': 'Brusdar Graterol', 'position': 'RP'},
            {'name': 'Ryan Brasier', 'position': 'RP'},
            {'name': 'Joe Kelly', 'position': 'RP'},
            {'name': 'Alex Vesia', 'position': 'RP'},
            {'name': 'Michael Grove', 'position': 'RP'},
            {'name': 'Kyle Hurt', 'position': 'RP'},
        ]

        # Add players to database
        for player_data in players:
            player = Player.query.filter_by(name=player_data['name']).first()
            if not player:
                player = Player(
                    name=player_data['name'],
                    team_id=dodgers.id,
                    position=player_data['position']
                )
                db.session.add(player)
        
        db.session.commit()
        print("Dodgers roster imported successfully!")

if __name__ == '__main__':
    import_dodgers_stats() 