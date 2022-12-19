from django.contrib import admin

# Register your models here.

from .models import UserProfile
from django.contrib.auth.admin import UserAdmin


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        *UserAdmin.fieldsets,
        (
            'Other Personal Info',
            {
                'fields': (
                    'phone_num',
                    'avatar'
                ),
            },
        ),
    )


admin.site.register(UserProfile, CustomUserAdmin)
