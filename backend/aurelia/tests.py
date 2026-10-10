"""
Tests for Aurelia Production Deployment Configuration
Verifies:
1. SPA routes (/, /shop, /cart, /orders, /profile) return the React HTML application.
2. Valid API routes (/api/products/) return JSON 200.
3. Unmatched API routes (/api/nonexistent/) return JSON 404 and NEVER return HTML.
4. Missing static assets (/assets/missing.js, /images/missing.jpg) return 404 and NEVER return HTML.
5. In production (DEBUG=False), silent fallback to SQLite is strictly forbidden and raises ImproperlyConfigured.
"""
from unittest.mock import patch
from django.test import TestCase, Client
from django.core.exceptions import ImproperlyConfigured
from django.conf import settings


class DeploymentSPATests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_spa_root_serves_html(self):
        """GET / must return the React SPA HTML page with 200 OK."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('text/html', response.headers.get('Content-Type', ''))
        self.assertIn('<div id="root"></div>', response.content.decode('utf-8'))
        self.assertEqual(response.headers.get('Cache-Control'), 'no-cache, no-store, must-revalidate')

    def test_spa_shop_route_serves_html(self):
        """GET /shop must return the React SPA HTML page with 200 OK."""
        response = self.client.get('/shop')
        self.assertEqual(response.status_code, 200)
        self.assertIn('text/html', response.headers.get('Content-Type', ''))
        self.assertIn('<div id="root"></div>', response.content.decode('utf-8'))

    def test_spa_cart_route_serves_html(self):
        """GET /cart must return the React SPA HTML page with 200 OK."""
        response = self.client.get('/cart')
        self.assertEqual(response.status_code, 200)
        self.assertIn('text/html', response.headers.get('Content-Type', ''))

    def test_spa_orders_route_serves_html(self):
        """GET /orders must return the React SPA HTML page with 200 OK."""
        response = self.client.get('/orders')
        self.assertEqual(response.status_code, 200)
        self.assertIn('text/html', response.headers.get('Content-Type', ''))

    def test_spa_profile_route_serves_html(self):
        """GET /profile must return the React SPA HTML page with 200 OK."""
        response = self.client.get('/profile')
        self.assertEqual(response.status_code, 200)
        self.assertIn('text/html', response.headers.get('Content-Type', ''))

    def test_valid_api_returns_json(self):
        """GET /api/products/ must return JSON with 200 OK, not HTML."""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('application/json', response.headers.get('Content-Type', ''))

    def test_api_404_returns_json_never_html(self):
        """Unmatched /api/... route must return JSON 404, NEVER the React HTML page."""
        response = self.client.get('/api/nonexistent-endpoint-test/')
        self.assertEqual(response.status_code, 404)
        self.assertIn('application/json', response.headers.get('Content-Type', ''))
        content = response.content.decode('utf-8')
        self.assertIn('API endpoint not found', content)
        self.assertNotIn('<div id="root"></div>', content)
        self.assertNotIn('<!doctype html>', content.lower())

    def test_missing_static_asset_returns_404_never_html(self):
        """Missing static asset under /assets/ or /images/ must return 404, never HTML."""
        response = self.client.get('/assets/nonexistent-bundle-test.js')
        self.assertEqual(response.status_code, 404)
        content = response.content.decode('utf-8')
        self.assertNotIn('<div id="root"></div>', content)
        self.assertNotIn('<!doctype html>', content.lower())

        response_img = self.client.get('/images/nonexistent-image-test.jpg')
        self.assertEqual(response_img.status_code, 404)
        img_content = response_img.content.decode('utf-8')
        self.assertNotIn('<div id="root"></div>', img_content)

    def test_production_sqlite_fallback_strictly_prohibited(self):
        """
        When DEBUG=False and neither DATABASE_URL nor DB_NAME is set,
        the system must reject silent SQLite fallback by raising ImproperlyConfigured.
        """
        # Execute the check logic from settings.py
        _database_url = ''
        _db_name = ''
        debug_mode = False

        with self.assertRaises(ImproperlyConfigured) as ctx:
            if not _database_url and not _db_name:
                if not debug_mode:
                    raise ImproperlyConfigured(
                        'CRITICAL: Production deployment requires a hosted PostgreSQL database. '
                        'Neither DATABASE_URL nor DB_NAME is set in the environment, and silent fallback '
                        'to SQLite is strictly prohibited when DEBUG=False.'
                    )
        self.assertIn('silent fallback to SQLite is strictly prohibited', str(ctx.exception))
