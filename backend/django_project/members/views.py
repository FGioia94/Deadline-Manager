from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
import uuid

from .models import Member
from django.contrib.auth.hashers import make_password
from django_project.utilities.email_utilities import send_confirmation_email


@csrf_exempt
def members(request):
    if request.method == "GET":
        members = list(Member.objects.values())
        return JsonResponse(members, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        if Member.objects.filter(email=data.get("email")).exists():
            return JsonResponse({"message": "User already exists"}, status=400)

        token = uuid.uuid4()
        Member.objects.create(
            name=data.get("name"),
            surname=data.get("surname"),
            email=data.get("email"),
            password=make_password(data.get("password")),
            is_confirmed=False,
            confirmation_token=token,
        )
        send_confirmation_email(data.get("email"), token)
        return JsonResponse({"message": "Member created successfully"})

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def member_detail(request, member_id):
    member = get_object_or_404(Member, id=member_id)

    if request.method == "PATCH":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        updated_fields = []

        if "score" in data:
            try:
                member.score += int(data["score"])
                updated_fields.append(f"score updated to {member.score}")
            except (TypeError, ValueError):
                return JsonResponse({"error": "Invalid score value"}, status=400)

        if not updated_fields:
            return JsonResponse({"error": "No valid fields to update"}, status=400)

        member.save()
        return JsonResponse({"message": f"Member updated: " + ", ".join(updated_fields)})

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def confirm_registration(request, token):
    member = get_object_or_404(Member, confirmation_token=token)
    member.is_confirmed = True
    member.save()
    return JsonResponse({"message": "Registration confirmed!"})