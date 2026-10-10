"""
Custom user model using email as the login identifier.
Extends AbstractUser and removes the default username field.
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    """Manager that uses email (not username) as the unique identifier."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('An email address is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    """
    User model with email-based authentication.
    Compatible with the frontend's expected user shape:
      { id, name, email, phone, memberSince, addresses }
    """
    # Remove default username field
    username = None

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=30, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        ordering = ['-date_joined']

    def __str__(self):
        return f'{self.name} <{self.email}>'

    @property
    def member_since(self):
        """Formatted string matching the frontend's 'memberSince' field."""
        return self.date_joined.strftime('%B %Y')

    @property
    def formatted_id(self):
        """Returns 'usr_<pk>' to match the frontend's user id format."""
        return f'usr_{self.pk}'
