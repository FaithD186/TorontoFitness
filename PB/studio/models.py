from django.db import models
import requests

# Create your models here.


class Studio(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=120)
    phone_num = models.CharField(max_length=14)

    def __str__(self):
        return self.name


class Location(models.Model):
    objects = models.Manager()
    studio = models.OneToOneField(Studio, on_delete=models.CASCADE, null=True)
    address = models.CharField(max_length=255, blank=True)
    post_code = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, blank=True, default='0')
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, blank=True, default='0')
    directions = models.CharField(max_length=500, null=True, blank=True)
    distance = models.FloatField(null=True, blank=True)

    def save(self, **kwargs):
        address = " ".join(
            [self.address, str(self.post_code), self.city])
        api_response = requests.get(
            'https://maps.googleapis.com/maps/api/geocode/json?address={0}&key=AIzaSyCYQ9rgbyH2mlOIun5ESSCkOuyjFIDX1NM'.format(address))
        api_response_dict = api_response.json()

        if api_response_dict['status'] == 'OK':
            self.latitude = api_response_dict['results'][0]['geometry']['location']['lat']
            self.longitude = api_response_dict['results'][0]['geometry']['location']['lng']

        self.directions = 'https://www.google.com/maps/search/?api=1&query={0},{1}&query_place_id={2}'.format(api_response_dict['results'][0]['geometry']['location']['lat'], api_response_dict['results'][0]['geometry']['location']['lng'], api_response_dict['results'][0]['place_id'])

        return super().save(**kwargs)

    def __str__(self):
        return self.address


class Photo(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, related_name="photos")
    photo = models.ImageField(upload_to='images')


class Amenity(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, related_name="amenities")
    type = models.CharField(max_length=120)
    quantity = models.PositiveIntegerField()

    class Meta:
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.type



# save function from https://stackoverflow.com/questions/54754223/django-transform-an-address-in-latitude-and-longitude-through-google-api-and-s
# google geocoding: https://developers.google.com/maps/documentation/geocoding/start






