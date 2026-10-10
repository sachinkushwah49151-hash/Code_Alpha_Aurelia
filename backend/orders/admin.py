from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_slug', 'product_name', 'product_image', 'price', 'line_total']
    fields = ['product_slug', 'product_name', 'quantity', 'price', 'color']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display  = ['order_number', 'user', 'status', 'total', 'created_at']
    list_filter   = ['status', 'created_at']
    search_fields = ['order_number', 'user__email']
    readonly_fields = ['order_number', 'subtotal', 'shipping_fee', 'discount', 'tax', 'total', 'created_at']
    inlines = [OrderItemInline]
    ordering = ['-created_at']
