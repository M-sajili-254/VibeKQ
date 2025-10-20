# Vibe With KQ - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Sign In (New)
**POST** `/accounts/signin/`

Sign in and receive JWT tokens.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "user_type": "passenger",
    "first_name": "John",
    "last_name": "Doe"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "message": "Login successful"
}
```

**Error Responses:**
- `400`: Missing username or password
- `401`: Invalid credentials
- `403`: Account is disabled

---

### Sign Up (New)
**POST** `/accounts/signup/`

Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password2": "string",
  "first_name": "string",
  "last_name": "string",
  "user_type": "passenger|business_partner|staff",
  "phone_number": "string" (optional)
}
```

**Response (201):**
```json
{
  "user": {...},
  "access": "token",
  "refresh": "token",
  "message": "Registration successful"
}
```

---

### Get JWT Token (Legacy)
**POST** `/token/`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access": "token",
  "refresh": "token"
}
```

---

### Refresh Token
**POST** `/token/refresh/`

**Request Body:**
```json
{
  "refresh": "refresh_token"
}
```

**Response:**
```json
{
  "access": "new_access_token"
}
```

---

### Get Current User
**GET** `/accounts/users/me/`

Requires authentication.

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "user_type": "passenger",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+254712345678",
  "profile_picture": "url",
  "bio": "string",
  "created_at": "2025-10-20T10:00:00Z"
}
```

---

## 🗺️ Trip Assistant Endpoints

### List Destinations
**GET** `/trip-assistant/destinations/`

**Query Parameters:**
- `search`: Search by name, city, or country
- `ordering`: Sort by field (e.g., `-created_at`)

**Response:**
```json
{
  "count": 10,
  "next": "url",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Nairobi",
      "country": "Kenya",
      "city": "Nairobi",
      "description": "...",
      "image": "url",
      "featured": true,
      "created_at": "2025-10-20T10:00:00Z"
    }
  ]
}
```

---

### Get Destination Details
**GET** `/trip-assistant/destinations/{id}/`

---

### List Service Categories
**GET** `/trip-assistant/categories/`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Hotels",
      "icon": "🏨",
      "description": "Accommodation services",
      "services_count": 15
    }
  ]
}
```

---

### List Services
**GET** `/trip-assistant/services/`

**Query Parameters:**
- `category`: Filter by category ID
- `destination`: Filter by destination ID
- `search`: Search by name or description
- `ordering`: Sort by field (e.g., `-rating`, `price`)

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Safari Park Hotel",
      "category": 1,
      "category_name": "Hotels",
      "destination": 1,
      "destination_name": "Nairobi",
      "provider": 2,
      "provider_name": "Safari Adventures Ltd",
      "description": "...",
      "price": "150.00",
      "currency": "USD",
      "image": "url",
      "verified": true,
      "rating": "4.50",
      "total_bookings": 45,
      "available": true
    }
  ]
}
```

---

### Get Service Details
**GET** `/trip-assistant/services/{id}/`

Includes reviews and detailed information.

---

### Create Booking
**POST** `/trip-assistant/bookings/`

Requires authentication.

**Request Body:**
```json
{
  "service": 1,
  "booking_date": "2025-11-15",
  "booking_time": "14:00:00",
  "number_of_people": 2,
  "special_requests": "string" (optional)
}
```

**Response:**
```json
{
  "id": 1,
  "service": 1,
  "service_name": "Safari Park Hotel",
  "booking_date": "2025-11-15",
  "booking_time": "14:00:00",
  "number_of_people": 2,
  "total_price": "300.00",
  "status": "pending",
  "created_at": "2025-10-20T10:00:00Z"
}
```

---

### List My Bookings
**GET** `/trip-assistant/bookings/`

Requires authentication. Returns bookings for the current user.

---

### Create Review
**POST** `/trip-assistant/reviews/`

Requires authentication.

