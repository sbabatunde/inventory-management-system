# Inventory & Equipment Release Management System

A modular inventory and equipment lifecycle management platform built with **Laravel 13**, **React 18**, and **TypeScript**.

The system is designed for organizations managing inventory across multiple stores and operational locations. It provides end-to-end visibility from procurement and goods receipt through stock movement, equipment release, asset assignment, and field deployment, with CRM integration, approval workflows, audit trails, and role-based access control.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.3%2B-purple.svg)
![Laravel](https://img.shields.io/badge/Laravel-13.x-red.svg)
![React](https://img.shields.io/badge/React-18.x-cyan.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## Table of Contents

- [Overview](#overview)
- [Core Capabilities](#core-capabilities)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Application Modules](#application-modules)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Support](#support)
- [Roadmap](#roadmap)

---

## Overview

The Inventory & Equipment Release Management System addresses the operational challenges of managing equipment and inventory across multiple stores, branches, and points of presence (POPs).

It centralizes inventory operations and connects them with procurement, asset management, equipment release workflows, and an external CRM system.

### Key Objectives

- Maintain accurate inventory balances across multiple locations.
- Control and track stock movements and transfers.
- Standardize equipment release and approval workflows.
- Maintain complete auditability of operational transactions.
- Synchronize relevant information with the CRM.
- Protect sensitive operations through role- and permission-based access control.
- Support controlled offline/manual entry with subsequent reconciliation.

### Core Benefits

| Area | Benefit |
|---|---|
| Inventory | Real-time visibility of stock across multiple stores |
| Operations | Controlled release workflows for installations and maintenance |
| Governance | Complete audit history for critical activities |
| Integration | CRM synchronization for jobs, tickets, and users |
| Security | RBAC, granular permissions, and segregation of duties |
| Resilience | Queue-based integration and circuit-breaker handling |
| Reporting | Inventory, cost, movement, supplier, and low-stock reporting |

---

## Core Capabilities

### Inventory Management

- Multi-store inventory management for HQ, branches, and POP locations.
- Serialized and non-serialized inventory.
- Real-time stock balances.
- Inter-store stock transfers.
- Stock adjustments with approval workflows.
- Low-stock alerts and reorder levels.
- Complete stock movement history.

### Equipment Release Management

Supports three release categories:

- Installation
- Maintenance
- Other

Release forms support a controlled lifecycle:

```text
Draft → Approved → Dispatched → Completed
```

Additional capabilities include:

- CRM Job Order and Ticket integration.
- E-signature support.
- Manual/offline entry with reconciliation.
- Automatic stock deduction on dispatch.
- PDF generation for signed release forms.

### Asset Management

- POP equipment tracking.
- Client equipment management.
- Serial number history.
- Asset assignment to users.
- Installation tracking with CRM references.
- Depreciation calculations:
  - Straight-line
  - Declining balance
  - Sum-of-years-digits

### Procurement

- Supplier management.
- Purchase requisitions with approval.
- Purchase orders.
- Goods receipt processing.
- Automatic stock updates following goods receipt.
- Supplier performance tracking.

### CRM Integration

The integration layer provides:

- Token-based authentication.
- Job Order retrieval.
- Ticket retrieval.
- User synchronization.
- Asynchronous CRM status updates using queues.
- Circuit-breaker protection for external service failures.
- Graceful degradation when the CRM is unavailable.

### Reporting & Analytics

- Monthly and yearly cost breakdowns.
- Inventory valuation.
- Stock movement summaries.
- Supplier performance metrics.
- Low-stock reporting.
- Export to Excel, PDF, and CSV.

### Security & Audit

- Role-Based Access Control (RBAC).
- Granular permission-based authorization.
- Detailed audit history:

```text
Who → What → When → Before → After
```

- Segregation of duties.
- Immutable historical records.
- Manual/offline transactions explicitly flagged.

---

## System Architecture

The application uses a modular backend architecture with a React/TypeScript client communicating with Laravel through RESTful APIs.

```text
┌──────────────────────────────────────────────────────────────┐
│                    React + TypeScript                         │
│                                                              │
│   Core     Inventory     Release     Assets     Reporting   │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ REST API / JSON
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 Laravel API Gateway                          │
│                     Modular Backend                          │
│                                                              │
│ Authentication        Core        Inventory       Release    │
│ Sanctum + CRM Token   Module      Module          Module     │
│                                                              │
│ Assets        Procurement        Integration      Reporting  │
└───────────────────────┬──────────────────────┬───────────────┘
                        │                      │
                        ▼                      ▼
               ┌─────────────────┐     ┌──────────────────┐
               │ MySQL/PostgreSQL│     │   External CRM   │
               │    Database     │     │     System       │
               └─────────────────┘     └──────────────────┘
```

### Architectural Patterns

The application documentation identifies the following patterns:

- **Modular Architecture** — separates functional domains into independent modules.
- **Repository Pattern** — abstracts data-access operations.
- **Service Pattern** — encapsulates business logic.
- **DTO Pattern** — provides structured data transfer between application layers.
- **Observer Pattern** — handles event-driven side effects.
- **Circuit Breaker Pattern** — improves resilience when communicating with the CRM.

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---:|---|
| PHP | 8.3+ | Core language |
| Laravel | 13.x | Application framework |
| nWidart Modules | 13.x | Modular architecture |
| Laravel Sanctum | — | API authentication |
| Spatie Permission | 8.x | Roles and permissions |
| Spatie Activitylog | 5.x | Audit trail |
| Redis | 7+ | Cache and queues |
| MySQL / PostgreSQL | — | Database |

### Frontend

| Technology | Version | Purpose |
|---|---:|---|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Axios | — | HTTP client |
| React Router | 6.x | Client-side routing |
| React Hot Toast | — | User notifications |

---

## Application Modules

| Module | Responsibility |
|---|---|
| **Core** | Authentication, users, roles, permissions, settings, notifications, dashboards |
| **Inventory** | Stores, stock items, balances, transfers, adjustments, and movements |
| **Assets** | Company assets, POP equipment, client equipment, assignment, depreciation |
| **ReleaseForm** | Installation, maintenance, and other equipment release workflows |
| **Procurement** | Suppliers, requisitions, purchase orders, and goods receipts |
| **Integration** | CRM communication, Job Orders, Tickets, and user synchronization |
| **Reporting** | Cost, inventory, movement, supplier, low-stock reports and exports |

---

## Getting Started

### Prerequisites

Ensure the following are installed:

- PHP **8.3+**
- Composer **2.x**
- Node.js **18+**
- npm or Yarn
- MySQL **8.0+** or PostgreSQL **14+**
- Redis **7+** *(optional for development)*
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/inventory-management-system.git
cd inventory-management-system
```

### 2. Install Backend Dependencies

```bash
composer install
```

Create the Laravel environment file and application key:

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Configure the Environment

Update `.env` with the appropriate application, database, authentication, frontend, and CRM settings.

```env
APP_NAME="Inventory System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory_system
DB_USERNAME=root
DB_PASSWORD=

AUTH_LOCAL_ENABLED=true
AUTH_CRM_ENABLED=false
AUTH_DEFAULT_METHOD=local

FRONTEND_URL=http://localhost:5173

CRM_URL=http://your-crm-url.com
CRM_APP_SECRET=your-crm-secret
```

> **Security:** Never commit real credentials, API secrets, tokens, or production `.env` files to source control.

### 5. Prepare the Database

Run migrations:

```bash
php artisan migrate
```

Run seeders:

```bash
php artisan db:seed
```

### 6. Start the Application

Start the Laravel backend:

```bash
php artisan serve
```

Backend:

```text
http://localhost:8000
```

Start the React development server in a separate terminal:

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### 7. Start the Queue Worker

Queue processing is used for asynchronous operations such as CRM synchronization.

```bash
php artisan queue:work
```

---

## Configuration

### Authentication

The system supports local authentication and CRM-based authentication.

```env
AUTH_LOCAL_ENABLED=true
AUTH_CRM_ENABLED=false
AUTH_DEFAULT_METHOD=local
```

These settings allow authentication methods to be enabled or disabled according to the deployment environment.

### Default Development Users

After running the seeders, the documented development accounts are:

| Email | Password | Role |
|---|---|---|
| `admin@inventory.com` | `password` | Super Admin |
| `manager@inventory.com` | `password` | Manager |
| `staff@inventory.com` | `password` | Staff |
| `user@inventory.com` | `password` | User |

> **Important:** These credentials are for development/demo use only. Change or remove seeded credentials before production deployment.

### Permissions

The application uses Spatie Permission for granular authorization.

Examples include:

```text
view-users
create-users
edit-users
delete-users

view-stores
create-stores
edit-stores
delete-stores

view-release-forms
create-release-forms
approve-release-forms

view-assets
create-assets
assign-assets

view-suppliers
create-suppliers
```

Additional permissions are defined across the application modules.

---

## API Documentation

### Base URL

```text
http://localhost:8000/api/v1
```

### Authentication

API requests require a Bearer token:

```http
Authorization: Bearer your-token-here
```

### Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate a user |
| POST | `/auth/logout` | End the authenticated session |
| GET | `/auth/user` | Retrieve the authenticated user |

### Inventory Endpoints

| Method | Endpoint |
|---|---|
| GET | `/inventory/stores` |
| POST | `/inventory/stores` |
| GET | `/inventory/stores/{id}` |
| PUT | `/inventory/stores/{id}` |
| DELETE | `/inventory/stores/{id}` |

### Release Form Endpoints

| Method | Endpoint |
|---|---|
| GET | `/release-forms` |
| POST | `/release-forms` |
| GET | `/release-forms/{id}` |
| POST | `/release-forms/{id}/submit` |
| POST | `/release-forms/{id}/approve` |
| POST | `/release-forms/{id}/dispatch` |
| POST | `/release-forms/{id}/complete` |

### Asset Endpoints

| Method | Endpoint |
|---|---|
| GET | `/assets` |
| POST | `/assets` |
| PUT | `/assets/{id}` |
| POST | `/assets/{id}/assign` |
| POST | `/assets/{id}/depreciation` |

### Procurement Endpoints

| Method | Endpoint |
|---|---|
| GET | `/procurement/suppliers` |
| POST | `/procurement/suppliers` |
| GET | `/procurement/purchase-orders` |
| POST | `/procurement/purchase-orders` |
| POST | `/procurement/purchase-orders/{id}/receive` |

### Reporting Endpoints

| Method | Endpoint |
|---|---|
| GET | `/reports/cost-breakdown` |
| GET | `/reports/inventory` |
| GET | `/reports/stock-movement` |
| GET | `/reports/low-stock` |
| GET | `/reports/supplier-performance` |
| POST | `/reports/export` |

For the complete API reference, see:

```text
API_DOCUMENTATION.md
```

---

## Testing

Run the complete test suite:

```bash
php artisan test
```

Run tests for individual modules:

```bash
php artisan test Modules/Inventory/Tests
php artisan test Modules/ReleaseForm/Tests
php artisan test Modules/Assets/Tests
```

Generate coverage information:

```bash
php artisan test --coverage
```

### Test Organization

```text
Modules/
├── Inventory/
│   └── Tests/
│       ├── Feature/
│       │   └── StoreManagementTest.php
│       └── Unit/
│           └── StoreServiceTest.php
│
├── ReleaseForm/
│   └── Tests/
│       └── Feature/
│           └── ReleaseFormWorkflowTest.php
│
└── ...
```

---

## Deployment

### Production Requirements

- PHP 8.3+ with required extensions
- MySQL 8.0+ or PostgreSQL 14+
- Redis 7+
- Nginx or Apache
- Node.js 18+ for frontend builds
- SSL/TLS certificate

### 1. Install PHP Dependencies

Example Ubuntu setup:

```bash
sudo apt-get install \
  php8.3-fpm \
  php8.3-mysql \
  php8.3-redis \
  php8.3-curl \
  php8.3-mbstring \
  php8.3-xml \
  php8.3-zip
```

### 2. Deploy the Repository

```bash
git clone https://github.com/yourusername/inventory-management-system.git
cd inventory-management-system
```

### 3. Install Production Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

Configure the production environment:

```bash
cp .env.example .env
php artisan key:generate
```

Recommended production settings:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
```

Run migrations:

```bash
php artisan migrate --force
```

Run seeders only when appropriate for the deployment:

```bash
php artisan db:seed --force
```

Cache application configuration:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. Build the Frontend

```bash
cd frontend
npm install
npm run build
```

The documented build output is:

```text
frontend/dist
```

### 5. Configure the Web Server

The application can be served through Nginx or Apache.

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/inventory-system/public;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location /api {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 6. Run Queue Workers

The documented deployment uses Supervisor to keep queue workers running:

```ini
[program:inventory-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/inventory-system/artisan queue:work redis --sleep=3 --tries=3
autostart=true
autorestart=true
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/inventory-worker.log
```

---

## Project Structure

```text
inventory-system/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   └── Services/
│
├── Modules/
│   ├── Core/
│   │   ├── app/
│   │   │   ├── Controllers/
│   │   │   ├── Models/
│   │   │   ├── Services/
│   │   │   └── Repositories/
│   │   ├── database/
│   │   └── routes/
│   │
│   ├── Inventory/
│   ├── Assets/
│   ├── ReleaseForm/
│   ├── Procurement/
│   ├── Integration/
│   └── Reporting/
│
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── core/
│   │   │   ├── inventory/
│   │   │   ├── assets/
│   │   │   ├── release-form/
│   │   │   ├── procurement/
│   │   │   ├── integration/
│   │   │   └── reporting/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── app/
│   ├── public/
│   └── package.json
│
├── database/
│   ├── migrations/
│   └── seeders/
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── USER_GUIDE.md
│   └── WORKFLOWS.md
│
├── tests/
├── .env.example
├── composer.json
└── README.md
```

---

## Contributing

Contributions should follow the project's coding and documentation standards.

### Development Workflow

```bash
git checkout -b feature/your-feature
```

Make your changes, add tests where appropriate, then commit:

```bash
git add .
git commit -m "feat: Add your feature"
```

Push your branch:

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

### Code Standards

- Follow **PSR-12** for PHP.
- Follow established TypeScript and React best practices.
- Add tests for new functionality where applicable.
- Update documentation when behavior or configuration changes.
- Keep modules focused on their respective business responsibilities.

### Commit Convention

| Type | Usage |
|---|---|
| `feat` | New functionality |
| `fix` | Bug fixes |
| `docs` | Documentation changes |
| `style` | Code style changes |
| `refactor` | Code refactoring |
| `test` | Tests |
| `chore` | Maintenance tasks |

Example:

```text
feat: Add equipment release approval workflow
```


---

## Acknowledgements

This project is built with and supported by:

- [Laravel](https://laravel.com/) — PHP application framework
- [React](https://react.dev/) — UI library
- [nWidart Laravel Modules](https://github.com/nWidart/laravel-modules) — Modular architecture
- [Spatie](https://spatie.be/) — Laravel packages for permissions and activity logging
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework

---

---

## Roadmap

### Completed

- [x] Core module with authentication
- [x] Multi-store inventory management
- [x] Asset tracking
- [x] Equipment release forms with CRM integration
- [x] Procurement management
- [x] Reporting and analytics

---

## Project Status

**Version:** 1.0.0

The system is structured as a modular business application covering inventory, equipment release, assets, procurement, CRM integration, reporting, authentication, authorization, and auditability.

