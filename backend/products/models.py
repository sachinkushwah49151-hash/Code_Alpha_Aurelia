"""
Products and categories models.
All JSON fields (colors, specifications, features, gallery) store data
exactly as the frontend expects — no transformation layer needed.
"""
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Category(models.Model):
    """Matches the frontend CATEGORIES array structure."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)      # frontend 'id' field
    tagline = models.CharField(max_length=255, blank=True)
    image = models.CharField(max_length=500, blank=True)      # e.g. /images/aurelia-arc.jpg

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    Full product model matching the frontend product data shape.
    Slug is used as the primary lookup key (matches frontend 'id' field).
    """
    slug = models.SlugField(unique=True, max_length=120)      # frontend 'id' — e.g. 'aurelia-air-x1'
    name = models.CharField(max_length=200)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name='products'
    )
    short_descriptor = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    rating = models.DecimalField(
        max_digits=3, decimal_places=1, default=0.0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    reviews_count = models.PositiveIntegerField(default=0)
    badge = models.CharField(max_length=80, blank=True)
    stock = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False, db_index=True)
    new_arrival = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    # Image paths (relative to public/, e.g. /images/aurelia-air-x1.jpg)
    image = models.CharField(max_length=500, blank=True)
    secondary_image = models.CharField(max_length=500, blank=True)
    gallery = models.JSONField(default=list)        # list of image paths

    # Structured JSON matching frontend format
    colors = models.JSONField(default=list)         # [{name, hex}, ...]
    specifications = models.JSONField(default=dict) # {key: value, ...}
    features = models.JSONField(default=list)       # [string, ...]

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['price']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return self.name


class Review(models.Model):
    """
    Product review — seeded from products.js REVIEWS array.
    Linked by product slug for efficient lookups.
    """
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='reviews_list'
    )
    author = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    date_display = models.CharField(max_length=60, blank=True)  # "2 weeks ago"
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.author} — {self.product.name} ({self.rating}★)'
