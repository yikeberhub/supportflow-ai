from django.db import models
from customer_support.models import CustomerMessage


class AIAnalysis(models.Model):
    message = models.OneToOneField(CustomerMessage, on_delete=models.CASCADE, related_name='analysis')

    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=20)
    sentiment = models.CharField(max_length=20)

    summary = models.TextField()
    draft_reply = models.TextField()

    action_required = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    

class DailySummary(models.Model):
    summary_text = models.TextField()
    total_messages = models.IntegerField(default=0)
    urgent_issues = models.IntegerField(default=0)
    
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Summary {self.generated_at.date()}"


class AutomationTask(models.Model):
    class Status(models.TextChoices):
        PENDING = "Pending"
        RUNNING = "Running"
        SUCCESS = "Success"
        FAILED = "Failed"

    message = models.ForeignKey(CustomerMessage, on_delete=models.CASCADE)

    task_type = models.CharField(max_length=100)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    result = models.TextField(null=True, blank=True)

    retry_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)