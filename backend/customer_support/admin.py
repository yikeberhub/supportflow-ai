from django.contrib import admin
from .models import CustomerMessage
from django.contrib.admin import register

# Register your models here.

@register(CustomerMessage)
class CustomerMessagetAdmin(admin.ModelAdmin):
    list_display = ("user", "status", "is_processed", "created_at")
    list_filter = ("status", "is_processed", "created_at")
    search_fields = ("user__username", "content")
    ordering = ("-created_at",)
