# ABIT Solutions - Database Files

This folder contains all database schemas and seed data for the ABIT Solutions platform.

## File Structure

```
database/
├── mysql_schema.sql       # Complete MySQL schema (for XAMPP)
├── mysql_seed.sql         # MySQL seed data
├── postgresql_schema.sql  # PostgreSQL schema (Supabase compatible)
├── postgresql_seed.sql    # PostgreSQL seed data
├── schema.sql             # Legacy MySQL schema
└── seed.sql               # Legacy seed data
```

## MySQL Setup (XAMPP)

### Step 1: Open phpMyAdmin or MySQL CLI

```bash
# Using MySQL command line
mysql -u root -p
```

### Step 2: Run Schema File

```sql
-- In phpMyAdmin: Import > Browse > mysql_schema.sql
-- Or in CLI:
SOURCE /path/to/backend/database/mysql_schema.sql;
```

### Step 3: Run Seed Data

```sql
SOURCE /path/to/backend/database/mysql_seed.sql;
```

### Quick Setup (Single Command)

```bash
cd backend
mysql -u root -p < database/mysql_schema.sql
mysql -u root -p abit_solutions < database/mysql_seed.sql
```

## PostgreSQL Setup

### Step 1: Create Database

```bash
createdb abit_solutions
# Or in psql:
# CREATE DATABASE abit_solutions;
```

### Step 2: Run Schema

```bash
psql -d abit_solutions -f database/postgresql_schema.sql
```

### Step 3: Run Seed Data

```bash
psql -d abit_solutions -f database/postgresql_seed.sql
```

## Database Tables

| Table | Description |
|-------|-------------|
| `users` | User authentication data |
| `profiles` | User profile information |
| `user_roles` | User role assignments |
| `services` | Available services |
| `project_categories` | Project type categories |
| `project_tiers` | Service level tiers (Basic/Normal/Premium) |
| `projects` | Client projects |
| `payments` | Payment records |
| `support_tickets` | Support ticket system |
| `ticket_messages` | Ticket conversations |
| `notifications` | User notifications |
| `blog_posts` | Blog content |
| `portfolio_projects` | Showcase projects |

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@abit.solutions | Admin@123 |
| Client | demo@example.com | Client@123 |

⚠️ **IMPORTANT**: Change these credentials immediately in production!

## ENUM Types

### MySQL
- Uses inline ENUM in column definitions

### PostgreSQL
- `app_role`: admin, client
- `registration_status`: pending, approved, rejected, suspended
- `project_status`: pending, in_progress, completed, cancelled
- `project_tier`: basic, normal, premium
- `ticket_priority`: low, medium, high, urgent
- `ticket_status`: open, in_progress, resolved, closed
- `payment_status`: pending, completed, failed, rejected
- `payment_type`: bank_transfer, credit_card, paypal, cash, crypto, other

## Migrations

For schema changes, create new migration files in the `migrations/` folder with format:
```
YYYYMMDD_description.sql
```

## Troubleshooting

### MySQL Connection Issues
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### PostgreSQL Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
psql -l
```
