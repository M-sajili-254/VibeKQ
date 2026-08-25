from django.db import migrations


DESTINATIONS = {
    "Bangkok": {
        "name": "Welcome to Bangkok",
        "country": "Thailand",
        "description": "Thailand's vibrant capital, known for ornate shrines, bustling street life, and incredible cuisine. Discover authentic Thai hospitality.",
        "featured": True,
        "image_url": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    },
    "Cape Town": {
        "name": "Welcome to Cape Town",
        "country": "South Africa",
        "description": "Stunning coastal city with Table Mountain, wine estates, and diverse culture.",
        "featured": True,
        "image_url": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    },
    "Nairobi": {
        "name": "Welcome to Nairobi",
        "country": "Kenya",
        "description": "The vibrant capital city of Kenya, known for its national park, museums, and bustling markets. Gateway to African safaris.",
        "featured": True,
        "image_url": "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80",
    },
    "London": {
        "name": "Welcome to London",
        "country": "United Kingdom",
        "description": "A dynamic global capital where iconic landmarks, world-class culture, and distinctive neighborhoods create unforgettable journeys.",
        "featured": True,
        "image_url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    },
    "New York": {
        "name": "Welcome to New York",
        "country": "United States",
        "description": "An iconic city packed with skyline views, celebrated neighborhoods, and nonstop energy for every kind of traveler.",
        "featured": True,
        "image_url": "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&q=80",
    },
    "Dubai": {
        "name": "Welcome to Dubai",
        "country": "United Arab Emirates",
        "description": "A modern gateway blending innovation, luxury, heritage, and desert adventure in one remarkable destination.",
        "featured": True,
        "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    },
}


def update_destinations(apps, schema_editor):
    Destination = apps.get_model("trip_assistant", "Destination")

    for city, values in DESTINATIONS.items():
        Destination.objects.update_or_create(
            city=city,
            defaults=values,
        )


def reverse_update_destinations(apps, schema_editor):
    Destination = apps.get_model("trip_assistant", "Destination")

    for city in ("Bangkok", "Cape Town", "Nairobi"):
        destination = Destination.objects.filter(city=city).first()
        if destination:
            destination.name = city
            destination.save(update_fields=["name"])

    Destination.objects.filter(city__in=["London", "New York", "Dubai"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("trip_assistant", "0004_destination_image_url_service_image_url_and_more"),
    ]

    operations = [
        migrations.RunPython(update_destinations, reverse_update_destinations),
    ]