**Request Body:**
```json
{
  "service": 1,
  "booking": 1 (optional),
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

### List Reviews
**GET** `/trip-assistant/reviews/`

**Query Parameters:**
- `service`: Filter by service ID

---

## 🏢 Business Community Endpoints

### Apply for Partnership
**POST** `/business/applications/`

Requires authentication.

**Request Body:**
```json
{
  "business_name": "string",
  "business_category": "string",
  "business_registration_number": "string",
  "business_address": "string",
  "business_phone": "string",
  "business_email": "string",
  "business_website": "string" (optional),
  "business_description": "string"
}
```

---

### List My Applications
**GET** `/business/applications/`

Requires authentication. Returns applications for the current user.

---

### List Partnerships
**GET** `/business/partnerships/`

Returns active partnerships.

---

### List Sponsored Content
**GET** `/business/sponsored/`

Returns active sponsored content.

---

## 👥 Vibe Community Endpoints

### List Posts
**GET** `/community/posts/`

**Query Parameters:**
- `search`: Search by title or content
- `ordering`: Sort by field

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "author": 1,
      "author_name": "Jane Staff",
      "author_profile_picture": "url",
      "title": "Welcome to Vibe With KQ!",
      "content": "...",
      "post_type": "announcement",
      "image": "url",
      "video_url": null,
      "featured": true,
      "likes_count": 45,
      "comments_count": 12,
      "views_count": 234,
      "is_liked": false,
      "published": true,
      "created_at": "2025-10-20T10:00:00Z"
    }
  ]
}
```

---

### Like/Unlike Post
**POST** `/community/posts/{id}/like/`

Requires authentication.

**Response:**
```json
{
  "status": "liked" | "unliked"
}
```

---

### List Comments
**GET** `/community/comments/`

**Query Parameters:**
- `post`: Filter by post ID

---

### Create Comment
**POST** `/community/comments/`

Requires authentication.

**Request Body:**
```json
{
  "post": 1,
  "content": "Great post!",
  "parent": 1 (optional, for replies)
}
```

---

### List Events
**GET** `/community/events/`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "organizer": 1,
      "organizer_name": "Jane Staff",
      "title": "Community Meetup: Nairobi",
      "description": "...",
      "event_type": "meetup",
      "location": "Nairobi, Kenya",
      "virtual_link": null,
      "start_date": "2025-11-03T14:00:00Z",
      "end_date": "2025-11-03T17:00:00Z",
      "image": "url",
      "max_participants": 50,
      "participants_count": 23,
      "featured": true,
      "is_registered": false
    }
  ]
}
```

---

### Register for Event
**POST** `/community/events/{id}/register/`

Requires authentication.

**Response:**
```json
{
  "status": "registered"
}
```

**Error:**
```json
{
  "error": "Event is full" | "Already registered"
}
```

---

### Unregister from Event
**POST** `/community/events/{id}/unregister/`

Requires authentication.

---

### List Merchandise
**GET** `/community/merchandise/`

Returns available merchandise items.

---

## 📊 Admin Actions

The Django admin panel provides additional actions:

### Trip Assistant Admin
- Verify/unverify services
- Approve/reject bookings
- Manage destinations and categories

### Business Community Admin
- **Approve applications**: Creates partnership and updates user
- **Reject applications**: Marks application as rejected
- **Approve sponsored content**: Makes content active
- **Manage partnerships**: Activate/deactivate

### Vibe Community Admin
- **Feature/unfeature posts**: Toggle featured status
- **Publish/unpublish posts**: Control visibility
- **Feature events**: Highlight important events
- **Mark attendance**: Track event participation
- **Manage merchandise**: Update stock and availability

---

## 🔍 API Documentation (Swagger)

Interactive API documentation available at:
```
http://localhost:8000/api/docs/
```

OpenAPI schema available at:
```
http://localhost:8000/api/schema/
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format with UTC timezone
2. Pagination is applied to list endpoints (20 items per page)
3. File uploads support: JPG, PNG, GIF, PDF
4. Maximum file size: 10MB
5. Rate limiting: Not implemented in development

---

## 🚨 Error Responses

Standard error format:
```json
{
  "error": "Error message",
  "detail": "Detailed error information"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
