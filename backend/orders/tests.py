from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import CustomUser
from products.models import Category, Product
from .models import Order, OrderItem


class OrdersApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.orders_url = reverse('order-list-create')

        # Create two distinct users
        self.user1 = CustomUser.objects.create_user(
            email='user1@aurelia.co',
            password='TestPassword123',
            name='User One',
        )
        self.user2 = CustomUser.objects.create_user(
            email='user2@aurelia.co',
            password='TestPassword123',
            name='User Two',
        )

        # Setup Category and Products
        self.category = Category.objects.create(name='Audio', slug='audio')
        self.product1 = Product.objects.create(
            slug='aurelia-air-x1',
            name='Aurelia Air X1 Headphones',
            category=self.category,
            price=Decimal('8499.00'),
            stock=10,
            image='/images/aurelia-air-x1.jpg',
            is_active=True,
        )
        self.product2 = Product.objects.create(
            slug='kyoto-hinoki-candle',
            name='Kyoto Hinoki Soy Candle',
            category=self.category,
            price=Decimal('1499.00'),
            stock=2,
            image='/images/kyoto-hinoki-candle.jpg',
            is_active=True,
        )

        # Authentication helpers
        token1 = str(RefreshToken.for_user(self.user1).access_token)
        self.auth_headers_user1 = {'HTTP_AUTHORIZATION': f'Bearer {token1}'}

        token2 = str(RefreshToken.for_user(self.user2).access_token)
        self.auth_headers_user2 = {'HTTP_AUTHORIZATION': f'Bearer {token2}'}

    def test_create_order_unauthenticated_fails(self):
        data = {
            'items': [{'id': 'aurelia-air-x1', 'quantity': 1}],
            'shippingAddress': {'fullName': 'Anon', 'city': 'Bengaluru'},
        }
        response = self.client.post(self.orders_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_order_server_calculates_prices_and_free_shipping(self):
        """
        Total subtotal = 8499 (above 4999 threshold -> shipping fee should be 0).
        Even if the client passes malicious totals/prices in the payload,
        the server recalculates based on the database price.
        """
        data = {
            'items': [
                {
                    'id': 'aurelia-air-x1',
                    'quantity': 1,
                    'price': 1,  # Malicious price attempt!
                    'color': 'Matte Obsidian',
                }
            ],
            'shippingAddress': {
                'fullName': 'User One',
                'street': '42 Lotus Blvd',
                'city': 'Bengaluru',
                'state': 'Karnataka',
                'postalCode': '560103',
                'country': 'India',
            },
            'paymentMethod': 'Credit Card',
            'deliveryMethod': 'standard',
            'subtotal': 1,  # Malicious subtotal attempt!
            'total': 1,     # Malicious total attempt!
        }
        response = self.client.post(
            self.orders_url, data, format='json', **self.auth_headers_user1
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check order response
        self.assertTrue(response.data['id'].startswith('AUR-'))
        self.assertEqual(Decimal(str(response.data['subtotal'])), Decimal('8499.00'))
        self.assertEqual(Decimal(str(response.data['shipping'])), Decimal('0.00'))
        self.assertEqual(Decimal(str(response.data['total'])), Decimal('8499.00'))
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(Decimal(str(response.data['items'][0]['price'])), Decimal('8499.00'))

        # Check stock decremented
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.stock, 9)

    def test_create_order_under_threshold_adds_standard_shipping(self):
        """
        Subtotal = 1499 (< 4999 threshold -> standard shipping fee = 299).
        """
        data = {
            'items': [{'id': 'kyoto-hinoki-candle', 'quantity': 1}],
            'shippingAddress': {'fullName': 'User One', 'city': 'Bengaluru'},
            'deliveryMethod': 'standard',
        }
        response = self.client.post(
            self.orders_url, data, format='json', **self.auth_headers_user1
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Decimal(str(response.data['subtotal'])), Decimal('1499.00'))
        self.assertEqual(Decimal(str(response.data['shipping'])), Decimal('299.00'))
        self.assertEqual(Decimal(str(response.data['total'])), Decimal('1798.00'))

    def test_create_order_insufficient_stock_fails(self):
        """Requesting 5 units when only 2 are in stock must be rejected."""
        data = {
            'items': [{'id': 'kyoto-hinoki-candle', 'quantity': 5}],
            'shippingAddress': {'fullName': 'User One', 'city': 'Bengaluru'},
        }
        response = self.client.post(
            self.orders_url, data, format='json', **self.auth_headers_user1
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Verify stock was not decremented
        self.product2.refresh_from_db()
        self.assertEqual(self.product2.stock, 2)

    def test_create_order_invalid_product_id_fails(self):
        data = {
            'items': [{'id': 'nonexistent-slug', 'quantity': 1}],
            'shippingAddress': {'fullName': 'User One', 'city': 'Bengaluru'},
        }
        response = self.client.post(
            self.orders_url, data, format='json', **self.auth_headers_user1
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_orders_only_returns_own_orders(self):
        # Create 1 order for user 1
        data = {
            'items': [{'id': 'aurelia-air-x1', 'quantity': 1}],
            'shippingAddress': {'fullName': 'User One', 'city': 'Bengaluru'},
        }
        self.client.post(self.orders_url, data, format='json', **self.auth_headers_user1)

        # User 1 should see 1 order
        res1 = self.client.get(self.orders_url, **self.auth_headers_user1)
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertIsInstance(res1.data, list)
        self.assertEqual(len(res1.data), 1)

        # User 2 should see 0 orders
        res2 = self.client.get(self.orders_url, **self.auth_headers_user2)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertIsInstance(res2.data, list)
        self.assertEqual(len(res2.data), 0)

    def test_order_detail_ownership_enforcement(self):
        # User 1 creates an order
        data = {
            'items': [{'id': 'aurelia-air-x1', 'quantity': 1}],
            'shippingAddress': {'fullName': 'User One', 'city': 'Bengaluru'},
        }
        create_res = self.client.post(self.orders_url, data, format='json', **self.auth_headers_user1)
        order_num = create_res.data['id']

        detail_url = reverse('order-detail', kwargs={'order_number': order_num})

        # User 1 can access it
        res_owner = self.client.get(detail_url, **self.auth_headers_user1)
        self.assertEqual(res_owner.status_code, status.HTTP_200_OK)
        self.assertEqual(res_owner.data['id'], order_num)

        # User 2 receives 404 (not found) when attempting to access User 1's order
        res_other = self.client.get(detail_url, **self.auth_headers_user2)
        self.assertEqual(res_other.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_order_missing_shipping_address_fails(self):
        data = {
            'items': [{'id': 'aurelia-air-x1', 'quantity': 1}],
            'shippingAddress': {},
        }
        response = self.client.post(self.orders_url, data, format='json', **self.auth_headers_user1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_order_empty_items_fails(self):
        data = {
            'items': [],
            'shippingAddress': {'fullName': 'User One', 'city': 'Bengaluru'},
        }
        response = self.client.post(self.orders_url, data, format='json', **self.auth_headers_user1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_order_zero_quantity_fails(self):
        data = {
            'items': [{'id': 'aurelia-air-x1', 'quantity': 0}],
            'shippingAddress': {'fullName': 'User One', 'city': 'Bengaluru'},
        }
        response = self.client.post(self.orders_url, data, format='json', **self.auth_headers_user1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_order_excessive_quantity_fails(self):
        data = {
            'items': [{'id': 'aurelia-air-x1', 'quantity': 1000}],
            'shippingAddress': {'fullName': 'User One', 'city': 'Bengaluru'},
        }
        response = self.client.post(self.orders_url, data, format='json', **self.auth_headers_user1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
