import graphene
from graphql_jwt.decorators import login_required

from .queries import CategoryType

from .inputs import CategoryInput

from .models import  Category

class CreateCategoryMutation(graphene.Mutation):
    class Arguments:
        input = CategoryInput(required=True)

    category = graphene.Field(CategoryType)
    
    @login_required
    def mutate(self, info, input):
        # Usually requires admin permissions
        if not info.context.user.is_staff:
            raise Exception("Permission denied. Only staff can create categories.")
        
        category = Category(
            name=input.name,
            slug=input.slug
        )
        
        try:
            category.save()
            return CreateCategoryMutation(category=category)
        except Exception as e:
            raise Exception(f"Error creating category: {str(e)}")


class UpdateCategoryMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = CategoryInput(required=True)

    category = graphene.Field(CategoryType)
    
    @login_required
    def mutate(self, info, id, input):
        # Usually requires admin permissions
        if not info.context.user.is_staff:
            raise Exception("Permission denied. Only staff can update categories.")
        
        try:
            category = Category.objects.get(id=id)
            category.name = input.name
            category.slug = input.slug
            category.save()
            return UpdateCategoryMutation(category=category)
        except Category.DoesNotExist:
            raise Exception(f"Category with ID {id} does not exist")
        except Exception as e:
            raise Exception(f"Error updating category: {str(e)}")


class DeleteCategoryMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    
    @login_required
    def mutate(self, info, id):
        # Usually requires admin permissions
        if not info.context.user.is_staff:
            raise Exception("Permission denied. Only staff can delete categories.")
        
        try:
            category = Category.objects.get(id=id)
            category.delete()
            return DeleteCategoryMutation(success=True)
        except Category.DoesNotExist:
            raise Exception(f"Category with ID {id} does not exist")
        except Exception as e:
            raise Exception(f"Error deleting category: {str(e)}")