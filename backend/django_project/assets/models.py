from django.db import models
from django.db import models
class Asset(models.Model):
    name = models.CharField(max_length=255)

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

    name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    artist = models.CharField(max_length=255, null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    asset = models.ForeignKey(Asset, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.department})"
