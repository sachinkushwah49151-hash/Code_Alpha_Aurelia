"""
Products serializers.
Output fields match the EXACT shape the frontend api.js and React components expect.
CamelCase aliases are used where the frontend uses camelCase field names.
"""
from rest_framework import serializers
from .models import Category, Product, Review


class CategorySerializer(serializers.ModelSerializer):
    """
    Matches the frontend CATEGORIES array:
    { id (slug), name, tagline, image }
    Frontend-only fields (gridSpan, accentColor, itemCount) are read from
    products.js locally — not returned by the API.
    """
    id = serializers.CharField(source='slug')

    class Meta:
        model  = Category
        fields = ['id', 'name', 'tagline', 'image']


class ReviewSerializer(serializers.ModelSerializer):
    """Matches the frontend REVIEWS array shape."""
    productId = serializers.CharField(source='product.slug')
    date      = serializers.CharField(source='date_display')

    class Meta:
        model  = Review
        fields = ['id', 'productId', 'author', 'rating', 'date', 'title', 'comment', 'verified']


class ProductListSerializer(serializers.ModelSerializer):
    """
    Compact product shape for list/grid views.
    Matches every field used by ProductCard.jsx and the Shop page.
    """
    id              = serializers.CharField(source='slug')
    category        = serializers.CharField(source='category.name')
    categoryId      = serializers.CharField(source='category.slug')
    shortDescriptor = serializers.CharField(source='short_descriptor')
    originalPrice   = serializers.DecimalField(
        source='original_price', max_digits=10, decimal_places=2, allow_null=True
    )
    reviews         = serializers.IntegerField(source='reviews_count')
    newArrival      = serializers.BooleanField(source='new_arrival')
    secondaryImage  = serializers.CharField(source='secondary_image')
    price           = serializers.DecimalField(max_digits=10, decimal_places=2)
    rating          = serializers.DecimalField(max_digits=3, decimal_places=1)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'categoryId',
            'shortDescriptor', 'description',
            'price', 'originalPrice',
            'rating', 'reviews',
            'badge', 'stock', 'featured', 'newArrival',
            'image', 'secondaryImage', 'gallery',
            'colors', 'specifications', 'features',
        ]


class ProductDetailSerializer(ProductListSerializer):
    """
    Full product shape for the detail page — adds reviewsList and relatedProducts.
    Matches: api.getProductById() → { ...product, reviewsList, relatedProducts }
    """
    reviewsList     = ReviewSerializer(source='reviews_list', many=True, read_only=True)
    relatedProducts = serializers.SerializerMethodField()

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ['reviewsList', 'relatedProducts']

    def get_relatedProducts(self, obj):
        related = (
            Product.objects
            .filter(category=obj.category, is_active=True)
            .exclude(pk=obj.pk)[:4]
        )
        return ProductListSerializer(related, many=True).data
