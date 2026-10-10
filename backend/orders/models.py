"""
Order and OrderItem models.
Order creation validates stock and calculates totals server-side.
Client-supplied prices are NEVER trusted.
"""
import random
import string
from django.conf import settings
from django.db import models
from products.models import Product


def generate_order_number():
    """
    Generate a unique order number in AUR-XXXXXX format,
    matching the frontend's expected order id field.
    """
    return 'AUR-' + ''.join(random.choices(string.digits, k=6))


class Order(models.Model):
    STATUS_PROCESSING = 'Processing'
    STATUS_SHIPPED    = 'Shipped'
    STATUS_DELIVERED  = 'Delivered'
    STATUS_CANCELLED  = 'Cancelled'

    STATUS_CHOICES = [
        (STATUS_PROCESSING, 'Processing'),
        (STATUS_SHIPPED,    'Shipped'),
        (STATUS_DELIVERED,  'Delivered'),
        (STATUS_CANCELLED,  'Cancelled'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders',
    )
    # AUR-XXXXXX format — used as the frontend 'id' field
    order_number = models.CharField(
        max_length=20, unique=True, default=generate_order_number
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PROCESSING
    )

    # Financials — all server-calculated, stored as integers (INR paise NOT used; stored as ₹)
    subtotal     = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount     = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax          = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total        = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Address and payment stored as JSON snapshot
    shipping_address = models.JSONField(default=dict)
    payment_method   = models.CharField(max_length=120, blank=True)
    delivery_method  = models.CharField(max_length=50, default='standard')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['user', '-created_at'])]

    def __str__(self):
        return f'{self.order_number} — {self.user.email}'


class OrderItem(models.Model):
    """
    A snapshot line-item in an order.
    product FK is nullable so deleted products don't cascade-delete order history.
    Price is stored at time of purchase (never recalculated).
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=True
    )

    # Snapshots — preserved even if product is later modified/deleted
    product_slug  = models.CharField(max_length=120)   # matches frontend 'id'
    product_name  = models.CharField(max_length=200)
    product_image = models.CharField(max_length=500, blank=True)

    quantity = models.PositiveIntegerField()
    price    = models.DecimalField(max_digits=10, decimal_places=2)   # price at purchase
    color    = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'{self.quantity}× {self.product_name} in {self.order.order_number}'

    @property
    def line_total(self):
        return self.price * self.quantity
