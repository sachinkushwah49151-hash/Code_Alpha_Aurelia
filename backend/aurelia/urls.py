from django.contrib import admin
from django.urls import path, re_path, include
from .views import frontend_index, api_not_found, static_not_found

urlpatterns = [
    # 1. Django Admin
    path('admin/', admin.site.urls),

    # 2. Django REST Framework API Endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),

    # 3. Explicit API 404 Handler (guarantees any unmatched /api/... returns JSON 404, never React HTML)
    re_path(r'^api(/.*)?$', api_not_found, name='api_404'),

    # 4. Explicit Static/Asset 404 Handler (prevents missing JS/CSS/image requests falling through to HTML)
    re_path(r'^(assets|images|static)/.*$', static_not_found, name='static_404'),

    # 5. React Single Page Application (SPA) Catch-All (serves index.html for all customer routes:
    #    /, /shop, /cart, /checkout, /login, /register, /profile, /orders, /product/:id)
    re_path(r'^.*$', frontend_index, name='frontend_spa'),
]
