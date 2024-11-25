from django.db import migrations
from django.db.models import Count
from django.contrib.auth.models import User

def remove_duplicate_emails(apps, schema_editor):
    # Find users with duplicate emails
    duplicate_emails = (
        User.objects.values('email')
        .annotate(count=Count('id'))
        .filter(count__gt=1)
        .values_list('email', flat=True)
    )

    for email in duplicate_emails:
        # Get all users with this email
        users = User.objects.filter(email=email).order_by('date_joined')
        # Keep the first one, update others
        for i, user in enumerate(users[1:], 1):
            user.email = f"{user.email}.{i}"
            user.save()

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(remove_duplicate_emails),
        migrations.RunSQL(
            sql=[
                'UPDATE auth_user SET email = username WHERE email IS NULL OR email = \'\';',
                'CREATE UNIQUE INDEX IF NOT EXISTS unique_email ON auth_user(email);',
            ],
            reverse_sql='DROP INDEX IF EXISTS unique_email;'
        ),
    ]
