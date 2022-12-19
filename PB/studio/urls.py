from django.urls import path

from studio.views import FindStudioByCurr, FindStudioByPoint, \
    FindStudioByPostCode, StudioView, FilteredStudios, FilteredClasses
from classes.views import ClassesView

urlpatterns = [
    path('<int:pk>/details/', StudioView.as_view(), name='studio-details'),
    path("sortby/currlocation/", FindStudioByCurr.as_view()),
    path("sortby/point/", FindStudioByPoint.as_view()),
    path("sortby/postcode/", FindStudioByPostCode.as_view(), name='post_code'),
    path('<int:pk>/classes/', ClassesView.as_view(), name='studio-class'),
    path('filter/', FilteredStudios.as_view(), name='filtered-studios'),
    path('<int:pk>/classes/filter/', FilteredClasses.as_view(), name='filtered-classes')
]
