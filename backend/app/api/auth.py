from flask import g, jsonify
from flask_httpauth import HTTPTokenAuth
from app.models import User

token_auth = HTTPTokenAuth()

@token_auth.verify_token
def verify_token(token):
    # For now, we'll use a simple token verification
    # In production, this should be replaced with proper JWT verification
    if token == 'dev-token':
        g.current_user = User.query.filter_by(id=1).first()
        return True
    return False

@token_auth.error_handler
def token_error():
    return jsonify({'error': 'Invalid token'}), 401 