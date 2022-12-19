from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.models import UserProfile
from accounts.serializers import ChangePasswordSerializer, RegisterSerializer, \
    ProfileSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser


class ProfileView(RetrieveUpdateAPIView):
    """
    View logged-in user's profile or update profile information.
    """
    serializer_class = ProfileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        user = UserProfile.objects.filter(user=self.request.user)
        return user

    def get(self, request, *args, **kwargs):
        user = self.request.user
        profile_serializer = ProfileSerializer(user)
        return Response(profile_serializer.data)

    def update(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class RegisterAPIView(CreateAPIView):
    """
    Registers a user with first name, last name, email, phone number, avatar(optional).
    """
    queryset = UserProfile.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)


class LogoutView(APIView):
    """
    Logs out a user by blacklisting token.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = UserProfile
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("password")):
                return Response({"password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("password2"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)









