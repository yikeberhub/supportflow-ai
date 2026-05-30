from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter

from .models import CustomerMessage
from .serializers import (
    CustomerMessageSerializer,
    CustomerMessageDetailSerializer
)
from ai_automation.tasks.analyse_customer_message import analyze_customer_message


class CustomerMessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomerMessageSerializer
    queryset = CustomerMessage.objects.all()
    filter_backends = [OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user

        if user.role == "ADMIN":
            queryset = CustomerMessage.objects.all()
        else:
            queryset = CustomerMessage.objects.filter(user=user)

        # Apply status filter if provided
        status = self.request.query_params.get('status')
        if status and status != 'All':
            queryset = queryset.filter(status=status)

        return queryset.order_by('-created_at')

   
    def perform_create(self, serializer):
        message = serializer.save(user=self.request.user)
        analyze_customer_message.delay(message.id)

   
    def get_serializer_class(self):
        if self.action == "retrieve":
            return CustomerMessageDetailSerializer

        return CustomerMessageSerializer