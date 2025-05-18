from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings
import uuid

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Listing(models.Model):
    CONDITION_CHOICES = [
        ('neuf', 'Neuf'),
        ('excellent', 'Excellent'),
        ('bon', 'Bon'),
        ('acceptable', 'Acceptable'),
        ('a-renover', 'À rénover'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('sold', 'Vendu'),
        ('inactive', 'Inactif'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='listings')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    quantity = models.PositiveIntegerField(default=1)
    unit = models.CharField(max_length=50, default='unité')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_free = models.BooleanField(default=False)
    location = models.CharField(max_length=100)
    address = models.TextField(blank=True, null=True)
    contact_method = models.CharField(max_length=20, default='platform')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listing_images/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.listing.title}"

class Message(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver}"

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')

    def __str__(self):
        return f"{self.user.username} favorited {self.listing.title}"
