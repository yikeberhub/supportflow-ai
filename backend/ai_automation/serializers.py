from rest_framework import serializers
from .models import AIAnalysis, DailySummary, AutomationTask

class AIAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalysis
        fields = [
            'id',
            'message',
            'category',
            'priority',
            'sentiment',
            'summary',
            'draft_reply',
            'action_required',
            'created_at'
        ]
        read_only_fields = fields
        

class DailySummarySerializer(serializers.ModelSerializer):

    class Meta:
        model = DailySummary
        fields = "__all__"
        
class AutomationTaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = AutomationTask
        fields = "__all__"