import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Redis configuration for caching
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # API configuration
    STATCAST_API_KEY = os.environ.get('STATCAST_API_KEY')
    STATCAST_API_URL = os.environ.get('STATCAST_API_URL') or 'https://api.statcast.com/v1'
    
    # Pagination
    ITEMS_PER_PAGE = 50 