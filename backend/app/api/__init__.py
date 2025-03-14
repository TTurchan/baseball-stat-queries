from flask import Blueprint

bp = Blueprint('api', __name__)

# Import routes after creating blueprint to avoid circular imports
from app.api.statistics import bp as stats_bp  # Import the statistics blueprint

def init_app(app):
    app.register_blueprint(stats_bp, url_prefix='/api') 