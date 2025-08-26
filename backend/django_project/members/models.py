from django.db import models

class Member(models.Model):
  name = models.CharField(max_length=255, null=True)
  surname = models.CharField(max_length=255, null=True)
  email = models.EmailField(max_length=255)
  password = models.CharField(max_length=255, null=True)
  is_confirmed = models.BooleanField(default=False)
  confirmation_token = models.UUIDField(unique=True, null=True)
  score = models.FloatField(default=0)