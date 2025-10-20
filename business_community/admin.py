from django.contrib import admin
from django.utils import timezone
from .models import PartnerApplication, Partnership, SponsoredContent


@admin.register(PartnerApplication)
class PartnerApplicationAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'user', 'business_category', 'status', 'created_at', 'reviewed_at')
    list_filter = ('status', 'business_category', 'created_at')
    search_fields = ('business_name', 'user__username', 'user__email', 'business_email')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Applicant Information', {
            'fields': ('user',)
        }),
        ('Business Details', {
            'fields': ('business_name', 'business_category', 'business_registration_number', 
                      'business_address', 'business_phone', 'business_email', 'business_website')
        }),
        ('Description & Documents', {
            'fields': ('business_description', 'business_logo', 'business_documents')
        }),
        ('Review Status', {
            'fields': ('status', 'admin_notes', 'reviewed_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_applications', 'reject_applications']
    
    def approve_applications(self, request, queryset):
        updated = queryset.filter(status='pending').update(
            status='approved',
            reviewed_at=timezone.now()
        )
        
        # Create partnerships for approved applications
        for application in queryset.filter(status='approved'):
            Partnership.objects.get_or_create(
                user=application.user,
                defaults={
                    'business_name': application.business_name,
                    'business_category': application.business_category,
                    'active': True
                }
            )
            # Update user type
            application.user.user_type = 'business_partner'
            application.user.business_name = application.business_name
            application.user.business_verified = True
            application.user.business_category = application.business_category
            application.user.save()
        
        self.message_user(request, f'{updated} application(s) approved successfully.')
    approve_applications.short_description = "Approve selected applications"
    
    def reject_applications(self, request, queryset):
        updated = queryset.filter(status='pending').update(
            status='rejected',
            reviewed_at=timezone.now()
        )
        self.message_user(request, f'{updated} application(s) rejected.')
    reject_applications.short_description = "Reject selected applications"


@admin.register(Partnership)
class PartnershipAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'user', 'business_category', 'commission_rate', 
                   'total_revenue', 'total_bookings', 'rating', 'active', 'created_at')
    list_filter = ('active', 'business_category', 'created_at')
    search_fields = ('business_name', 'user__username', 'user__email')
    list_editable = ('active', 'commission_rate')
    readonly_fields = ('total_revenue', 'total_bookings', 'rating', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Partner Information', {
            'fields': ('user', 'business_name', 'business_category')
        }),
        ('Financial Details', {
            'fields': ('commission_rate', 'total_revenue', 'total_bookings')
        }),
        ('Performance', {
            'fields': ('rating', 'active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_partnerships', 'deactivate_partnerships']
    
    def activate_partnerships(self, request, queryset):
        queryset.update(active=True)
    activate_partnerships.short_description = "Activate selected partnerships"
    
    def deactivate_partnerships(self, request, queryset):
        queryset.update(active=False)
    deactivate_partnerships.short_description = "Deactivate selected partnerships"


@admin.register(SponsoredContent)
class SponsoredContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'partner', 'status', 'start_date', 'end_date', 
                   'impressions', 'clicks', 'budget', 'created_at')
    list_filter = ('status', 'start_date', 'end_date', 'created_at')
    search_fields = ('title', 'description', 'partner__username', 'partner__business_name')
    readonly_fields = ('impressions', 'clicks', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Content Details', {
            'fields': ('partner', 'title', 'description', 'image', 'link_url')
        }),
        ('Campaign Period', {
            'fields': ('start_date', 'end_date', 'budget')
        }),
        ('Status & Performance', {
            'fields': ('status', 'impressions', 'clicks')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_content', 'reject_content', 'mark_as_expired']
    
    def approve_content(self, request, queryset):
        queryset.filter(status='pending').update(status='active')
    approve_content.short_description = "Approve selected content"
    
    def reject_content(self, request, queryset):
        queryset.update(status='rejected')
    reject_content.short_description = "Reject selected content"
    
    def mark_as_expired(self, request, queryset):
        queryset.update(status='expired')
    mark_as_expired.short_description = "Mark selected content as expired"
