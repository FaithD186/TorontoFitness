from rest_framework import serializers
from studio.models import Location, Studio, Photo, Amenity

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ("photo",)

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ("type", "quantity")

class LocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = ("address", "post_code", "latitude", "longitude", "directions", "distance")


class StudioSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Studio
        fields = ("id", "name", "phone_num", "location", "amenities", "photos")
