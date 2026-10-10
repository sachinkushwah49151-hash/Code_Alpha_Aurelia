from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Category, Product, Review


class ProductsApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.list_url = reverse('product-list')
        self.categories_url = reverse('category-list')

        self.audio_cat = Category.objects.create(
            name='Audio',
            slug='audio',
            tagline='Reference acoustics',
            image='/images/aurelia-air-x1.jpg',
        )
        self.home_cat = Category.objects.create(
            name='Home',
            slug='home',
            tagline='Intentional living',
            image='/images/aurelia-forma.jpg',
        )

        self.product_audio = Product.objects.create(
            slug='aurelia-air-x1',
            name='Aurelia Air X1 Headphones',
            category=self.audio_cat,
            short_descriptor='Minimal Wireless Spatial Audio',
            description='Engineered for acoustic purity with beryllium drivers.',
            price=Decimal('8499.00'),
            original_price=Decimal('10999.00'),
            rating=Decimal('4.9'),
            reviews_count=142,
            stock=18,
            featured=True,
            new_arrival=False,
            image='/images/aurelia-air-x1.jpg',
            is_active=True,
        )

        self.product_home = Product.objects.create(
            slug='aurelia-forma',
            name='Aurelia Forma Desk Lamp',
            category=self.home_cat,
            short_descriptor='Architectural Workspace Illumination',
            description='Counterbalanced study lamp in extruded aluminum.',
            price=Decimal('4299.00'),
            original_price=Decimal('5499.00'),
            rating=Decimal('4.8'),
            reviews_count=57,
            stock=0,  # Out of stock for testing
            featured=False,
            new_arrival=True,
            image='/images/aurelia-forma.jpg',
            is_active=True,
        )

        self.review = Review.objects.create(
            product=self.product_audio,
            author='Arjun M.',
            rating=5,
            date_display='2 weeks ago',
            title='Flawless sound balance',
            comment='Super comfortable and precise sound.',
            verified=True,
        )

    def test_list_categories(self):
        response = self.client.get(self.categories_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 2)
        slugs = [c['id'] for c in response.data]
        self.assertIn('audio', slugs)
        self.assertIn('home', slugs)

    def test_list_products_structure(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 2)

        first = response.data['results'][0]
        # Verify required frontend fields
        self.assertIn('id', first)
        self.assertIn('name', first)
        self.assertIn('price', first)
        self.assertIn('category', first)
        self.assertIn('categoryId', first)
        self.assertIn('shortDescriptor', first)

    def test_filter_products_by_category(self):
        response = self.client.get(self.list_url, {'category': 'audio'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], 'aurelia-air-x1')

    def test_search_products(self):
        response = self.client.get(self.list_url, {'search': 'Lamp'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], 'aurelia-forma')

    def test_filter_by_price_range(self):
        response = self.client.get(self.list_url, {'priceMin': '5000', 'priceMax': '10000'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], 'aurelia-air-x1')

    def test_filter_in_stock_only(self):
        response = self.client.get(self.list_url, {'inStockOnly': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], 'aurelia-air-x1')

    def test_sorting_by_price(self):
        response = self.client.get(self.list_url, {'sort': 'price-low'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['id'], 'aurelia-forma')
        self.assertEqual(response.data['results'][1]['id'], 'aurelia-air-x1')

    def test_retrieve_product_detail_success(self):
        detail_url = reverse('product-detail', kwargs={'slug': 'aurelia-air-x1'})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 'aurelia-air-x1')
        self.assertEqual(response.data['name'], 'Aurelia Air X1 Headphones')
        self.assertIn('reviewsList', response.data)
        self.assertEqual(len(response.data['reviewsList']), 1)
        self.assertEqual(response.data['reviewsList'][0]['author'], 'Arjun M.')
        self.assertIn('relatedProducts', response.data)

    def test_retrieve_product_detail_not_found(self):
        detail_url = reverse('product-detail', kwargs={'slug': 'nonexistent-item'})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('detail', response.data)
