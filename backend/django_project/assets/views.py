from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Asset, Task
import json

def assets(request):
    if request.method == "GET":
        assets = Asset.objects.all()
        data = [{
            "name": asset.name,
        } for asset in assets]
        return JsonResponse(data, safe=False)


    elif request.method == "POST":
        name = json.loads(request.body())
        if Asset.objects.filter(name=name).exists():
            print("EX")
        else:
            Asset.objects.create(
                name = name
            )

     
def tasks(request):
    if request.method == "GET":
        tasks = Task.objects.all()
        data = [{
            "name": task.name,
            "department": task.department,
            "artist": task.artist,
            "deadline": task.deadline,
            "status": task.status,
            "asset": task.asset.id
        } for task in tasks]
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body())
    Task.objects.create(
                name = data["name"],
                department = data["department"],
                artist = data["artist"],
                deadline = data["deadline"],
                status = data["status"],
                asset = data["asset"],
            ) 