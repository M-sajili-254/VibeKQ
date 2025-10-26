from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Comment, Like, Event, EventParticipant, Merchandise, VibeMemory
from .serializers import (
    PostSerializer, CommentSerializer, LikeSerializer,
    EventSerializer, EventParticipantSerializer, MerchandiseSerializer,
    VibeMemorySerializer
)


class PostViewSet(viewsets.ModelViewSet):
    """ViewSet for Post model"""
    queryset = Post.objects.filter(published=True)
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """Like or unlike a post"""
        post = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        
        if not created:
            like.delete()
            post.likes_count -= 1
            post.save()
            return Response({'status': 'unliked'})
        
        post.likes_count += 1
        post.save()
        return Response({'status': 'liked'})


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for Comment model"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        post = self.request.query_params.get('post', None)
        
        if post:
            queryset = queryset.filter(post_id=post, parent=None)
        
        return queryset


class EventViewSet(viewsets.ModelViewSet):
    """ViewSet for Event model"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def register(self, request, pk=None):
        """Register for an event"""
        event = self.get_object()
        
        if event.max_participants and event.participants_count >= event.max_participants:
            return Response({'error': 'Event is full'}, status=status.HTTP_400_BAD_REQUEST)
        
        participant, created = EventParticipant.objects.get_or_create(
            user=request.user,
            event=event
        )
        
        if created:
            event.participants_count += 1
            event.save()
            return Response({'status': 'registered'})
        
        return Response({'error': 'Already registered'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unregister(self, request, pk=None):
        """Unregister from an event"""
        event = self.get_object()
        
        try:
            participant = EventParticipant.objects.get(user=request.user, event=event)
            participant.delete()
            event.participants_count -= 1
            event.save()
            return Response({'status': 'unregistered'})
        except EventParticipant.DoesNotExist:
            return Response({'error': 'Not registered'}, status=status.HTTP_400_BAD_REQUEST)


class MerchandiseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Merchandise model"""
    queryset = Merchandise.objects.filter(available=True)
    serializer_class = MerchandiseSerializer
    permission_classes = [permissions.AllowAny]


class VibeMemoryViewSet(viewsets.ModelViewSet):
    """ViewSet for VibeMemory model"""
    queryset = VibeMemory.objects.all()
    serializer_class = VibeMemorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
