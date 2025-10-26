from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from .serializers import UserSerializer, UserRegistrationSerializer, UserProfileSerializer
from .models import TicketVerification
from .ticket_verification_service import ticket_verification_service

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return UserProfileSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Get current user profile"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Register a new user"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketVerificationView(APIView):
    """
    API endpoint for ticket-based authentication
    Verifies airline ticket and creates/authenticates passenger account
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """
        Verify ticket and authenticate/create passenger account
        
        Expected payload:
        {
            "ticket_number": "1234567890",
            "passport_number": "AB1234567" (optional for additional verification)
        }
        """
        ticket_number = request.data.get('ticket_number')
        passport_number = request.data.get('passport_number')
        
        if not ticket_number:
            return Response({
                'error': 'Ticket number is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if ticket was already verified
        existing_verification = TicketVerification.objects.filter(
            ticket_number=ticket_number
        ).first()
        
        if existing_verification and existing_verification.verification_status == 'verified':
            # Ticket already used, authenticate existing user
            if existing_verification.user:
                refresh = RefreshToken.for_user(existing_verification.user)
                return Response({
                    'message': 'Welcome back! Authenticated with existing account',
                    'user': UserSerializer(existing_verification.user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'is_new_user': False
                })
        
        # Verify ticket with third-party API
        if passport_number:
            verification_result = ticket_verification_service.verify_ticket_with_passport(
                ticket_number, passport_number
            )
        else:
            verification_result = ticket_verification_service.verify_ticket(ticket_number)
        
        if not verification_result['success']:
            return Response({
                'error': verification_result['message']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        passenger_data = verification_result['data']
        passport_num = passenger_data['passport_number']
        
        # Check if user exists with this passport number
        user = User.objects.filter(passport_number=passport_num).first()
        
        if user:
            # Existing user - update their ticket info
            user.last_ticket_number = ticket_number
            user.ticket_verified = True
            user.save()
            is_new_user = False
        else:
            # Create new passenger account
            username = f"passenger_{passport_num.lower()}"
            # Generate email - use provided email or create a temporary one
            email = passenger_data.get('email') or f"{username}@vibewithkq.temp"
            
            user = User.objects.create(
                username=username,
                first_name=passenger_data['passenger_name'].split()[0] if passenger_data['passenger_name'] else '',
                last_name=' '.join(passenger_data['passenger_name'].split()[1:]) if len(passenger_data['passenger_name'].split()) > 1 else '',
                user_type='passenger',
                passport_number=passport_num,
                ticket_verified=True,
                last_ticket_number=ticket_number,
                email=email,
                phone_number=passenger_data.get('phone') or ''
            )
            user.set_unusable_password()  # No password for ticket-based auth
            user.save()
            is_new_user = True
        
        # Create verification record
        ticket_verification = TicketVerification.objects.create(
            user=user,
            ticket_number=ticket_number,
            passport_number=passport_num,
            passenger_name=passenger_data['passenger_name'],
            flight_number=passenger_data.get('flight_number'),
            departure_date=passenger_data.get('departure_date'),
            destination=passenger_data.get('destination'),
            verification_status='verified',
            verification_response=passenger_data,
            verified_at=timezone.now()
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Ticket verified successfully' if is_new_user else 'Welcome back!',
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_new_user': is_new_user,
            'flight_info': {
                'flight_number': passenger_data.get('flight_number'),
                'destination': passenger_data.get('destination'),
                'departure_date': passenger_data.get('departure_date'),
            }
        }, status=status.HTTP_200_OK)
