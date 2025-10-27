"""
Payment services for M-Pesa and Card payments
"""
import requests
import uuid
from datetime import datetime
from typing import Dict
from django.conf import settings


class MPesaService:
    """
    M-Pesa STK Push payment service
    Integrates with Safaricom Daraja API
    """
    
    def __init__(self):
        # These should be in settings/environment variables
        self.consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', '')
        self.business_shortcode = getattr(settings, 'MPESA_SHORTCODE', '')
        self.passkey = getattr(settings, 'MPESA_PASSKEY', '')
        self.callback_url = getattr(settings, 'MPESA_CALLBACK_URL', '')
        self.api_url = 'https://sandbox.safaricom.co.ke'  # Use production URL in production
    
    def get_access_token(self) -> str:
        """Get OAuth access token from M-Pesa API"""
        url = f"{self.api_url}/oauth/v1/generate?grant_type=client_credentials"
        
        try:
            response = requests.get(url, auth=(self.consumer_key, self.consumer_secret))
            response.raise_for_status()
            return response.json()['access_token']
        except Exception as e:
            raise Exception(f"Failed to get M-Pesa access token: {str(e)}")
    
    def initiate_stk_push(self, phone_number: str, amount: float, account_reference: str, transaction_desc: str) -> Dict:
        """
        Initiate STK Push to customer's phone
        
        Args:
            phone_number: Customer phone number (format: 254XXXXXXXXX)
            amount: Amount to charge
            account_reference: Reference for the transaction
            transaction_desc: Description of the transaction
        """
        # Mock implementation for development
        # In production, this would make actual API calls
        
        if not phone_number.startswith('254'):
            phone_number = '254' + phone_number.lstrip('0')
        
        # MOCK RESPONSE - Replace with actual API call in production
        if len(phone_number) == 12:  # Valid Kenyan number
            return {
                'success': True,
                'checkout_request_id': f'ws_CO_{uuid.uuid4().hex[:20]}',
                'merchant_request_id': f'mr_{uuid.uuid4().hex[:15]}',
                'response_code': '0',
                'response_description': 'Success. Request accepted for processing',
                'customer_message': 'Success. Request accepted for processing'
            }
        else:
            return {
                'success': False,
                'error_message': 'Invalid phone number format'
            }
    
    def query_transaction_status(self, checkout_request_id: str) -> Dict:
        """Query the status of an STK Push transaction"""
        # Mock implementation
        return {
            'success': True,
            'result_code': '0',
            'result_desc': 'The service request is processed successfully.',
            'transaction_id': f'MPE{uuid.uuid4().hex[:10].upper()}'
        }


class StripeService:
    """
    Stripe payment service for card payments
    """
    
    def __init__(self):
        self.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '')
        self.publishable_key = getattr(settings, 'STRIPE_PUBLISHABLE_KEY', '')
    
    def create_payment_intent(self, amount: float, currency: str, metadata: Dict) -> Dict:
        """
        Create a Stripe Payment Intent
        
        Args:
            amount: Amount in smallest currency unit (e.g., cents for USD)
            currency: Currency code (e.g., 'usd', 'kes')
            metadata: Additional data to attach to the payment
        """
        # Mock implementation for development
        # In production, use actual Stripe SDK
        
        return {
            'success': True,
            'payment_intent_id': f'pi_{uuid.uuid4().hex}',
            'client_secret': f'pi_{uuid.uuid4().hex}_secret_{uuid.uuid4().hex[:10]}',
            'amount': amount,
            'currency': currency,
            'status': 'requires_payment_method'
        }
    
    def confirm_payment(self, payment_intent_id: str) -> Dict:
        """Confirm a payment intent"""
        return {
            'success': True,
            'payment_intent_id': payment_intent_id,
            'status': 'succeeded',
            'transaction_id': f'ch_{uuid.uuid4().hex}'
        }


# Singleton instances
mpesa_service = MPesaService()
stripe_service = StripeService()
