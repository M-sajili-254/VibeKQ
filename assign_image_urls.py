#!/usr/bin/env python
"""Script to assign image URLs to all items missing images"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VibeKQ.settings')
django.setup()

from trip_assistant.models import Destination, Service
from vibe_community.models import Post, Event, Merchandise, VibeMemory

print("Assigning image URLs to all items...\n")

# === DESTINATIONS ===
destination_images = {
    'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    'Mombasa': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80',
    'Nairobi': 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
    'Zanzibar': 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800&q=80',
    'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
}

for dest in Destination.objects.all():
    url = destination_images.get(dest.city) or destination_images.get(dest.name)
    if url:
        dest.image_url = url
        dest.save(update_fields=['image_url'])
        print(f"✓ Destination: {dest.city} - image URL set")
    else:
        print(f"  ⚠ Destination: {dest.city} - no URL mapped")

# === SERVICES ===
service_images = {
    'Safari Park Hotel': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'Nairobi National Park Tour': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    'Airport Transfer Service': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    'Serena Beach Resort': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'Thai Comfort Tours': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
    'Bangkok River Hotels': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'Siam Transport Co.': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    'Thai Culinary Academy': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'Sydney Harbor Cruises': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80',
    'Aussie Outback Tours': 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&q=80',
    'Bondi Beach Hotels': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'Sydney Executive Cars': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    'Roma Antica Tours': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80',
    'Tuscan Wine Experiences': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    'Roman Holiday Hotels': 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    'Italia Express Transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
}

for service in Service.objects.all():
    url = service_images.get(service.name)
    if url:
        service.image_url = url
        service.save(update_fields=['image_url'])
        print(f"✓ Service: {service.name} - image URL set")
    else:
        print(f"  ⚠ Service: {service.name} - no URL mapped")

# === EVENTS ===
event_images = {
    'Community Meetup: Nairobi': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'Beach Cleanup Initiative': 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80',
}

for event in Event.objects.all():
    url = event_images.get(event.title)
    if url:
        event.image_url = url
        event.save(update_fields=['image_url'])
        print(f"✓ Event: {event.title} - image URL set")
    else:
        # Assign a default event image
        event.image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
        event.save(update_fields=['image_url'])
        print(f"✓ Event: {event.title} - default image URL set")

# === MERCHANDISE ===
merchandise_images = {
    'Kenya Airways Polo Shirt - Red': 'https://images.unsplash.com/photo-1625910513413-5fc56c3e3402?w=800&q=80',
    'Kenya Airways Polo Shirt - White': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
    'Kenya Airways Pilot Uniform Cap': 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=800&q=80',
    'Kenya Airways Crew Scarf': 'https://images.unsplash.com/photo-1601924921557-45e8e0e6988f?w=800&q=80',
    'Pride of Africa T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'Kenya Airways Hoodie - Black': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'Kenya Airways Executive Travel Bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    'KQ Cabin Trolley Bag': 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80',
    'Kenya Airways Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    'KQ Leather Passport Holder': 'https://images.unsplash.com/photo-1612902456551-404b5ec9f4c0?w=800&q=80',
    'Kenya Airways Luggage Tag Set': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    'Boeing 787 Dreamliner Model - KQ Livery': 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
    'Embraer E190 Model - KQ Livery': 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
    'Kenya Airways Mug - Pride of Africa': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    'KQ Playing Cards Set': 'https://images.unsplash.com/photo-1529480780361-12441ada2c2d?w=800&q=80',
    'Kenya Airways Metal Pin Badge': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
    'KQ Keychain - Aircraft Shape': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
    'Kenya Airways Travel Pillow': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    'KQ Sleep Mask & Earplug Set': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    'Kenya Airways Toiletry Bag': 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=800&q=80',
}

for merch in Merchandise.objects.all():
    url = merchandise_images.get(merch.name)
    if url:
        merch.image_url = url
        merch.save(update_fields=['image_url'])
        print(f"✓ Merchandise: {merch.name} - image URL set")
    else:
        print(f"  ⚠ Merchandise: {merch.name} - no URL mapped")

# === VIBE MEMORIES ===
memory_images = {
    'Sunset at Masai Mara': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    'Crew Celebration in Nairobi': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'Mount Kenya View from Above': 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80',
    'Mombasa Beach Vibes': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80',
    'Zanzibar Spice Market': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'KQ Dreamliner at Dawn': 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=80',
    'Lake Nakuru Flamingos': 'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&q=80',
    'Victoria Falls Adventure': 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&q=80',
    'Cape Town Table Mountain': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
    'Traditional Maasai Welcome': 'https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=80',
    'Kilimanjaro Sunrise': 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=800&q=80',
    'Nairobi Skyline Night': 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    'Amboseli Elephant Crossing': 'https://images.unsplash.com/photo-1535338454528-1b5ee56cee13?w=800&q=80',
    'Lamu Island Dhow': 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800&q=80',
    'Pride of Africa Team': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'Dubai Layover Sunset': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    'Serengeti Great Migration': 'https://images.unsplash.com/photo-1535338454528-1b5ee56cee13?w=800&q=80',
    'Ethiopian Coffee Ceremony': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
    'Giraffe Centre Nairobi': 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&q=80',
    "Hell's Gate Adventure": 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
}

for memory in VibeMemory.objects.all():
    url = memory_images.get(memory.title)
    if url:
        memory.image_url = url
        memory.save(update_fields=['image_url'])
        print(f"✓ Memory: {memory.title} - image URL set")
    else:
        print(f"  ⚠ Memory: {memory.title} - no URL mapped")

# === POSTS ===
post_images = {
    'Welcome to Vibe With KQ Community!': 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=80',
    'Our CSR Initiative: Education for All': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    'Behind the Scenes: A Day in the Life of a Flight Attendant': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
}

for post in Post.objects.all():
    url = post_images.get(post.title)
    if url:
        post.image_url = url
        post.save(update_fields=['image_url'])
        print(f"✓ Post: {post.title} - image URL set")

print("\n" + "=" * 50)
print("All image URLs assigned successfully!")
print("=" * 50)

