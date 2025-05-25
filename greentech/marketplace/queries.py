import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from django.db.models import Q
from django.db.models.functions import TruncMonth
from django.db.models import Count
from datetime import datetime

from .models import User, Category, Listing, ListingImage, Message, Favorite


class UserType(DjangoObjectType):
    is_active = graphene.Boolean()
    isActive = graphene.Boolean()
    listing_count = graphene.Int()
    message_count = graphene.Int()
    dateJoined = graphene.DateTime()
    lastLogin = graphene.DateTime()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'phone_number', 'profile_picture', 'created_at', 'updated_at',
                  'is_staff',
                  'listings', 'sent_messages', 'received_messages', 'favorites',
                  'date_joined', 'last_login')

    def resolve_is_active(self, info):
        return self.is_active

    def resolve_isActive(self, info):
        return self.is_active

    def resolve_listing_count(self, info):
        return self.listings.count()

    def resolve_message_count(self, info):
        return self.sent_messages.count() + self.received_messages.count()

    def resolve_dateJoined(self, info):
        return self.date_joined

    def resolve_lastLogin(self, info):
        return self.last_login


class CategoryType(DjangoObjectType):
    listing_count = graphene.Int()
    listingCount = graphene.Int()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'created_at', 'listings')

    def resolve_listing_count(self, info):
        return self.listings.count()

    def resolve_listingCount(self, info):
        return self.listings.count()


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
        fields = ('id', 'listing', 'sender', 'receiver', 'message', 'is_read', 'created_at', 'attachment', 'attachment_type')


class FavoriteType(DjangoObjectType):
    class Meta:
        model = Favorite
        fields = ('id', 'user', 'listing', 'created_at')


class StatusCountType(graphene.ObjectType):
    status = graphene.String()
    count = graphene.Int()


class MonthCountType(graphene.ObjectType):
    month = graphene.String()
    count = graphene.Int()


class AdminStatsType(graphene.ObjectType):
    total_users = graphene.Int()
    total_listings = graphene.Int()
    total_categories = graphene.Int()
    total_messages = graphene.Int()
    active_users = graphene.Int()
    active_listings = graphene.Int()
    listings_by_status = graphene.List(StatusCountType)
    users_by_month = graphene.List(MonthCountType)
    listings_by_month = graphene.List(MonthCountType)
    listingsByStatus = graphene.List(StatusCountType)
    usersByMonth = graphene.List(MonthCountType)
    listingsByMonth = graphene.List(MonthCountType)


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
    
    # Admin queries
    admin_stats = graphene.Field(AdminStatsType)
    
    # New query
    all_users = graphene.List(UserType, search=graphene.String(), is_active=graphene.Boolean())
    
    all_listings = graphene.List(
        ListingType,
        status=graphene.String(),
        search=graphene.String()
    )
    allListings = graphene.List(
        ListingType,
        status=graphene.String(),
        search=graphene.String()
    )
    
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
    
    # @login_required
    def resolve_my_listings(self, info, status=None):
        user = info.context.user
        queryset = Listing.objects.filter(user=user)
        
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset.order_by('-created_at')
    
    # @login_required
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

    def resolve_admin_stats(self, info):
        # Listings by status
        listings_by_status = (
            Listing.objects.values('status')
            .annotate(count=Count('id'))
        )
        listings_by_status = [
            StatusCountType(status=entry['status'], count=entry['count'])
            for entry in listings_by_status
        ]

        # Users by month
        users_by_month = (
            User.objects.annotate(month=TruncMonth('date_joined'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        users_by_month = [
            MonthCountType(month=entry['month'].strftime('%Y-%m'), count=entry['count'])
            for entry in users_by_month if entry['month']
        ]

        # Listings by month
        listings_by_month = (
            Listing.objects.annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        listings_by_month = [
            MonthCountType(month=entry['month'].strftime('%Y-%m'), count=entry['count'])
            for entry in listings_by_month if entry['month']
        ]

        return AdminStatsType(
            total_users=User.objects.count(),
            total_listings=Listing.objects.count(),
            total_categories=Category.objects.count(),
            total_messages=Message.objects.count(),
            active_users=User.objects.filter(is_active=True).count(),
            active_listings=Listing.objects.filter(status='active').count(),
            listings_by_status=listings_by_status,
            users_by_month=users_by_month,
            listings_by_month=listings_by_month,
            listingsByStatus=listings_by_status,
            usersByMonth=users_by_month,
            listingsByMonth=listings_by_month,
        )

    def resolve_all_users(self, info, search=None, is_active=None):
        qs = User.objects.all()
        if is_active is not None:
            qs = qs.filter(is_active=is_active)
        if search:
            qs = qs.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        return qs.order_by('-date_joined')

    def resolve_all_listings(self, info, status=None, search=None):
        qs = Listing.objects.all()
        if status:
            qs = qs.filter(status=status)
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )
        return qs.order_by('-created_at')

    def resolve_allListings(self, info, status=None, search=None):
        return Query.resolve_all_listings(self, info, status, search)