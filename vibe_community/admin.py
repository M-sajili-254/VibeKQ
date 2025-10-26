from django.contrib import admin
from .models import Post, Comment, Like, Event, EventParticipant, Merchandise, VibeMemory


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'post_type', 'featured', 'published', 
                   'likes_count', 'comments_count', 'views_count', 'created_at')
    list_filter = ('post_type', 'featured', 'published', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    list_editable = ('featured', 'published')
    readonly_fields = ('likes_count', 'comments_count', 'views_count', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Post Information', {
            'fields': ('author', 'title', 'content', 'post_type')
        }),
        ('Media', {
            'fields': ('image', 'video_url')
        }),
        ('Status & Visibility', {
            'fields': ('featured', 'published')
        }),
        ('Engagement Metrics', {
            'fields': ('likes_count', 'comments_count', 'views_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['feature_posts', 'unfeature_posts', 'publish_posts', 'unpublish_posts']
    
    def feature_posts(self, request, queryset):
        queryset.update(featured=True)
    feature_posts.short_description = "Feature selected posts"
    
    def unfeature_posts(self, request, queryset):
        queryset.update(featured=False)
    unfeature_posts.short_description = "Unfeature selected posts"
    
    def publish_posts(self, request, queryset):
        queryset.update(published=True)
    publish_posts.short_description = "Publish selected posts"
    
    def unpublish_posts(self, request, queryset):
        queryset.update(published=False)
    unpublish_posts.short_description = "Unpublish selected posts"


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'parent', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('author__username', 'post__title', 'content')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Comment Details', {
            'fields': ('post', 'author', 'content', 'parent')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__title')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'event_type', 'start_date', 'end_date', 
                   'participants_count', 'max_participants', 'featured', 'created_at')
    list_filter = ('event_type', 'featured', 'start_date', 'created_at')
    search_fields = ('title', 'description', 'organizer__username', 'location')
    list_editable = ('featured',)
    readonly_fields = ('participants_count', 'created_at', 'updated_at')
    ordering = ('start_date',)
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Event Information', {
            'fields': ('organizer', 'title', 'description', 'event_type')
        }),
        ('Schedule', {
            'fields': ('start_date', 'end_date')
        }),
        ('Location', {
            'fields': ('location', 'virtual_link')
        }),
        ('Capacity', {
            'fields': ('max_participants', 'participants_count')
        }),
        ('Media & Visibility', {
            'fields': ('image', 'featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['feature_events', 'unfeature_events']
    
    def feature_events(self, request, queryset):
        queryset.update(featured=True)
    feature_events.short_description = "Feature selected events"
    
    def unfeature_events(self, request, queryset):
        queryset.update(featured=False)
    unfeature_events.short_description = "Unfeature selected events"


@admin.register(EventParticipant)
class EventParticipantAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'registered_at', 'attended')
    list_filter = ('attended', 'registered_at')
    search_fields = ('user__username', 'event__title')
    list_editable = ('attended',)
    readonly_fields = ('registered_at',)
    ordering = ('-registered_at',)
    date_hierarchy = 'registered_at'
    
    actions = ['mark_as_attended', 'mark_as_not_attended']
    
    def mark_as_attended(self, request, queryset):
        queryset.update(attended=True)
    mark_as_attended.short_description = "Mark selected participants as attended"
    
    def mark_as_not_attended(self, request, queryset):
        queryset.update(attended=False)
    mark_as_not_attended.short_description = "Mark selected participants as not attended"


@admin.register(Merchandise)
class MerchandiseAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'currency', 'stock_quantity', 'available', 'featured', 'created_at')
    list_filter = ('available', 'featured', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('available', 'featured', 'stock_quantity')
    ordering = ('-featured', 'name')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'description', 'image')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'currency', 'stock_quantity')
        }),
        ('Status', {
            'fields': ('available', 'featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_available', 'mark_as_unavailable', 'feature_items', 'unfeature_items']
    
    def mark_as_available(self, request, queryset):
        queryset.update(available=True)
    mark_as_available.short_description = "Mark selected items as available"
    
    def mark_as_unavailable(self, request, queryset):
        queryset.update(available=False)
    mark_as_unavailable.short_description = "Mark selected items as unavailable"
    
    def feature_items(self, request, queryset):
        queryset.update(featured=True)
    feature_items.short_description = "Feature selected items"
    
    def unfeature_items(self, request, queryset):
        queryset.update(featured=False)
    unfeature_items.short_description = "Unfeature selected items"


@admin.register(VibeMemory)
class VibeMemoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploader', 'location', 'featured', 'likes_count', 'created_at')
    list_filter = ('featured', 'created_at')
    search_fields = ('title', 'description', 'uploader__username', 'location')
    list_editable = ('featured',)
    readonly_fields = ('likes_count', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Memory Information', {
            'fields': ('uploader', 'title', 'description', 'location')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Status & Engagement', {
            'fields': ('featured', 'likes_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['feature_memories', 'unfeature_memories']
    
    def feature_memories(self, request, queryset):
        queryset.update(featured=True)
    feature_memories.short_description = "Feature selected memories"
    
    def unfeature_memories(self, request, queryset):
        queryset.update(featured=False)
    unfeature_memories.short_description = "Unfeature selected memories"
