import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import redis
from django.conf import settings

logger = logging.getLogger(__name__)

class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'user_{self.user_id}'
        
        # Accepter la connexion WebSocket
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # Ajouter au groupe global de présence
        await self.channel_layer.group_add(
            "online_status",
            self.channel_name
        )
        await self.accept()
        
        # Envoyer un message de confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connexion WebSocket établie'
        }))
        
        # Broadcast présence en ligne
        await self.channel_layer.group_send(
            "online_status",
            {
                "type": "user_status",
                "user_id": self.user_id,
                "status": "online"
            }
        )
        
        logger.info(f"✓ WebSocket accepté pour user {self.user_id}")
        logger.info(f"✓ Ajouté au groupe: {self.room_group_name}")
        logger.info("✓ Message de confirmation envoyé")

    async def disconnect(self, close_code):
        # Retirer du groupe
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # Retirer du groupe global de présence
        await self.channel_layer.group_discard(
            "online_status",
            self.channel_name
        )
        # Broadcast présence hors ligne
        await self.channel_layer.group_send(
            "online_status",
            {
                "type": "user_status",
                "user_id": self.user_id,
                "status": "offline"
            }
        )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if message_type == 'message':
                # Traiter le message reçu
                await self.handle_message(text_data_json)
            elif message_type == 'typing':
                # Gérer l'état de frappe
                await self.handle_typing(text_data_json)
            elif message_type == 'read':
                # Marquer les messages comme lus
                await self.handle_read(text_data_json)
                
        except json.JSONDecodeError:
            logger.error("Erreur de décodage JSON")
        except Exception as e:
            logger.error(f"Erreur lors du traitement du message: {str(e)}")

    async def handle_message(self, data):
        try:
            message = data.get('message')
            sender_id = data.get('sender_id')
            receiver_id = data.get('receiver_id')
            listing_id = data.get('listing_id')
            
            if not all([message, sender_id, receiver_id, listing_id]):
                logger.error("Données de message incomplètes")
                return
                
            # Sauvegarder le message dans la base de données
            saved_message = await self.save_message(
                message=message,
                sender_id=sender_id,
                receiver_id=receiver_id,
                listing_id=listing_id
            )
            
            if saved_message:
                # Envoyer le message au destinataire
                await self.channel_layer.group_send(
                    f'user_{receiver_id}',
                    {
                        'type': 'chat_message',
                        'message': {
                            'id': saved_message.id,
                            'content': saved_message.content,
                            'sender_id': str(saved_message.sender.id),
                            'receiver_id': str(saved_message.receiver.id),
                            'listing_id': str(saved_message.listing.id),
                            'created_at': saved_message.created_at.isoformat(),
                            'is_read': saved_message.is_read
                        }
                    }
                )
                
                # Confirmer l'envoi à l'expéditeur
                await self.send(text_data=json.dumps({
                    'type': 'message_sent',
                    'message_id': saved_message.id
                }))
                
        except Exception as e:
            logger.error(f"Erreur lors du traitement du message: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Erreur lors de l\'envoi du message'
            }))

    async def handle_typing(self, data):
        try:
            sender_id = data.get('sender_id')
            receiver_id = data.get('receiver_id')
            is_typing = data.get('is_typing')
            
            if not all([sender_id, receiver_id, is_typing is not None]):
                return
                
            # Envoyer l'état de frappe au destinataire
            await self.channel_layer.group_send(
                f'user_{receiver_id}',
                {
                    'type': 'typing_status',
                    'sender_id': sender_id,
                    'is_typing': is_typing
                }
            )
            
        except Exception as e:
            logger.error(f"Erreur lors du traitement de l'état de frappe: {str(e)}")

    async def handle_read(self, data):
        try:
            message_ids = data.get('message_ids', [])
            reader_id = data.get('reader_id')
            
            if not message_ids or not reader_id:
                return
                
            # Marquer les messages comme lus
            await self.mark_messages_as_read(message_ids, reader_id)
            
            # Notifier l'expéditeur
            for message_id in message_ids:
                message = await self.get_message(message_id)
                if message and message.sender.id != reader_id:
                    await self.channel_layer.group_send(
                        f'user_{message.sender.id}',
                        {
                            'type': 'message_read',
                            'message_id': message_id,
                            'reader_id': reader_id
                        }
                    )
                    
        except Exception as e:
            logger.error(f"Erreur lors du marquage des messages comme lus: {str(e)}")

    @database_sync_to_async
    def save_message(self, message, sender_id, receiver_id, listing_id):
        try:
            sender = get_user_model().objects.get(id=sender_id)
            receiver = get_user_model().objects.get(id=receiver_id)
            
            return Message.objects.create(
                content=message,
                sender=sender,
                receiver=receiver,
                listing_id=listing_id
            )
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde du message: {str(e)}")
            return None

    @database_sync_to_async
    def mark_messages_as_read(self, message_ids, reader_id):
        try:
            Message.objects.filter(
                id__in=message_ids,
                receiver_id=reader_id
            ).update(is_read=True)
        except Exception as e:
            logger.error(f"Erreur lors du marquage des messages comme lus: {str(e)}")

    @database_sync_to_async
    def get_message(self, message_id):
        try:
            return Message.objects.get(id=message_id)
        except Message.DoesNotExist:
            return None

    async def chat_message(self, event):
        # Envoyer le message au WebSocket
        await self.send(text_data=json.dumps(event))

    async def typing_status(self, event):
        # Envoyer l'état de frappe au WebSocket
        await self.send(text_data=json.dumps(event))

    async def message_read(self, event):
        # Envoyer la notification de lecture au WebSocket
        await self.send(text_data=json.dumps(event))

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "user_status",
            "user_id": event["user_id"],
            "status": event["status"]
        })) 