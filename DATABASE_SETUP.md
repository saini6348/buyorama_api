# Database Setup Guide

## Current Configuration: SQLite

The application is currently configured to use **SQLite** for development. This allows the server to run without requiring a PostgreSQL installation.

### SQLite Configuration

- **Type:** SQLite (file-based database)
- **File Location:** `healthelink_buyorama_dev.sqlite` (in project root)
- **Auto-Create:** Tables are automatically created when the app starts (via `synchronize: true`)
- **Persistent:** Data is saved to the SQLite file between app restarts

### Running with SQLite

```bash
npm run dev
```

Tables will be created automatically on first run.

---

## Switching to PostgreSQL

To use PostgreSQL instead of SQLite, follow these steps:

### 1. Ensure PostgreSQL is Running

```bash
# Start PostgreSQL service
brew services start postgresql@18

# Or start manually
pg_ctl -D /usr/local/var/postgres start
```

### 2. Create the Database

```bash
psql -U postgres -c "CREATE DATABASE healthelink_buyorama_dev;"
```

### 3. Update the Configuration

Edit `src/app.module.ts` and replace the TypeOrmModule configuration:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres_admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'healthelink_buyorama_dev',
  entities: [Brand, User, SiteSettings],
  synchronize: true,
  logging: false,
})
```

### 4. Update .env File

Ensure your `.env` file has the correct database credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthelink_buyorama_dev
DB_USERNAME=postgres_admin
DB_PASSWORD=YkZUM-i2NRDTs6?}UnOTAr9_
```

### 5. Run the Application

```bash
npm run dev
```

Tables will be created automatically when the app starts.

---

## Database Entities

The following entities are automatically created:

### User Entity
- `id` (UUID, primary key)
- `name` (varchar 255)
- `email` (varchar 255, unique)
- `password` (varchar 255, encrypted)
- `status` (0=inactive, 1=active, default=1)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Brand Entity
- `id` (UUID, primary key)
- `brandName` (varchar 255, unique)
- `slug` (varchar 255, unique, indexed)
- `logo` (text, nullable)
- `status` (0=inactive, 1=active, default=1)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Site Settings Entity
- `id` (UUID, primary key)
- `siteName` (varchar 255)
- `siteLogo` (text, nullable)
- `tagline` (text, nullable)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

---

## Troubleshooting

### Tables Not Created
- Ensure `synchronize: true` is set in TypeOrmModule configuration
- Check that the database connection is successful
- Review the server logs for any TypeORM errors

### Connection Refused
- Verify PostgreSQL is running
- Check if the database exists: `psql -l`
- Verify credentials in `.env` file
- Test connection: `psql -U postgres -d healthelink_buyorama_dev`

### Permission Denied
- Ensure PostgreSQL user has proper permissions
- Try: `psql -U postgres -c "GRANT ALL ON healthelink_buyorama_dev TO postgres;"`
