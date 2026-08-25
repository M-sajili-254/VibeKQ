from django.db import migrations


DESTINATION_UPDATES = {
    "New York": {
        "name": "Welcome to New York",
        "description": "Access airport conveniences, curated city experiences, dining, transport, and marketplace bookings in one connected New York destination experience.",
    },
    "London": {
        "name": "Welcome to London",
        "description": "Your London ticket unlocks airport lounges, fast transfers, hospitality, dining, and curated local experiences before and after arrival.",
    },
    "Amsterdam": {
        "name": "Welcome to Amsterdam",
        "description": "Amsterdam combines airport services, local culture, accommodation, food, tours, and transport in one connected destination ecosystem.",
    },
    "Dubai": {
        "name": "Welcome to Dubai",
        "description": "Dubai blends airport retail, lounges, premium transport, hospitality, dining, and destination experiences into one connected platform.",
    },
    "Nairobi": {
        "name": "Welcome to Nairobi",
        "description": "Nairobi connects airport hospitality, local transport, safari planning, accommodation, healthcare, and dining in one traveler-ready ecosystem.",
    },
    "Cape Town": {
        "name": "Welcome to Cape Town",
        "description": "Cape Town demonstrates a localized business ecosystem with airport support, mobility, accommodation, culinary, wellness, and sightseeing services.",
    },
    "Bangkok": {
        "name": "Welcome to Bangkok",
        "description": "Bangkok showcases airport assistance, hospitality, transport, dining, tours, and wellness in one unified destination experience.",
    },
}


def apply_destination_copy(apps, schema_editor):
    Destination = apps.get_model("trip_assistant", "Destination")

    for city, values in DESTINATION_UPDATES.items():
        destination = Destination.objects.filter(city=city).first()
        if not destination:
            continue
        for field, value in values.items():
            setattr(destination, field, value)
        destination.save(update_fields=list(values.keys()))


def reverse_destination_copy(apps, schema_editor):
    Destination = apps.get_model("trip_assistant", "Destination")

    for city in DESTINATION_UPDATES:
        destination = Destination.objects.filter(city=city).first()
        if destination:
            destination.name = f"{city} Destination Passport"
            destination.save(update_fields=["name"])


class Migration(migrations.Migration):

    dependencies = [
        ("trip_assistant", "0007_destination_business_and_payment_commission"),
    ]

    operations = [
        migrations.RunPython(apply_destination_copy, reverse_destination_copy),
    ]
