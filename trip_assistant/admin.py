from django.contrib import admin
from .models import Destination, ServiceCategory, Service, Booking, Review


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('city', 'country', 'name', 'featured', 'created_at')
    list_filter = ('featured', 'country', 'created_at')
    search_fields = ('name', 'city', 'country', 'description')
    list_editable = ('featured',)
    ordering = ('-featured', 'name')
    date_hierarchy = 'created_at'


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'destination', 'provider', 'price', 'currency', 'verified', 'rating', 'available')
    list_filter = ('verified', 'available', 'category', 'destination', 'created_at')
    search_fields = ('name', 'description', 'provider__username', 'provider__business_name')
    list_editable = ('verified', 'available')
    readonly_fields = ('rating', 'total_bookings', 'created_at', 'updated_at')
    ordering = ('-verified', '-rating', 'name')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'destination', 'provider', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'currency')
        }),
        ('Status & Verification', {
            'fields': ('verified', 'available', 'rating', 'total_bookings')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'service', 'booking_date', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'booking_date', 'created_at')
    search_fields = ('user__username', 'user__email', 'service__name')
    readonly_fields = ('total_price', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'booking_date'
    
    fieldsets = (
        ('Booking Details', {
            'fields': ('user', 'service', 'booking_date', 'booking_time', 'number_of_people')
        }),
        ('Status & Payment', {
            'fields': ('status', 'total_price')
        }),
        ('Additional Information', {
            'fields': ('special_requests',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_confirmed', 'mark_as_completed', 'mark_as_cancelled']
    
    def mark_as_confirmed(self, request, queryset):
        queryset.update(status='confirmed')
    mark_as_confirmed.short_description = "Mark selected bookings as confirmed"
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
    mark_as_completed.short_description = "Mark selected bookings as completed"
    
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
    mark_as_cancelled.short_description = "Mark selected bookings as cancelled"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'service', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'service__name', 'comment')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Review Details', {
            'fields': ('user', 'service', 'booking', 'rating', 'comment')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
