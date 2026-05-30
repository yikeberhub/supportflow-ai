from rest_framework.views import APIView
from rest_framework.response import Response
from common.permissions import IsAdmin
from rest_framework import status

from .models import AIAnalysis, DailySummary
from .serializers import AIAnalysisSerializer, DailySummarySerializer
from customer_support.models import CustomerMessage
from ai_automation.tasks.generate_daily_summary import generate_daily_summary

class AIAnalysisListAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        data = AIAnalysis.objects.all().order_by("-created_at")
        serializer = AIAnalysisSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AIAnalysisDetailAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, pk):
        try:
            analysis = AIAnalysis.objects.get(pk=pk)
        except AIAnalysis.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)

        serializer = AIAnalysisSerializer(analysis)
        return Response(serializer.data)
    
class MessageAnalysisAPIView(APIView):

    def get(self, request, message_id):
        try:
            analysis = AIAnalysis.objects.get(message_id=message_id)
        except AIAnalysis.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)

        serializer = AIAnalysisSerializer(analysis)
        return Response(serializer.data)
    
class DailySummaryListAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        summaries = DailySummary.objects.all().order_by("-generated_at")
        serializer = DailySummarySerializer(summaries, many=True)
        return Response(serializer.data)
    
class LatestDailySummaryAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        summary = DailySummary.objects.order_by("-generated_at").first()

        if not summary:
            return Response({"detail": "No summary found"}, status=404)

        serializer = DailySummarySerializer(summary)
        return Response(serializer.data)
    
class GenerateDailySummaryAPIView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        task = generate_daily_summary.delay()

        return Response({
            "message": "Summary generation started",
            "task_id": task.id
        })