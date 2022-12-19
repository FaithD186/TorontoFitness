from django.contrib import admin

from .models import Membership, UserMembership, CardInfo, PaymentInfo
from django.contrib.auth.admin import UserAdmin

admin.site.register(Membership)
admin.site.register(UserMembership)
admin.site.register(CardInfo)
admin.site.register(PaymentInfo)
