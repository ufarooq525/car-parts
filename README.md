# Car Parts Online Store

A full-stack online car parts store with multi-role authentication, supplier management, and an admin dashboard.

## Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | React 19, TypeScript, React Router 7, CSS Modules   |
| Backend    | Laravel 13, PHP 8.3                                 |
| Database   | MySQL 8                                             |
| Auth       | Laravel Sanctum (token-based) + Spatie Permission   |
| Icons      | react-icons (Feather icons)                         |
| HTTP       | Axios                                               |
| Toasts     | react-hot-toast                                     |

## Architecture

### Backend (Modular Laravel)

```
backend/app/Modules/
  Auth/          - Login, Register, AuthResource
  Category/      - Category CRUD
  Order/         - Order management
  Product/       - Product CRUD with vehicle compatibility
  Supplier/      - Supplier CRUD, registration, approval workflow, portal
  User/          - User management (admin only)
  Vehicle/       - Vehicle make/model/year management
  MarginRule/    - Dynamic pricing margin rules
```

Each module follows the pattern:
- **Controllers/** - HTTP request handling
- **Models/** - Eloquent models
- **Repositories/** - Data access layer (extends BaseRepository)
- **Actions/** - Single-responsibility business logic
- **Requests/** - Form validation
- **Resources/** - API response transformation
- **Routes/** - Module-specific API routes
- **Providers/** - Module service provider (auto-registered)

### Frontend (React + TypeScript)

```
frontend/src/
  api/            - Axios API client functions
  components/     - Reusable UI components (Button, Input, Modal, Table, etc.)
  components/Layout/ - AdminLayout, SupplierLayout, StorefrontLayout
  contexts/       - React Context providers (AuthContext)
  pages/          - Page components organized by section
  types/          - TypeScript interfaces
```

## Roles & Permissions

| Role     | Access                                    |
| -------- | ----------------------------------------- |
| admin    | Full access to everything                 |
| staff    | Products, Categories, Orders, Suppliers, Vehicles, Margin Rules |
| supplier | Own portal: dashboard, products, sync logs, feed settings |
| customer | Storefront browsing and ordering          |

Managed via **Spatie Laravel Permission** package with role-based middleware on all API routes.

## Supplier Approval Workflow

```
New Registration --> [pending] --> Admin reviews --> [under_review]
                                                       |
                                          +-----------+----------+
                                          |                      |
                                     [approved]             [rejected]
                                     (is_active=true)       (with reason)
```

- Suppliers register via a 3-step form (Account -> Company -> Feed Setup)
- Admin reviews applications at `/admin/supplier-approvals`
- Approved suppliers can manage their feed settings
- Rejected suppliers see the rejection reason on their dashboard

## Setup Instructions

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 18+
- MySQL 8
- Laragon (recommended) or any LAMP/LEMP stack

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure .env with your database credentials
# DB_DATABASE=car_parts
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations and seed data
php artisan migrate:fresh --seed

# Start the server
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend runs on `http://localhost:3000` and the backend API on `http://localhost:8000`.

## Test Accounts

After running `php artisan migrate:fresh --seed`, the following accounts are available:

### Admin & Staff

| Role  | Email              | Password | Access        |
| ----- | ------------------ | -------- | ------------- |
| Admin | admin@carparts.com | password | `/admin`      |
| Staff | staff@carparts.com | password | `/admin`      |

### Customers

| Email                   | Password |
| ----------------------- | -------- |
| customer1@example.com   | password |
| customer2@example.com   | password |
| customer3@example.com   | password |
| customer4@example.com   | password |
| customer5@example.com   | password |

### Suppliers (various approval states)

| Email                        | Password | Status       | Company               |
| ---------------------------- | -------- | ------------ | --------------------- |
| supplier1@deepcar.eu         | password | approved     | DeepCar Parts         |
| supplier2@nlparts.eu         | password | approved     | NL Parts Europe       |
| info@turkparts.com           | password | pending      | TurkParts Intl        |
| contact@europartsexpress.fr  | password | under_review | EuroParts Express     |
| info@cheapparts.xyz          | password | rejected     | CheapParts Co.        |

## API Endpoints

### Public
- `POST /api/login` - User login
- `POST /api/register` - Customer registration
- `POST /api/supplier/register` - Supplier registration

### Supplier Portal (auth + role:supplier)
- `GET /api/supplier/dashboard` - Dashboard stats
- `GET /api/supplier/products` - Own products list
- `GET /api/supplier/sync-logs` - Sync history
- `PUT /api/supplier/feed` - Update feed settings
- `PUT /api/supplier/profile` - Update company profile

### Admin - Supplier Approvals (auth + role:admin)
- `GET /api/admin/supplier-approvals` - Approval queue
- `POST /api/admin/supplier-approvals/{id}/under-review` - Mark under review
- `POST /api/admin/supplier-approvals/{id}/approve` - Approve
- `POST /api/admin/supplier-approvals/{id}/reject` - Reject

### Admin - CRUD Resources (auth + role:admin|staff)
- `/api/admin/products` - Products CRUD
- `/api/admin/categories` - Categories CRUD
- `/api/admin/suppliers` - Suppliers CRUD
- `/api/admin/vehicles` - Vehicles CRUD
- `/api/admin/orders` - Orders management
- `/api/admin/margin-rules` - Margin rules CRUD

### Admin - Users (auth + role:admin)
- `/api/admin/users` - User management

## Features Implemented

- [x] Multi-role authentication (admin, staff, customer, supplier)
- [x] Admin dashboard with sidebar navigation
- [x] Product management with vehicle compatibility
- [x] Category management (hierarchical)
- [x] Supplier management with CRUD
- [x] Supplier registration (3-step form)
- [x] Supplier approval workflow (pending/under_review/approved/rejected)
- [x] Supplier portal (dashboard, products, sync logs, settings)
- [x] Order management
- [x] Vehicle make/model/year management
- [x] Dynamic margin rules
- [x] User management (admin only)
- [x] Dark/Light theme toggle
- [x] Responsive design (mobile sidebar)
- [x] Role-based route protection (frontend + backend)
- [x] Toast notifications
- [x] Pagination, search, and filtering

## Project Structure

```
car-parts/
  backend/               - Laravel API
    app/
      Models/            - User model (shared)
      Modules/           - Feature modules
    config/
    database/
      migrations/
      seeders/
    routes/
  frontend/              - React SPA
    src/
      api/
      components/
      contexts/
      pages/
      types/
  .claude/
    skills/              - Claude Code AI skills for development
```
