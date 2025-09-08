from django.db import models
from django.db import models
class Asset(models.Model):
    name = models.CharField(max_length=255)
    added_on = models.DateField(null=True, blank=True)
    added_by = models.CharField(max_length=255, null=True, blank=True)
    def __str__(self):
        return self.name
    
class Task(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('approved', 'Approved'),
        ('temp_approved', 'Temp Approved'),
        ('pending_review', 'Pending Review'),
        ('retake', 'Retake'),
        ('hold', 'Hold'),
        ('blocked', 'Blocked'),
    ]

    name = models.CharField(max_length=255, unique=True)
    department = models.CharField(max_length=255)
    artist = models.CharField(max_length=255, null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    asset = models.ForeignKey(Asset, related_name='tasks', on_delete=models.CASCADE, null=True)
    added_on = models.DateField(null=True, blank=True)
    added_by = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

