#!/usr/bin/env python
"""Script to create sample data for testing"""
import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VibeKQ.settings')
django.setup()

from accounts.models import User
from trip_assistant.models import Destination, ServiceCategory, Service
from vibe_community.models import Post, Event, Merchandise, VibeMemory

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
        'description': 'The vibrant capital city of Kenya, known for its national park, museums, and bustling markets. Gateway to African safaris.',
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
    },
    # Business Communities - International Cities
    {
        'name': 'Bangkok',
        'country': 'Thailand',
        'city': 'Bangkok',
        'description': 'Thailand\'s vibrant capital, known for ornate shrines, bustling street life, and incredible cuisine. Discover authentic Thai hospitality.',
        'featured': True
    },
    {
        'name': 'Sydney',
        'country': 'Australia',
        'city': 'Sydney',
        'description': 'Australia\'s harbor city featuring the iconic Opera House, beautiful beaches, and world-class dining experiences.',
        'featured': True
    },
    {
        'name': 'Rome',
        'country': 'Italy',
        'city': 'Rome',
        'description': 'The Eternal City with ancient ruins, stunning architecture, and authentic Italian culture. Experience la dolce vita.',
        'featured': True
    },
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
bangkok = Destination.objects.filter(city='Bangkok').first()
sydney = Destination.objects.filter(city='Sydney').first()
rome = Destination.objects.filter(city='Rome').first()

hotel_cat = ServiceCategory.objects.get(name='Hotel, Motel and Lodging')
tour_cat = ServiceCategory.objects.get(name='Adventure')
taxi_cat = ServiceCategory.objects.get(name='Transport')
activity_cat = ServiceCategory.objects.get(name='Activities')
restaurant_cat = ServiceCategory.objects.get(name='Restaurant')

