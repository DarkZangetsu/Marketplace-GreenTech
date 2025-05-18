import graphene

from .queries import Query
from .mutations import Mutation


class Schema(graphene.Schema):
    query = Query
    mutation = Mutation


schema = graphene.Schema(query=Query, mutation=Mutation)