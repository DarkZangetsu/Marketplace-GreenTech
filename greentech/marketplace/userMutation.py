import graphene
from graphql_jwt.decorators import login_required
from django.contrib.auth import  authenticate
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from graphql_jwt.shortcuts import get_token
import uuid
import os
from django.core.files.base import ContentFile
import base64

from .queries import UserType

from .inputs import UserProfileInput

from .models import User

class RegisterUserMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        first_name = graphene.String()
        last_name = graphene.String()
        phone_number = graphene.String()

    user = graphene.Field(UserType)
    token = graphene.String()
    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, username, email, password, first_name=None, last_name=None, phone_number=None):
        try:
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return RegisterUserMutation(
                    success=False,
                    message="Ce nom d'utilisateur est déjà pris."
                )
            
            if User.objects.filter(email=email).exists():
                return RegisterUserMutation(
                    success=False,
                    message="Cette adresse email est déjà utilisée."
                )
            
            # Validate password
            try:
                validate_password(password)
            except ValidationError as e:
                return RegisterUserMutation(
                    success=False,
                    message=f"Erreur de mot de passe: {str(e)}"
                )
            
            # Create user
            user = User(
                username=username,
                email=email,
                first_name=first_name or "",
                last_name=last_name or "",
                phone_number=phone_number
            )
            user.set_password(password)
            user.save()
            
            # Generate token with user ID
            token = get_token(user, {'user_id': str(user.id)})
            
            return RegisterUserMutation(
                user=user,
                token=token,
                success=True,
                message="Inscription réussie!"
            )
            
        except Exception as e:
            return RegisterUserMutation(
                success=False,
                message=f"Une erreur est survenue: {str(e)}"
            )


class LoginUserMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        email = graphene.String()
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    token = graphene.String()
    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, password, username=None, email=None):
        if not username and not email:
            return LoginUserMutation(
                success=False, 
                message="Veuillez fournir un nom d'utilisateur ou une adresse email"
            )

        # Determine login method (username or email)
        if username:
            user = authenticate(username=username, password=password)
        else:
            # Django's authenticate doesn't accept email by default
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                return LoginUserMutation(
                    success=False,
                    message="Aucun utilisateur trouvé avec cette adresse email"
                )

        if user is not None:
            # Generate token with user ID
            token = get_token(user, {'user_id': str(user.id)})
            return LoginUserMutation(
                user=user,
                token=token,
                success=True,
                message="Connexion réussie!"
            )
        else:
            return LoginUserMutation(
                success=False,
                message="Identifiants invalides"
            )


class ChangePasswordMutation(graphene.Mutation):
    class Arguments:
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    
    @login_required
    def mutate(self, info, old_password, new_password):
        user = info.context.user
        
        # Check old password
        if not user.check_password(old_password):
            return ChangePasswordMutation(
                success=False,
                message="Le mot de passe actuel est incorrect"
            )
        
        # Validate new password
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return ChangePasswordMutation(
                success=False,
                message=f"Erreur de mot de passe: {str(e)}"
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return ChangePasswordMutation(
            success=True,
            message="Mot de passe modifié avec succès"
        )


class UpdateUserProfileMutation(graphene.Mutation):
    class Arguments:
        input = UserProfileInput(required=True)

    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()
    
    @login_required
    def mutate(self, info, input):
        user = info.context.user
        
        # Update email if provided and not already taken
        if hasattr(input, 'email') and input.email and input.email != user.email:
            if User.objects.filter(email=input.email).exclude(id=user.id).exists():
                return UpdateUserProfileMutation(
                    user=user,
                    success=False,
                    message="Cette adresse email est déjà utilisée"
                )
            user.email = input.email
        
        # Update other fields if provided
        if hasattr(input, 'first_name') and input.first_name is not None:
            user.first_name = input.first_name
            
        if hasattr(input, 'last_name') and input.last_name is not None:
            user.last_name = input.last_name
            
        if hasattr(input, 'phone_number') and input.phone_number is not None:
            user.phone_number = input.phone_number
            
        try:
            user.save()
            return UpdateUserProfileMutation(
                user=user, 
                success=True,
                message="Profil mis à jour avec succès"
            )
        except Exception as e:
            return UpdateUserProfileMutation(
                user=None, 
                success=False,
                message=f"Erreur lors de la mise à jour du profil: {str(e)}"
            )    


class UploadProfilePictureMutation(graphene.Mutation):
    class Arguments:
        image_data = graphene.String(required=True)
        
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()
    
    @login_required
    def mutate(self, info, image_data):
        user = info.context.user
        
        try:
            # Handle the base64 encoded image
            if ';base64,' not in image_data:
                return UploadProfilePictureMutation(
                    success=False,
                    message="Format d'image invalide. L'image doit être encodée en base64."
                )
                
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            
            # Generate a unique filename
            filename = f"profile_{user.id}_{uuid.uuid4()}.{ext}"
            
            # Create the image file from the base64 data
            data = ContentFile(base64.b64decode(imgstr), name=filename)
            
            # Delete old profile picture if it exists
            if user.profile_picture:
                if os.path.isfile(user.profile_picture.path):
                    os.remove(user.profile_picture.path)
            
            # Save the new profile picture
            user.profile_picture.save(filename, data, save=True)
            
            return UploadProfilePictureMutation(
                user=user,
                success=True,
                message="Photo de profil téléchargée avec succès"
            )
            
        except Exception as e:
            return UploadProfilePictureMutation(
                success=False,
                message=f"Erreur lors du téléchargement de la photo de profil: {str(e)}"
            )
