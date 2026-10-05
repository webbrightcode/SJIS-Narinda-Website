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
        reset_pwd = options.get('reset_password', False)
        username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin').strip()
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'sjisadmin2026')
        email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@sjis-narinda.edu.bd').strip()

        user = User.objects.filter(username=username).first()
        if not user:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f"Successfully created superuser '{username}'"))
        else:
            if reset_pwd:
                user.set_password(password)
                self.stdout.write(self.style.SUCCESS(f"Reset password for superuser '{username}'"))
            user.email = email
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Superuser verified for '{username}' (password preserved)"))

        token, created = Token.objects.get_or_create(user=user)
        self.stdout.write(self.style.SUCCESS(f"Authentication token ready for user '{username}': {token.key}"))
