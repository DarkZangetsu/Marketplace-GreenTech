import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class MessageConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        """
        Connexion avec debug détaillé
        """
        try:
            print(f"=== CONNEXION WEBSOCKET ===")
            print(f"Scope: {self.scope}")
            print(f"URL route kwargs: {self.scope.get('url_route', {}).get('kwargs', {})}")
            
            # Récupérer l'user_id depuis l'URL
            self.user_id = self.scope['url_route']['kwargs']['user_id']
            self.room_group_name = f'user_{self.user_id}'
            
            print(f"User ID: {self.user_id}")
            print(f"Room group: {self.room_group_name}")
            
            # Accepter la connexion
            await self.accept()
            print(f"✓ WebSocket accepté pour user {self.user_id}")
            
            # Ajouter au groupe
            try:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                print(f"✓ Ajouté au groupe: {self.room_group_name}")
            except Exception as group_error:
                print(f"❌ Erreur ajout au groupe: {group_error}")
            
            # Message de confirmation
            await self.send(text_data=json.dumps({
                'type': 'connected',
                'user_id': str(self.user_id),
                'message': 'Connexion WebSocket établie avec succès',
                'room_group': self.room_group_name
            }))
            
            print(f"✓ Message de confirmation envoyé")
            
        except KeyError as e:
            print(f"❌ Paramètre manquant dans l'URL: {e}")
            await self.close(code=4000)
        except Exception as e:
            print(f"❌ Erreur connexion WebSocket: {e}")
            import traceback
            traceback.print_exc()
            try:
                await self.close(code=4000)
            except:
                pass

    async def disconnect(self, close_code):
        """
        Déconnexion avec debug
        """
        try:
            print(f"=== DÉCONNEXION WEBSOCKET ===")
            print(f"User: {getattr(self, 'user_id', 'Unknown')}")
            print(f"Code: {close_code}")
            
            if hasattr(self, 'room_group_name') and hasattr(self, 'channel_layer'):
                try:
                    await self.channel_layer.group_discard(
                        self.room_group_name,
                        self.channel_name
                    )
                    print(f"✓ Retiré du groupe: {self.room_group_name}")
                except Exception as e:
                    print(f"❌ Erreur retrait du groupe: {e}")
                    
        except Exception as e:
            print(f"❌ Erreur déconnexion: {e}")

    async def receive(self, text_data):
        """
        Réception des messages avec debug
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'unknown')
            
            print(f"📨 Message reçu de user {self.user_id}: {message_type}")
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': asyncio.get_event_loop().time()
                }))
                print(f"🏓 Pong envoyé à user {self.user_id}")
                
            elif message_type == 'test':
                # Test simple
                await self.send(text_data=json.dumps({
                    'type': 'test_response',
                    'message': f'Test réussi pour user {self.user_id}',
                    'timestamp': asyncio.get_event_loop().time()
                }))
                
            else:
                # Echo générique
                await self.send(text_data=json.dumps({
                    'type': 'echo',
                    'original': data,
                    'user_id': str(self.user_id)
                }))
                
        except json.JSONDecodeError as e:
            print(f"❌ Erreur JSON: {e}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Format JSON invalide'
            }))
            
        except Exception as e:
            print(f"❌ Erreur réception message: {e}")
            import traceback
            traceback.print_exc()