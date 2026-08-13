# API CURL Examples

## 🚀 Quick Start

**Backend API:** `http://localhost:3011`

---

## 👥 USER MANAGEMENT

### 1. Create New User (Add User)

**Endpoint:** `POST /api/users/create`

**Description:** Create a new user account with encrypted password

#### Basic Example
```bash
curl -X POST http://localhost:3011/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Response (Success)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$...", // bcrypt hash
  "status": 1,
  "createdAt": "2026-07-15T20:30:00.000Z",
  "updatedAt": "2026-07-15T20:30:00.000Z"
}
```

#### Response (Duplicate Email)
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

---

### 2. Add Multiple Users (Batch Example)

```bash
# User 1: Admin
curl -X POST http://localhost:3011/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@buyorama.com",
    "password": "AdminPass@123"
  }'

# User 2: Manager
curl -X POST http://localhost:3011/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manager User",
    "email": "manager@buyorama.com",
    "password": "ManagerPass@456"
  }'

# User 3: Editor
curl -X POST http://localhost:3011/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Editor User",
    "email": "editor@buyorama.com",
    "password": "EditorPass@789"
  }'
```

---

### 3. List All Users

**Endpoint:** `POST /api/users/list`

```bash
# Get all users with pagination
curl -X POST http://localhost:3011/api/users/list \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 10,
    "offset": 0
  }'
```

#### Response
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "status": 1,
      "createdAt": "2026-07-15T20:30:00.000Z",
      "updatedAt": "2026-07-15T20:30:00.000Z"
    }
  ],
  "total": 1,
  "message": "Users retrieved successfully"
}
```

---

### 4. Get Active Users Only

```bash
curl -X POST http://localhost:3011/api/users/list \
  -H "Content-Type: application/json" \
  -d '{
    "status": 1,
    "limit": 10,
    "offset": 0
  }'
```

---

### 5. User Login (Get Auth Token)

**Endpoint:** `POST /api/users/login`

```bash
curl -X POST http://localhost:3011/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Response (Success)
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2ODcxODk0NjAsImV4cCI6MTY4Nzc5NDI2MH0.signature",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Login successful"
}
```

---

### 6. Update User

**Endpoint:** `POST /api/users/update`

```bash
curl -X POST http://localhost:3011/api/users/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "password": "NewPassword@123"
  }'
```

---

### 7. Deactivate User

**Endpoint:** `POST /api/users/update-status`

```bash
# Deactivate user (status = 0)
curl -X POST http://localhost:3011/api/users/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": 0
  }'
```

---

## 🏪 BRAND MANAGEMENT

### 1. Create Brand

**Endpoint:** `POST /api/brands/create`

```bash
curl -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Ajio",
    "slug": "ajio-deals",
    "logo": "https://example.com/ajio-logo.png"
  }'
```

#### Response
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440111",
  "brandName": "Ajio",
  "slug": "ajio-deals",
  "logo": "https://example.com/ajio-logo.png",
  "status": 1,
  "createdAt": "2026-07-15T20:35:00.000Z",
  "updatedAt": "2026-07-15T20:35:00.000Z"
}
```

---

### 2. Add Multiple Brands

```bash
# Brand 1: Ajio
curl -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Ajio",
    "slug": "ajio-deals"
  }'

# Brand 2: Amazon
curl -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Amazon",
    "slug": "amazon-deals"
  }'

# Brand 3: Flipkart
curl -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Flipkart",
    "slug": "flipkart-deals"
  }'

# Brand 4: Myntra
curl -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Myntra",
    "slug": "myntra-deals"
  }'

# Brand 5: Meesho
curl -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Meesho",
    "slug": "meesho-deals"
  }'
```

---

### 3. List Brands

**Endpoint:** `POST /api/brands/list`

```bash
curl -X POST http://localhost:3011/api/brands/list \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 20,
    "offset": 0
  }'
```

---

### 4. Update Brand

**Endpoint:** `POST /api/brands/update`

```bash
curl -X POST http://localhost:3011/api/brands/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": "660e8400-e29b-41d4-a716-446655440111",
    "brandName": "Ajio Updated",
    "slug": "ajio-updated",
    "logo": "https://example.com/ajio-new-logo.png"
  }'
```

---

### 5. Deactivate Brand

**Endpoint:** `POST /api/brands/update-status`

```bash
curl -X POST http://localhost:3011/api/brands/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "id": "660e8400-e29b-41d4-a716-446655440111",
    "status": 0
  }'
```

---

## ⚙️ SITE SETTINGS

### 1. Get Site Settings

**Endpoint:** `POST /api/settings/get`

```bash
curl -X POST http://localhost:3011/api/settings/get
```

#### Response
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440222",
  "siteName": "Buyorama",
  "siteLogo": "https://example.com/logo.png",
  "tagline": "Best Deals & Offers",
  "createdAt": "2026-07-15T20:40:00.000Z",
  "updatedAt": "2026-07-15T20:40:00.000Z"
}
```

---

### 2. Update Site Settings

**Endpoint:** `POST /api/settings/update`

```bash
curl -X POST http://localhost:3011/api/settings/update \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "Buyorama - Best Deals Platform",
    "siteLogo": "https://example.com/buyorama-logo.png",
    "tagline": "Your one-stop shop for amazing deals"
  }'