services_data = [
    # Nairobi Services
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

# Bangkok Services
if bangkok:
    services_data.extend([
        {
            'name': 'Thai Comfort Tours',
            'category': tour_cat,
            'destination': bangkok,
            'provider': partner,
            'description': 'Authentic temple tours, street food adventures, and cultural experiences in Bangkok.',
            'price': 65.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.9,
            'available': True
        },
        {
            'name': 'Bangkok River Hotels',
            'category': hotel_cat,
            'destination': bangkok,
            'provider': partner,
            'description': 'Luxury accommodation along the Chao Phraya River with stunning city views.',
            'price': 180.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.8,
            'available': True
        },
        {
            'name': 'Siam Transport Co.',
            'category': taxi_cat,
            'destination': bangkok,
            'provider': partner,
            'description': 'Professional airport transfers and city-wide transportation services.',
            'price': 35.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.7,
            'available': True
        },
        {
            'name': 'Thai Culinary Academy',
            'category': activity_cat,
            'destination': bangkok,
            'provider': partner,
            'description': 'Authentic Thai cooking classes with local chefs and market tours.',
            'price': 55.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.9,
            'available': True
        },
    ])

# Sydney Services
if sydney:
    services_data.extend([
        {
            'name': 'Sydney Harbor Cruises',
            'category': tour_cat,
            'destination': sydney,
            'provider': partner,
            'description': 'Scenic harbor cruises with views of the Opera House and Harbor Bridge.',
            'price': 95.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.8,
            'available': True
        },
        {
            'name': 'Aussie Outback Tours',
            'category': tour_cat,
            'destination': sydney,
            'provider': partner,
            'description': 'Day trips to the Blue Mountains and authentic Australian outback experiences.',
            'price': 120.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.9,
            'available': True
        },
        {
            'name': 'Bondi Beach Hotels',
            'category': hotel_cat,
            'destination': sydney,
            'provider': partner,
            'description': 'Beachfront accommodation at iconic Bondi Beach with ocean views.',
            'price': 220.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.7,
            'available': True
        },
        {
            'name': 'Sydney Executive Cars',
            'category': taxi_cat,
            'destination': sydney,
            'provider': partner,
            'description': 'Luxury airport transfers and executive chauffeur services.',
            'price': 75.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.8,
            'available': True
        },
    ])

# Rome Services
if rome:
    services_data.extend([
        {
            'name': 'Roma Antica Tours',
            'category': tour_cat,
            'destination': rome,
            'provider': partner,
            'description': 'Skip-the-line Vatican tours, Colosseum visits, and ancient Rome explorations.',
            'price': 85.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.9,
            'available': True
        },
        {
            'name': 'Tuscan Wine Experiences',
            'category': activity_cat,
            'destination': rome,
            'provider': partner,
            'description': 'Day trips to Tuscany with wine tasting and authentic Italian cuisine.',
            'price': 150.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.8,
            'available': True
        },
        {
            'name': 'Roman Holiday Hotels',
            'category': hotel_cat,
            'destination': rome,
            'provider': partner,
            'description': 'Boutique hotels near the Spanish Steps and historic city center.',
            'price': 195.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.7,
            'available': True
        },
        {
            'name': 'Italia Express Transport',
            'category': taxi_cat,
            'destination': rome,
            'provider': partner,
            'description': 'Airport transfers and private car services throughout Rome.',
            'price': 55.00,
            'currency': 'USD',
            'verified': True,
            'rating': 4.6,
            'available': True
        },
    ])

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

# Create Kenya Airways Merchandise
merchandise_data = [
    # Apparel
    {
        'name': 'Kenya Airways Polo Shirt - Red',
        'description': 'Official Kenya Airways branded polo shirt in signature red. Made from premium cotton blend with embroidered KQ logo on chest. Perfect for casual wear or travel. Available in various sizes.',
        'price': 45.00,
        'currency': 'USD',
        'stock_quantity': 150,
        'available': True,
        'featured': True
    },
    {
        'name': 'Kenya Airways Polo Shirt - White',
        'description': 'Classic white polo shirt with Kenya Airways logo. Premium quality fabric with moisture-wicking technology. Ideal for a smart casual look.',
        'price': 45.00,
        'currency': 'USD',
        'stock_quantity': 120,
        'available': True,
        'featured': False
    },
    {
        'name': 'Kenya Airways Pilot Uniform Cap',
        'description': 'Authentic Kenya Airways pilot-style cap with embroidered wings and KQ logo. Adjustable strap for perfect fit. A must-have for aviation enthusiasts.',
        'price': 35.00,
        'currency': 'USD',
        'stock_quantity': 80,
        'available': True,
        'featured': True
    },
    {
        'name': 'Kenya Airways Crew Scarf',
        'description': 'Elegant silk scarf featuring traditional African patterns inspired by Kenya Airways cabin crew uniforms. Perfect accessory for any outfit.',
        'price': 55.00,
        'currency': 'USD',
        'stock_quantity': 60,
        'available': True,
        'featured': False
    },
    {
        'name': 'Pride of Africa T-Shirt',
        'description': 'Comfortable cotton t-shirt featuring the iconic "Pride of Africa" slogan with artistic African wildlife design. Unisex fit.',
        'price': 30.00,
        'currency': 'USD',
        'stock_quantity': 200,
        'available': True,
        'featured': True
    },
    {
        'name': 'Kenya Airways Hoodie - Black',
        'description': 'Premium quality hoodie in black with embroidered Kenya Airways logo. Warm fleece interior, perfect for travel or lounging.',
        'price': 65.00,
        'currency': 'USD',
        'stock_quantity': 75,
        'available': True,
        'featured': False
    },
    # Bags and Accessories
    {
        'name': 'Kenya Airways Executive Travel Bag',
        'description': 'Sleek black leather executive travel bag with KQ logo. Multiple compartments, laptop sleeve, and premium zippers. Perfect for business travelers.',
        'price': 120.00,
        'currency': 'USD',
        'stock_quantity': 40,
        'available': True,
        'featured': True
    },
    {
        'name': 'KQ Cabin Trolley Bag',
        'description': 'Official Kenya Airways cabin-approved trolley bag. Lightweight design with 360° spinner wheels. Includes KQ luggage tag.',
        'price': 150.00,
        'currency': 'USD',
        'stock_quantity': 50,
        'available': True,
        'featured': True
    },
    {
        'name': 'Kenya Airways Backpack',
        'description': 'Versatile backpack with Kenya Airways branding. Features padded laptop compartment, multiple pockets, and ergonomic design.',
        'price': 75.00,
        'currency': 'USD',
        'stock_quantity': 90,
        'available': True,
        'featured': False
    },
    {
        'name': 'KQ Leather Passport Holder',
        'description': 'Premium leather passport holder with gold-embossed Kenya Airways logo. Includes card slots and boarding pass pocket.',
        'price': 40.00,
        'currency': 'USD',
        'stock_quantity': 100,
        'available': True,
        'featured': True
    },
    {
        'name': 'Kenya Airways Luggage Tag Set',
        'description': 'Set of 3 premium luggage tags in red, black, and white with Kenya Airways branding. Durable design with privacy flap.',
        'price': 18.00,
        'currency': 'USD',
        'stock_quantity': 200,
        'available': True,
        'featured': False
    },
    # Collectibles and Gifts
    {
        'name': 'Boeing 787 Dreamliner Model - KQ Livery',
        'description': 'Detailed 1:200 scale model of the Kenya Airways Boeing 787 Dreamliner. Perfect for collectors and aviation enthusiasts. Comes with display stand.',
        'price': 85.00,
        'currency': 'USD',
        'stock_quantity': 30,
        'available': True,
        'featured': True
    },
    {
        'name': 'Embraer E190 Model - KQ Livery',
        'description': 'Collectible 1:200 scale model of Kenya Airways Embraer E190 aircraft. Detailed finish with authentic livery.',
        'price': 65.00,
        'currency': 'USD',
        'stock_quantity': 25,
        'available': True,
        'featured': False
    },
    {
        'name': 'Kenya Airways Mug - Pride of Africa',
        'description': 'Premium ceramic mug featuring Kenya Airways Pride of Africa design. Microwave and dishwasher safe. Perfect for your morning coffee.',
        'price': 15.00,
        'currency': 'USD',
        'stock_quantity': 300,
        'available': True,
        'featured': False
    },
    {
        'name': 'KQ Playing Cards Set',
        'description': 'Premium playing cards featuring stunning African wildlife and Kenya Airways aircraft. Great for travel entertainment.',
        'price': 12.00,
        'currency': 'USD',
        'stock_quantity': 150,
        'available': True,
        'featured': False
    },
    {
        'name': 'Kenya Airways Metal Pin Badge',
        'description': 'High-quality metal pin badge with Kenya Airways logo. Gold and red enamel finish. Perfect for jackets, bags, or collections.',
        'price': 10.00,
        'currency': 'USD',
        'stock_quantity': 250,
        'available': True,
        'featured': False
    },
    {
        'name': 'KQ Keychain - Aircraft Shape',
        'description': 'Elegant metal keychain in aircraft shape with Kenya Airways engraving. Perfect gift for aviation lovers.',
        'price': 12.00,
        'currency': 'USD',
        'stock_quantity': 180,
        'available': True,
        'featured': False
    },
    # Travel Accessories
    {
        'name': 'Kenya Airways Travel Pillow',
        'description': 'Memory foam travel neck pillow with removable KQ-branded cover. Compact and comfortable for long flights.',
        'price': 28.00,
        'currency': 'USD',
        'stock_quantity': 100,
        'available': True,
        'featured': False
    },
    {
        'name': 'KQ Sleep Mask & Earplug Set',
        'description': 'Premium silk sleep mask with Kenya Airways logo and high-quality earplugs. Perfect travel companion for restful journeys.',
        'price': 22.00,
        'currency': 'USD',
        'stock_quantity': 120,
        'available': True,
        'featured': False
    },
    {
        'name': 'Kenya Airways Toiletry Bag',
        'description': 'Compact toiletry bag as used in Kenya Airways Business Class. Water-resistant with multiple compartments.',
        'price': 35.00,
        'currency': 'USD',
        'stock_quantity': 80,
        'available': True,
        'featured': False
    },
]

for merch_data in merchandise_data:
    merch, created = Merchandise.objects.get_or_create(
        name=merch_data['name'],
        defaults=merch_data
    )
    if created:
        print(f"✓ Created merchandise: {merch.name}")

# Create Vibe Memories
vibe_memories_data = [
    {
        'uploader': staff,
        'title': 'Sunset at Masai Mara',
        'description': 'Capturing the breathtaking sunset over the Masai Mara savannah. The golden hour creates magical colors that words cannot describe.',
        'location': 'Masai Mara, Kenya',
        'featured': True,
        'likes_count': 245
    },
    {
        'uploader': staff,
        'title': 'Crew Celebration in Nairobi',
        'description': 'Our amazing cabin crew celebrating after a successful international route launch. The pride of Africa!',
        'location': 'JKIA, Nairobi',
        'featured': True,
        'likes_count': 189
    },
    {
        'uploader': staff,
        'title': 'Mount Kenya View from Above',
        'description': 'A stunning aerial view of Mount Kenya as seen from the flight deck. Africa\'s second highest peak never fails to amaze.',
        'location': 'Mount Kenya, Kenya',
        'featured': True,
        'likes_count': 312
    },
    {
        'uploader': staff,
        'title': 'Mombasa Beach Vibes',
        'description': 'The pristine beaches of Diani. Crystal clear waters and white sand - Kenya\'s coastal paradise.',
        'location': 'Diani Beach, Mombasa',
        'featured': True,
        'likes_count': 278
    },
    {
        'uploader': staff,
        'title': 'Zanzibar Spice Market',
        'description': 'Exploring the vibrant spice markets of Stone Town. The colors and aromas are simply intoxicating!',
        'location': 'Stone Town, Zanzibar',
        'featured': False,
        'likes_count': 156
    },
    {
        'uploader': staff,
        'title': 'KQ Dreamliner at Dawn',
        'description': 'Our beautiful Boeing 787 Dreamliner ready for departure at sunrise. Pride of Africa taking to the skies!',
        'location': 'JKIA, Nairobi',
        'featured': True,
        'likes_count': 423
    },
    {
        'uploader': staff,
        'title': 'Lake Nakuru Flamingos',
        'description': 'Millions of flamingos painting Lake Nakuru pink. One of nature\'s most spectacular displays.',
        'location': 'Lake Nakuru, Kenya',
        'featured': True,
        'likes_count': 298
    },
    {
        'uploader': staff,
        'title': 'Victoria Falls Adventure',
        'description': 'The mighty Victoria Falls - one of the seven natural wonders of the world. Simply breathtaking!',
        'location': 'Victoria Falls, Zimbabwe',
        'featured': False,
        'likes_count': 187
    },
    {
        'uploader': staff,
        'title': 'Cape Town Table Mountain',
        'description': 'Stunning view of Table Mountain from our layover in Cape Town. What a magnificent city!',
        'location': 'Cape Town, South Africa',
        'featured': False,
        'likes_count': 234
    },
    {
        'uploader': staff,
        'title': 'Traditional Maasai Welcome',
        'description': 'Warmly welcomed by Maasai warriors during a community visit. Their culture and traditions are truly inspiring.',
        'location': 'Maasai Mara, Kenya',
        'featured': True,
        'likes_count': 356
    },
    {
        'uploader': staff,
        'title': 'Kilimanjaro Sunrise',
        'description': 'Mount Kilimanjaro\'s peak at sunrise, as seen during our flight to Dar es Salaam. Africa\'s highest point in all its glory.',
        'location': 'En Route to Dar es Salaam',
        'featured': True,
        'likes_count': 445
    },
    {
        'uploader': staff,
        'title': 'Nairobi Skyline Night',
        'description': 'The beautiful Nairobi city skyline at night. Our home base never fails to impress.',
        'location': 'Nairobi, Kenya',
        'featured': False,
        'likes_count': 167
    },
    {
        'uploader': staff,
        'title': 'Amboseli Elephant Crossing',
        'description': 'Majestic elephants crossing the Amboseli plains with Kilimanjaro in the background. Pure Africa!',
        'location': 'Amboseli National Park, Kenya',
        'featured': True,
        'likes_count': 389
    },
    {
        'uploader': staff,
        'title': 'Lamu Island Dhow',
        'description': 'Traditional dhow sailing off the coast of Lamu Island. Stepping back in time in this UNESCO heritage site.',
        'location': 'Lamu Island, Kenya',
        'featured': False,
        'likes_count': 145
    },
    {
        'uploader': staff,
        'title': 'Pride of Africa Team',
        'description': 'Our incredible ground crew team at JKIA. The heart and soul behind every successful flight!',
        'location': 'JKIA, Nairobi',
        'featured': True,
        'likes_count': 512
    },
    {
        'uploader': staff,
        'title': 'Dubai Layover Sunset',
        'description': 'Stunning Dubai skyline during our layover. Connecting Africa to the world!',
        'location': 'Dubai, UAE',
        'featured': False,
        'likes_count': 198
    },
    {
        'uploader': staff,
        'title': 'Serengeti Great Migration',
        'description': 'Witnessing the Great Migration in Serengeti - millions of wildebeest on the move. Nature at its finest!',
        'location': 'Serengeti, Tanzania',
        'featured': True,
        'likes_count': 478
    },
    {
        'uploader': staff,
        'title': 'Ethiopian Coffee Ceremony',
        'description': 'Experiencing a traditional Ethiopian coffee ceremony in Addis Ababa. The birthplace of coffee!',
        'location': 'Addis Ababa, Ethiopia',
        'featured': False,
        'likes_count': 134
    },
    {
        'uploader': staff,
        'title': 'Giraffe Centre Nairobi',
        'description': 'Meeting the friendly Rothschild giraffes at the Nairobi Giraffe Centre. An unforgettable experience!',
        'location': 'Giraffe Centre, Nairobi',
        'featured': True,
        'likes_count': 267
    },
    {
        'uploader': staff,
        'title': 'Hell\'s Gate Adventure',
        'description': 'Cycling through Hell\'s Gate National Park. The only park in Kenya where you can walk or cycle among wildlife!',
        'location': 'Hell\'s Gate, Kenya',
        'featured': False,
        'likes_count': 156
    },
]

for memory_data in vibe_memories_data:
    memory, created = VibeMemory.objects.get_or_create(
        title=memory_data['title'],
        defaults=memory_data
    )
    if created:
        print(f"✓ Created vibe memory: {memory.title}")

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
