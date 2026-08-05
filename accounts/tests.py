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
        self.assertTrue({'Nairobi', 'London', 'Dubai', 'Bangkok', 'New York'}.issubset(cities))
