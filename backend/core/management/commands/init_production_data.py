import sys
from django.core.management.base import BaseCommand
from django.core.management import call_command
from core.models import SliderSlide, AboutInfo, StaffMember


class Command(BaseCommand):
    help = "Initializes production database with superuser, institutional data, and faculty if empty"

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-seeding even if data already exists in the database',
        )

    def handle(self, *args, **options):
        force = options.get('force', False)
        self.stdout.write("Running production database initialization...")

        # 1. Setup Admin Superuser
        call_command('setup_admin')

        # 2. Check existing data
        has_slides = SliderSlide.objects.exists()
        has_about = AboutInfo.objects.exists()
        has_faculty = StaffMember.objects.exists()

        if not has_slides or not has_about or force:
            self.stdout.write("Seeding baseline institutional data...")
            call_command('seed_data')
        else:
            self.stdout.write(self.style.SUCCESS("Institutional data already present. Skipping re-seed."))

        # 3. Seed faculty if empty
        if not has_faculty or force:
            self.stdout.write("Seeding faculty and administration members...")
            try:
                from seed_faculty import MEMBERS
                StaffMember.objects.all().delete() if force else None
                created_count = 0
                for data in MEMBERS:
                    _, created = StaffMember.objects.get_or_create(
                        name=data['name'],
                        designation=data['designation'],
                        defaults=data
                    )
                    if created:
                        created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} faculty/staff members."))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Faculty seeding notice: {e}"))
        else:
            self.stdout.write(self.style.SUCCESS("Faculty and staff records already present."))

        self.stdout.write(self.style.SUCCESS("Production database initialization complete!"))
