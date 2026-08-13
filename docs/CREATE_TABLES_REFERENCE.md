# Database CREATE TABLE Statements

## 1️⃣ USERS TABLE

### Purpose
Store user accounts for admin/backoffice access with authentication details.

### SQL Create Statement
```sql
CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  "status" smallint NOT NULL DEFAULT (1),
  "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
  "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
);

CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email");
```

### Field Details

| Field | Type | Constraints | Description |
|-------|------|-----------|---|
| id | varchar | PRIMARY KEY | UUID identifier |
| name | varchar(255) | NOT NULL | User's full name |
| email | varchar(255) | NOT NULL, UNIQUE | Email address (indexed for fast lookup) |
| password | varchar(255) | NOT NULL | Bcrypt encrypted password |
| status | smallint | DEFAULT 1 | 0=inactive, 1=active |
| createdAt | datetime | DEFAULT NOW | Creation timestamp |
| updatedAt | datetime | DEFAULT NOW | Last update timestamp |

### Indexes
- `email` - For fast user lookup by email

### Unique Constraints
- `email` - No duplicate emails allowed

---

## 2️⃣ BRANDS TABLE

### Purpose
Store brand/store information for the deals and coupons platform.

### SQL Create Statement
```sql
CREATE TABLE IF NOT EXISTS "brands" (
  "id" varchar PRIMARY KEY NOT NULL,
  "brandName" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "logo" text,
  "status" smallint NOT NULL DEFAULT (1),
  "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
  "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT "UQ_6aac8072508b60a2c4173504a7b" UNIQUE ("brandName"),
  CONSTRAINT "UQ_b15428f362be2200922952dc268" UNIQUE ("slug")
);

CREATE INDEX "IDX_b15428f362be2200922952dc26" ON "brands" ("slug");
```

### Field Details

| Field | Type | Constraints | Description |
|-------|------|-----------|---|
| id | varchar | PRIMARY KEY | UUID identifier |
| brandName | varchar(255) | NOT NULL, UNIQUE | Brand name (e.g., "Ajio", "Amazon") |
| slug | varchar(255) | NOT NULL, UNIQUE, INDEXED | URL slug (e.g., "ajio-deals") |
| logo | text | NULLABLE | Logo URL or base64 encoded image |
| status | smallint | DEFAULT 1 | 0=inactive, 1=active |
| createdAt | datetime | DEFAULT NOW | Creation timestamp |
| updatedAt | datetime | DEFAULT NOW | Last update timestamp |

### Indexes
- `slug` - For fast brand lookup by URL slug

### Unique Constraints
- `brandName` - No duplicate brand names
- `slug` - No duplicate slugs

---

## 3️⃣ SITE_SETTINGS TABLE

### Purpose
Store global website configuration and settings.

### SQL Create Statement
```sql
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" varchar PRIMARY KEY NOT NULL,
  "siteName" varchar(255) NOT NULL,
  "siteLogo" text,
  "tagline" text,
  "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
  "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
);
```

### Field Details

| Field | Type | Constraints | Description |
|-------|------|-----------|---|
| id | varchar | PRIMARY KEY | UUID identifier |
| siteName | varchar(255) | NOT NULL | Website name (e.g., "Buyorama") |
| siteLogo | text | NULLABLE | Logo URL or base64 encoded image |
| tagline | text | NULLABLE | Site tagline/description |
| createdAt | datetime | DEFAULT NOW | Creation timestamp |
| updatedAt | datetime | DEFAULT NOW | Last update timestamp |

### Indexes
- None (settings are usually small table, typically only 1 record)

---

## Summary Table

| Table | Records | Indexes | Unique Constraints |
|-------|---------|---------|---|
| users | Multiple | email | email |
| brands | Multiple | slug | brandName, slug |
| site_settings | 1 (typically) | None | None |

---

## PostgreSQL Equivalents

If migrating to PostgreSQL, use these CREATE TABLE statements:

### USERS (PostgreSQL)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  status SMALLINT NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### BRANDS (PostgreSQL)
```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "brandName" VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo TEXT,
  status SMALLINT NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brands_slug ON brands(slug);
```

### SITE_SETTINGS (PostgreSQL)
```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "siteName" VARCHAR(255) NOT NULL,
  "siteLogo" TEXT,
  tagline TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## Notes

1. **UUIDs**: All IDs are universally unique identifiers
2. **Status Field**: 
   - `0` = Inactive/Disabled
   - `1` = Active/Enabled (default)
3. **Passwords**: Always stored as bcrypt hashes, never plaintext
4. **Timestamps**: Automatically set by the database
5. **Nullable Fields**: Only `logo` (brands) and `siteLogo`, `tagline` (settings) are nullable
6. **Indexes**: Used for frequently queried fields (email, slug) for performance
7. **Constraints**: Enforce data uniqueness where required

