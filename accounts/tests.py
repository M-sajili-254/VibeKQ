from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User


class TicketDestinationPassportTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_ticket_verification_links_user_to_single_destination(self):
        response = self.client.post(
            '/api/accounts/verify-ticket/',
            {
                'ticket_number': '1234567890',
                'passport_number': 'PA998877',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        user = User.objects.get(username='passenger_pa998877')
        verification = user.ticket_verifications.get(ticket_number='1234567890')

        self.assertIsNotNone(verification.linked_destination)
        self.assertEqual(user.passenger_profile.current_destination_id, verification.linked_destination_id)
        self.assertEqual(response.data['flight_info']['destination_id'], verification.linked_destination_id)

    def test_passport_endpoint_returns_segmented_destination_marketplace(self):
        login = self.client.post(
            '/api/accounts/verify-ticket/',
            {
                'ticket_number': '5555512345',
                'passport_number': 'PAX554433',
            },
            format='json',
        )
        self.assertEqual(login.status_code, 200)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        passport = self.client.get('/api/trip-assistant/passport/')

        self.assertEqual(passport.status_code, 200)
        self.assertIn('airport', passport.data['communities'])
        self.assertIn('destination', passport.data['communities'])
        self.assertGreater(len(passport.data['communities']['airport']['services']), 0)
        self.assertGreater(len(passport.data['communities']['destination']['services']), 0)
        self.assertEqual(
            passport.data['destination']['id'],
            login.data['user']['active_destination']['id'],
        )

    def test_demo_destinations_include_requested_cities(self):
        response = self.client.get('/api/trip-assistant/destinations/')
        self.assertEqual(response.status_code, 200)
        cities = {destination['city'] for destination in response.data['results']}
        self.assertTrue({'Nairobi', 'London', 'Amsterdam', 'Dubai', 'Cape Town', 'Bangkok', 'New York'}.issubset(cities))


class TicketVerificationMessagingTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch('accounts.views.ticket_verification_service.verify_ticket_with_passport')
    def test_passport_mismatch_error_is_softened(self, mock_verify):
        mock_verify.return_value = {
            'success': False,
            'verified': False,
            'data': None,
            'message': 'Passport number does not match ticket record',
        }

        response = self.client.post(
            '/api/accounts/verify-ticket/',
            {
                'ticket_number': '1234567890',
                'passport_number': 'WRONG9988',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['error'],
            'We could not verify your ticket with the provided details. Please re-check your ticket number and try again.',
        )


class BusinessSigninTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.partner = User.objects.create_user(
            username='partner-login-user',
            email='partner-login@example.com',
            password='SecurePass123',
            user_type='business_partner',
            business_name='Airport Lounge Group',
            business_category='Lounge',
        )
        self.passenger = User.objects.create_user(
            username='passenger-login-user',
            email='passenger-login@example.com',
            password='SecurePass123',
            user_type='passenger',
        )

    def test_partner_signin_returns_tokens_for_partner_portal(self):
        response = self.client.post(
            '/api/accounts/signin/',
            {
                'username': self.partner.username,
                'password': 'SecurePass123',
                'portal': 'partner',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['user_type'], 'business_partner')

    def test_partner_signin_rejects_invalid_credentials(self):
        response = self.client.post(
            '/api/accounts/signin/',
            {
                'username': self.partner.username,
                'password': 'wrong-password',
                'portal': 'partner',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['error'], 'Invalid credentials')

    def test_partner_signin_rejects_passenger_accounts(self):
        response = self.client.post(
            '/api/accounts/signin/',
            {
                'username': self.passenger.username,
                'password': 'SecurePass123',
                'portal': 'partner',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], 'This sign-in is for business partners and staff only.')
