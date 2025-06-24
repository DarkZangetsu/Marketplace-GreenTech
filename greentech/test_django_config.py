#!/usr/bin/env python3
"""
Test de la configuration Django
"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'greentech.settings')
django.setup()

from django.conf import settings

print("🔧 Configuration Django chargée")
print("=" * 40)

# Test base de données
db_config = settings.DATABASES['default']
print(f"Base de données:")
print(f"  Engine: {db_config['ENGINE']}")
print(f"  Host: {db_config.get('HOST', 'N/A')}")
print(f"  Port: {db_config.get('PORT', 'N/A')}")
print(f"  Name: {db_config.get('NAME', 'N/A')}")

# Test Redis
if hasattr(settings, 'CHANNEL_LAYERS'):
    redis_config = settings.CHANNEL_LAYERS['default']['CONFIG']
    print(f"\nRedis:")
    print(f"  Hosts: {redis_config.get('hosts')}")
    print(f"  Capacity: {redis_config.get('capacity')}")
    print(f"  Expiry: {redis_config.get('expiry')}s")

# Variables d'environnement
print(f"\nVariables d'environnement:")
print(f"  USE_POSTGRESQL: {os.environ.get('USE_POSTGRESQL')}")
print(f"  REDIS_HOST: {os.environ.get('REDIS_HOST')}")
print(f"  DB_HOST: {os.environ.get('DB_HOST')}")
