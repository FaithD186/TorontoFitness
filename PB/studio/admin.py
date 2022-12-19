from django.contrib import admin
# Register your models here.
from studio.models import Photo, Studio, Amenity, Location


class PhotoAdmin(admin.StackedInline):
    model = Photo


class AmenityAdmin(admin.StackedInline):
    model = Amenity


class LocationAdmin(admin.StackedInline):
    model = Location


class StudioAdmin(admin.ModelAdmin):
    inlines = [PhotoAdmin, AmenityAdmin, LocationAdmin]

    class Meta:
        model = Studio



admin.site.register(Studio, StudioAdmin)
admin.site.register(Amenity)
admin.site.register(Photo)
admin.site.register(Location)


