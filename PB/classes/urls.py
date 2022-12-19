from django.urls import path

from .views import EnrolSingleView, EnrolAllView, DropSingleView, DropAllView, ScheduleView, HistoryView

urlpatterns = [
    path('<int:pk>/enrol', EnrolSingleView.as_view(), name='enrol-instance'),
    path('<int:pk>/enrol/all', EnrolAllView.as_view(), name='enrol-all'),
    path('<int:pk>/drop', DropSingleView.as_view(), name='drop-instance'),
    path('<int:pk>/drop/all', DropAllView.as_view(), name='drop-all'),
    path('schedule', ScheduleView.as_view(), name='schedule'),
    path('history', HistoryView.as_view(), name='history'),
]
