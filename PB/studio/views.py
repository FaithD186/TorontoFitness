import operator
from rest_framework.generics import GenericAPIView, ListAPIView, \
    get_object_or_404
from rest_framework.response import Response

from classes.models import Class, Time
from studio.models import Location, Studio, Amenity
from studio.serializers import LocationSerializer, StudioSerializer
from classes.serializers import ClassSerializer, TimeSerializer
import requests
from rest_framework.permissions import AllowAny

from geopy import distance
from geopy import Point

from datetime import datetime, date

class StudioView(GenericAPIView):
    """
    Return general information of a studio.
    """
    serializer_class = StudioSerializer
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        studio = get_object_or_404(Studio, pk=kwargs['pk'])
        studio_serializer = StudioSerializer(studio)
        return Response(studio_serializer.data)


class FindStudioByCurr(ListAPIView):
    """
    Return ordered list of studios based on geographical proximity to a
    user's current location

    IP address of user is converted to coordinates using ipify API
    (https://www.ipify.org/)

    Distance between coordinates calculated using geopy
    (https://pypi.org/project/geopy/)
    """
    serializer_class = StudioSerializer
    paginate_by = 10
    permission_classes = (AllowAny,)
    def get_queryset(self):
        response = requests.get('https://api64.ipify.org?format=json').json()
        ip_address = response["ip"]
        response = requests.get(f'https://ipapi.co/{ip_address}/json/').json()
        location_data = {
            "latitude": response.get("latitude"),
            "longitude": response.get("longitude"),
        }

        curr_location = Point(location_data["latitude"], location_data["longitude"])

        location_list = Location.objects.all()
        for location in location_list:
            studio_location = Point(location.latitude, location.longitude)
            location.distance = distance.distance(curr_location, studio_location).kilometers
        list_by_distance = sorted(location_list, key=operator.attrgetter('distance'))

        list_by_studio = []
        for place in list_by_distance:
            studio = place.studio
            list_by_studio.append(studio)
        return list_by_studio


class FindStudioByPoint(ListAPIView):
    """
    Return ordered list of studios (name + location) based on geographical
    proximity to a pinpoint on a map (set of coordinates)

    Distance between coordinates calculated using geopy
    (https://pypi.org/project/geopy/)
    """
    serializer_class = StudioSerializer
    paginate_by = 10
    permission_classes = (AllowAny,)

    def get_queryset(self):
        if 'latitude' in self.request.GET:
            if 'longitude' in self.request.GET:
                latitude = self.request.GET['latitude']
                longitude = self.request.GET['longitude']
                curr_location = Point(latitude, longitude)

                location_list = Location.objects.all()
                for location in location_list:
                    studio_location = Point(location.latitude, location.longitude)
                    location.distance = distance.distance(curr_location, studio_location).kilometers
                list_by_distance = sorted(location_list, key=operator.attrgetter('distance'))

                list_by_studio = []
                for place in list_by_distance:
                    studio = place.studio
                    list_by_studio.append(studio)
                return list_by_studio
        return []


class FindStudioByPostCode(ListAPIView):
    """
    Return ordered list of studios (name + location) based on geographical
    proximity to a postal code.

    Postal code is converted to coordinates using Google Maps API geocoding
    (https://developers.google.com/maps/documentation/geocoding/start)

    Distance between coordinates calculated using geopy
    (https://pypi.org/project/geopy/)
    """
    serializer_class = StudioSerializer
    paginate_by = 10
    permission_classes = (AllowAny,)

    def get_queryset(self):
#         if not self.request.data["post_code"]:
#             return Response({"message": "Please enter a postal code."})
        if 'post_code' in self.request.GET:
            post_code = self.request.GET['post_code']
            if ((post_code != "")):
                api_response = requests.get(
                    'https://maps.googleapis.com/maps/api/geocode/json?address={0}&key=AIzaSyCYQ9rgbyH2mlOIun5ESSCkOuyjFIDX1NM'.format(
                        post_code))
                api_response_dict = api_response.json()
                curr_location = Point(api_response_dict['results'][0]['geometry']['location']['lat'],
                                      api_response_dict['results'][0]['geometry']['location']['lng'])

                location_list = Location.objects.all()
                for location in location_list:
                    studio_location = Point(location.latitude, location.longitude)
                    location.distance = distance.distance(curr_location, studio_location).kilometers
                list_by_distance = sorted(location_list, key=operator.attrgetter('distance'))

                list_by_studio = []
                for place in list_by_distance:
                    studio = StudioSerializer(place.studio)
                    list_by_studio.append(studio.data)
                return list_by_studio
        return []


