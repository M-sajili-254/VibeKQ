#!/usr/bin/env python
"""Script to assign images to destinations and services"""
import os
import django
import shutil

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VibeKQ.settings')
django.setup()

from trip_assistant.models import Destination, Service

print("Assigning images to destinations and services...")

# Image mappings for destinations
destination_images = {
    'Nairobi': 'destinations/nairobi.jpg',
    'Mombasa': 'destinations/mombasa.jpg',
    'Zanzibar': 'destinations/zanzibar.jpg',
    'Cape Town': 'destinations/capetown.jpg',
    'Bangkok': 'destinations/bangkok.jpg',
    'Sydney': 'destinations/sydney.jpg',
    'Rome': 'destinations/rome.jpg',
}

# Assign images to destinations
for city, image_path in destination_images.items():
    try:
        dest = Destination.objects.filter(city=city).first()
        if dest:
            dest.image = image_path
            dest.save()
            print(f"✓ Assigned image to destination: {city}")
        else:
            print(f"✗ Destination not found: {city}")
    except Exception as e:
        print(f"✗ Error assigning image to {city}: {e}")

# Image mappings for services (by name pattern)
service_image_mapping = {
    'Safari Park Hotel': 'services/hotel1.jpg',
    'Serena Beach Resort': 'services/hotel2.jpg',
    'Nairobi National Park Tour': 'services/safari.jpg',
    'Airport Transfer Service': 'services/transport.jpg',
    'Thai Comfort Tours': 'services/tour1.jpg',
    'Bangkok River Hotels': 'services/hotel1.jpg',
    'Siam Transport Co.': 'services/transport.jpg',
    'Thai Culinary Academy': 'services/cooking.jpg',
    'Sydney Harbor Cruises': 'services/cruise.jpg',
    'Aussie Outback Tours': 'services/safari.jpg',
    'Bondi Beach Hotels': 'services/hotel2.jpg',
    'Sydney Executive Cars': 'services/transport.jpg',
    'Roma Antica Tours': 'services/tour1.jpg',
    'Tuscan Wine Experiences': 'services/wine.jpg',
    'Roman Holiday Hotels': 'services/hotel1.jpg',
    'Italia Express Transport': 'services/transport.jpg',
}

# Assign images to services
for service_name, image_path in service_image_mapping.items():
    try:
        service = Service.objects.filter(name=service_name).first()
        if service:
            service.image = image_path
            service.save()
            print(f"✓ Assigned image to service: {service_name}")
        else:
            print(f"✗ Service not found: {service_name}")
    except Exception as e:
        print(f"✗ Error assigning image to {service_name}: {e}")

print("\n" + "="*50)
print("Image assignment completed!")
print("="*50)
print("\nYou can now view the images on the frontend.")

