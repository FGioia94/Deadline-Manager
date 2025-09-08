from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Asset, Task
import json
import datetime
import ast

@csrf_exempt
def assets(request):
    try:
        if request.method == "GET":
            assets = Asset.objects.all()
            data = [
                {
                    "id": asset.id,
                    "name": asset.name,
                    "added_on": asset.added_on.strftime("%Y-%m-%d") if asset.added_on else "",
                    "added_by": asset.added_by or "",
                }
                for asset in assets
            ]
            return JsonResponse(data, safe=False)

        elif request.method == "POST":
            payload = json.loads(request.body)
            name = payload.get("name")
            if isinstance(name, dict):
                name = name.get("name")
            if not isinstance(name, str):
                return JsonResponse({"error": "Invalid asset name"}, status=400)

            if Asset.objects.filter(name=name).exists():
                return JsonResponse({"message": f"Asset '{name}' already exists"})
            asset = Asset.objects.create(name=name)
            return JsonResponse({"message": f"Asset '{name}' created", "id": asset.id})

        else:
            return JsonResponse({"error": "Method not allowed"}, status=405)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def tasks(request):
    try:
        if request.method == "GET":
            tasks = Task.objects.all()
            data = []
            for task in tasks:
                name = task.name
                if isinstance(name, str) and name.startswith("{") and name.endswith("}"):
                    try:
                        parsed = ast.literal_eval(name)
                        name = parsed.get("name", name)
                    except:
                        pass

                asset_name = task.asset.name if task.asset else None
                data.append({
                    "id": task.id,
                    "name": name,
                    "department": task.department,
                    "artist": task.artist,
                    "deadline": task.deadline.strftime("%Y-%m-%d") if task.deadline else "",
                    "status": task.status,
                    "asset": asset_name,
                    "added_on": task.added_on.strftime("%Y-%m-%d") if task.added_on else "",
                    "added_by": task.added_by or "",
                })
            return JsonResponse(data, safe=False)

        elif request.method == "POST":
            payload = json.loads(request.body)

            name = payload.get("name")
            if isinstance(name, dict):
                name = name.get("name")
            if not isinstance(name, str):
                return JsonResponse({"error": "Invalid task name"}, status=400)

            department = payload.get("department")
            artist = payload.get("artist")
            deadline = payload.get("deadline") or "2025-12-31"
            status = payload.get("status")
            asset_id = payload.get("asset")

            if not all([name, department, artist, status]):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            asset_instance = None
            if asset_id:
                try:
                    asset_instance = Asset.objects.get(id=asset_id)
                except Asset.DoesNotExist:
                    return JsonResponse({"error": f"Asset with ID {asset_id} not found"}, status=404)

            task = Task.objects.create(
                name=name,
                department=department,
                artist=artist,
                deadline=deadline,
                status=status,
                asset=asset_instance,
                added_on=datetime.date.today(),
                added_by="",
            )
            return JsonResponse({"message": f"Task '{name}' created", "id": task.id})

        elif request.method == "PATCH":
            payload = json.loads(request.body)
            task_name = payload.get("name")
            if isinstance(task_name, dict):
                task_name = task_name.get("name")
            if not isinstance(task_name, str):
                return JsonResponse({"error": "Invalid task name"}, status=400)

            try:
                task = Task.objects.get(name=task_name)
            except Task.DoesNotExist:
                return JsonResponse({"error": f"Task '{task_name}' not found"}, status=404)

            updates = []
            if "deadline" in payload:
                task.deadline = payload["deadline"]
                updates.append(f"deadline → {payload['deadline']}")
            if "artist" in payload:
                task.artist = payload["artist"]
                updates.append(f"artist → {payload['artist']}")
            if "status" in payload:
                task.status = payload["status"]
                updates.append(f"status → {payload['status']}")

            if not updates:
                return JsonResponse({"error": "No valid fields to update"}, status=400)

            task.save()
            return JsonResponse({
                "message": f"Task '{task_name}' updated: {', '.join(updates)}",
                "id": task.id
            })

        elif request.method == "DELETE":
            task_name = request.GET.get("name")
            if isinstance(task_name, dict):
                task_name = task_name.get("name")
            if not isinstance(task_name, str):
                return JsonResponse({"error": "Invalid task name"}, status=400)

            try:
                task = Task.objects.get(name=task_name)
                task.delete()
                return JsonResponse({"message": f"Task '{task_name}' deleted successfully"})
            except Task.DoesNotExist:
                return JsonResponse({"error": f"Task '{task_name}' not found"}, status=404)

        else:
            return JsonResponse({"error": "Method not allowed"}, status=405)

    except Exception as e:
        print("Fatal error in tasks view:", e)
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def task_detail(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        if request.method == "GET":
            asset_name = task.asset.name if task.asset else None
            return JsonResponse({
                "id": task.id,
                "name": task.name,
                "department": task.department,
                "artist": task.artist,
                "deadline": task.deadline.strftime("%Y-%m-%d") if task.deadline else "",
                "status": task.status,
                "asset": asset_name,
                "added_on": task.added_on.strftime("%Y-%m-%d") if task.added_on else "",
                "added_by": task.added_by or "",
            })
        else:
            return JsonResponse({"error": "Method not allowed"}, status=405)
    except Task.DoesNotExist:
        return JsonResponse({"error": f"Task with ID {task_id} not found"}, status=404)