"""
Orders views.
GET  /api/orders/   — list the authenticated user's orders (plain array)
POST /api/orders/   — create a new order (server validates stock + calculates totals)
GET  /api/orders/{order_number}/ — retrieve a single order (owner only)
All endpoints require a valid JWT Bearer token.
"""
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderCreateSerializer, OrderOutputSerializer


class OrderListCreateView(APIView):
    """
    GET  /api/orders/ → plain array of the user's orders (newest first)
    POST /api/orders/ → create order; returns the new order object
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects
            .filter(user=request.user)
            .prefetch_related('items')
            .order_by('-created_at')
        )
        serializer = OrderOutputSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderCreateSerializer(
            data=request.data, context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order = serializer.save()
        return Response(
            OrderOutputSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderDetailView(APIView):
    """
    GET /api/orders/{order_number}/
    Returns a single order — user may only access their own orders (HTTP 404 otherwise).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, order_number):
        try:
            order = (
                Order.objects
                .prefetch_related('items')
                .get(order_number=order_number, user=request.user)
            )
        except Order.DoesNotExist:
            # Return 404 (not 403) to avoid leaking order existence
            return Response(
                {'detail': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(OrderOutputSerializer(order).data)
