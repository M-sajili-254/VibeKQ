#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate --noinput

# Collect static files (with --noinput to avoid prompts)
python manage.py collectstatic --noinput --clear

# Create sample data and assign image URLs
python create_sample_data.py
python assign_image_urls.py

