# Vibe With KQ - Full Stack Platform

A comprehensive digital platform that transforms Kenya Airways from an airline into a lifestyle brand, connecting travel with local culture and business.

## 🌟 Features

### Trip Assistant
- Browse and book verified local services (hotels, taxis, tours)
- Search destinations by city, country
- Filter services by category
- View service ratings and reviews
- Secure booking system with payment tracking

### Vibe Community
- Share stories and passion projects
- Engage with KQ staff and fans
- Participate in CSR initiatives
- Register for community events
- Like and comment on posts

### Business Community
- Partner application portal for local businesses
- Verified partnership management
- Sponsored content platform
- Commission-based revenue model
- Business analytics dashboard

## 🏗️ Tech Stack

### Backend (Django)
- **Framework**: Django 5.2.7
- **API**: Django REST Framework 3.15.2
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (development) / PostgreSQL (production)
- **CORS**: django-cors-headers
- **API Documentation**: drf-spectacular (Swagger/OpenAPI)

### Frontend (Next.js)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Forms**: React Hook Form

## 📁 Project Structure

```
VibeKQ/
├── backend (Django)
│   ├── VibeKQ/              # Project settings
│   ├── accounts/            # User management
│   ├── trip_assistant/      # Trip booking services
│   ├── business_community/  # Business partnerships
│   ├── vibe_community/      # Community features
│   ├── manage.py
│   └── requirements.txt
│
└── frontend (Next.js)
    ├── app/                 # Next.js app router pages
    │   ├── trip-assistant/
    │   ├── community/
    │   ├── business/
    │   ├── login/
    │   └── register/
    ├── components/          # Reusable components
    ├── utils/              # API client & utilities
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to project directory**
   ```bash
   cd /home/eddy/PycharmProjects/VibeKQ
   ```

2. **Create and activate virtual environment**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python3 manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python3 manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`
   - Admin panel: `http://localhost:8000/admin/`
   - API docs: `http://localhost:8000/api/docs/`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:3000`

## 🔑 API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/accounts/users/register/` - Register new user
- `GET /api/accounts/users/me/` - Get current user profile

### Trip Assistant
- `GET /api/trip-assistant/destinations/` - List destinations
- `GET /api/trip-assistant/categories/` - List service categories
- `GET /api/trip-assistant/services/` - List services
- `POST /api/trip-assistant/bookings/` - Create booking
- `GET /api/trip-assistant/bookings/` - List user bookings
- `POST /api/trip-assistant/reviews/` - Create review

### Community
- `GET /api/community/posts/` - List community posts
- `POST /api/community/posts/{id}/like/` - Like/unlike post
- `GET /api/community/events/` - List events
- `POST /api/community/events/{id}/register/` - Register for event
- `GET /api/community/merchandise/` - List merchandise

### Business
- `POST /api/business/applications/` - Apply for partnership
- `GET /api/business/partnerships/` - List partnerships
- `GET /api/business/sponsored/` - List sponsored content

## 🎨 Design Theme

**Modern African Luxury**
- Primary Color: Warm Orange (#ff6b35)
- Secondary Color: Golden Yellow (#fdc830)
- Accent: Vibrant gradients
- Typography: Clean, modern sans-serif
- Visual Style: Warm, inviting, culturally rich

## 👥 User Types

1. **Passenger** - Books services, engages with community
2. **Business Partner** - Provides verified services
3. **KQ Staff** - Creates content, manages events
4. **Administrator** - Platform management

## 💰 Monetization

- Commission on service bookings (10% default)
- Sponsored content from partners
- Merchandise sales
- Premium partnership tiers

## 🔒 Security

- JWT-based authentication
- CORS protection
- CSRF protection
- Password validation
- Secure file uploads
- Rate limiting (production)

## 📱 Features Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time chat
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Social media integration

## 🤝 Contributing

This is a proprietary project for Kenya Airways. For internal contributions, please follow the established Git workflow and coding standards.

## 📄 License

Proprietary - Kenya Airways © 2025

## 📞 Support

For support and inquiries, contact the development team or visit the help center.

---

**Vibe With KQ** - Connecting Travel with Culture, Passion, and Community
