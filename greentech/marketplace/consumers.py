import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

# Set global pour tracker les utilisateurs connectés
connected_users = set()

class MessageConsumer(AsyncWebsocketConsumer):

    async def broadcast_user_status(self, user_id, status):
        """
        Diffuser le changement de statut d'un utilisateur à tous les autres utilisateurs connectés
        """
        try:
            # Diffuser à tous les utilisateurs connectés
            for connected_user_id in connected_users:
                if connected_user_id != user_id:  # Ne pas envoyer à soi-même
                    await self.channel_layer.group_send(
                        f'user_{connected_user_id}',
                        {
                            'type': 'user_status_change',
                            'user_id': str(user_id),
                            'status': status
                        }
                    )
        except Exception:
            pass

    async def user_status_change(self, event):
        """
        Gestionnaire pour envoyer les changements de statut via WebSocket
        """
        await self.send(text_data=json.dumps({
            'type': 'user_status',
            'user_id': event['user_id'],
            'status': event['status']
        }))

    async def connect(self):
        """
        Connexion WebSocket
        """
        try:
            # Récupérer l'user_id depuis l'URL
            self.user_id = self.scope['url_route']['kwargs']['user_id']
            self.room_group_name = f'user_{self.user_id}'

            # Accepter la connexion
            await self.accept()

            # Ajouter au groupe
            try:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
            except Exception:
                pass

            # Ajouter l'utilisateur aux connectés
            connected_users.add(str(self.user_id))

            # Message de confirmation
            await self.send(text_data=json.dumps({
                'type': 'connected',
                'user_id': str(self.user_id),
                'message': 'Connexion WebSocket établie avec succès',
                'room_group': self.room_group_name
            }))

            # Diffuser le statut "online" aux autres utilisateurs
            await self.broadcast_user_status(str(self.user_id), 'online')

        except KeyError:
            await self.close(code=4000)
        except Exception:
            try:
                await self.close(code=4000)
            except:
                pass

    async def disconnect(self, close_code):
        """
        Déconnexion WebSocket
        """
        try:
            # Retirer l'utilisateur des connectés et diffuser le statut offline
            if hasattr(self, 'user_id'):
                user_id_str = str(self.user_id)
                if user_id_str in connected_users:
                    connected_users.remove(user_id_str)

                    # Diffuser le statut "offline" aux autres utilisateurs
                    await self.broadcast_user_status(user_id_str, 'offline')

            if hasattr(self, 'room_group_name') and hasattr(self, 'channel_layer'):
                try:
                    await self.channel_layer.group_discard(
                        self.room_group_name,
                        self.channel_name
                    )
                except Exception:
                    pass

        except Exception:
            pass

    async def receive(self, text_data):
        """
        Réception des messages WebSocket
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'unknown')

            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': asyncio.get_event_loop().time()
                }))

            elif message_type == 'test':
                # Test simple
                await self.send(text_data=json.dumps({
                    'type': 'test_response',
                    'message': f'Test réussi pour user {self.user_id}',
                    'timestamp': asyncio.get_event_loop().time()
                }))

            elif message_type == 'get_online_users':
                # Envoyer la liste des utilisateurs en ligne
                await self.send(text_data=json.dumps({
                    'type': 'online_users_list',
                    'online_users': list(connected_users),
                    'count': len(connected_users)
                }))

            else:
                # Echo générique
                await self.send(text_data=json.dumps({
                    'type': 'echo',
                    'original': data,
                    'user_id': str(self.user_id)
                }))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Format JSON invalide'
            }))

        except Exception:
            pass