"""
Accounts views — registration, login, token refresh, and current user profile.
Auth responses return { user, token } matching api.js frontend contracts.
"""
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView

from .models import CustomUser
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserPublicSerializer,
    get_tokens_for_user,
)


def build_auth_response(user):
    """Build the standard { user, token } response the frontend expects."""
    return {
        'user':  UserPublicSerializer(user).data,
        'token': get_tokens_for_user(user),
    }


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Body: { fullName, email, password, phone? }
    Response: { user, token }
    """
    permission_classes = []   # public endpoint

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        return Response(build_auth_response(user), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Body: { email, password }
    Response: { user, token }
    Returns 400 for invalid credentials (frontend checks error.message).
    """
    permission_classes = []   # public endpoint

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            errors = serializer.errors
            # Flatten to a single detail message for the frontend
            detail = (
                errors.get('detail')
                or errors.get('non_field_errors', ['Invalid credentials.'])[0]
            )
            return Response({'detail': str(detail)}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']
        return Response(build_auth_response(user), status=status.HTTP_200_OK)


class MeView(APIView):
    """
    GET /api/auth/me/
    Returns the current authenticated user's public profile.
    Protected — requires a valid Bearer JWT.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserPublicSerializer(request.user).data)
