"""
Orders serializers.
Input: validates product slugs + quantities; server calculates all prices.
Output: matches the exact order shape the frontend Orders.jsx and CartContext expect.
"""
from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from products.models import Product
from .models import Order, OrderItem

FREE_SHIPPING_THRESHOLD = Decimal('4999')
STANDARD_SHIPPING_FEE   = Decimal('299')
GST_RATE                = Decimal('0.18')
EXPRESS_FEE             = Decimal('299')


class OrderItemOutputSerializer(serializers.ModelSerializer):
    """
    Line-item shape matching the frontend order items array:
    { id, name, price, quantity, color, image }
    """
    id    = serializers.CharField(source='product_slug')
    name  = serializers.CharField(source='product_name')
    image = serializers.CharField(source='product_image')
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model  = OrderItem
        fields = ['id', 'name', 'price', 'quantity', 'color', 'image']


class OrderOutputSerializer(serializers.ModelSerializer):
    """
    Full order shape matching the frontend's expected structure:
    { id, date, status, total, subtotal, shipping, tax, paymentMethod,
      shippingAddress, items }
    """
    id              = serializers.CharField(source='order_number')
    date            = serializers.DateTimeField(source='created_at')
    shipping        = serializers.DecimalField(source='shipping_fee', max_digits=10, decimal_places=2)
    paymentMethod   = serializers.CharField(source='payment_method')
    shippingAddress = serializers.JSONField(source='shipping_address')
    items           = OrderItemOutputSerializer(many=True, read_only=True)
    subtotal        = serializers.DecimalField(max_digits=10, decimal_places=2)
    tax             = serializers.DecimalField(max_digits=10, decimal_places=2)
    total           = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model  = Order
        fields = [
            'id', 'date', 'status',
            'subtotal', 'shipping', 'discount', 'tax', 'total',
            'paymentMethod', 'shippingAddress', 'items',
        ]


# ── Input serializers for order creation ─────────────────────────────────────

class OrderItemInputSerializer(serializers.Serializer):
    """A single cart item submitted from the frontend."""
    id       = serializers.CharField()       # product slug
    quantity = serializers.IntegerField(min_value=1, max_value=100)
    color    = serializers.CharField(required=False, allow_blank=True, default='')


class OrderCreateSerializer(serializers.Serializer):
    """
    Input for POST /api/orders/
    Sent by api.createOrder() as:
    { items, shippingAddress, paymentMethod, deliveryMethod, ... }
    All financial totals are IGNORED from the client and recalculated server-side.
    """
    items           = OrderItemInputSerializer(many=True, min_length=1)
    shippingAddress = serializers.DictField(child=serializers.CharField(allow_blank=True))
    paymentMethod   = serializers.CharField(required=False, allow_blank=True, default='')
    deliveryMethod  = serializers.CharField(required=False, default='standard')

    def validate_items(self, items):
        """Resolve product slugs to DB rows and validate stock."""
        slugs = [item['id'] for item in items]
        products = {p.slug: p for p in Product.objects.filter(slug__in=slugs, is_active=True)}

        errors = []
        for item in items:
            slug = item['id']
            qty  = item['quantity']
            if slug not in products:
                errors.append(f"Product '{slug}' not found.")
                continue
            product = products[slug]
            if product.stock < qty:
                errors.append(
                    f"'{product.name}' only has {product.stock} unit(s) in stock "
                    f"(requested {qty})."
                )

        if errors:
            raise serializers.ValidationError(errors)

        # Attach resolved product objects so create() doesn't re-query
        self._products = products
        return items

    def validate_shippingAddress(self, addr):
        if not addr or not isinstance(addr, dict):
            raise serializers.ValidationError('Shipping address is required.')
        if not addr.get('fullName', '').strip():
            raise serializers.ValidationError('Recipient full name is required in shipping address.')
        if not addr.get('city', '').strip():
            raise serializers.ValidationError('City is required in shipping address.')
        return addr

    @transaction.atomic
    def create(self, validated_data):
        """
        Create Order + OrderItems inside a transaction.
        Prices fetched from DB — client prices are never used.
        Stock is decremented atomically.
        """
        user           = self.context['request'].user
        items_data     = validated_data['items']
        shipping_addr  = validated_data['shippingAddress']
        payment_method = validated_data.get('paymentMethod', '')
        delivery_method = validated_data.get('deliveryMethod', 'standard')

        products = getattr(self, '_products', {})

        # ── Server-side total calculation ─────────────────────────────────
        subtotal = Decimal('0')
        for item in items_data:
            product  = products[item['id']]
            subtotal += product.price * item['quantity']

        # Shipping: express adds ₹299, otherwise free above threshold
        if delivery_method == 'express':
            shipping_fee = EXPRESS_FEE
        elif subtotal >= FREE_SHIPPING_THRESHOLD:
            shipping_fee = Decimal('0')
        else:
            shipping_fee = STANDARD_SHIPPING_FEE

        tax   = (subtotal * GST_RATE).quantize(Decimal('1'))
        total = subtotal + shipping_fee   # tax is inclusive in Indian pricing display

        # ── Create the Order ─────────────────────────────────────────────
        order = Order.objects.create(
            user=user,
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            tax=tax,
            total=total,
            shipping_address=shipping_addr,
            payment_method=payment_method,
            delivery_method=delivery_method,
        )

        # ── Create OrderItems and decrement stock atomically ──────────────
        for item in items_data:
            product = products[item['id']]

            # Re-fetch with select_for_update to prevent race conditions
            product_locked = Product.objects.select_for_update().get(pk=product.pk)
            if product_locked.stock < item['quantity']:
                raise serializers.ValidationError(
                    f"'{product_locked.name}' ran out of stock during checkout."
                )
            product_locked.stock -= item['quantity']
            product_locked.save(update_fields=['stock'])

            OrderItem.objects.create(
                order=order,
                product=product_locked,
                product_slug=product_locked.slug,
                product_name=product_locked.name,
                product_image=product_locked.image,
                quantity=item['quantity'],
                price=product_locked.price,
                color=item.get('color', ''),
            )

        return order
