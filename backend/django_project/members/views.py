from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
import uuid
from .models import Member
from django.contrib.auth.hashers import make_password
from django_project.utilities.email_utilities import send_confirmation_email
from django.shortcuts import get_object_or_404


def members(request):
    
    if request.method == "GET":
        members = list(Member.objects.values())
        return JsonResponse(members, safe=False)

    
    elif request.method == "POST":
        data = json.loads(request.body)
        if Member.objects.filter(email=data["email"]).exists():
            return JsonResponse({"message": "POST request denied, user already exists"})
        token=uuid.uuid4()
        Member.objects.create(
            name = data["name"],
            surname = data["surname"],
            email = data["email"],
            password=make_password(data["password"]),
            is_confirmed = False,
            confirmation_token = token,
            )
        send_confirmation_email(data["email"], token)
        return JsonResponse({"message": "POST request received"})

def confirm_registration(request, token):
    member = get_object_or_404(Member, confirmation_token=token)
    member.is_confirmed = True
    member.save()
    return JsonResponse({"message": "Registration confirmed!"})