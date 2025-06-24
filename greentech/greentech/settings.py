"""
Django settings for greentech project.
"""

import datetime
import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# Charger le fichier .env manuellement
def load_env_file():
    env_file = BASE_DIR / '.env'
    if env_file.exists():
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ.setdefault(key.strip(), value.strip())

# Charger les variables d'environnement
load_env_file()

SECRET_KEY = 'token'
DEBUG = True

# Configuration  pour ALLOWED_HOSTS
ALLOWED_HOSTS = [
    'localhost', 
    '127.0.0.1',
    'marketplace-greentech.onrender.com',
    '.onrender.com',
    'marketplace-green-tech.vercel.app',
    '*.vercel.app',
    '.vercel.app',
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'graphene_django',
    'corsheaders',
    'graphql_jwt',
    'storages',
    'graphene_file_upload',
    'channels',
    'channels_redis',
    
    # Local apps
    'marketplace',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'greentech.urls'

# Configuration ASGI pour WebSockets
ASGI_APPLICATION = 'greentech.asgi.application'

# Configuration des channels (Redis requis)
# import os

# # Configuration Redis - Priorité à Render, fallback vers Redis externe
# REDIS_URL = os.environ.get('REDIS_URL')

# if REDIS_URL:
#     # Utiliser Redis de Render (recommandé pour la production)
#     print(f"Utilisation de Redis Render: {REDIS_URL[:20]}...")
#     CHANNEL_LAYERS = {
#         'default': {
#             'BACKEND': 'channels_redis.core.RedisChannelLayer',
#             'CONFIG': {
#                 "hosts": [REDIS_URL],
#                 "capacity": 1500,
#                 "expiry": 60,
#             },
#         },
#     }
# else:
#     # Fallback vers Redis externe (développement)
#     print("Utilisation de Redis externe: 51.20.226.76:6379")
# Configuration Redis avec variables d'environnement
REDIS_HOST = os.environ.get('REDIS_HOST')
REDIS_PORT = int(os.environ.get('REDIS_PORT'))
REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD')
REDIS_CAPACITY = int(os.environ.get('REDIS_CAPACITY'))
REDIS_EXPIRY = int(os.environ.get('REDIS_EXPIRY'))

# Configuration des Channel Layers avec fallback
# USE_REDIS = os.environ.get('USE_REDIS', 'True').lower() == 'true'

# if USE_REDIS:
#     try:
#         if REDIS_PASSWORD:
#             # Avec mot de passe
#             CHANNEL_LAYERS = {
#                 'default': {
#                     'BACKEND': 'channels_redis.core.RedisChannelLayer',
#                     'CONFIG': {
#                         "hosts": [f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/0"],
#                         "capacity": REDIS_CAPACITY,
#                         "expiry": REDIS_EXPIRY,
#                     },
#                 },
#             }
#         else:
#             # Sans mot de passe
#             CHANNEL_LAYERS = {
#                 'default': {
#                     'BACKEND': 'channels_redis.core.RedisChannelLayer',
#                     'CONFIG': {
#                         "hosts": [(REDIS_HOST, REDIS_PORT)],
#                         "capacity": REDIS_CAPACITY,
#                         "expiry": REDIS_EXPIRY,
#                     },
#                 },
#             }
#         print(f"Configuration Redis: {REDIS_HOST}:{REDIS_PORT} (capacity: {REDIS_CAPACITY}, expiry: {REDIS_EXPIRY}s)")
#     except Exception as e:
#         print(f" Erreur Redis: {e}")
#         print("Utilisation d'InMemoryChannelLayer comme fallback")
#         USE_REDIS = False

# if not USE_REDIS:
#     # Fallback vers InMemoryChannelLayer (développement uniquement)
#     CHANNEL_LAYERS = {
#         'default': {
#             'BACKEND': 'channels.layers.InMemoryChannelLayer'
#         }
#     }
#     print("Configuration: InMemoryChannelLayer (développement uniquement)")

# CHANNEL_LAYERS = {
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             "hosts": [("localhost", 6379)],
#             "prefix": "django-channels:",
#             "symmetric_encryption_keys": [
#                 # Clé de 32 caractères minimum
#                 "my-secret-key-for-channels-encryption-12345".encode('utf-8')
#             ],
#             # Options additionnelles
#             "expiry": 60,  # Expiration des messages en secondes
#             "group_expiry": 86400,  # Expiration des groupes en secondes
#             "capacity": 100,  # Capacité du canal
#             "channel_capacity": {
#                 "http.request": 200,
#                 "websocket.connect": 100,
#                 "websocket.disconnect": 100,
#             },
#         },
#     },
# }

# Si vous n'avez pas Redis, utilisez cette configuration temporaire (pour développement uniquement) :
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'greentech.wsgi.application'

# Configuration base de données - PostgreSQL ou SQLite
if os.environ.get('USE_POSTGRESQL', 'False').lower() == 'true':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME'),
            'USER': os.environ.get('DB_USER'),
            'PASSWORD': os.environ.get('DB_PASSWORD'),
            'HOST': os.environ.get('DB_HOST'),
            'PORT': os.environ.get('DB_PORT'),
            'OPTIONS': {
                'sslmode': 'prefer',
            },
        }
    }
else:
    # Configuration SQLite par défaut
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Indian/Antananarivo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'marketplace.User'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

GRAPHENE = {
    'SCHEMA': 'schema_root.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}

AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]

GRAPHQL_JWT = {
    'JWT_ALGORITHM': 'HS256',
    'JWT_SECRET_KEY': SECRET_KEY,
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=7), 
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=30),
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
    'JWT_ALLOW_REFRESH': True,
    'JWT_LONG_RUNNING_REFRESH_TOKEN': True,
    'JWT_ALLOW_ANY_CLASSES': [
        'graphql_jwt.mutations.ObtainJSONWebToken',
        'graphql_jwt.mutations.Verify',
        'graphql_jwt.mutations.Refresh',
    ],
    'JWT_PAYLOAD_HANDLER': 'greentech.jwt_handlers.custom_jwt_payload',
}

if not DEBUG:
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'eu-west-3')
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = None
    AWS_S3_VERIFY = True
    
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    
    
    

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'marketplace.consumers': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}