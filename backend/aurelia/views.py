"""
AURELIA Views — Frontend SPA and Error Handling

Provides:
- frontend_index: Serves the compiled React Vite single-page application (dist/index.html)
  for all customer-facing routes (/shop, /cart, /checkout, /orders, /profile, etc.).
- api_not_found: Deterministic JSON 404 for any unmatched /api/... endpoint.
  Guarantees API 404 responses never return the React HTML document.
- static_not_found: Plain text 404 for missing static assets under /assets/, /images/, /static/.
  Prevents missing JS/CSS/image requests from returning index.html.
"""
from pathlib import Path
from django.conf import settings
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse


def frontend_index(request):
    """
    Serve the built React index.html.
    Instructs browsers not to cache index.html so frontend updates take effect immediately.
    """
    dist_index = settings.BASE_DIR.parent / 'dist' / 'index.html'
    if dist_index.is_file():
        try:
            content = dist_index.read_text(encoding='utf-8')
            response = HttpResponse(content, content_type='text/html; charset=utf-8')
            # Prevent caching of the entry HTML so new asset hashes take effect on deploy
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            return response
        except OSError:
            pass

    return HttpResponse(
        "Aurelia frontend build not found. Run 'npm run build' to compile React assets.",
        status=503,
        content_type='text/plain; charset=utf-8',
    )


def api_not_found(request, *args, **kwargs):
    """
    Catch-all JSON 404 handler for API endpoints.
    Ensures any unmatched /api/... route returns standard JSON rather than HTML.
    """
    return JsonResponse(
        {
            'detail': 'API endpoint not found.',
            'status': 404,
            'path': request.path,
        },
        status=404,
    )


def static_not_found(request, *args, **kwargs):
    """
    Plain 404 for missing static assets (preventing index.html fallback for scripts/styles).
    """
    return HttpResponseNotFound(
        f"Static asset not found: {request.path}",
        content_type='text/plain; charset=utf-8',
    )
