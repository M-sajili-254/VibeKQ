from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, TicketVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'user_type', 'business_verified', 'ticket_verified', 'created_at')
    list_filter = ('user_type', 'business_verified', 'ticket_verified', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'business_name', 'employee_id', 'passport_number')
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'phone_number', 'profile_picture', 'bio', 
                      'date_of_birth', 'nationality')
        }),
        ('Business Partner Info', {
            'fields': ('business_name', 'business_verified', 'business_category')
        }),
        ('Staff Info', {
            'fields': ('employee_id', 'department')
        }),
        ('Passenger Info', {
            'fields': ('passport_number', 'ticket_verified', 'last_ticket_number')
        }),
    )


@admin.register(TicketVerification)
class TicketVerificationAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'passenger_name', 'passport_number', 'verification_status', 'verified_at', 'created_at')
    list_filter = ('verification_status', 'verified_at', 'created_at')
    search_fields = ('ticket_number', 'passenger_name', 'passport_number', 'flight_number')
    readonly_fields = ('created_at', 'updated_at', 'verified_at', 'verification_response')
    
    fieldsets = (
        ('Ticket Information', {
            'fields': ('ticket_number', 'flight_number', 'departure_date', 'destination')
        }),
        ('Passenger Information', {
            'fields': ('passenger_name', 'passport_number', 'user')
        }),
        ('Verification Status', {
            'fields': ('verification_status', 'verified_at', 'verification_response')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
