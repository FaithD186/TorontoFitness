from django.http import Http404
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.fields import ChoiceField
from rest_framework.validators import UniqueTogetherValidator

from accounts.models import UserProfile
from accounts.serializers import ProfileSerializer
from .models import Class, Time, Enrollments


class TimeSerializer(serializers.ModelSerializer):
    # time_class = ClassSerializer(read_only=True)

    class Meta:
        model = Time
        fields = ("id", "class_date", "start_time", "end_time", "capacity")

class ClassSerializer(serializers.ModelSerializer):
    times = TimeSerializer(read_only=True)

    class Meta:
        model = Class
        fields = ("id", "name", "description", "coach", "capacity", "times")




class AllEnrollmentsSerializer(serializers.ModelSerializer):
    enrolled_user = serializers.SerializerMethodField()
    enrolled_class = serializers.SerializerMethodField()
    enrolled_time = serializers.SerializerMethodField()

    def get_enrolled_user(self, *args, **kwargs):
        request = self.context.get('request', None)
        return request.user

    def get_enrolled_class(self, *args, **kwargs):
        request = self.context.get('request', None)
        class_id = request.parser_context.get('kwargs').get('pk')
        class_obj = Class.objects.get(id=class_id)
        return class_obj

    class Meta:
        model = Enrollments
        fields = ("enrolled_time", "enrolled_user", "enrolled_class")

    def create(self, data):
        data['enrolled_user'] = self.get_enrolled_user()
        data['enrolled_class'] = self.get_enrolled_class()

        if data['enrolled_time'].capacity == data['enrolled_class'].capacity:
            raise PermissionDenied({"message": "The class is currently at maximum capacity"})

        data['enrolled_time'].capacity += 1
        data['enrolled_time'].save(is_first=False)

        return Enrollments.objects.create(enrolled_user=data['enrolled_user'],
                                          enrolled_class=data['enrolled_class'],
                                          enrolled_time=data['enrolled_time'])


class EnrollmentsSerializer(serializers.ModelSerializer):
    enrolled_user = serializers.SerializerMethodField()
    enrolled_class = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request', None)
        class_id = request.parser_context.get('kwargs').get('pk')
        time_objs = Time.objects.filter(time_class=class_id)
        for t in time_objs:
            e = Enrollments.objects.filter(enrolled_user=self.get_enrolled_user(), enrolled_time=t).first()
            if not e:
                continue
            time_objs = time_objs.exclude(id=e.enrolled_time.id)

        self.fields['enrolled_time'] = ChoiceField(choices=[time.id for time in time_objs])

    def get_enrolled_user(self, *args, **kwargs):
        request = self.context.get('request', None)
        return request.user

    def get_enrolled_class(self, *args, **kwargs):
        request = self.context.get('request', None)
        class_id = request.parser_context.get('kwargs').get('pk')
        class_obj = Class.objects.get(id=class_id)
        return class_obj

    class Meta:
        model = Enrollments
        fields = ("enrolled_time", "enrolled_user", "enrolled_class")

    def create(self, data):

        data['enrolled_user'] = self.get_enrolled_user()
        data['enrolled_class'] = self.get_enrolled_class()

        if data['enrolled_time'].capacity == data['enrolled_class'].capacity:
            raise PermissionDenied({"message": "The class is currently at maximum capacity"})

        data['enrolled_time'].capacity += 1
        data['enrolled_time'].save(is_first=False)

        return Enrollments.objects.create(enrolled_user=data['enrolled_user'],
                                          enrolled_class=data['enrolled_class'],
                                          enrolled_time=data['enrolled_time'])


class DropEnrollmentsSerializer(serializers.ModelSerializer):
    enrolled_user = serializers.SerializerMethodField()
    enrolled_class = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request', None)
        class_id = request.parser_context.get('kwargs').get('pk')
        all_enrollments = Enrollments.objects.filter(enrolled_user=self.get_enrolled_user(), enrolled_class=class_id)
        self.fields['enrolled_time'] = ChoiceField(
            choices=[enrollment.enrolled_time.id for enrollment in all_enrollments])

    def get_enrolled_user(self, *args, **kwargs):
        request = self.context.get('request', None)
        return request.user

    def get_enrolled_class(self, *args, **kwargs):
        request = self.context.get('request', None)
        class_id = request.parser_context.get('kwargs').get('pk')
        class_obj = Class.objects.get(id=class_id)
        return class_obj

    class Meta:
        model = Enrollments
        fields = ("enrolled_time", "enrolled_user", "enrolled_class")
