# Buyorama Backoffice API Documentation

## Quick Start

### Running the Backend Server
```bash
cd buyorama_backoffice
npm install
npm run dev
```

Server will start on **http://localhost:3011**

### Database Configuration
**Current Development Setup:** SQLite (in-memory)
- For production: Modify `src/app.module.ts` to use PostgreSQL configuration in `.env`
- Database credentials are configured in `.env` file

### Server URLs

#### Backend API (Backoffice)
```
http://localhost:3011
```

#### Frontend Applications
- **Main Site (Buyorama):** http://localhost:3010
- **Admin Login:** http://localhost:3010/admin-backoffice

## Authentication
Some endpoints may require JWT token in the `Authorization` header:
```
Authorization: Bearer <authToken>
```

---

## 🔐 Users API

### 1. Login (Get Authentication Token)
**Endpoint:** `POST /api/users/login`

**Description:** Authenticate user and get JWT token

**Request:**
```bash
curl -X POST http://localhost:3011/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response (Success):**
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "message": "Login successful"
}
```

---

### 2. Get All Users
**Endpoint:** `POST /api/users/list`

**Description:** Retrieve all users with pagination and filtering

**Request:**
```bash
curl -X POST http://localhost:3011/api/users/list \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 10,
    "offset": 0,
    "status": 1
  }'
```

**Query Parameters:**
- `limit` (optional): Records per page (default: 10)
- `offset` (optional): Number of records to skip (default: 0)
- `status` (optional): Filter by status (0=inactive, 1=active)

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "user@example.com",
      "status": 1,
      "createdAt": "2025-07-15T19:00:00.000Z",
      "updatedAt": "2025-07-15T19:00:00.000Z"
    }
  ],
  "total": 1,
  "message": "Users retrieved successfully"
}
```

---

### 3. Create New User
**Endpoint:** `POST /api/users/create`

**Description:** Create a new user (password is encrypted)

**Request:**
```bash
curl -X POST http://localhost:3011/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response (Success):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "status": 1,
    "createdAt": "2025-07-15T19:00:00.000Z",
    "updatedAt": "2025-07-15T19:00:00.000Z"
  },
  "message": "User created successfully"
}
```

---

### 4. Update User
**Endpoint:** `POST /api/users/update`

**Description:** Update user details

**Request:**
```bash
curl -X POST http://localhost:3011/api/users/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "newPassword123"
  }'
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "status": 1,
    "createdAt": "2025-07-15T19:00:00.000Z",
    "updatedAt": "2025-07-15T19:05:00.000Z"
  },
  "message": "User updated successfully"
}
```

---

### 5. Update User Status
**Endpoint:** `POST /api/users/update-status`

**Description:** Activate or deactivate user (0=inactive, 1=active)

**Request:**
```bash
curl -X POST http://localhost:3011/api/users/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": 0
  }'
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "status": 0,
    "createdAt": "2025-07-15T19:00:00.000Z",
    "updatedAt": "2025-07-15T19:05:00.000Z"
  },
  "message": "User status updated successfully"
}
```

---

## 🏷️ Brands API

### 1. Get All Brands
**Endpoint:** `POST /api/brands/list`

**Description:** Retrieve all brands with pagination and filtering

**Request:**
```bash
curl -X POST http://localhost:3011/api/brands/list \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 10,
    "offset": 0,
    "status": 1
  }'
```

**Query Parameters:**
- `limit` (optional): Records per page (default: 10)
- `offset` (optional): Number of records to skip (default: 0)
- `status` (optional): Filter by status (0=inactive, 1=active)

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "brandName": "Nike",
      "slug": "nike",
      "logo": "https://example.com/nike.png",
      "status": 1,
      "createdAt": "2025-07-15T19:00:00.000Z",
      "updatedAt": "2025-07-15T19:00:00.000Z"
    }
  ],
  "total": 1,
  "message": "Brands retrieved successfully"
}
```

---

### 2. Create Brand
**Endpoint:** `POST /api/brands/create`

**Description:** Create a new brand

**Request:**
```bash
curl -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Nike",
    "slug": "nike",
    "logo": "https://example.com/nike.png"
  }'
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "brandName": "Nike",
    "slug": "nike",
    "logo": "https://example.com/nike.png",
    "status": 1,
    "createdAt": "2025-07-15T19:00:00.000Z",
    "updatedAt": "2025-07-15T19:00:00.000Z"
  },
  "message": "Brand created successfully"
}
```

