from rest_framework import serializers
from .models import NotificationLog


class NotificationLogSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = NotificationLog
        fields = [
            'id',
            'user',
            'user_username',
            'notification_type',
            'recipient',
            'title',
            'message',
            'status',
            'error_message',
            'sent_at',
            'created_at'
        ]
        read_only_fields = ['id', 'sent_at', 'created_at']


class NotificationLogDetailSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = NotificationLog
        fields = [
            'id',
            'user',
            'user_username',
            'user_email',
            'notification_type',
            'recipient',
            'title',
            'message',
            'status',
            'error_message',
            'sent_at',
            'created_at'
        ]
        read_only_fields = fields