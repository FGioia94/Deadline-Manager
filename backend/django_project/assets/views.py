from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Asset, Task
import json
import datetime

def assets(request):
    if request.method == "GET":
        assets = Asset.objects.all()
        data = [{
            "name": asset.name,
            "added_on":  datetime.datetime.now().strftime("%Y-%m-%d"),
            "added_by": "",
        } for asset in assets]
        return JsonResponse(data, safe=False)


    elif request.method == "POST":
        name = json.loads(request.body)
        if Asset.objects.filter(name=name).exists():
            return JsonResponse({"message": f"Asset {name} Already Exists"})
        else:
            Asset.objects.create(
                name = name
            )
            return JsonResponse({"message": f"Asset {name} Created"})


     
def tasks(request):
    if request.method == "GET":
        tasks = Task.objects.all()
        data = [{
            "name": task.name,
            "department": task.department,
            "artist": task.artist,
            "deadline": task.deadline,
            "status": task.status,
            "asset": task.asset,
            "added_on": task.added_on,
            "added_by": task.added_by
        } for task in tasks]
        return JsonResponse(data, safe=False)
        
    elif request.method == "POST":
        data = json.loads(request.body)
        data["added_on"] = datetime.datetime.now().strftime("%Y-%m-%d")
        data["added_by"] = ""
        Task.objects.create(
                name = data["name"],
                department = data["department"],
                artist = data["artist"],
                deadline = data["deadline"] if data["deadline"] else "2023-12-07",
                status = data["status"],
                asset = None,
                added_on = data["added_on"],
                added_by = data["added_by"],
            ) 
        return JsonResponse({"message": f"Task {data["name"]} Created"})
    
    elif request.method == "PATCH":
        data = json.loads(request.body)
        task_name = data.get("name")

        if not task_name:
            return JsonResponse({"error": "Missing 'name' in request"}, status=400)

        try:
            task = Task.objects.get(name=task_name)

            updated_fields = []

            if "deadline" in data:
                task.deadline = data["deadline"]
                updated_fields.append(f"deadline updated to {data['deadline']}")

            if "artist" in data:
                task.artist = data["artist"]
                updated_fields.append(f"artist updated to {data['artist']}")
                            

            if not updated_fields:
                return JsonResponse({"error": "No valid fields to update"}, status=400)

            task.save()
            return JsonResponse({"message": f"Task '{task_name}' updated: " + ", ".join(updated_fields)})

        except Task.DoesNotExist:
            return JsonResponse({"error": f"Task '{task_name}' not found"}, status=404)
    elif request.method == "DELETE":
        task_name = request.GET.get("name")

        if not task_name:
            return JsonResponse({"error": "Missing 'name' query parameter"}, status=400)

        try:
            task = Task.objects.get(name=task_name)
            task.delete()
            return JsonResponse({"message": f"Task '{task_name}' deleted successfully"})
        except Task.DoesNotExist:
            return JsonResponse({"error": f"Task '{task_name}' not found"}, status=404)