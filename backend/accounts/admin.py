from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        (
            "Custom Fields",
            {
                "fields": (
                    "role",
                    "telegram_chat_id",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Custom Fields",
            {
                "fields": (
                    "role",
                    "telegram_chat_id",
                )
            },
        ),
    )

    list_display = (
        "id",
        "username",
        "email",
        "role",
        "telegram_chat_id",
        "is_staff",
    )