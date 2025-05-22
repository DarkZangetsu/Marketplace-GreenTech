import graphene
from graphql_jwt.decorators import login_required
from django.core.exceptions import ValidationError
import uuid
from decimal import Decimal

from .queries import ListingType
from .inputs import ListingInput
from .models import Category, Listing, User

class CreateListingMutation(graphene.Mutation):
    class Arguments:
        input = ListingInput(required=True)

    listing = graphene.Field(ListingType)
    
    @login_required
    def mutate(self, info, input):
        try:
            category = Category.objects.get(id=input.category_id)
        except Category.DoesNotExist:
            raise Exception(f"Category with ID {input.category_id} does not exist")
        
        try:
            user = User.objects.get(id=input.user_id)
        except User.DoesNotExist:
            raise Exception(f"User with ID {input.user_id} does not exist")
        
        listing = Listing(
            id=uuid.uuid4(),
            user=user,
            title=input.title,
            description=input.description,
            category=category,
            condition=input.condition,
            quantity=input.quantity,
            unit=input.unit,
            is_free=input.is_free,
            location=input.location,
            contact_method=input.contact_method,
        )
        
        # Handle price based on whether it's free or not
        if input.is_free:
            listing.price = Decimal('0.00')
        else:
            if input.price is None:
                raise ValidationError("Price is required for non-free listings")
            listing.price = Decimal(str(input.price))
        
        # Optional fields
        if hasattr(input, 'address') and input.address:
            listing.address = input.address
        
        if hasattr(input, 'phone_number') and input.phone_number:
            listing.phone_number = input.phone_number
        
        if hasattr(input, 'email') and input.email:
            listing.email = input.email
        
        try:
            listing.save()
            return CreateListingMutation(listing=listing)
        except Exception as e:
            raise Exception(f"Error creating listing: {str(e)}")


class UpdateListingMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = ListingInput(required=True)

    listing = graphene.Field(ListingType)
    
    @login_required
    def mutate(self, info, id, input):
        # Debugging: vérifier l'utilisateur
        print(f"User from context: {info.context.user}")
        print(f"User authenticated: {info.context.user.is_authenticated if hasattr(info.context.user, 'is_authenticated') else 'No auth attribute'}")
        
        user = info.context.user
        
        try:
            listing = Listing.objects.get(id=id)
            
            # Check if the user is the owner of the listing
            if str(listing.user.id) != str(user.id) and not user.is_staff:
                raise Exception("Permission denied. You can only update your own listings.")
            
            # Update category if provided
            if input.category_id:
                try:
                    category = Category.objects.get(id=input.category_id)
                    listing.category = category
                except Category.DoesNotExist:
                    raise Exception(f"Category with ID {input.category_id} does not exist")
            
            # Update fields
            listing.title = input.title
            listing.description = input.description
            listing.condition = input.condition
            listing.quantity = input.quantity
            listing.unit = input.unit
            listing.is_free = input.is_free
            listing.location = input.location
            listing.contact_method = input.contact_method
            
            # Handle price based on whether it's free or not
            if input.is_free:
                listing.price = Decimal('0.00')
            else:
                if input.price is None:
                    raise ValidationError("Price is required for non-free listings")
                listing.price = Decimal(str(input.price))
            
            # Optional fields
            if hasattr(input, 'address'):
                listing.address = input.address or ""
            
            if hasattr(input, 'phone_number'):
                listing.phone_number = input.phone_number or None
            
            if hasattr(input, 'email'):
                listing.email = input.email or None
            
            listing.save()
            return UpdateListingMutation(listing=listing)
            
        except Listing.DoesNotExist:
            raise Exception(f"Listing with ID {id} does not exist")
        except Exception as e:
            raise Exception(f"Error updating listing: {str(e)}")


class ChangeListingStatusMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        status = graphene.String(required=True)

    success = graphene.Boolean()
    listing = graphene.Field(ListingType)
    
    @login_required
    def mutate(self, info, id, status):
        # Debugging: vérifier l'utilisateur
        print(f"User from context: {info.context.user}")
        print(f"User authenticated: {info.context.user.is_authenticated if hasattr(info.context.user, 'is_authenticated') else 'No auth attribute'}")
        
        user = info.context.user
        
        try:
            listing = Listing.objects.get(id=id)
            
            # Check if the user is the owner of the listing
            if str(listing.user.id) != str(user.id) and not user.is_staff:
                raise Exception("Permission denied. You can only update your own listings.")
            
            # Validate status value
            if status not in [choice[0] for choice in Listing.STATUS_CHOICES]:
                raise Exception(f"Invalid status: {status}")
            
            listing.status = status
            listing.save()
            
            return ChangeListingStatusMutation(success=True, listing=listing)
            
        except Listing.DoesNotExist:
            raise Exception(f"Listing with ID {id} does not exist")
        except Exception as e:
            raise Exception(f"Error updating listing status: {str(e)}")


class DeleteListingMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    
    @login_required
    def mutate(self, info, id):
        # Debugging: vérifier l'utilisateur
        print(f"User from context: {info.context.user}")
        print(f"User authenticated: {info.context.user.is_authenticated if hasattr(info.context.user, 'is_authenticated') else 'No auth attribute'}")
        
        user = info.context.user
        
        try:
            listing = Listing.objects.get(id=id)
            
            # Check if the user is the owner of the listing
            if str(listing.user.id) != str(user.id) and not user.is_staff:
                raise Exception("Permission denied. You can only delete your own listings.")
            
            listing.delete()
            
            return DeleteListingMutation(success=True)
            
        except Listing.DoesNotExist:
            raise Exception(f"Listing with ID {id} does not exist")
        except Exception as e:
            raise Exception(f"Error deleting listing: {str(e)}")