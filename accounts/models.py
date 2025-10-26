from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from abstract.abstract import TimeStampedModel, IDModel

class User(AbstractUser, TimeStampedModel, IDModel):
    """Custom user model for Vibe With KQ platform"""
    
    USER_TYPE_CHOICES = (
        ('passenger', 'Passenger'),
        ('business_partner', 'Business Partner'),
        ('staff', 'KQ Staff'),
        ('admin', 'Administrator'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='passenger')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    nationality = models.CharField(max_length=100, blank=True, null=True)
    
    # Business partner specific fields
    business_name = models.CharField(max_length=255, blank=True, null=True)
    business_verified = models.BooleanField(default=False)
    business_category = models.CharField(max_length=100, blank=True, null=True)
    
    # Staff specific fields
    employee_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    
    # Passenger specific fields (for ticket verification)
    passport_number = models.CharField(max_length=50, blank=True, null=True, unique=True)
    ticket_verified = models.BooleanField(default=False)
    last_ticket_number = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
    
    class Meta:
        ordering = ['-created_at']


class TicketVerification(TimeStampedModel, IDModel):
    """Store ticket verification records"""
    VERIFICATION_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ticket_verifications', null=True, blank=True)
    ticket_number = models.CharField(max_length=50, unique=True)
    passport_number = models.CharField(max_length=50)
    passenger_name = models.CharField(max_length=255)
    flight_number = models.CharField(max_length=20, blank=True, null=True)
    departure_date = models.DateField(blank=True, null=True)
    destination = models.CharField(max_length=100, blank=True, null=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='pending')
    verification_response = models.JSONField(blank=True, null=True)  # Store full API response
    verified_at = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.ticket_number} - {self.passenger_name}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Ticket Verification"
        verbose_name_plural = "Ticket Verifications"
