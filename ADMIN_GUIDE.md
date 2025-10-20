# Vibe With KQ - Admin Guide

## 🔐 Admin Access

**URL**: http://localhost:8000/admin

**Credentials**:
- Username: `admin`
- Password: `admin123`

---

## 📋 Admin Features Overview

### 1. **Accounts (User Management)**

**Location**: Accounts → Users

**Features**:
- View all registered users
- Filter by user type (Passenger, Business Partner, Staff, Admin)
- Search by username, email, business name, employee ID
- Edit user profiles
- Verify business partners
- Manage user permissions

**Fields**:
- Basic info: username, email, name
- User type and status
- Business partner info (if applicable)
- Staff info (if applicable)
- Profile details

---

### 2. **Trip Assistant**

#### Destinations
**Location**: Trip Assistant → Destinations

**Features**:
- Add/edit destinations
- Mark destinations as featured
- Upload destination images
- Search and filter by country

**Quick Actions**:
- Toggle featured status directly in list view

#### Service Categories
**Location**: Trip Assistant → Service Categories

**Features**:
- Create service categories (Hotels, Taxis, Tours, etc.)
- Add icons and descriptions
- View service count per category

#### Services
**Location**: Trip Assistant → Services

**Features**:
- Add/edit services
- Verify services (important for trust)
- Set pricing and availability
- Upload service images
- View ratings and booking stats

**Admin Actions**:
- Verify/unverify services in bulk
- Mark services as available/unavailable

**Quick Actions**:
- Toggle verified status
- Toggle availability

#### Bookings
**Location**: Trip Assistant → Bookings

**Features**:
- View all bookings
- Filter by status (Pending, Confirmed, Completed, Cancelled)
- Search by user or service
- View booking details and special requests

**Admin Actions**:
- Mark as confirmed
- Mark as completed
- Mark as cancelled

**Status Flow**:
1. Pending (user creates booking)
2. Confirmed (admin/partner confirms)
3. Completed (service delivered)
4. Cancelled (if needed)

#### Reviews
**Location**: Trip Assistant → Reviews

**Features**:
- View all reviews
- Filter by rating
- Moderate reviews if needed
- Link reviews to bookings

---

### 3. **Business Community**

#### Partner Applications
**Location**: Business Community → Partner Applications

**Features**:
- Review partnership applications
- View business documents
- Add admin notes
- Track review status

**Admin Actions**:
- **Approve applications**: 
  - Creates Partnership record
  - Updates user type to 'business_partner'
  - Marks user as verified
  - Sets business details
- **Reject applications**:
  - Marks application as rejected
  - Records review date

**Application Status**:
- Pending: Awaiting review
- Approved: Partnership created
- Rejected: Application denied

#### Partnerships
**Location**: Business Community → Partnerships

**Features**:
- View all active partnerships
- Set commission rates
- Track revenue and bookings
- Monitor partner ratings

**Admin Actions**:
- Activate/deactivate partnerships

**Quick Actions**:
- Edit commission rate directly in list
- Toggle active status

#### Sponsored Content
**Location**: Business Community → Sponsored Content

**Features**:
- Review sponsored content submissions
- Set campaign periods
- Track impressions and clicks
- Manage budgets

**Admin Actions**:
- Approve content (makes it active)
- Reject content
- Mark as expired

**Content Status**:
- Draft: Being created
- Pending: Awaiting approval
- Active: Currently showing
- Expired: Campaign ended
- Rejected: Not approved

---

### 4. **Vibe Community**

#### Posts
**Location**: Vibe Community → Posts

**Features**:
- View all community posts
- Filter by type (Story, Passion, CSR, Culture, Announcement)
- Feature important posts
- Control publication status
- View engagement metrics

**Admin Actions**:
- Feature/unfeature posts
- Publish/unpublish posts

**Quick Actions**:
- Toggle featured status
- Toggle published status

**Post Types**:
- Story: Personal stories
- Passion: Passion projects
- CSR: CSR initiatives
- Culture: Cultural content
- Announcement: Official announcements

#### Comments
**Location**: Vibe Community → Comments

**Features**:
- View all comments
- See parent-child relationships (replies)
- Moderate comments if needed

#### Likes
**Location**: Vibe Community → Likes

**Features**:
- View all post likes
- Track engagement

#### Events
**Location**: Vibe Community → Events