```

---

## 🔐 Authentication

### Using Auth Token in Headers

Once you have an `authToken` from login, use it in requests:

```bash
curl -X POST http://localhost:3011/api/users/list \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "limit": 10,
    "offset": 0
  }'
```

---

## 📊 Complete Test Workflow

```bash
#!/bin/bash

# 1. Create first user (Admin)
echo "Creating admin user..."
ADMIN=$(curl -s -X POST http://localhost:3011/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@buyorama.com",
    "password": "Admin@123"
  }')

echo "Admin created: $ADMIN"
echo ""

# 2. Create brands
echo "Creating brands..."
curl -s -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{"brandName": "Ajio", "slug": "ajio"}'

curl -s -X POST http://localhost:3011/api/brands/create \
  -H "Content-Type: application/json" \
  -d '{"brandName": "Amazon", "slug": "amazon"}'

echo "Brands created"
echo ""

# 3. List all users
echo "Listing all users..."
curl -s -X POST http://localhost:3011/api/users/list \
  -H "Content-Type: application/json" \
  -d '{"limit": 10, "offset": 0}'

echo ""

# 4. List all brands
echo "Listing all brands..."
curl -s -X POST http://localhost:3011/api/brands/list \
  -H "Content-Type: application/json" \
  -d '{"limit": 20, "offset": 0}'
```

Save as `test-api.sh` and run: `bash test-api.sh`

---

## 📝 CONTENT MANAGEMENT

### 1. Create New Content

**Endpoint:** `POST /api/content/create`

**Description:** Create a new content item with brand reference

```bash
curl -X POST http://localhost:3011/api/content/create \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Summer Sale 2026",
    "description": "Enjoy amazing discounts up to 70% off on summer collection!",
    "image_path": "https://example.com/image.jpg",
    "status": 1
  }'
```

#### Response (Success)
```json
{
  "statusCode": 201,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "brand_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Summer Sale 2026",
    "description": "Enjoy amazing discounts up to 70% off on summer collection!",
    "image_path": "https://example.com/image.jpg",
    "status": 1,
    "created_at": "2026-07-15T20:30:00.000Z",
    "updated_at": "2026-07-15T20:30:00.000Z"
  },
  "message": "Content created successfully"
}
```

---

### 2. Get All Published Content

**Endpoint:** `POST /api/content/getAllListing`

**Description:** Get all published content items with pagination

```bash
curl -X POST http://localhost:3011/api/content/getAllListing \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 20,
    "offset": 0
  }'
```

#### Response
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "brand_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Summer Sale 2026",
      "description": "Enjoy amazing discounts up to 70% off on summer collection!",
      "image_path": "https://example.com/image.jpg",
      "status": 1,
      "created_at": "2026-07-15T20:30:00.000Z",
      "updated_at": "2026-07-15T20:30:00.000Z"
    }
  ],
  "total": 1,
  "message": "Content listed successfully"
}
```

---

### 3. Get Content by Brand

**Endpoint:** `POST /api/content/getContentByBrand`

**Description:** Get all published content for a specific brand

```bash
curl -X POST http://localhost:3011/api/content/getContentByBrand \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "550e8400-e29b-41d4-a716-446655440000",
    "limit": 20,
    "offset": 0
  }'
```

---

### 4. Update Content

**Endpoint:** `POST /api/content/update`

**Description:** Update content details

```bash
curl -X POST http://localhost:3011/api/content/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Updated Title",
    "description": "Updated description",
    "image_path": "https://example.com/new-image.jpg"
  }'
```

---

### 5. Update Content Status

**Endpoint:** `POST /api/content/update-status`

**Description:** Publish or unpublish content

```bash
# Publish (status: 1)
curl -X POST http://localhost:3011/api/content/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": 1
  }'

# Unpublish (status: 0)
curl -X POST http://localhost:3011/api/content/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": 0
  }'
```

---

### 6. Delete Content

**Endpoint:** `POST /api/content/delete`

**Description:** Delete a content item

```bash
curl -X POST http://localhost:3011/api/content/delete \
  -H "Content-Type: application/json" \
  -d '{
    "id": "660e8400-e29b-41d4-a716-446655440001"
  }'
```

---

### 7. Get All Content (Including Unpublished)

**Endpoint:** `POST /api/content/getAll`

**Description:** Get all content items regardless of status

```bash
curl -X POST http://localhost:3011/api/content/getAll \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 20,
    "offset": 0
  }'
```

---

## ✅ Testing Checklist

### Users
- [ ] User creation works
- [ ] Duplicate email prevention works
- [ ] User login returns auth token
- [ ] User list returns data with pagination

### Brands
- [ ] Brand creation works
- [ ] Brand slug is unique
- [ ] Brand status updates work
- [ ] Brand list returns data with pagination

### Content
- [ ] Content creation works
- [ ] Content requires valid brand_id
- [ ] Get all published content works
- [ ] Get content by brand works
- [ ] Update content works
- [ ] Update content status works (publish/unpublish)
- [ ] Delete content works
- [ ] Pagination works for all endpoints

