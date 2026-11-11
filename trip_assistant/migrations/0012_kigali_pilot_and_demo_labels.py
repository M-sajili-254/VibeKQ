from uuid import uuid4
from django.db import migrations


def add_kigali_and_label_demos(apps, schema_editor):
    Destination = apps.get_model('trip_assistant', 'Destination')
    Service = apps.get_model('trip_assistant', 'Service')
    Partnership = apps.get_model('business_community', 'Partnership')
    demo_usernames = [
        f'{code}_{kind}_partner'
        for code in ('nyc', 'lon', 'ams', 'dxb', 'nbo', 'cpt', 'bkk')
        for kind in ('airport', 'local')
    ]
    Service.objects.filter(provider__username__in=demo_usernames, destination__is_demo=True).update(is_demo=True)
    Partnership.objects.filter(user__username__in=demo_usernames, destination__is_demo=True).update(is_demo=True)
    Service.objects.filter(
        provider__username='partner1',
        name__in=[
            'Safari Park Hotel', 'Nairobi National Park Tour', 'Airport Transfer Service',
            'Serena Beach Resort', 'Thai Comfort Tours', 'Bangkok River Hotels',
            'Siam Transport Co.', 'Thai Culinary Academy', 'Sydney Harbor Cruises',
            'Aussie Outback Tours', 'Bondi Beach Hotels', 'Sydney Executive Cars',
            'Schiphol Arrival Lounge', 'Canal View Stays', 'Schiphol City Transfers',
            'Dutch Culture Walks', 'Roma Antica Tours', 'Tuscan Wine Experiences',
            'Roman Holiday Hotels', 'Italia Express Transport',
        ],
    ).update(is_demo=True)
    if not Destination.objects.filter(code='KGL').exists():
        Destination.objects.create(
            id=uuid4().hex,
            code='KGL',
            name='Kigali Destination Passport',
            city='Kigali',
            country='Rwanda',
            airport_code='KGL',
            airport_name='Kigali International Airport',
            currency_code='RWF',
            timezone='Africa/Kigali',
            hero_tagline='Discover Kigali, from your airport arrival to the heart of the city.',
            description='A Kigali pilot for connecting travelers with local dining, shops, stays, cultural experiences, and airport transfers. Merchant onboarding is open; listings will appear after review.',
            highlights=['Local dining', 'Art and craft communities', 'City experiences', 'Airport transfers'],
            before_arrival_tips=['Plan your airport pickup.', 'Check entry requirements before travel.'],
            after_arrival_tips=['Explore local business communities.', 'Browse merchant profiles as they are approved.'],
            is_demo=True,
            featured=True,
            sort_order=0,
        )


class Migration(migrations.Migration):
    dependencies = [
        ('trip_assistant', '0011_service_is_demo'),
        ('business_community', '0006_partnerapplication_photo_rights_confirmed_and_more'),
    ]
    operations = [migrations.RunPython(add_kigali_and_label_demos, migrations.RunPython.noop)]
