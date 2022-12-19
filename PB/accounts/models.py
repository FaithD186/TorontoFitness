from datetime import datetime, timedelta

from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import AbstractUser


class UserProfile(AbstractUser):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    password = models.CharField(max_length=120)
    password2 = models.CharField(max_length=120, blank=True, null=True)
    email = models.EmailField(max_length=200)
    avatar = models.ImageField(max_length=None, upload_to='avatars')
    phone_num = models.CharField(max_length=20)










