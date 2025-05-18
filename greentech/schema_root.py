import graphene

from marketplace.schema import Query as MarketplaceQuery, Mutation as MarketplaceMutation

class Query(MarketplaceQuery, graphene.ObjectType):
    pass

class Mutation(MarketplaceMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation= Mutation)

