from django.contrib.auth import get_user_model
from django.db import models
from django.http import Http404

from accounts.models import UserProfile
from studio.models import Studio
from datetime import timedelta

# Create your models here.

RECURRENCE_CHOICES = (
    (1, 'Daily'),
    (7, 'Weekly'),
    (14, 'Biweekly'),
    (30, 'Monthly')
)


class Class(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=120)
    description = models.CharField(max_length=200)
    coach = models.CharField(max_length=200)
    capacity = models.PositiveIntegerField()
    cancel = models.BooleanField(default=False)
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Classes"


class Keyword(models.Model):
    word = models.CharField(max_length=200)
    keyword_class = models.ForeignKey(Class, on_delete=models.CASCADE)

    def __str__(self):
        return self.word


class Time(models.Model):
    objects = models.Manager()
    class_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    last_class_date = models.DateField()
    frequency = models.IntegerField(choices=RECURRENCE_CHOICES)
    cancel = models.BooleanField(default=False)
    time_class = models.ForeignKey(Class, on_delete=models.CASCADE)
    capacity = models.PositiveIntegerField(default=0)

    def save(self, is_first=True, *args, **kwargs):
        # Override save to add all class instances between the first class date and the last class date
        super().save(*args, **kwargs)
        curr_date = self.class_date
        curr_date += timedelta(days=self.frequency)
        while curr_date <= self.last_class_date and is_first:
            time = Time(class_date=curr_date,
                        start_time=self.start_time,
                        end_time=self.end_time,
                        last_class_date=self.last_class_date,
                        frequency=self.frequency,
                        time_class=self.time_class)
            time.save(is_first=False)
            curr_date += timedelta(days=self.frequency)

    def __str__(self):
        return f'{self.class_date.strftime("%A, %m/%d/%Y")} from {self.start_time.strftime("%H:%M")} to {self.end_time.strftime("%H:%M")}'


class Enrollments(models.Model):
    objects = models.Manager()
    enrolled_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    enrolled_time = models.ForeignKey(Time, on_delete=models.CASCADE)
    enrolled_class = models.ForeignKey(Class, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('enrolled_user', 'enrolled_time')
        verbose_name_plural = "Enrolled Users"

    def __str__(self):
        return f'{self.enrolled_user} has {self.enrolled_class} on {self.enrolled_time}'