class FilteredStudios(ListAPIView):
    serializer_class = StudioSerializer
    permission_classes = (AllowAny,)
    paginate_by = 10

    def get_queryset(self):
        filtered_by_studio_name = Studio.objects.none()
        filtered_by_amenity = Studio.objects.none()
        filtered_by_class_name = Studio.objects.none()
        filtered_by_coach = Studio.objects.none()

        if 'studio_name' in self.request.GET:
            if self.request.GET['studio_name'] == '':
                filtered_by_studio_name |= Studio.objects.all()
            found_name = False
            for s in Studio.objects.all():
                if s.name == self.request.GET['studio_name']:
                    found_name = True
                    filtered_by_studio_name |= Studio.objects.filter(name=s.name)
            if not found_name and self.request.GET['studio_name'] != '':
                return Studio.objects.none()
        if 'amenity' in self.request.GET:
            if self.request.GET['amenity'] == '':
                filtered_by_amenity |= Studio.objects.all()
            found = False
            for a in Amenity.objects.all():
                if a.type == self.request.GET['amenity']:
                    found = True
                    filtered_by_amenity |= Studio.objects.filter(id=a.studio.id)
            if not found and self.request.GET['amenity'] != '':
                return Studio.objects.none()

        if 'class_name' in self.request.GET:
            if self.request.GET['class_name'] == '':
                filtered_by_class_name |= Studio.objects.all()
            found = False
            for c in Class.objects.all():
                if c.name == self.request.GET['class_name']:
                    found = True
                    filtered_by_class_name |= Studio.objects.filter(id=c.studio.id)
            if not found and self.request.GET['class_name'] != '':
                return Studio.objects.none()
        if 'coach' in self.request.GET:
            if self.request.GET['coach'] == '':
                filtered_by_coach |= Studio.objects.all()
            found = False
            for c in Class.objects.all():
                if c.coach == self.request.GET['coach']:
                    found = True
                    filtered_by_coach |= Studio.objects.filter(id=c.studio.id)
            if not found and self.request.GET['coach'] != '':
                return Studio.objects.none()


        filters = [filtered_by_studio_name,
                   filtered_by_amenity,
                   filtered_by_class_name,
                   filtered_by_coach]

        non_empty = [filter for filter in filters if filter]

        return non_empty[0].intersection(*non_empty[1:])



class FilteredClasses(GenericAPIView):
    serializer_class = TimeSerializer
    permission_classes = (AllowAny,)
    # queryset = Time.objects.none()
    paginate_by = 10

    def get_queryset(self):
        filtered_by_name = Time.objects.none()
        filtered_by_coach = Time.objects.none()
        filtered_by_date = Time.objects.none()
        filtered_by_start_time = Time.objects.none()
        filtered_by_end_time = Time.objects.none()
        if 'class_name' in self.request.GET:
            if self.request.GET['class_name'] == '':
                filtered_by_name |= Time.objects.all()
            found_name = False
            for c in Class.objects.all():
                if c.name == self.request.GET['class_name']:
                    found_name = True
                    filtered_by_name |= Time.objects.filter(time_class=c.id)
            if not found_name and self.request.GET['class_name'] != '':
                return Time.objects.none()

        if 'coach' in self.request.GET:
            if self.request.GET['coach'] == '':
                filtered_by_coach |= Time.objects.all()            
            found_coach = False
            for c in Class.objects.all():
                if c.coach == self.request.GET['coach']:
                    found_coach = True
                    filtered_by_coach |= Time.objects.filter(time_class=c.id)
            if not found_coach and self.request.GET['coach'] != '':
                return Time.objects.none()

        if 'date' in self.request.GET:
            if self.request.GET['date'] == '':
                filtered_by_date |= Time.objects.all()            
            found_date = False
            for t in Time.objects.all():
                if str(t.class_date) == self.request.GET['date']:
                    found_date = True
                    filtered_by_date |= Time.objects.filter(id=t.id)
            if not found_date and self.request.GET['date'] != '':
                return Time.objects.none()

        if 'start_time' in self.request.GET:
            if self.request.GET['start_time'] == '':
                filtered_by_start_time |= Time.objects.all()            
            found_start_time = False
            for t in Time.objects.all():
                if str(t.start_time) == self.request.GET['start_time']:
                    found_start_time = True
                    filtered_by_start_time |= Time.objects.filter(id=t.id)
            if not found_start_time and self.request.GET['start_time'] != '':
                return Time.objects.none()
        if 'end_time' in self.request.GET:
            if self.request.GET['end_time'] == '':
                filtered_by_end_time |= Time.objects.all()            
            found_end_time = False
            for t in Time.objects.all():
                if str(t.end_time) == self.request.GET['end_time']:
                    found_end_time = True
                    filtered_by_end_time |= Time.objects.filter(id=t.id)
            if not found_end_time and self.request.GET['end_time'] != '':
                return Time.objects.none()

        filters = [filtered_by_name,
                   filtered_by_coach,
                   filtered_by_date,
                   filtered_by_start_time,
                   filtered_by_end_time]

        non_empty = [filter for filter in filters if filter]
        return non_empty[0].intersection(*non_empty[1:])

    
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
                if t not in self.get_queryset() or t.cancel or t.class_date < date.today() or (
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

