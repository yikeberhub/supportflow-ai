from django.contrib import admin
from ai_automation.models import AIAnalysis, DailySummary

# Register your models here.

@admin.register(AIAnalysis) 
class AIAnalysisAdmin(admin.ModelAdmin):
    list_display = ("id", "message", "category", "priority", "sentiment", "created_at")
    search_fields = ("message__content", "category", "sentiment")
    list_filter = ("category", "sentiment", "created_at")
    

@admin.register(DailySummary)
class DailySummaryAdmin(admin.ModelAdmin):
    list_display = ("id", "summary_text", "total_messages", "urgent_issues", "generated_at")
    search_fields = ("summary_text",)
    list_filter = ("generated_at",)