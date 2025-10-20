#!/usr/bin/env python
"""Script to create a superuser programmatically"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VibeKQ.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if superuser already exists
if User.objects.filter(username='admin').exists():
    print('Superuser "admin" already exists!')
else:
    User.objects.create_superuser(
        username='admin',
        email='admin@vibekq.com',
        password='admin123',
        user_type='admin',
        first_name='Admin',
        last_name='User'
    )
    print('Superuser created successfully!')
    print('Username: admin')
    print('Password: admin123')
    print('Email: admin@vibekq.com')
