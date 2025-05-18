import graphene
import graphql_jwt
from graphql_jwt.decorators import login_required
import uuid
import os
from django.core.files.base import ContentFile
import base64

from .queries import ListingImageType

from .models import Listing, ListingImage

class UploadListingImageMutation(graphene.Mutation):
    class Arguments:
        listing_id = graphene.ID(required=True)
        image_data = graphene.String(required=True)
        is_primary = graphene.Boolean(default=False)
        
    image = graphene.Field(ListingImageType)
    success = graphene.Boolean()
    message = graphene.String()
    
    @login_required
    def mutate(self, info, listing_id, image_data, is_primary=False):
        user = info.context.user
        
        try:
            # Get the listing
            listing = Listing.objects.get(id=listing_id)
            
            # Check if the user is the owner of the listing
            if listing.user.id != user.id and not user.is_staff:
                return UploadListingImageMutation(
                    success=False,
                    message="Permission refusée. Vous ne pouvez ajouter des images qu'à vos propres annonces."
                )
            
            # Handle the base64 encoded image
            # Format is typically: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
            if ';base64,' not in image_data:
                return UploadListingImageMutation(
                    success=False,
                    message="Format d'image invalide. L'image doit être encodée en base64."
                )
                
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            
            # Generate a unique filename
            filename = f"{uuid.uuid4()}.{ext}"
            
            # Create the image file from the base64 data
            data = ContentFile(base64.b64decode(imgstr), name=filename)
            
            # If this is set as primary, unset any existing primary images
            if is_primary:
                ListingImage.objects.filter(listing=listing, is_primary=True).update(is_primary=False)
            
            # Create the image record
            image = ListingImage(
                listing=listing,
                is_primary=is_primary
            )
            image.image.save(filename, data, save=False)
            image.save()
            
            return UploadListingImageMutation(
                image=image,
                success=True,
                message="Image téléchargée avec succès"
            )
            
        except Listing.DoesNotExist:
            return UploadListingImageMutation(
                success=False,
                message=f"L'annonce avec l'ID {listing_id} n'existe pas"
            )
        except Exception as e:
            return UploadListingImageMutation(
                success=False,
                message=f"Erreur lors du téléchargement de l'image: {str(e)}"
            )


class DeleteListingImageMutation(graphene.Mutation):
    class Arguments:
        image_id = graphene.ID(required=True)
        
    success = graphene.Boolean()
    message = graphene.String()
    
    @login_required
    def mutate(self, info, image_id):
        user = info.context.user
        
        try:
            # Get the image
            image = ListingImage.objects.get(id=image_id)
            
            # Check if the user is the owner of the listing
            if image.listing.user.id != user.id and not user.is_staff:
                return DeleteListingImageMutation(
                    success=False,
                    message="Permission refusée. Vous ne pouvez supprimer que des images de vos propres annonces."
                )
            
            # Delete the image file from storage
            if image.image and os.path.isfile(image.image.path):
                os.remove(image.image.path)
            
            # Delete the image record
            image.delete()
            
            return DeleteListingImageMutation(
                success=True,
                message="Image supprimée avec succès"
            )
            
        except ListingImage.DoesNotExist:
            return DeleteListingImageMutation(
                success=False,
                message=f"L'image avec l'ID {image_id} n'existe pas"
            )
        except Exception as e:
            return DeleteListingImageMutation(
                success=False,
                message=f"Erreur lors de la suppression de l'image: {str(e)}"
            )


class SetPrimaryListingImageMutation(graphene.Mutation):
    class Arguments:
        image_id = graphene.ID(required=True)
        
    success = graphene.Boolean()
    message = graphene.String()
    
    @login_required
    def mutate(self, info, image_id):
        user = info.context.user
        
        try:
            # Get the image
            image = ListingImage.objects.get(id=image_id)
            
            # Check if the user is the owner of the listing
            if image.listing.user.id != user.id and not user.is_staff:
                return SetPrimaryListingImageMutation(
                    success=False,
                    message="Permission refusée. Vous ne pouvez modifier que des images de vos propres annonces."
                )
            
            # Unset any existing primary images for this listing
            ListingImage.objects.filter(listing=image.listing, is_primary=True).update(is_primary=False)
            
            # Set this image as primary
            image.is_primary = True
            image.save()
            
            return SetPrimaryListingImageMutation(
                success=True,
                message="Image définie comme principale avec succès"
            )
            
        except ListingImage.DoesNotExist:
            return SetPrimaryListingImageMutation(
                success=False,
                message=f"L'image avec l'ID {image_id} n'existe pas"
            )
        except Exception as e:
            return SetPrimaryListingImageMutation(
                success=False,
                message=f"Erreur lors de la définition de l'image principale: {str(e)}"
            )