-- ============================================================================
-- Buyorama Database Schema - All CREATE TABLE Statements
-- ============================================================================
-- Database: healthelink_buyorama_dev
-- Generated: 2026-07-15
-- ============================================================================

-- ============================================================================
-- TABLE: users
-- Description: User accounts for admin/backend access
-- ============================================================================
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

-- Index on email for fast lookups
CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email");

-- ============================================================================
-- TABLE: brands
-- Description: Brand/Store information
-- ============================================================================
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

-- Index on slug for fast lookups
CREATE INDEX "IDX_b15428f362be2200922952dc26" ON "brands" ("slug");

-- ============================================================================
-- TABLE: site_settings
-- Description: Global site configuration and settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" varchar PRIMARY KEY NOT NULL,
  "siteName" varchar(255) NOT NULL,
  "siteLogo" text,
  "tagline" text,
  "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
  "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- FIELD DESCRIPTIONS
-- ============================================================================

-- USERS TABLE
-- id           : UUID (Primary Key)
-- name         : User's full name (varchar 255)
-- email        : User's email address (varchar 255, UNIQUE)
-- password     : Encrypted password (varchar 255, bcrypt hash)
-- status       : Account status (0=inactive, 1=active, default=1)
-- createdAt    : Record creation timestamp
-- updatedAt    : Last update timestamp

-- BRANDS TABLE
-- id           : UUID (Primary Key)
-- brandName    : Brand/Store name (varchar 255, UNIQUE)
-- slug         : URL-friendly slug (varchar 255, UNIQUE, INDEXED)
-- logo         : Logo URL or base64 (text, nullable)
-- status       : Brand status (0=inactive, 1=active, default=1)
-- createdAt    : Record creation timestamp
-- updatedAt    : Last update timestamp

-- SITE_SETTINGS TABLE
-- id           : UUID (Primary Key)
-- siteName     : Website name (varchar 255)
-- siteLogo     : Site logo URL or base64 (text, nullable)
-- tagline      : Site tagline/description (text, nullable)
-- createdAt    : Record creation timestamp
-- updatedAt    : Last update timestamp

-- ============================================================================
-- CONSTRAINTS
-- ============================================================================

-- UNIQUE CONSTRAINTS
-- users.email         - No two users can have the same email
-- brands.brandName    - No two brands can have the same name
-- brands.slug         - No two brands can have the same slug

-- INDEXES (for performance)
-- users(email)        - Fast lookup by email
-- brands(slug)        - Fast lookup by slug

-- ============================================================================
-- DEFAULT VALUES
-- ============================================================================
-- status          : 1 (active by default)
-- createdAt       : Current timestamp
-- updatedAt       : Current timestamp

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. All timestamps are automatically set by the database
-- 2. Status field: 0 = inactive, 1 = active
-- 3. Passwords are stored as bcrypt hashes (never plaintext)
-- 4. IDs are UUIDs (Universal Unique Identifiers)
-- 5. email and slug fields are indexed for performance
-- 6. SQLite syntax used (compatible with PostgreSQL with minor changes)
