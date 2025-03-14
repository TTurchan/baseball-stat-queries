from datetime import datetime
from app import db

class Player(db.Model):
    __tablename__ = 'players'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    team = db.Column(db.String(3), nullable=False)
    position = db.Column(db.String(2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    batting_stats = db.relationship('BattingStats', backref='player', lazy=True)
    pitching_stats = db.relationship('PitchingStats', backref='player', lazy=True)

class BattingStats(db.Model):
    __tablename__ = 'batting_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    season = db.Column(db.Integer, nullable=False)
    games = db.Column(db.Integer)
    at_bats = db.Column(db.Integer)
    hits = db.Column(db.Integer)
    runs = db.Column(db.Integer)
    rbis = db.Column(db.Integer)
    home_runs = db.Column(db.Integer)
    batting_average = db.Column(db.Float)
    exit_velocity = db.Column(db.Float)
    launch_angle = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PitchingStats(db.Model):
    __tablename__ = 'pitching_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    season = db.Column(db.Integer, nullable=False)
    games = db.Column(db.Integer)
    innings_pitched = db.Column(db.Float)
    hits_allowed = db.Column(db.Integer)
    runs_allowed = db.Column(db.Integer)
    earned_runs = db.Column(db.Integer)
    walks = db.Column(db.Integer)
    strikeouts = db.Column(db.Integer)
    era = db.Column(db.Float)
    velocity = db.Column(db.Float)
    spin_rate = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 