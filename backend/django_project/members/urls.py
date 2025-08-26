from django.urls import path
from . import views

urlpatterns = [
    path("members/", views.members),
    path("members/<int:member_id>/", views.member_detail),
    path("confirm/<uuid:token>/", views.confirm_registration),
]