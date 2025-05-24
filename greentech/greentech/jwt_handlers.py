import calendar
from datetime import datetime, timedelta
from graphql_jwt.settings import jwt_settings

def custom_jwt_payload(user, context=None):
    """
    Version alternative du payload handler
    """
    
    now = datetime.utcnow()
    
    payload = {
        'user_id': user.pk, 
        'username': user.get_username(),
        'exp': now + timedelta(seconds=jwt_settings.JWT_EXPIRATION_DELTA.total_seconds()),
        'orig_iat': calendar.timegm(now.utctimetuple()),
    }
    
    return payload