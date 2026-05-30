from rest_framework import serializers
from .models import CustomerMessage
from ai_automation.serializers import AIAnalysisSerializer
from accounts.serializers import UserSerializer


class CustomerMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = CustomerMessage
        fields = [
            "id",
            "content",
            "user",
            "status",
            "is_processed",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "is_processed",
            "created_at",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)


class CustomerMessageDetailSerializer(serializers.ModelSerializer):
    analysis = AIAnalysisSerializer(read_only=True)

    class Meta:
        model = CustomerMessage
        fields = [
            "id",
            "content",
            "status",
            "is_processed",
            "created_at",
            "analysis",
        ]
        read_only_fields = [
            "id",
            "is_processed",
            "created_at",
            "analysis",
        ]