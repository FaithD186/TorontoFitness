from django.contrib import admin
from .models import Class, Keyword, Time, Enrollments


# Register your models here.

class KeywordsAdmin(admin.StackedInline):
    model = Keyword


class TimesAdmin(admin.StackedInline):
    model = Time
    exclude = ('capacity',)


class EnrolledAdmin(admin.StackedInline):
    model = Enrollments

class ClassAdmin(admin.ModelAdmin):
    model = Class
    inlines = [KeywordsAdmin, TimesAdmin]


admin.site.register(Class, ClassAdmin)
admin.site.register(Keyword)
admin.site.register(Time)
admin.site.register(Enrollments)
