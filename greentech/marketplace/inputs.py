import graphene


class CategoryInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String(required=True)


class ListingInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    category_id = graphene.ID(required=True)
    condition = graphene.String(required=True)
    quantity = graphene.Int(default_value=1)
    unit = graphene.String(default_value="unité")
    price = graphene.Float()
    is_free = graphene.Boolean(default_value=False)
    location = graphene.String(required=True)
    address = graphene.String()
    contact_method = graphene.String(default_value="platform")
    phone_number = graphene.String()
    email = graphene.String()
    
class UserProfileInput(graphene.InputObjectType):
    """Input type for updating a user profile"""
    email = graphene.String(description="Adresse email de l'utilisateur")
    first_name = graphene.String(description="Prénom de l'utilisateur")
    last_name = graphene.String(description="Nom de famille de l'utilisateur")
    phone_number = graphene.String(description="Numéro de téléphone de l'utilisateur")
