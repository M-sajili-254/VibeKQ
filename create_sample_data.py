#!/usr/bin/env python
"""Script to create sample data for testing"""
import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VibeKQ.settings')
django.setup()

from accounts.models import User
from trip_assistant.models import Destination, ServiceCategory, Service
from vibe_community.models import Post, Event

print("Creating sample data...")

# Get or create a business partner user
partner, created = User.objects.get_or_create(
    username='partner1',
    defaults={
        'email': 'partner@example.com',
        'user_type': 'business_partner',
        'first_name': 'John',
        'last_name': 'Partner',
        'business_name': 'Safari Adventures Ltd',
        'business_verified': True,
        'business_category': 'Tours'
    }
)
if created:
    partner.set_password('partner123')
    partner.save()
    print(f"✓ Created business partner: {partner.username}")

# Get or create a staff user
staff, created = User.objects.get_or_create(
    username='staff1',
    defaults={
        'email': 'staff@kq.com',
        'user_type': 'staff',
        'first_name': 'Jane',
        'last_name': 'Staff',
        'employee_id': 'KQ001',
        'department': 'Customer Experience'
    }
)
if created:
    staff.set_password('staff123')
    staff.save()
    print(f"✓ Created staff user: {staff.username}")

# Create destinations
destinations_data = [
    {
        'name': 'Nairobi',
        'country': 'Kenya',
        'city': 'Nairobi',
        'description': 'The vibrant capital city of Kenya, known for its national park, museums, and bustling markets.',
        'featured': True
    },
    {
        'name': 'Mombasa',
        'country': 'Kenya',
        'city': 'Mombasa',
        'description': 'Kenya\'s coastal paradise with beautiful beaches, historic sites, and rich Swahili culture.',
        'featured': True
    },
    {
        'name': 'Zanzibar',
        'country': 'Tanzania',
        'city': 'Zanzibar',
        'description': 'Exotic island destination with pristine beaches, spice tours, and Stone Town heritage.',
        'featured': True
    },
    {
        'name': 'Cape Town',
        'country': 'South Africa',
        'city': 'Cape Town',
        'description': 'Stunning coastal city with Table Mountain, wine estates, and diverse culture.',
        'featured': False
    }
]

for dest_data in destinations_data:
    dest, created = Destination.objects.get_or_create(
        city=dest_data['city'],
        country=dest_data['country'],
        defaults=dest_data
    )
    if created:
        print(f"✓ Created destination: {dest.city}, {dest.country}")

# Create service categories
categories_data = [
    {'name': 'Activities', 'icon': '🎯', 'description': 'Entertainment and activities'},
    {'name': 'Adventure', 'icon': '🗺️', 'description': 'Guided tours and excursions'},
    {'name': 'Hotel, Motel and Lodging', 'icon': '🏨', 'description': 'Accommodation and lodging services'},
    {'name': 'Transport', 'icon': '🚕', 'description': 'Transportation services'},
    {'name': 'Merchandise and Shopping', 'icon': '🛍️', 'description': 'Shopping and merchandise services'},
    {'name': 'Restaurant', 'icon': '🍽️', 'description': 'Dining and culinary experiences'},
]

for cat_data in categories_data:
    cat, created = ServiceCategory.objects.get_or_create(
        name=cat_data['name'],
        defaults=cat_data
    )
    if created:
        print(f"✓ Created category: {cat.name}")

# Create services
nairobi = Destination.objects.get(city='Nairobi')
mombasa = Destination.objects.get(city='Mombasa')
hotel_cat = ServiceCategory.objects.get(name='Hotel, Motel and Lodging')
tour_cat = ServiceCategory.objects.get(name='Adventure')
taxi_cat = ServiceCategory.objects.get(name='Transport')

