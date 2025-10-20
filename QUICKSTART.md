# Vibe With KQ - Quick Start Guide

## 🚀 Run the Application in 5 Minutes

### Step 1: Start the Django Backend

```bash
# Navigate to project root
cd /home/eddy/PycharmProjects/VibeKQ

# Activate virtual environment
source .venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run migrations (first time only)
python3 manage.py makemigrations
python3 manage.py migrate

# Create superuser (first time only)
python3 manage.py createsuperuser

# Start Django server
python3 manage.py runserver
```

✅ Backend running at: **http://localhost:8000**

### Step 2: Start the Next.js Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd /home/eddy/PycharmProjects/VibeKQ/frontend

# Install dependencies (first time only)
npm install

# Start Next.js development server
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

## 🎯 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:8000/api | REST API endpoints |
| **Admin Panel** | http://localhost:8000/admin | Django admin |
| **API Docs** | http://localhost:8000/api/docs | Swagger documentation |

## 👤 Test Accounts

After creating a superuser, you can:
1. Login to admin panel: http://localhost:8000/admin
2. Create test data (destinations, services, posts, events)
3. Register new users via frontend: http://localhost:3000/register

## 📝 Sample Data Creation

### Via Django Admin
1. Go to http://localhost:8000/admin
2. Add Destinations (e.g., Nairobi, Mombasa, Zanzibar)
3. Add Service Categories (Hotels, Taxis, Tours, Restaurants)
4. Add Services linked to destinations
5. Create Community Posts and Events

### Via Django Shell
```bash
python3 manage.py shell
```

```python
from accounts.models import User
from trip_assistant.models import Destination, ServiceCategory, Service
from vibe_community.models import Post, Event

# Create a test user
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='testpass123',
    user_type='passenger'
)

# Create a destination
dest = Destination.objects.create(
    name='Nairobi',
    country='Kenya',
    city='Nairobi',
    description='The vibrant capital city of Kenya',
    featured=True
)

# Create a service category
category = ServiceCategory.objects.create(
    name='Hotels',
    icon='🏨',
    description='Accommodation services'
)

# Create a service
service = Service.objects.create(
    name='Safari Park Hotel',
    category=category,
    destination=dest,
    provider=user,
    description='Luxury hotel in the heart of Nairobi',
    price=150.00,
    currency='USD',
    verified=True,
    rating=4.5
)

print("Sample data created successfully!")
```

## 🔧 Common Commands

### Backend
```bash
# Make migrations
python3 manage.py makemigrations

# Apply migrations
python3 manage.py migrate

# Create superuser
python3 manage.py createsuperuser

# Run tests
python3 manage.py test

# Collect static files
python3 manage.py collectstatic
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Database locked:**
```bash
# Remove database and recreate
rm db.sqlite3
python3 manage.py migrate
```

**Module not found:**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Dependencies error:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**API connection error:**
- Check backend is running on port 8000
- Verify `.env.local` has correct API URL
- Check CORS settings in Django

## 📱 Testing the Application

1. **Register a new account** at http://localhost:3000/register
2. **Browse destinations** at http://localhost:3000/trip-assistant
3. **View community posts** at http://localhost:3000/community
4. **Apply as business partner** at http://localhost:3000/business

## 🎨 Design Features

- **Modern African Luxury** theme with warm orange and golden colors
- **Responsive design** works on mobile, tablet, and desktop
- **Smooth animations** and transitions
- **Accessible** components following WCAG guidelines

## 📚 Next Steps

1. Customize the design colors in `frontend/app/globals.css`
2. Add more sample data via Django admin
3. Configure email settings for notifications
4. Set up payment gateway for bookings
5. Deploy to production (Vercel for frontend, Railway/Heroku for backend)

## 💡 Tips

- Use the Django admin panel to quickly manage data
- Check API docs at `/api/docs/` for endpoint details
- Use browser DevTools to debug API calls
- Enable Django Debug Toolbar for backend debugging

---

**Need Help?** Check the main README.md for detailed documentation.
