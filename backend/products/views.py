"""
Products views.
GET /api/products/        — filtered, sorted product list → { count, results }
GET /api/products/{slug}/ — full product detail with reviews + related products
GET /api/categories/      — all categories list
All endpoints are public (no authentication required).
"""
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product
from .serializers import CategorySerializer, ProductDetailSerializer, ProductListSerializer


class ProductListView(APIView):
    """
    GET /api/products/
    Query params (matching api.js getProducts() call):
      category, search, sort, priceMin, priceMax, rating, inStockOnly, featured, newArrival
    Returns: { count: int, results: [...] }
    """
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Product.objects.select_related('category').filter(is_active=True)

        # ── Filtering ─────────────────────────────────────────────────────
        category = request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(
                Q(category__slug__iexact=category) |
                Q(category__name__iexact=category)
            )

        search = request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(short_descriptor__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )

        price_min = request.query_params.get('priceMin')
        if price_min:
            try:
                qs = qs.filter(price__gte=float(price_min))
            except (ValueError, TypeError):
                pass

        price_max = request.query_params.get('priceMax')
        if price_max:
            try:
                qs = qs.filter(price__lte=float(price_max))
            except (ValueError, TypeError):
                pass

        min_rating = request.query_params.get('rating')
        if min_rating:
            try:
                qs = qs.filter(rating__gte=float(min_rating))
            except (ValueError, TypeError):
                pass

        if request.query_params.get('inStockOnly') in ('true', '1'):
            qs = qs.filter(stock__gt=0)

        if request.query_params.get('featured') in ('true', '1'):
            qs = qs.filter(featured=True)

        if request.query_params.get('newArrival') in ('true', '1'):
            qs = qs.filter(new_arrival=True)

        # ── Sorting (matching api.js sort values) ─────────────────────────
        sort = request.query_params.get('sort', 'featured')
        if sort == 'price-low':
            qs = qs.order_by('price')
        elif sort == 'price-high':
            qs = qs.order_by('-price')
        elif sort == 'newest':
            qs = qs.order_by('-new_arrival', '-created_at')
        elif sort == 'rating':
            qs = qs.order_by('-rating')
        else:
            # Default: featured first
            qs = qs.order_by('-featured', 'name')

        results = list(qs)
        serializer = ProductListSerializer(results, many=True)
        return Response({'count': len(results), 'results': serializer.data})


class ProductDetailView(APIView):
    """
    GET /api/products/{slug}/
    Returns full product data including reviewsList and relatedProducts.
    Returns 404 JSON { detail: "..." } on missing product.
    """
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            product = (
                Product.objects
                .select_related('category')
                .prefetch_related('reviews_list')
                .get(slug=slug, is_active=True)
            )
        except Product.DoesNotExist:
            return Response(
                {'detail': f"Product '{slug}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProductDetailSerializer(product)
        return Response(serializer.data)


class CategoryListView(APIView):
    """
    GET /api/categories/
    Returns all categories as a plain array (no pagination).
    """
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