services_data = [
    {
        'name': 'Safari Park Hotel',
        'category': hotel_cat,
        'destination': nairobi,
        'provider': partner,
        'description': 'Luxury hotel in the heart of Nairobi with modern amenities and excellent service.',
        'price': 150.00,
        'currency': 'USD',
        'verified': True,
        'rating': 4.5,
        'available': True
    },
    {
        'name': 'Nairobi National Park Tour',
        'category': tour_cat,
        'destination': nairobi,
        'provider': partner,
        'description': 'Full-day safari tour in Nairobi National Park with experienced guides.',
        'price': 80.00,
        'currency': 'USD',
        'verified': True,
        'rating': 4.8,
        'available': True
    },
    {
        'name': 'Airport Transfer Service',
        'category': taxi_cat,
        'destination': nairobi,
        'provider': partner,
        'description': 'Reliable airport pickup and drop-off service with professional drivers.',
        'price': 25.00,
        'currency': 'USD',
        'verified': True,
        'rating': 4.6,
        'available': True
    },
    {
        'name': 'Serena Beach Resort',
        'category': hotel_cat,
        'destination': mombasa,
        'provider': partner,
        'description': 'Beachfront resort with stunning ocean views and world-class facilities.',
        'price': 200.00,
        'currency': 'USD',
        'verified': True,
        'rating': 4.7,
        'available': True
    },
]

for service_data in services_data:
    service, created = Service.objects.get_or_create(
        name=service_data['name'],
        destination=service_data['destination'],
        defaults=service_data
    )
    if created:
        print(f"✓ Created service: {service.name}")

# Create community posts
posts_data = [
    {
        'author': staff,
        'title': 'Welcome to Vibe With KQ Community!',
        'content': 'We are excited to launch this platform where we can connect, share stories, and celebrate our culture together. Join us in making every journey memorable!',
        'post_type': 'announcement',
        'featured': True,
        'published': True
    },
    {
        'author': staff,
        'title': 'Our CSR Initiative: Education for All',
        'content': 'Kenya Airways is proud to support education initiatives across Africa. Learn about our latest project providing school supplies to underprivileged children.',
        'post_type': 'csr',
        'featured': True,
        'published': True
    },
    {
        'author': staff,
        'title': 'Behind the Scenes: A Day in the Life of a Flight Attendant',
        'content': 'Ever wondered what it\'s like to work 30,000 feet in the air? Join me as I share my experiences and passion for aviation.',
        'post_type': 'story',
        'featured': False,
        'published': True
    },
]

for post_data in posts_data:
    post, created = Post.objects.get_or_create(
        title=post_data['title'],
        defaults=post_data
    )
    if created:
        print(f"✓ Created post: {post.title}")

# Create events
events_data = [
    {
        'organizer': staff,
        'title': 'Community Meetup: Nairobi',
        'description': 'Join us for our monthly community meetup in Nairobi. Network with fellow travelers and KQ staff!',
        'event_type': 'meetup',
        'location': 'Nairobi, Kenya',
        'start_date': datetime.now() + timedelta(days=14),
        'end_date': datetime.now() + timedelta(days=14, hours=3),
        'max_participants': 50,
        'featured': True
    },
    {
        'organizer': staff,
        'title': 'Beach Cleanup Initiative',
        'description': 'Help us keep our beaches clean! Join our CSR beach cleanup event in Mombasa.',
        'event_type': 'csr',
        'location': 'Mombasa, Kenya',
        'start_date': datetime.now() + timedelta(days=21),
        'end_date': datetime.now() + timedelta(days=21, hours=4),
        'max_participants': 100,
        'featured': True
    },
]

for event_data in events_data:
    event, created = Event.objects.get_or_create(
        title=event_data['title'],
        defaults=event_data
    )
    if created:
        print(f"✓ Created event: {event.title}")

print("\n" + "="*50)
print("Sample data created successfully!")
print("="*50)
print("\nTest Accounts:")
print("-" * 50)
print("Admin:")
print("  Username: admin")
print("  Password: admin123")
print("\nBusiness Partner:")
print("  Username: partner1")
print("  Password: partner123")
print("\nStaff:")
print("  Username: staff1")
print("  Password: staff123")
print("\nYou can now:")
print("1. Start the backend: .venv/bin/python manage.py runserver")
print("2. Access admin panel: http://localhost:8000/admin")
print("3. View API docs: http://localhost:8000/api/docs")
