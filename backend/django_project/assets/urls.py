from django.urls import path
from . import views
from .views import tasks, assets, task_detail

urlpatterns = [
    path("tasks/", tasks),
    path("tasks/<int:task_id>/", task_detail),
    path("assets/", assets),
    path("tasks/", tasks),



]