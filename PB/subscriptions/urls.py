from django.urls import path

from .views import SubscriptionView, EditCardInfoView, PaymentHistoryView, PaymentFutureView, \
    EditSubscriptionView, CancelSubscriptionView, ListMembershipView

urlpatterns = [
    path('memberships/', ListMembershipView.as_view()),
    # path('memberships/edit/', EditUserMembershipView.as_view(), name='memberships'),
    path('<int:pk>/subscribe/', SubscriptionView.as_view(), name='memberships'),
    path('card/edit/', EditCardInfoView.as_view(), name='edit-card'),
    path('payments/history/', PaymentHistoryView.as_view(), name='history'),
    path('payments/future/', PaymentFutureView.as_view(), name='future'),
    path('edit/', EditSubscriptionView.as_view(), name='edit-subscription'),
    path('cancel/', CancelSubscriptionView.as_view(), name='cancel-subscription')

]
