#!/usr/bin/env python3
"""
Script de diagnostic Redis pour GreenTech Marketplace
Usage: python scripts/test_redis.py
"""

import os
import sys
import redis
from urllib.parse import urlparse

def test_redis_connection(host, port, password=None):
    """Test la connexion Redis"""
    print(f"🔍 Test de connexion Redis: {host}:{port}")
    
    try:
        # Connexion
        r = redis.Redis(host=host, port=port, password=password, decode_responses=True)
        
        # Test ping
        response = r.ping()
        if response:
            print("✅ Connexion réussie")
        else:
            print("❌ Ping échoué")
            return False
            
        # Test info
        info = r.info()
        print(f"📊 Version Redis: {info.get('redis_version', 'Inconnue')}")
        
        # Test replication
        replication_info = r.info('replication')
        role = replication_info.get('role', 'unknown')
        print(f"🔄 Rôle: {role}")
        
        if role == 'slave':
            master_host = replication_info.get('master_host', 'unknown')
            master_port = replication_info.get('master_port', 'unknown')
            print(f"⚠️  PROBLÈME: Redis est en mode SLAVE (replica)")
            print(f"   Master: {master_host}:{master_port}")
            return False
        elif role == 'master':
            print("✅ Redis est en mode MASTER (écriture autorisée)")
        
        # Test écriture
        print("📝 Test d'écriture...")
        test_key = "greentech_test_key"
        test_value = "test_value_123"
        
        try:
            r.set(test_key, test_value, ex=10)  # Expire dans 10 secondes
            retrieved_value = r.get(test_key)
            
            if retrieved_value == test_value:
                print("✅ Écriture/lecture réussie")
                r.delete(test_key)  # Nettoyer
                return True
            else:
                print("❌ Valeur récupérée incorrecte")
                return False
                
        except redis.exceptions.ReadOnlyError:
            print("❌ ERREUR: Redis en mode lecture seule (replica)")
            print("💡 Solution: Utilisez un Redis en mode master ou créez un service Redis sur Render")
            return False
        except Exception as e:
            print(f"❌ Erreur d'écriture: {e}")
            return False
            
    except redis.exceptions.ConnectionError as e:
        print(f"❌ Erreur de connexion: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

def test_redis_url(redis_url):
    """Test une URL Redis complète"""
    print(f"🔍 Test URL Redis: {redis_url[:30]}...")
    
    try:
        # Parser l'URL
        parsed = urlparse(redis_url)
        host = parsed.hostname
        port = parsed.port or 6379
        password = parsed.password
        
        return test_redis_connection(host, port, password)
        
    except Exception as e:
        print(f"❌ Erreur parsing URL: {e}")
        return False

def main():
    print("🧪 Diagnostic Redis - GreenTech Marketplace\n")
    
    # 1. Tester Redis de Render (si configuré)
    render_redis_url = os.environ.get('REDIS_URL')
    render_working = False
    
    if render_redis_url:
        print("1️⃣ Test Redis Render (variable REDIS_URL)")
        render_working = test_redis_url(render_redis_url)
        print()
    else:
        print("1️⃣ Redis Render: Variable REDIS_URL non définie")
        print()
    
    # 2. Tester Redis externe
    print("2️⃣ Test Redis externe (51.20.226.76:6379)")
    external_working = test_redis_connection('51.20.226.76', 6379)
    print()
    
    # 3. Résumé et recommandations
    print("📊 Résumé:")
    print(f"   Redis Render: {'✅ OK' if render_working else '❌ Problème ou non configuré'}")
    print(f"   Redis externe: {'✅ OK' if external_working else '❌ Problème (probablement replica)'}")
    print()
    
    if render_working:
        print("🎉 Recommandation: Utilisez Redis Render (déjà configuré)")
        print("   Votre application devrait fonctionner correctement.")
    elif external_working:
        print("✅ Recommandation: Redis externe fonctionne")
        print("   Assurez-vous que la variable REDIS_URL n'est pas définie sur Render")
    else:
        print("❌ Problème: Aucun Redis fonctionnel détecté")
        print()
        print("💡 Solutions:")
        print("   1. Créez un service Redis sur Render (recommandé)")
        print("      - Dashboard Render → New + → Redis")
        print("      - Render configurera automatiquement REDIS_URL")
        print()
        print("   2. Ou configurez votre Redis externe en mode master:")
        print("      redis-cli -h 51.20.226.76 -p 6379 SLAVEOF NO ONE")
        print()
    
    # 4. Instructions pour Render
    if not render_working:
        print("🚀 Pour créer Redis sur Render:")
        print("   1. Allez sur dashboard.render.com")
        print("   2. Cliquez 'New +' → 'Redis'")
        print("   3. Name: greentech-marketplace-redis")
        print("   4. Region: Même que votre service web")
        print("   5. Render ajoutera automatiquement REDIS_URL à votre service web")
        print("   6. Redéployez votre service web")

if __name__ == "__main__":
    main()
