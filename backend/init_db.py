from app import create_app, db
from app.models import User, Team, Player, Game, BattingStats, PitchingStats

def init_db():
    app = create_app()
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create a test user
        if not User.query.filter_by(username='admin').first():
            user = User(
                username='admin',
                email='admin@example.com',
                password_hash='pbkdf2:sha256:260000$your-salt-here$your-hash-here'  # This should be properly hashed in production
            )
            db.session.add(user)
            db.session.commit()
        
        # Create some test teams
        teams = [
            Team(name='New York Yankees', abbreviation='NYY'),
            Team(name='Boston Red Sox', abbreviation='BOS'),
            Team(name='Los Angeles Dodgers', abbreviation='LAD')
        ]
        
        for team in teams:
            if not Team.query.filter_by(name=team.name).first():
                db.session.add(team)
        
        db.session.commit()
        
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_db() 