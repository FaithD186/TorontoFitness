from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from accounts.models import UserProfile


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ('first_name', 'last_name', 'email', 'phone_num', 'avatar')


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=UserProfile.objects.all())]
    )
    password = serializers.CharField(
        max_length=120,
        min_length=8,
        required=True,
        write_only=True,
        validators=[validate_password]
    )
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'phone_num', 'avatar')
        write_only_fields = ('password',)

    def create(self, validated_data):
        user = UserProfile.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    model = UserProfile

    """
    Serializer for password change endpoint.
    """
    password = serializers.CharField(required=True)
    password2 = serializers.CharField(required=True)









