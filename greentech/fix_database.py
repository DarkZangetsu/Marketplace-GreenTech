#!/usr/bin/env python3
"""
Script pour nettoyer et recréer la base de données
"""

import os
import sys
import django
from pathlib import Path

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'greentech.settings')
django.setup()

def reset_database():
    """Recrée la base de données"""
    print("🗄️  Nettoyage de la base de données...")
    
    from django.core.management import execute_from_command_line
    
    try:
        # Supprimer les migrations (sauf __init__.py)
        print("1. Suppression des fichiers de migration...")
        
        apps_dir = Path('.')
        for app_dir in apps_dir.glob('*/migrations'):
            if app_dir.is_dir():
                for migration_file in app_dir.glob('*.py'):
                    if migration_file.name != '__init__.py':
                        migration_file.unlink()
                        print(f"   Supprimé: {migration_file}")
        
        # Supprimer la base SQLite si elle existe
        sqlite_db = Path('db.sqlite3')
        if sqlite_db.exists():
            sqlite_db.unlink()
            print("2. Base SQLite supprimée")
        
        # Créer de nouvelles migrations
        print("3. Création de nouvelles migrations...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        
        # Appliquer les migrations
        print("4. Application des migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("✅ Base de données nettoyée avec succès!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def load_fixtures_safely():
    """Charge les fixtures en évitant les doublons"""
    print("\n📦 Chargement des fixtures...")
    
    from django.core.management import execute_from_command_line
    
    fixtures_dir = Path('fixtures')
    if not fixtures_dir.exists():
        print("⚠️  Aucun dossier fixtures trouvé")
        return True
    
    fixture_files = list(fixtures_dir.glob('*.json'))
    if not fixture_files:
        print("⚠️  Aucun fichier fixture trouvé")
        return True
    
    for fixture_file in fixture_files:
        try:
            print(f"Chargement: {fixture_file.name}")
            execute_from_command_line(['manage.py', 'loaddata', str(fixture_file)])
            print(f"✅ {fixture_file.name} chargé")
        except Exception as e:
            print(f"❌ Erreur avec {fixture_file.name}: {e}")
            # Continuer avec les autres fixtures
            continue
    
    return True

def create_superuser():
    """Propose de créer un superutilisateur"""
    print("\n👤 Création d'un superutilisateur...")
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    if User.objects.filter(is_superuser=True).exists():
        print("✅ Un superutilisateur existe déjà")
        return True
    
    create = input("Créer un superutilisateur? [y/N]: ").strip().lower()
    
    if create in ['y', 'yes', 'oui']:
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'createsuperuser'])
    
    return True

def main():
    """Fonction principale"""
    print("🔧 Nettoyage et réinitialisation de la base de données")
    print("=" * 60)
    
    # Vérifier la configuration
    from django.conf import settings
    db_engine = settings.DATABASES['default']['ENGINE']
    print(f"Base de données: {db_engine}")
    
    if 'postgresql' in db_engine:
        print("⚠️  ATTENTION: Vous utilisez PostgreSQL")
        print("Ce script va supprimer toutes les données!")
        confirm = input("Continuer? [y/N]: ").strip().lower()
        if confirm not in ['y', 'yes', 'oui']:
            print("Opération annulée")
            return False
    
    # Réinitialiser la base
    if not reset_database():
        return False
    
    # Charger les fixtures
    load_fixtures_safely()
    
    # Créer un superutilisateur
    create_superuser()
    
    print("\n🎉 Base de données réinitialisée avec succès!")
    print("Vous pouvez maintenant lancer: python manage.py runserver")
    
    return True

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n⚠️  Opération interrompue")
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        sys.exit(1)
