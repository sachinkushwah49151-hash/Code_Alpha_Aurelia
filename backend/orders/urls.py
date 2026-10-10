"""orders URL patterns."""
from django.urls import path
from .views import OrderDetailView, OrderListCreateView

urlpatterns = [
    path('orders/',                      OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<str:order_number>/',   OrderDetailView.as_view(),    name='order-detail'),
]
