from django.urls import path
from .views import (
    AIAnalysisListAPIView,
    AIAnalysisDetailAPIView,
    MessageAnalysisAPIView,
    DailySummaryListAPIView,
    LatestDailySummaryAPIView,
    GenerateDailySummaryAPIView
)

urlpatterns = [
    path("analysis/", AIAnalysisListAPIView.as_view()),
    path("analysis/<int:pk>/", AIAnalysisDetailAPIView.as_view()),
    path("analysis/message/<int:message_id>/", MessageAnalysisAPIView.as_view()),

    path("summaries/", DailySummaryListAPIView.as_view()),
    path("summaries/latest/", LatestDailySummaryAPIView.as_view()),
    path("summaries/generate/", GenerateDailySummaryAPIView.as_view()),
]