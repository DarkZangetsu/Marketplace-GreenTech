import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from django.db.models import Q

from .models import User, Category, Listing, ListingImage, Message, Favorite


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'phone_number', 'profile_picture', 'created_at', 'updated_at',
                  'listings', 'sent_messages', 'received_messages', 'favorites')


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'created_at', 'listings')


class ListingImageType(DjangoObjectType):
    class Meta:
        model = ListingImage
        fields = ('id', 'listing', 'image', 'is_primary', 'created_at')


class ListingType(DjangoObjectType):
    userId = graphene.ID(source='user.id')
    
    class Meta:
        model = Listing
        fields = ('id', 'user', 'title', 'description', 'category', 'condition',
                 'quantity', 'unit', 'price', 'is_free', 'location', 'address',
                 'contact_method', 'phone_number', 'email', 'status', 'created_at',
                 'updated_at', 'images', 'messages', 'favorited_by')
    
    primary_image = graphene.Field(ListingImageType)
    
    def resolve_primary_image(self, info):
        return self.images.filter(is_primary=True).first() or self.images.first()


class MessageType(DjangoObjectType):
    class Meta:
        model = Message
        fields = ('id', 'listing', 'sender', 'receiver', 'message', 'is_read', 'created_at')


class FavoriteType(DjangoObjectType):
    class Meta:
        model = Favorite
        fields = ('id', 'user', 'listing', 'created_at')


class Query(graphene.ObjectType):
    # User queries
    me = graphene.Field(UserType)
    user = graphene.Field(UserType, id=graphene.ID(required=True))
    
    # Category queries
    categories = graphene.List(CategoryType)
    category = graphene.Field(CategoryType, id=graphene.ID(), slug=graphene.String())
    
    # Listing queries
    listings = graphene.List(
        ListingType,
        search=graphene.String(),
        category_id=graphene.ID(),
        category_slug=graphene.String(),
        condition=graphene.String(),
        min_price=graphene.Float(),
        max_price=graphene.Float(),
        location=graphene.String(),
        user_id=graphene.ID(),
        status=graphene.String(),
        limit=graphene.Int(),
    )
    listing = graphene.Field(ListingType, id=graphene.ID(required=True))
    my_listings = graphene.List(ListingType, status=graphene.String())
    
    # Message queries
    my_messages = graphene.List(MessageType, is_read=graphene.Boolean())
    conversation = graphene.List(
        MessageType,
        user_id=graphene.ID(required=True),
        listing_id=graphene.ID(required=True)
    )
    
    # Favorite queries
    my_favorites = graphene.List(FavoriteType)
    
    @login_required
    def resolve_me(self, info):
        return info.context.user
    
    def resolve_user(self, info, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None
    
    def resolve_categories(self, info):
        return Category.objects.all()
    
    def resolve_category(self, info, id=None, slug=None):
        if id:
            try:
                return Category.objects.get(id=id)
            except Category.DoesNotExist:
                return None
        if slug:
            try:
                return Category.objects.get(slug=slug)
            except Category.DoesNotExist:
                return None
        return None
    
    def resolve_listings(self, info, search=None, category_id=None, category_slug=None, 
                        condition=None, min_price=None, max_price=None, location=None, 
                        user_id=None, status='active', limit=None):
        queryset = Listing.objects.filter(status=status)
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        if condition:
            queryset = queryset.filter(condition=condition)
        
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)
        
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        if user_id:
            queryset = queryset.filter(user__id=user_id)
        
        # Order by most recent
        queryset = queryset.order_by('-created_at')
        
        # Apply limit if specified
        if limit:
            queryset = queryset[:limit]
            
        return queryset
    
    def resolve_listing(self, info, id):
        try:
            return Listing.objects.get(id=id)
        except Listing.DoesNotExist:
            return None
    
    @login_required
    def resolve_my_listings(self, info, status=None):
        user = info.context.user
        queryset = Listing.objects.filter(user=user)
        
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset.order_by('-created_at')
    
    @login_required
    def resolve_my_messages(self, info, is_read=None):
        user = info.context.user
        queryset = Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        )
        
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read)
            
        return queryset.order_by('-created_at')
    
    @login_required
    def resolve_conversation(self, info, user_id, listing_id):
        user = info.context.user
        other_user = User.objects.get(id=user_id)
        
        queryset = Message.objects.filter(
            (Q(sender=user) & Q(receiver=other_user)) |
            (Q(sender=other_user) & Q(receiver=user)),
            listing__id=listing_id
        )
        
        return queryset.order_by('created_at')
    
    @login_required
    def resolve_my_favorites(self, info):
        user = info.context.user
        return Favorite.objects.filter(user=user).order_by('-created_at')