from django.db import models
from django.conf import settings
from abstract.abstract import TimeStampedModel, IDModel


class Destination(TimeStampedModel, IDModel):
    """Destinations available for booking"""
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='destinations/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL fallback")
    featured = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.city}, {self.country}"
    
    class Meta:
        ordering = ['-featured', 'name']


class ServiceCategory(TimeStampedModel, IDModel):
    """Categories for local services (Hotels, Taxis, Tours, etc.)"""
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)  # Icon name for frontend
    description = models.TextField()
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Service Categories"
        ordering = ['name']


class Service(TimeStampedModel, IDModel):
    """Local services available at destinations"""
    name = models.CharField(max_length=255)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='services')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='services')
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='provided_services')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL fallback")
    verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_bookings = models.IntegerField(default=0)
    available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} - {self.destination.city}"
    
    class Meta:
        ordering = ['-verified', '-rating', 'name']


class Booking(TimeStampedModel, IDModel):
    """Bookings made by passengers"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateField()
    booking_time = models.TimeField(blank=True, null=True)
    number_of_people = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    special_requests = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Booking #{self.id} - {self.user.username} - {self.service.name}"
    
    class Meta:
        ordering = ['-created_at']


class Review(TimeStampedModel, IDModel):
    """Reviews for services"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='reviews')
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='review', blank=True, null=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    
    def __str__(self):
        return f"Review by {self.user.username} - {self.rating} stars"
    
    class Meta:
        ordering = ['-created_at']


class Payment(TimeStampedModel, IDModel):
    """Payment records for bookings"""
    PAYMENT_METHOD_CHOICES = (
        ('mpesa', 'M-Pesa'),
        ('card', 'Debit/Credit Card'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='KES')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # M-Pesa specific fields
    mpesa_phone_number = models.CharField(max_length=15, blank=True, null=True)
    mpesa_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    mpesa_checkout_request_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Card specific fields
    card_last_four = models.CharField(max_length=4, blank=True, null=True)
    card_brand = models.CharField(max_length=20, blank=True, null=True)
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Additional info
    transaction_reference = models.CharField(max_length=100, unique=True)
    payment_response = models.JSONField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"Payment #{self.id} - {self.booking.id} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']
