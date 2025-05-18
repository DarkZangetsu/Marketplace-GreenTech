import graphene
from graphql_jwt.decorators import login_required

from .queries import FavoriteType, MessageType
from .models import User, Listing, Message, Favorite

class SendMessageMutation(graphene.Mutation):
    class Arguments:
        listing_id = graphene.ID(required=True)
        receiver_id = graphene.ID(required=True)
        message = graphene.String(required=True)

    message_obj = graphene.Field(MessageType)
    
    @login_required
    def mutate(self, info, listing_id, receiver_id, message):
        sender = info.context.user
        
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            raise Exception(f"User with ID {receiver_id} does not exist")
        
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            raise Exception(f"Listing with ID {listing_id} does not exist")
        
        message_obj = Message(
            listing=listing,
            sender=sender,
            receiver=receiver,
            message=message,
            is_read=False
        )
        
        try:
            message_obj.save()
            return SendMessageMutation(message_obj=message_obj)
        except Exception as e:
            raise Exception(f"Error sending message: {str(e)}")


class MarkMessageAsReadMutation(graphene.Mutation):
    class Arguments:
        message_id = graphene.ID(required=True)

    message = graphene.Field(MessageType)
    
    @login_required
    def mutate(self, info, message_id):
        user = info.context.user
        
        try:
            message = Message.objects.get(id=message_id)
            
            # Check if the user is the receiver of the message
            if message.receiver.id != user.id:
                raise Exception("Permission denied. You cannot mark this message as read.")
            
            message.is_read = True
            message.save()
            
            return MarkMessageAsReadMutation(message=message)
            
        except Message.DoesNotExist:
            raise Exception(f"Message with ID {message_id} does not exist")
        except Exception as e:
            raise Exception(f"Error marking message as read: {str(e)}")


class ToggleFavoriteMutation(graphene.Mutation):
    class Arguments:
        listing_id = graphene.ID(required=True)

    favorite = graphene.Field(FavoriteType)
    is_favorite = graphene.Boolean()
    
    @login_required
    def mutate(self, info, listing_id):
        user = info.context.user
        
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            raise Exception(f"Listing with ID {listing_id} does not exist")
        
        favorite, created = Favorite.objects.get_or_create(
            user=user,
            listing=listing
        )
        
        # If not created, it means it already exists, so we should delete it
        if not created:
            favorite.delete()
            return ToggleFavoriteMutation(favorite=None, is_favorite=False)
        
        return ToggleFavoriteMutation(favorite=favorite, is_favorite=True)