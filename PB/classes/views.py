import operator
from datetime import datetime, date, time

import time

from django.shortcuts import get_object_or_404

from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from studio.models import Studio
from subscriptions.permissions import IsSubscribed
from .models import Class, Time, Enrollments
from .serializers import ClassSerializer, EnrollmentsSerializer, AllEnrollmentsSerializer, \
    DropEnrollmentsSerializer


# Create your views here.

class ClassesView(GenericAPIView):
    queryset = Time.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        get_object_or_404(Studio, pk=kwargs['pk'])
        class_objs = Class.objects.filter(studio=kwargs['pk'])
        time_list = []
        for c in class_objs:
            if c.cancel:
                continue
            class_json= {"id": c.id,
                        "name": c.name,
                        "description": c.description,
                        "coach": c.coach,
                        "max_capacity": c.capacity,
                        "times": []
                        }
            time_objs = Time.objects.filter(time_class=c)
            for t in time_objs:
                if t.cancel or t.class_date < date.today() or (
                        t.class_date == date.today() and t.start_time < datetime.now().time()):
                    continue
                time_json = {
                    "id": t.id,
                    "class_date": t.class_date,
                    "start_time": t.start_time,
                    "end_time": t.end_time,
                    "space_left": c.capacity - t.capacity,
                }
                class_json["times"].append(time_json)
            class_json["times"].sort(key=lambda x: x['class_date'])
            time_list.append(class_json)

        time_list.sort(key=lambda x: x['name'])

        return Response(time_list)


class EnrolSingleView(CreateAPIView):
    serializer_class = EnrollmentsSerializer
    queryset = Enrollments.objects.all()
    permission_classes = [IsAuthenticated, IsSubscribed]

    def post(self, request, *args, **kwargs):
        class_obj = get_object_or_404(Class, id=self.kwargs['pk'])
        #class_obj = Class.objects.get(id=self.kwargs['pk'])
        time_obj = Time.objects.get(id=self.request.data['enrolled_time'])
        if time_obj.capacity == class_obj.capacity:
            raise PermissionDenied({"message": "This class instance is currently at maximum capacity"})

        if Enrollments.objects.filter(enrolled_time=time_obj, enrolled_user=request.user.id).first():
            raise PermissionDenied({"message": "You are already enrolled in this class instance"})

        if time_obj.class_date < date.today() or (
                        time_obj.class_date == date.today() and time_obj.start_time < datetime.now().time()):
            raise PermissionDenied({"message": "This class instance has already passed"})

        time_obj.capacity += 1
        time_obj.save(is_first=False)

        Enrollments.objects.create(enrolled_user=request.user,
                                   enrolled_time=time_obj,
                                   enrolled_class=class_obj)

        return Response({'details': 'successfully enrolled in the chosen class instance.'})



class EnrolAllView(GenericAPIView):
    serializer_class = AllEnrollmentsSerializer
    queryset = Enrollments.objects.all()
    permission_classes = [IsAuthenticated, IsSubscribed]

    # def filter_queryset(self, queryset):
    #     return queryset.filter(enrolled_class=Class.objects.filter(id=self.kwargs['pk']).first())

    def post(self, request, *args, **kwargs):
        class_obj = get_object_or_404(Class, id=self.kwargs['pk'])
        # class_obj = Class.objects.get(id=self.kwargs['pk'])
        enrolled_times = Time.objects.filter(time_class=class_obj)
        for time in enrolled_times:
            # skip enrolling instances with full capacity or ones already enrolled or ones that are in the past
            if time.capacity == class_obj.capacity or Enrollments.objects.filter(enrolled_time=time, enrolled_user=request.user).first() or \
                time.class_date < date.today() or (
                        time.class_date == date.today() and time.start_time < datetime.now().time()):
                continue

            time.capacity += 1
            time.save(is_first=False)

            Enrollments.objects.create(enrolled_user=request.user,
                                       enrolled_time=time,
                                       enrolled_class=class_obj)

        return Response({'details': 'successfully enrolled in all available class instances.'})

class DropSingleView(CreateAPIView):
    serializer_class = DropEnrollmentsSerializer
    queryset = Enrollments.objects.all()
    permission_classes = [IsAuthenticated, IsSubscribed]

    def post(self, request, *args, **kwargs):
        class_obj = get_object_or_404(Class, id=self.kwargs['pk'])
        # class_obj = Class.objects.get(id=self.kwargs['pk'])
        time_obj = Time.objects.get(id=self.request.data['enrolled_time'])

        time_obj.capacity -= 1
        time_obj.save(is_first=False)


        Enrollments.objects.filter(enrolled_user=request.user,
                                   enrolled_time=time_obj,
                                   enrolled_class=class_obj).delete()

        return Response({'details': 'successfully dropped the chosen class instance.'})


class DropAllView(GenericAPIView):
    serializer_class = AllEnrollmentsSerializer
    queryset = Enrollments.objects.all()
    permission_classes = [IsAuthenticated, IsSubscribed]
    def post(self, request, *args, **kwargs):
        class_obj = Class.objects.get(id=self.kwargs['pk'])
        enrolled_times = Time.objects.filter(time_class=class_obj)
        for time in enrolled_times:
            if time.capacity > 0:
                time.capacity -= 1
            time.save(is_first=False)

            Enrollments.objects.filter(enrolled_user=request.user,
                                       enrolled_time=time,
                                       enrolled_class=class_obj).delete()

        return Response({'details': 'successfully dropped all available class instances.'})

class ScheduleView(GenericAPIView):
    serializer_class = ClassSerializer
    queryset = Enrollments.objects.all()
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user_enrollments = Enrollments.objects.filter(enrolled_user=request.user)
        time_list = []
        for e in user_enrollments:
            if e.enrolled_class.cancel:
                continue
            if e.enrolled_time.cancel or e.enrolled_time.class_date < date.today() or (
                        e.enrolled_time.class_date == date.today() and e.enrolled_time.start_time < datetime.now().time()):
                    continue

            next_t = {
                "class_date": e.enrolled_time.class_date,
                "start_time": e.enrolled_time.start_time,
                "end_time": e.enrolled_time.end_time,
                "capacity": e.enrolled_time.capacity,
                "class": {
                    "name": e.enrolled_class.name,
                    "description": e.enrolled_class.description,
                    "coach": e.enrolled_class.coach,
                    "max_capacity": e.enrolled_class.capacity
                }
            }
            time_list.append(next_t)

        time_list.sort(key=lambda x: (x['class_date'], x['start_time']))

        return Response(time_list)


class HistoryView(GenericAPIView):
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_enrollments = Enrollments.objects.filter(enrolled_user=request.user)
        time_list = []
        for e in user_enrollments:
            if e.enrolled_class.cancel:
                continue
            if e.enrolled_time.cancel or e.enrolled_time.class_date > date.today() or (
                        e.enrolled_time.class_date == date.today() and
                        e.enrolled_time.start_time > datetime.now().time()):
                    continue

            next_t = {
                "class_date": e.enrolled_time.class_date,
                "start_time": e.enrolled_time.start_time,
                "end_time": e.enrolled_time.end_time,
                "capacity": e.enrolled_time.capacity,
                "class": {
                    "name": e.enrolled_class.name,
                    "description": e.enrolled_class.description,
                    "coach": e.enrolled_class.coach,
                    "max_capacity": e.enrolled_class.capacity
                }
            }
            time_list.append(next_t)

        time_list.sort(key=lambda x: (x['class_date'], x['start_time']))

        return Response(time_list)

