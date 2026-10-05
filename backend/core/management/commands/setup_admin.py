import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()


class Command(BaseCommand):
    help = "Creates or updates the default superuser and verifies DRF token"

    def handle(self, *args, **options):
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
            user.set_password(password)
            user.email = email
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Successfully updated superuser credentials for '{username}'"))

        token, created = Token.objects.get_or_create(user=user)
        self.stdout.write(self.style.SUCCESS(f"Authentication token ready for user '{username}': {token.key}"))
