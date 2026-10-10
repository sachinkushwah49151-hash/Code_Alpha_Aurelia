from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser


class AccountsAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.me_url = reverse('auth-me')
        self.refresh_url = reverse('auth-token-refresh')

        self.user_password = 'TestSecurePassword123'
        self.user = CustomUser.objects.create_user(
            email='alex.vance@studio-aurelia.co',
            password=self.user_password,
            name='Alex Vance',
            phone='+91 98765 43210',
        )

    def test_user_registration_success(self):
        data = {
            'fullName': 'Elena Rostova',
            'email': 'elena.rostova@aurelia.co',
            'password': 'SecurePassword456',
            'phone': '+91 91234 56789',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'elena.rostova@aurelia.co')
        self.assertEqual(response.data['user']['name'], 'Elena Rostova')
        self.assertTrue(CustomUser.objects.filter(email='elena.rostova@aurelia.co').exists())

    def test_registration_duplicate_email_fails(self):
        data = {
            'fullName': 'Duplicate User',
            'email': 'alex.vance@studio-aurelia.co',
            'password': 'SecurePassword456',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_registration_missing_name_fails(self):
        data = {
            'email': 'noname@aurelia.co',
            'password': 'SecurePassword456',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_valid_credentials_success(self):
        data = {
            'email': 'alex.vance@studio-aurelia.co',
            'password': self.user_password,
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'alex.vance@studio-aurelia.co')
        self.assertEqual(response.data['user']['name'], 'Alex Vance')

    def test_login_invalid_password_fails(self):
        data = {
            'email': 'alex.vance@studio-aurelia.co',
            'password': 'WrongPasswordXYZ',
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_login_nonexistent_email_fails(self):
        data = {
            'email': 'nobody@aurelia.co',
            'password': 'SomePassword123',
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_protected_me_endpoint_without_token_fails(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_me_endpoint_with_valid_bearer_token(self):
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['name'], self.user.name)

    def test_token_refresh(self):
        refresh = RefreshToken.for_user(self.user)
        data = {'refresh': str(refresh)}
        response = self.client.post(self.refresh_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
