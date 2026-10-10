"""
AURELIA Django Settings
Reads all secrets and configuration from environment variables via python-dotenv.
Never hardcode secrets or database passwords in this file.
"""
import os
from pathlib import Path
from datetime import timedelta
from urllib.parse import urlparse, parse_qs, unquote
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

# ── Base paths ────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env from backend/ directory
load_dotenv(BASE_DIR / '.env')

# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-dev-key-change-in-production')
DEBUG = os.environ.get('DEBUG', 'True').strip().lower() in ('true', '1', 'yes')

_allowed_hosts_raw = os.environ.get('ALLOWED_HOSTS', 'localhost 127.0.0.1')
ALLOWED_HOSTS = [h.strip() for h in _allowed_hosts_raw.replace(',', ' ').split() if h.strip()]

# Render automatically provides RENDER_EXTERNAL_HOSTNAME (e.g. aurelia-ecommerce.onrender.com)
_render_host = os.environ.get('RENDER_EXTERNAL_HOSTNAME', '').strip()
if _render_host and _render_host not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(_render_host)

# Enforce security requirements in production
if not DEBUG:
    if not SECRET_KEY or SECRET_KEY == 'django-insecure-dev-key-change-in-production' or SECRET_KEY.startswith('django-insecure-'):
        raise ImproperlyConfigured(
            'CRITICAL: A secure, non-default SECRET_KEY environment variable is required when DEBUG=False.'
        )
    if not ALLOWED_HOSTS:
        raise ImproperlyConfigured(
            'CRITICAL: ALLOWED_HOSTS must specify at least one production domain or hostname when DEBUG=False.'
        )

# ── Application definition ────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # Project apps
    'accounts',
    'products',
    'orders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',          # must be before CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',     # WhiteNoise static file serving
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'aurelia.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'aurelia.wsgi.application'

# ── Database ──────────────────────────────────────────────────────────────────
# 1. DATABASE_URL (hosted URL supplied by Render, Neon, Supabase, Railway, etc.)
# 2. Discrete DB_* variables (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
# 3. SQLite fallback (for local development without PostgreSQL)
_database_url = os.environ.get('DATABASE_URL', '').strip()
_db_name = os.environ.get('DB_NAME', '').strip()

if _database_url:
    _parsed = urlparse(_database_url)
    _db_path = unquote(_parsed.path.lstrip('/'))
    _db_user = unquote(_parsed.username or '')
    _db_password = unquote(_parsed.password or '')
    _db_host = _parsed.hostname or 'localhost'
    _db_port = str(_parsed.port or 5432)

    _query_params = parse_qs(_parsed.query)
    _ssl_mode = _query_params.get('sslmode', [''])[0]

    _db_options = {}
    if _ssl_mode:
        _db_options['sslmode'] = _ssl_mode

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': _db_path,
            'USER': _db_user,
            'PASSWORD': _db_password,
            'HOST': _db_host,
            'PORT': _db_port,
            'OPTIONS': _db_options,
            'CONN_MAX_AGE': int(os.environ.get('DB_CONN_MAX_AGE', '600')),
        }
    }
elif _db_name:
    _db_options = {}
    _ssl_mode = os.environ.get('DB_SSLMODE', '').strip()
    if _ssl_mode:
        _db_options['sslmode'] = _ssl_mode

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': _db_name,
            'USER': os.environ.get('DB_USER', 'postgres'),
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
            'OPTIONS': _db_options,
            'CONN_MAX_AGE': int(os.environ.get('DB_CONN_MAX_AGE', '600')),
        }
    }
else:
    # In production (DEBUG=False), silent fallback to SQLite is strictly prohibited.
    if not DEBUG:
        raise ImproperlyConfigured(
            'CRITICAL: Production deployment requires a hosted PostgreSQL database. '
            'Neither DATABASE_URL nor DB_NAME is set in the environment, and silent fallback '
            'to SQLite is strictly prohibited when DEBUG=False.'
        )
    # SQLite fallback — safe for local development without PostgreSQL
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# ── Custom User model ─────────────────────────────────────────────────────────
AUTH_USER_MODEL = 'accounts.CustomUser'

# ── Password validation ───────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── Internationalisation ──────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# ── Static files & WhiteNoise ─────────────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# WhiteNoise serves built frontend assets directly at root (e.g. /assets/..., /images/..., /favicon.svg)
WHITENOISE_ROOT = BASE_DIR.parent / 'dist'

# WhiteNoise storage for compressed static files
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Django REST Framework ─────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    # No global pagination — order list returns a plain array per frontend contract
    'DEFAULT_PAGINATION_CLASS': None,
}

# ── SimpleJWT ─────────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(
        minutes=int(os.environ.get('ACCESS_TOKEN_LIFETIME_MINUTES', '60'))
    ),
    'REFRESH_TOKEN_LIFETIME': timedelta(
        days=int(os.environ.get('REFRESH_TOKEN_LIFETIME_DAYS', '7'))
    ),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ── CORS ──────────────────────────────────────────────────────────────────────
_cors_origins_raw = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://127.0.0.1:5173'
)
CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_origins_raw.split(',') if o.strip()]

# If deployed on Render, add the external hostname to CORS origins
if _render_host:
    _render_origin = f'https://{_render_host}'
    if _render_origin not in CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS.append(_render_origin)

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False  # Explicit: Never allow wildcard access

# ── Production Security Headers ───────────────────────────────────────────────
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'False').strip().lower() in ('true', '1')
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'True').strip().lower() in ('true', '1')
    CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'True').strip().lower() in ('true', '1')
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
