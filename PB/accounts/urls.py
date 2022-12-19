from django.urls import path

from accounts.views import ChangePasswordView, LogoutView, ProfileView, \
    RegisterAPIView
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/view/', ProfileView.as_view()),
    path('profile/edit/', ProfileView.as_view()),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('changepassword/', ChangePasswordView.as_view())
]
