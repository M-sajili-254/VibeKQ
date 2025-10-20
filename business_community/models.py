from django.db import models
from django.conf import settings
from abstract.abstract import TimeStampedModel, IDModel


class PartnerApplication(TimeStampedModel, IDModel):
    """Applications from businesses to become verified partners"""
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='partner_applications')
    business_name = models.CharField(max_length=255)
    business_category = models.CharField(max_length=100)
    business_registration_number = models.CharField(max_length=100)
    business_address = models.TextField()
    business_phone = models.CharField(max_length=20)
    business_email = models.EmailField()
    business_website = models.URLField(blank=True, null=True)
    business_description = models.TextField()
    business_logo = models.ImageField(upload_to='business_logos/')
    business_documents = models.FileField(upload_to='business_documents/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.business_name} - {self.get_status_display()}"
    
    class Meta:
        ordering = ['-created_at']


class Partnership(TimeStampedModel, IDModel):
    """Active partnerships with verified businesses"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='partnership')
    business_name = models.CharField(max_length=255)
    business_category = models.CharField(max_length=100)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.0)  # Percentage
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    total_bookings = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.business_name} Partnership"
    
    class Meta:
        ordering = ['-created_at']


class SponsoredContent(TimeStampedModel, IDModel):
    """Sponsored content from business partners"""
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending Approval'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('rejected', 'Rejected'),
    )
    
    partner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sponsored_content')
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='sponsored/')
    link_url = models.URLField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.title} - {self.partner.business_name}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Sponsored Content"
