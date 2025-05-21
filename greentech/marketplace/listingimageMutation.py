import graphene
from graphql_jwt.decorators import login_required
import os
from graphene_file_upload.scalars import Upload

from .queries import ListingImageType

from .models import Listing, ListingImage

class UploadListingImageMutation(graphene.Mutation):
    class Arguments:
        listing_id = graphene.ID(required=True)
        image = Upload(required=True)
        is_primary = graphene.Boolean()

    success = graphene.Boolean()
    listing_image = graphene.Field(ListingImageType)
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, listing_id, image, is_primary=False):
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"Début de la mutation UploadListingImage: listing_id={listing_id}, is_primary={is_primary}")
        logger.info(f"Type d'image reçu: {type(image)}")
        
        try:
            listing = Listing.objects.get(pk=listing_id)
            logger.info(f"Listing trouvé: {listing.id} - {listing.title}")
            
            # Create the listing image
            listing_image = ListingImage.objects.create(
                listing=listing,
                image=image,
                is_primary=is_primary
            )
            logger.info(f"Image créée avec l'ID: {listing_image.id}")
            
            # If this is set as primary, unset any other primary images
            if is_primary:
                ListingImage.objects.filter(
                    listing=listing,
                    is_primary=True
                ).exclude(
                    id=listing_image.id
                ).update(is_primary=False)
                logger.info("Autres images primaires réinitialisées")
            
            return UploadListingImageMutation(
                success=True,
                listing_image=listing_image
            )
            
        except Listing.DoesNotExist:
            logger.error(f"Listing non trouvé avec ID: {listing_id}")
            return UploadListingImageMutation(
                success=False,
                errors=["Listing not found"]
            )
        except Exception as e:
            logger.error(f"Erreur lors de l'upload d'image: {str(e)}", exc_info=True)
            return UploadListingImageMutation(
                success=False,
                errors=[str(e)]
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