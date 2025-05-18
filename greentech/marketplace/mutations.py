import graphene
import graphql_jwt

from .userMutation import ChangePasswordMutation, LoginUserMutation, RegisterUserMutation, UpdateUserProfileMutation

from .messageMutation import MarkMessageAsReadMutation, SendMessageMutation, ToggleFavoriteMutation

from .listingMutation import ChangeListingStatusMutation, CreateListingMutation, DeleteListingMutation, UpdateListingMutation

from .categoriesMutation import CreateCategoryMutation, DeleteCategoryMutation, UpdateCategoryMutation


class Mutation(graphene.ObjectType):
    # Auth mutations
    register = RegisterUserMutation.Field()
    login = LoginUserMutation.Field()
    change_password = ChangePasswordMutation.Field()
    
    # JWT token mutations for authentication
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    
    # User profile mutations
    update_user_profile = UpdateUserProfileMutation.Field()
    
    # Category mutations
    create_category = CreateCategoryMutation.Field()
    update_category = UpdateCategoryMutation.Field()
    delete_category = DeleteCategoryMutation.Field()
    
    # Listing mutations
    create_listing = CreateListingMutation.Field()
    update_listing = UpdateListingMutation.Field()
    change_listing_status = ChangeListingStatusMutation.Field()
    delete_listing = DeleteListingMutation.Field()
    
    # Message mutations
    send_message = SendMessageMutation.Field()
    mark_message_as_read = MarkMessageAsReadMutation.Field()
    
    # Favorite mutations
    toggle_favorite = ToggleFavoriteMutation.Field()