from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'user_type', 'business_verified', 'created_at')
    list_filter = ('user_type', 'business_verified', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'business_name', 'employee_id')
    
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
    )
