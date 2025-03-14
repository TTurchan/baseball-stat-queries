import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Cache configuration
    CACHE_TYPE = "SimpleCache"  # Using simple cache for local development
    CACHE_DEFAULT_TIMEOUT = 300
    
    # API configuration
    STATCAST_API_KEY = os.environ.get('STATCAST_API_KEY')
    STATCAST_API_URL = os.environ.get('STATCAST_API_URL') or 'https://api.statcast.com/v1'
    
    # Pagination
    ITEMS_PER_PAGE = 50 