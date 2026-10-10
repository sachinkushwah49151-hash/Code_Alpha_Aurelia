"""
Accounts serializers.
Auth responses use the exact shape the frontend api.js expects:
  { user: { id, name, email, phone, memberSince, addresses }, token }
"""
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser


def get_tokens_for_user(user):
    """Return the access token string for a user (frontend stores this as 'token')."""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


class UserPublicSerializer(serializers.ModelSerializer):
    """
    Read-only user shape returned to the frontend after login/register.
    Matches: { id, name, email, phone, memberSince, addresses }
    """
    id          = serializers.CharField(source='formatted_id')
    memberSince = serializers.CharField(source='member_since')
    addresses   = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'phone', 'memberSince', 'addresses']

    def get_addresses(self, obj):
        # No persistent address model yet — return empty list.
        # Frontend handles address management in local state/profile.
        return []


class RegisterSerializer(serializers.Serializer):
    """Registration input. Accepts both 'fullName' and 'name' to match frontend."""
    fullName = serializers.CharField(max_length=200, required=False, allow_blank=True)
    name     = serializers.CharField(max_length=200, required=False, allow_blank=True)
    email    = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    phone    = serializers.CharField(max_length=30, required=False, allow_blank=True)

    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value.lower()

    def validate(self, attrs):
        name = attrs.get('fullName') or attrs.get('name') or ''
        if not name.strip():
            raise serializers.ValidationError({'name': 'Full name is required.'})
        attrs['resolved_name'] = name.strip()
        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['resolved_name'],
            phone=validated_data.get('phone', ''),
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Login input — email + password."""
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get('request'),
            email=attrs['email'].lower(),
            password=attrs['password'],
        )
        if not user:
            raise serializers.ValidationError(
                {'detail': 'Invalid email or password. Please try again.'}
            )
        if not user.is_active:
            raise serializers.ValidationError(
                {'detail': 'This account has been deactivated.'}
            )
        attrs['user'] = user
        return attrs
