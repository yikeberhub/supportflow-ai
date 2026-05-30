from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from customer_support.models import CustomerMessage
from ai_automation.models import AIAnalysis


class AdminDashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "ADMIN":
            return Response(
                {"detail": "Not authorized"},
                status=403
            )

        total_messages = CustomerMessage.objects.count()
        open_messages = CustomerMessage.objects.filter(status="OPEN").count()
        resolved = CustomerMessage.objects.filter(status="RESOLVED").count()

        ai_total = AIAnalysis.objects.count()

        sentiment_stats = {
            "positive": AIAnalysis.objects.filter(sentiment="Positive").count(),
            "neutral": AIAnalysis.objects.filter(sentiment="Neutral").count(),
            "negative": AIAnalysis.objects.filter(sentiment="Negative").count(),
        }

        priority_stats = {
            "high": AIAnalysis.objects.filter(priority="High").count(),
            "medium": AIAnalysis.objects.filter(priority="Medium").count(),
            "low": AIAnalysis.objects.filter(priority="Low").count(),
        }

        return Response({
            "messages": {
                "total": total_messages,
                "open": open_messages,
                "resolved": resolved
            },
            "ai": {
                "total": ai_total,
                "sentiment": sentiment_stats,
                "priority": priority_stats
            }
        })