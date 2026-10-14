import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()


class Command(BaseCommand):
    help = "Creates or updates the default superuser and verifies DRF token"

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset-password',
            action='store_true',
            help='Explicitly force-reset superuser password from environment variable',
        )

    def handle(self, *args, **options):
        # Fixed superadmin credentials
        fixed_username = 'SjisN_Admin'
        fixed_password = 'HolyCro$$Narind@2026'

        username = os.getenv('DJANGO_SUPERUSER_USERNAME', fixed_username).strip()
        env_password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

        # Fall back to fixed password if unset or if still holding legacy default
        if not env_password or env_password in ('sjisadmin2026', 'admin'):
            password = fixed_password
        else:
            password = env_password

        email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@sjis-narinda.edu.bd').strip()

        # Find superuser case-insensitively
        user = User.objects.filter(username__iexact=username).first()
        if not user:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f"Successfully created fixed superuser '{username}'"))
        else:
            user.username = username
            user.set_password(password)
            user.email = email
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Fixed superuser '{username}' verified and password synchronized."))

        token, created = Token.objects.get_or_create(user=user)
        self.stdout.write(self.style.SUCCESS(f"Authentication token ready for user '{username}': {token.key}"))
