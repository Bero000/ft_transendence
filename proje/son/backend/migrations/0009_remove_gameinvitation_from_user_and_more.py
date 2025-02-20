# Generated by Django 5.1.2 on 2024-11-14 16:12

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0008_gameinvitation"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="gameinvitation",
            name="from_user",
        ),
        migrations.RemoveField(
            model_name="gameinvitation",
            name="to_user",
        ),
        migrations.RemoveField(
            model_name="matchhistory",
            name="user",
        ),
        migrations.RemoveField(
            model_name="oauthtoken",
            name="user",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="is_42_student",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="profile_picture",
        ),
        migrations.AddField(
            model_name="customuser",
            name="access_token",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="customuser",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="customuser",
            name="expires_in",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="customuser",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to=""),
        ),
        migrations.AddField(
            model_name="customuser",
            name="refresh_token",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="customuser",
            name="secret_valid_until",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.DeleteModel(
            name="Friendship",
        ),
        migrations.DeleteModel(
            name="GameInvitation",
        ),
        migrations.DeleteModel(
            name="MatchHistory",
        ),
        migrations.DeleteModel(
            name="OAuthToken",
        ),
    ]
