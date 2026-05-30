from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/", include("customer_support.urls")),
    path("api/ai/", include("ai_automation.urls")),
    path("api/notifications/", include("notifications.urls")),
    # path("api/dashboard/", include("dashboard.urls")),
]