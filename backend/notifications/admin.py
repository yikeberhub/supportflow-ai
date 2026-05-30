from django.contrib import admin
from .models import NotificationLog


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'notification_type', 'status', 'recipient', 'created_at', 'sent_at')
    list_filter = ('notification_type', 'status', 'created_at')
    search_fields = ('user__username', 'recipient', 'title')
    readonly_fields = ('created_at', 'sent_at')
    
    fieldsets = (
        ('User Info', {
            'fields': ('user',)
        }),
        ('Notification Details', {
            'fields': ('notification_type', 'recipient', 'title', 'message')
        }),
        ('Status', {
            'fields': ('status', 'error_message')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'sent_at'),
            'classes': ('collapse',)
        }),
    )