**Features**:
- Create/edit events
- Set capacity limits
- Feature important events
- Track registrations
- Manage virtual/physical locations

**Admin Actions**:
- Feature/unfeature events

**Event Types**:
- CSR Initiative
- Community Meetup
- Webinar
- Workshop

#### Event Participants
**Location**: Vibe Community → Event Participants

**Features**:
- View all event registrations
- Track attendance

**Admin Actions**:
- Mark as attended/not attended

**Quick Actions**:
- Toggle attended status

#### Merchandise
**Location**: Vibe Community → Merchandise

**Features**:
- Add/edit merchandise items
- Manage inventory
- Set pricing
- Feature popular items

**Admin Actions**:
- Mark as available/unavailable
- Feature/unfeature items

**Quick Actions**:
- Edit stock quantity
- Toggle availability
- Toggle featured status

---

## 🎯 Common Admin Tasks

### Approve a Business Partner

1. Go to **Business Community → Partner Applications**
2. Find pending application
3. Review business details and documents
4. Select application(s)
5. Choose **"Approve selected applications"** from actions
6. Click **"Go"**
7. Partnership is automatically created
8. User is updated to business partner type

### Verify a Service

1. Go to **Trip Assistant → Services**
2. Find the service
3. Check the **"Verified"** checkbox
4. Click **"Save"**

Or bulk verify:
1. Select multiple services
2. Choose action (if available)
3. Click **"Go"**

### Feature a Post

1. Go to **Vibe Community → Posts**
2. Find the post
3. Check the **"Featured"** checkbox in the list
4. Post is automatically saved

Or use bulk action:
1. Select posts
2. Choose **"Feature selected posts"**
3. Click **"Go"**

### Manage Event Capacity

1. Go to **Vibe Community → Events**
2. Click on event
3. Set **"Max participants"** field
4. Current **"Participants count"** is read-only
5. Save

### Update Service Availability

1. Go to **Trip Assistant → Services**
2. Toggle **"Available"** checkbox in list view
3. Changes are auto-saved

---

## 📊 Dashboard Insights

### Key Metrics to Monitor

**Users**:
- Total users by type
- New registrations
- Business partner applications

**Bookings**:
- Pending bookings (need confirmation)
- Total revenue
- Popular services

**Community**:
- Post engagement (likes, comments)
- Event registrations
- Active partnerships

---

## 🔍 Search & Filter Tips

### Effective Searching

**Users**:
- Search by username, email, or business name
- Filter by user type
- Filter by verification status

**Services**:
- Search by name or provider
- Filter by category
- Filter by destination
- Filter by verified status

**Bookings**:
- Search by user or service name
- Filter by status
- Filter by date range

**Posts**:
- Search by title or content
- Filter by post type
- Filter by featured/published status

---

## ⚡ Bulk Actions

Available bulk actions:

**Bookings**:
- Confirm multiple bookings
- Complete multiple bookings
- Cancel multiple bookings

**Services**:
- Verify multiple services
- Update availability

**Posts**:
- Feature/unfeature
- Publish/unpublish

**Events**:
- Feature/unfeature

**Partnerships**:
- Activate/deactivate

**Applications**:
- Approve/reject

---

## 🛡️ Best Practices

### Security
1. Change default admin password immediately
2. Create separate admin accounts for team members
3. Use strong passwords
4. Review user permissions regularly

### Data Management
1. Verify business partners before approving
2. Review services before marking as verified
3. Monitor bookings for suspicious activity
4. Moderate community content appropriately

### Content Quality
1. Feature high-quality posts
2. Ensure service descriptions are accurate
3. Verify business documents thoroughly
4. Keep destination information up-to-date

### Performance
1. Archive old bookings periodically
2. Remove inactive partnerships
3. Clean up expired sponsored content
4. Monitor database size

---

## 🆘 Troubleshooting

### Can't login to admin
- Check username and password
- Ensure user has `is_staff` and `is_superuser` flags
- Check if account is active

### Changes not saving
- Check for validation errors at top of page
- Ensure all required fields are filled
- Check file size limits for uploads

### Bulk actions not working
- Ensure items are selected
- Check if action is available for selected items
- Review any error messages

---

## 📞 Support

For technical issues or questions:
1. Check this guide
2. Review API documentation
3. Check Django admin logs
4. Contact development team

---

**Admin Panel**: http://localhost:8000/admin
**API Docs**: http://localhost:8000/api/docs
