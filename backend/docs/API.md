# ABIT Solutions - API Documentation v2.0

Complete REST API documentation for the ABIT Solutions platform.

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.abit.solutions/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "full_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful",
  "user_id": "uuid"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "NewSecurePass@123"
}
```

---

## Profile Endpoints

### Get My Profile
```http
GET /api/profiles/me
Authorization: Bearer <token>
```

### Update My Profile
```http
PUT /api/profiles/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "company_name": "My Company",
  "country": "United States",
  "timezone": "America/New_York"
}
```

---

## Service Endpoints

### Get All Services (Public)
```http
GET /api/services
```

### Get Service by Slug (Public)
```http
GET /api/services/:slug
```

---

## Category Endpoints

### Get All Categories (Public)
```http
GET /api/categories
```

### Get Category by Slug (Public)
```http
GET /api/categories/:slug
```

### Admin: Get All Categories
```http
GET /api/categories/admin/all
Authorization: Bearer <admin_token>
```

### Admin: Create Category
```http
POST /api/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Web Development",
  "slug": "web-development",
  "description": "Custom websites",
  "icon": "Globe",
  "base_delivery_days": 30,
  "deposit_percentage": 30
}
```

### Admin: Update Category
```http
PUT /api/categories/:id
Authorization: Bearer <admin_token>
```

### Admin: Delete Category
```http
DELETE /api/categories/:id
Authorization: Bearer <admin_token>
```

---

## Tier Endpoints

### Get All Tiers (Public)
```http
GET /api/tiers
```

**Response:**
```json
[
  {
    "id": "uuid",
    "tier_key": "basic",
    "name": "Basic",
    "description": "Economy option",
    "icon": "Star",
    "color_from": "slate-400",
    "color_to": "slate-500",
    "features": ["Standard delivery", "Basic support"],
    "price_multiplier": 1.00,
    "delivery_multiplier": 1.50
  }
]
```

### Get Tier by Key (Public)
```http
GET /api/tiers/:key
```

### Admin: CRUD Operations
```http
GET    /api/tiers/admin/all
POST   /api/tiers
PUT    /api/tiers/:id
DELETE /api/tiers/:id
```

---

## Project Endpoints

### Get My Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

### Get Project by ID
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

### Create Project (Approved clients only)
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Project",
  "description": "Project description",
  "category_id": "uuid",
  "tier": "normal",
  "total_amount": 5000,
  "deposit_amount": 1500,
  "due_date": "2024-12-31"
}
```

### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
```

---

## Payment Endpoints

### Get My Payments
```http
GET /api/payments
Authorization: Bearer <token>
```

### Create Payment
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_id": "uuid",
  "amount": 1500,
  "payment_type": "credit_card"
}
```

### Process Payment
```http
POST /api/payments/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "payment_id": "uuid",
  "card_number": "4242424242424242",
  "card_holder": "John Doe",
  "cvv": "123",
  "expiry_month": "12",
  "expiry_year": "2025"
}
```

### Admin: Get All Payments
```http
GET /api/payments/admin/all?status=pending&limit=50
Authorization: Bearer <admin_token>
```

### Admin: Get Payment Stats
```http
GET /api/payments/admin/stats
Authorization: Bearer <admin_token>
```

### Admin: Update Payment Status
```http
PUT /api/payments/admin/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed",
  "notes": "Payment verified"
}
```

---

## Support Ticket Endpoints

### Get My Tickets
```http
GET /api/tickets
Authorization: Bearer <token>
```

### Get Ticket by ID
```http
GET /api/tickets/:id
Authorization: Bearer <token>
```

### Create Ticket (Approved clients only)
```http
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Need help with project",
  "description": "Detailed description...",
  "priority": "medium",
  "project_id": "uuid"
}
```

### Add Message to Ticket
```http
POST /api/tickets/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Follow-up message content"
}
```

---

## Blog Endpoints

### Get Published Posts (Public)
```http
GET /api/blog?category=Development&limit=10&offset=0
```

### Get Post by Slug (Public)
```http
GET /api/blog/:slug
```

### Get Categories (Public)
```http
GET /api/blog/categories
```

### Admin: CRUD Operations
```http
GET    /api/blog/admin/all
POST   /api/blog
PUT    /api/blog/:id
DELETE /api/blog/:id
```

---

## Portfolio Endpoints

### Get Active Projects (Public)
```http
GET /api/portfolio?category=E-Commerce&featured=true
```

### Get Project by Slug (Public)
```http
GET /api/portfolio/:slug
```

### Get Categories (Public)
```http
GET /api/portfolio/categories
```

### Admin: CRUD Operations
```http
GET    /api/portfolio/admin/all
POST   /api/portfolio
PUT    /api/portfolio/:id
DELETE /api/portfolio/:id
```

---

## Notification Endpoints

### Get My Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

### Mark All as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer <token>
```

---

## Admin Endpoints

### Dashboard Stats
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

### Profile Management
```http
GET /api/admin/profiles
PUT /api/admin/profiles/:id/status
```

### Service Management
```http
GET    /api/admin/services
POST   /api/admin/services
PUT    /api/admin/services/:id
DELETE /api/admin/services/:id
```

### Project Management
```http
GET /api/admin/projects
PUT /api/admin/projects/:id
```

### Ticket Management
```http
GET /api/admin/tickets
PUT /api/admin/tickets/:id
GET /api/admin/tickets/:id/messages
```

### Role Management
```http
GET    /api/admin/roles/:userId
POST   /api/admin/roles
DELETE /api/admin/roles/:userId/:role
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Login endpoint: 10 attempts per hour per IP

---

## Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "2.0.0",
  "environment": "development"
}
```
