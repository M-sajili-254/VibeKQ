from rest_framework import serializers
from .models import Post, Comment, Like, Event, EventParticipant, Merchandise, VibeMemory
from accounts.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_profile_picture = serializers.ImageField(source='author.profile_picture', read_only=True)
    is_liked = serializers.SerializerMethodField()
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('author', 'likes_count', 'comments_count', 'views_count')
    
    def get_display_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            try:
                return obj.image.url
            except Exception:
                pass
        return obj.image_url or None

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_profile_picture = serializers.ImageField(source='author.profile_picture', read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('author',)
    
    def get_replies(self, obj):
        if obj.parent is None:
            replies = obj.replies.all()
            return CommentSerializer(replies, many=True, context=self.context).data
        return []
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for Like model"""
    
    class Meta:
        model = Like
        fields = '__all__'
        read_only_fields = ('user',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model"""
    organizer_name = serializers.CharField(source='organizer.get_full_name', read_only=True)
    is_registered = serializers.SerializerMethodField()
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('organizer', 'participants_count')
    
    def get_display_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            try:
                return obj.image.url
            except Exception:
                pass
        return obj.image_url or None

    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return EventParticipant.objects.filter(user=request.user, event=obj).exists()
        return False
    
    def create(self, validated_data):
        validated_data['organizer'] = self.context['request'].user
        return super().create(validated_data)


class EventParticipantSerializer(serializers.ModelSerializer):
    """Serializer for EventParticipant model"""
    user = UserSerializer(read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventParticipant
        fields = '__all__'
        read_only_fields = ('user',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class MerchandiseSerializer(serializers.ModelSerializer):
    """Serializer for Merchandise model"""
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = Merchandise
        fields = '__all__'

    def get_display_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            try:
                return obj.image.url
            except Exception:
                pass
        return obj.image_url or None


class VibeMemorySerializer(serializers.ModelSerializer):
    """Serializer for VibeMemory model"""
    uploader_name = serializers.CharField(source='uploader.get_full_name', read_only=True)
    uploader_profile_picture = serializers.ImageField(source='uploader.profile_picture', read_only=True)
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = VibeMemory
        fields = '__all__'
        read_only_fields = ('uploader', 'likes_count')
    
    def get_display_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            try:
                return obj.image.url
            except Exception:
                pass
        return obj.image_url or None

    def create(self, validated_data):
        validated_data['uploader'] = self.context['request'].user
        return super().create(validated_data)
