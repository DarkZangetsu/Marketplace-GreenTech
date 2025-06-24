#!/usr/bin/env python3
"""
Script pour vérifier les variables d'environnement
"""

import os
from dotenv import load_dotenv

# Charger le fichier .env
load_dotenv()

print("🔍 Vérification des variables d'environnement")
print("=" * 50)

# Variables à vérifier
variables = [
    'USE_POSTGRESQL',
    'DB_NAME', 'DB_USER', 'DB_HOST', 'DB_PORT',
    'REDIS_HOST', 'REDIS_PORT', 'REDIS_CAPACITY', 'REDIS_EXPIRY'
]

for var in variables:
    value = os.environ.get(var, 'NON DÉFINI')
    if 'PASSWORD' in var:
        value = '***' if value else 'NON DÉFINI'
    print(f"{var}: {value}")

print("\n🔧 Configuration qui sera utilisée:")
print(f"Base de données: {'PostgreSQL' if os.environ.get('USE_POSTGRESQL', '').lower() == 'true' else 'SQLite'}")
print(f"Redis: {os.environ.get('REDIS_HOST', 'localhost')}:{os.environ.get('REDIS_PORT', '6379')}")
