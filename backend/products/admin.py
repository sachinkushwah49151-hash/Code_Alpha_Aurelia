from django.contrib import admin
from .models import Category, Product, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display  = ['name', 'slug', 'category', 'price', 'stock', 'featured', 'new_arrival', 'is_active']
    list_filter   = ['category', 'featured', 'new_arrival', 'is_active']
    search_fields = ['name', 'slug']
    list_editable = ['price', 'stock', 'featured', 'is_active']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-featured', 'name']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ['author', 'product', 'rating', 'verified', 'created_at']
    list_filter   = ['verified', 'rating']
    search_fields = ['author', 'product__name']
