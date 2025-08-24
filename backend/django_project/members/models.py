from django.db import models

class Member(models.Model):
  first_name = models.CharField(max_length=255, null=True)
  last_name = models.CharField(max_length=255, null=True)
  email = models.EmailField(max_length=255)
  password = models.CharField(max_length=255, null=True)
  is_confirmed = models.BooleanField(default=False)
  confirmation_token = models.UUIDField(unique=True, null=True)