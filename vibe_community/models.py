from django.db import models
from django.conf import settings
from abstract.abstract import TimeStampedModel, IDModel


class Post(TimeStampedModel, IDModel):
    """Community posts from staff and fans"""
    POST_TYPE_CHOICES = (
        ('story', 'Story'),
        ('passion', 'Passion Project'),
        ('csr', 'CSR Initiative'),
        ('culture', 'Culture'),
        ('announcement', 'Announcement'),
    )
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, default='story')
    image = models.ImageField(upload_to='community_posts/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    views_count = models.IntegerField(default=0)
    published = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.title} by {self.author.username}"
    
    class Meta:
        ordering = ['-created_at']


class Comment(TimeStampedModel, IDModel):
    """Comments on community posts"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', blank=True, null=True)

    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"
    
    class Meta:
        ordering = ['created_at']


class Like(TimeStampedModel, IDModel):
    """Likes on posts"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    
    def __str__(self):
        return f"{self.user.username} likes {self.post.title}"
    
    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-created_at']


class Event(TimeStampedModel, IDModel):
    """Community events and CSR initiatives"""
    EVENT_TYPE_CHOICES = (
        ('csr', 'CSR Initiative'),
        ('meetup', 'Community Meetup'),
        ('webinar', 'Webinar'),
        ('workshop', 'Workshop'),
    )
    
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events')
    title = models.CharField(max_length=255)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default='meetup')
    location = models.CharField(max_length=255, blank=True, null=True)
    virtual_link = models.URLField(blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    image = models.ImageField(upload_to='events/')
    max_participants = models.IntegerField(blank=True, null=True)
    participants_count = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['start_date']


class EventParticipant(TimeStampedModel, IDModel):
    """Event participants"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_participations')
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.event.title}"
    
    class Meta:
        unique_together = ('event', 'user')
        ordering = ['-registered_at']


class Merchandise(TimeStampedModel, IDModel):
    """KQ branded merchandise"""
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    image = models.ImageField(upload_to='merchandise/')
    stock_quantity = models.IntegerField(default=0)
    available = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-featured', 'name']
        verbose_name_plural = "Merchandise"


class VibeMemory(TimeStampedModel, IDModel):
    """Photo memories shared by KQ staff and community"""
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vibe_memories')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='vibe_memories/')
    location = models.CharField(max_length=255, blank=True, null=True)
    featured = models.BooleanField(default=False)
    likes_count = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.title} by {self.uploader.username}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Vibe Memories"
