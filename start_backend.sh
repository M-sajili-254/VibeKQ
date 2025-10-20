#!/bin/bash
# Script to start the Django backend server

echo "🚀 Starting Vibe With KQ Backend..."
echo "=================================="
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Start the server
.venv/bin/python manage.py runserver

echo ""
echo "Backend stopped."
