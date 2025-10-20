# 🚀 Vibe With KQ - Start Here!

## ✅ Setup Complete!

Your Vibe With KQ platform is ready to use. The database has been created with sample data.

## 🎯 Quick Start

### 1️⃣ Backend is Already Running!

The Django backend is currently running at: **http://localhost:8000**

If you need to restart it:
```bash
cd /home/eddy/PycharmProjects/VibeKQ
./start_backend.sh
```

Or manually:
```bash
.venv/bin/python manage.py runserver
```

### 2️⃣ Start the Frontend

Open a **NEW terminal** and run:

```bash
cd /home/eddy/PycharmProjects/VibeKQ/frontend
npm install
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## 🔑 Test Accounts

### Admin Account
- **URL**: http://localhost:8000/admin
- **Username**: `admin`
- **Password**: `admin123`
- Use this to manage all data via Django admin panel

### Business Partner Account
- **Username**: `partner1`
- **Password**: `partner123`
- Can create and manage services

### Staff Account
- **Username**: `staff1`
- **Password**: `staff123`
- Can create community posts and events

### Create Your Own Account
- Go to http://localhost:3000/register
- Choose account type (Passenger, Business Partner, or Staff)

## 📍 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:8000/api | REST API |
| **Admin Panel** | http://localhost:8000/admin | Django admin |
| **API Docs** | http://localhost:8000/api/docs | Swagger UI |

## 🎨 Sample Data Included

The database already contains:
- ✅ 4 Destinations (Nairobi, Mombasa, Zanzibar, Cape Town)
- ✅ 5 Service Categories (Hotels, Taxis, Tours, Restaurants, Activities)
- ✅ 4 Services (Hotels, Tours, Taxis)
- ✅ 3 Community Posts
- ✅ 2 Upcoming Events
- ✅ 3 Test User Accounts

## 🧪 Testing the Platform

### Test Trip Assistant
1. Go to http://localhost:3000/trip-assistant
2. Browse destinations
3. Click on a destination to see available services
4. Login and try booking a service

### Test Community
1. Go to http://localhost:3000/community
2. View posts and events
3. Login to like posts
4. Register for events

### Test Business Portal
1. Go to http://localhost:3000/business
2. Fill out partnership application
3. Login as admin to approve applications

## 🛠️ Common Commands

### Backend Commands
```bash
# Create migrations
.venv/bin/python manage.py makemigrations

# Apply migrations
.venv/bin/python manage.py migrate

# Create superuser
.venv/bin/python manage.py createsuperuser

# Run tests
.venv/bin/python manage.py test

# Access Django shell
.venv/bin/python manage.py shell
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Features to Explore

### Trip Assistant
- Search destinations by city/country
- Browse services by category
- View service ratings and reviews
- Book services (requires login)
- Leave reviews after booking

### Vibe Community
- Read staff stories and passion projects
- View CSR initiatives
- Register for community events
- Like and comment on posts
- Browse KQ merchandise

### Business Portal
- Apply for verified partnership
- List your services
- Track bookings and revenue
- Create sponsored content

## 🎨 Design Theme

The platform uses a **Modern African Luxury** theme:
- Primary: Warm Orange (#ff6b35)
- Secondary: Golden Yellow (#fdc830)
- Fully responsive design
- Smooth animations and transitions

## 🔧 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Need to reset database:**
```bash
rm db.sqlite3
.venv/bin/python manage.py migrate
.venv/bin/python create_superuser.py
.venv/bin/python create_sample_data.py
```

### Frontend Issues

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**API connection error:**
- Ensure backend is running on port 8000
- Check `.env.local` file in frontend directory

## 📚 Next Steps

1. **Customize Design**: Edit `frontend/app/globals.css` for colors
2. **Add More Data**: Use Django admin to add destinations, services, posts
3. **Test All Features**: Try booking, posting, registering for events
4. **Review API**: Check http://localhost:8000/api/docs for all endpoints
5. **Deploy**: See README.md for deployment instructions

## 💡 Pro Tips

- Use Django admin panel for quick data management
- Check browser console for API debugging
- All API endpoints require JWT token (except public ones)
- Images can be uploaded via Django admin
- Use Postman/Insomnia to test API endpoints directly

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Check `QUICKSTART.md` for setup instructions
- Review API docs at http://localhost:8000/api/docs
- Check Django admin for data management

---

**Enjoy building with Vibe With KQ!** ✈️🌍

*Connecting Travel with Culture, Passion, and Community*