---

### 3. Update Brand
**Endpoint:** `POST /api/brands/update`

**Description:** Update brand details

**Request:**
```bash
curl -X POST http://localhost:3011/api/brands/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "brandName": "Nike Inc",
    "slug": "nike-inc",
    "logo": "https://example.com/nike-new.png"
  }'
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "brandName": "Nike Inc",
    "slug": "nike-inc",
    "logo": "https://example.com/nike-new.png",
    "status": 1,
    "createdAt": "2025-07-15T19:00:00.000Z",
    "updatedAt": "2025-07-15T19:05:00.000Z"
  },
  "message": "Brand updated successfully"
}
```

---

### 4. Update Brand Status
**Endpoint:** `POST /api/brands/update-status`

**Description:** Activate or deactivate brand (0=inactive, 1=active)

**Request:**
```bash
curl -X POST http://localhost:3011/api/brands/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "status": 0
  }'
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "brandName": "Nike",
    "slug": "nike",
    "logo": "https://example.com/nike.png",
    "status": 0,
    "createdAt": "2025-07-15T19:00:00.000Z",
    "updatedAt": "2025-07-15T19:05:00.000Z"
  },
  "message": "Brand status updated successfully"
}
```

---

## ⚙️ Site Settings API

### 1. Get Site Settings
**Endpoint:** `POST /api/settings/get`

**Description:** Retrieve current site settings

**Request:**
```bash
curl -X POST http://localhost:3011/api/settings/get \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "siteName": "Buyorama",
    "siteLogo": "https://example.com/logo.png",
    "tagline": "Find Amazing Deals & Save Big",
    "createdAt": "2025-07-15T19:00:00.000Z",
    "updatedAt": "2025-07-15T19:00:00.000Z"
  },
  "message": "Settings retrieved successfully"
}
```

---

### 2. Update Site Settings
**Endpoint:** `POST /api/settings/update`

**Description:** Update site settings (all fields optional)

**Request:**
```bash
curl -X POST http://localhost:3011/api/settings/update \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "Buyorama Pro",
    "siteLogo": "https://example.com/logo-new.png",
    "tagline": "Best Deals Online!"
  }'
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "siteName": "Buyorama Pro",
    "siteLogo": "https://example.com/logo-new.png",
    "tagline": "Best Deals Online!",
    "createdAt": "2025-07-15T19:00:00.000Z",
    "updatedAt": "2025-07-15T19:05:00.000Z"
  },
  "message": "Settings updated successfully"
}
```

---

## 📊 API Info
**Endpoint:** `GET /api`

**Description:** Get API information and available endpoints

**Request:**
```bash
curl -X GET http://localhost:3011/api
```

**Response:**
```json
{
  "name": "Buyorama Backoffice API",
  "version": "1.0.0",
  "description": "Backend API services for Buyorama admin panel",
  "endpoints": {
    "health": "/api/health",
    "coupons": "/api/coupons",
    "stores": "/api/stores",
    "deals": "/api/deals"
  }
}
```

---

## 🏥 Health Check
**Endpoint:** `GET /api/health`

**Description:** Check API health status

**Request:**
```bash
curl -X GET http://localhost:3011/api/health
```

**Response:**
```json
{
  "message": "Buyorama Backoffice API is running",
  "timestamp": "2025-07-15T19:00:00.000Z",
  "status": "healthy"
}
```

---

## ❌ Error Responses

### Invalid Credentials
```json
{
  "statusCode": 400,
  "message": "Invalid email or password",
  "error": "Bad Request"
}
```

### User Not Found
```json
{
  "statusCode": 404,
  "message": "User with id <uuid> not found",
  "error": "Not Found"
}
```

### Email Already Exists
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

### Account Inactive
```json
{
  "statusCode": 400,
  "message": "User account is inactive",
  "error": "Bad Request"
}
```

---

## 🔑 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Status field: 0 = inactive, 1 = active
- Passwords are encrypted using bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- All text searches are case-insensitive
- Pagination: Use `limit` and `offset` for large datasets

---

## 🚀 Quick Start

### Start the Backend API
```bash
cd buyorama_backoffice
npm run dev  # Runs on port 3001
```

### Start the Frontend
```bash
cd frontPanel
npm run dev  # Runs on port 3010
```

### Access Admin Login
```
http://localhost:3010/admin-backoffice
```

### Test API Endpoints
Use the curl commands provided in each section to test the APIs.

---

**Last Updated:** 2025-07-15
