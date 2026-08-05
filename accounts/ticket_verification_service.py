"""
Service for verifying airline tickets with third-party APIs
This is a mock implementation - replace with actual airline/airport API integration
"""
import requests
from datetime import datetime, timedelta
from typing import Dict, Optional


class TicketVerificationService:
    """
    Service to verify airline tickets with third-party providers
    
    In production, this would integrate with:
    - Airline reservation systems (Amadeus, Sabre, etc.)
    - Airport authority APIs
    - IATA databases
    """
    
    def __init__(self):
        # These would be real API credentials in production
        self.api_url = "https://api.airline-verification.example.com/v1/verify"
        self.api_key = "YOUR_API_KEY_HERE"
        self.demo_destinations = [
            {
                'destination': 'New York',
                'destination_code': 'NYC',
                'country': 'United States',
                'arrival_airport': 'JFK',
                'airport_name': 'John F. Kennedy International Airport',
                'flight_number': 'KQ002',
            },
            {
                'destination': 'London',
                'destination_code': 'LON',
                'country': 'United Kingdom',
                'arrival_airport': 'LHR',
                'airport_name': 'Heathrow Airport',
                'flight_number': 'KQ100',
            },
            {
                'destination': 'Amsterdam',
                'destination_code': 'AMS',
                'country': 'Netherlands',
                'arrival_airport': 'AMS',
                'airport_name': 'Amsterdam Airport Schiphol',
                'flight_number': 'KQ116',
            },
            {
                'destination': 'Dubai',
                'destination_code': 'DXB',
                'country': 'United Arab Emirates',
                'arrival_airport': 'DXB',
                'airport_name': 'Dubai International Airport',
                'flight_number': 'KQ304',
            },
            {
                'destination': 'Nairobi',
                'destination_code': 'NBO',
                'country': 'Kenya',
                'arrival_airport': 'NBO',
                'airport_name': 'Jomo Kenyatta International Airport',
                'flight_number': 'KQ205',
            },
            {
                'destination': 'Cape Town',
                'destination_code': 'CPT',
                'country': 'South Africa',
                'arrival_airport': 'CPT',
                'airport_name': 'Cape Town International Airport',
                'flight_number': 'KQ782',
            },
            {
                'destination': 'Bangkok',
                'destination_code': 'BKK',
                'country': 'Thailand',
                'arrival_airport': 'BKK',
                'airport_name': 'Suvarnabhumi Airport',
                'flight_number': 'KQ886',
            },
        ]

    def _select_demo_destination(self, ticket_number: str) -> Dict:
        index = sum(ord(char) for char in ticket_number) % len(self.demo_destinations)
        return self.demo_destinations[index]
    
    def verify_ticket(self, ticket_number: str) -> Dict:
        """
        Verify a ticket number with the airline/airport API
        
        Args:
            ticket_number: The airline ticket number to verify
            
        Returns:
            Dictionary containing verification result and passenger data
        """
        
        # MOCK IMPLEMENTATION - Replace with actual API call
        # In production, this would make a real API request:
        # response = requests.post(
        #     self.api_url,
        #     headers={'Authorization': f'Bearer {self.api_key}'},
        #     json={'ticket_number': ticket_number}
        # )
        
        # Mock response for demonstration
        # This simulates what a real airline API would return
        if len(ticket_number) >= 10:
            destination = self._select_demo_destination(ticket_number)
            passport_number = f"P{ticket_number[-7:].upper()}"
            return {
                'success': True,
                'verified': True,
                'data': {
                    'ticket_number': ticket_number,
                    'passenger_name': f'Vibe Passenger {ticket_number[-3:]}',
                    'passport_number': passport_number,
                    'flight_number': destination['flight_number'],
                    'departure_date': (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d'),
                    'departure_airport': 'NBO',
                    'arrival_airport': destination['arrival_airport'],
                    'destination': destination['destination'],
                    'destination_code': destination['destination_code'],
                    'airport_name': destination['airport_name'],
                    'country': destination['country'],
                    'booking_reference': 'ABC123',
                    'seat_number': '12A',
                    'class': 'Economy',
                    'email': None,  # May or may not be available
                    'phone': None,  # May or may not be available
                },
                'message': 'Ticket verified successfully'
            }
        else:
            return {
                'success': False,
                'verified': False,
                'data': None,
                'message': 'Invalid ticket number or ticket not found'
            }
    
    def verify_ticket_with_passport(self, ticket_number: str, passport_number: str) -> Dict:
        """
        Verify ticket with additional passport validation
        
        Args:
            ticket_number: The airline ticket number
            passport_number: Passenger's passport number for additional verification
            
        Returns:
            Dictionary containing verification result
        """
        result = self.verify_ticket(ticket_number)
        
        if result['success'] and result['data']:
            normalized_passport = passport_number.strip().upper()
            if len(normalized_passport) < 6:
                return {
                    'success': False,
                    'verified': False,
                    'data': None,
                    'message': 'Passport number must be at least 6 characters long'
                }
            result['data']['passport_number'] = normalized_passport
            return result
        
        return result


# Singleton instance
ticket_verification_service = TicketVerificationService()
