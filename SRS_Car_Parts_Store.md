# Software Requirements Specification (SRS)

## Online Car Parts Store

**Project Name:** Car Parts Store
**Version:** 1.0
**Date:** 2026-04-01
**Status:** Draft

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Database Design](#6-database-design)
7. [API Specification](#7-api-specification)
8. [User Interface Requirements](#8-user-interface-requirements)
9. [Third-Party Integrations](#9-third-party-integrations)
10. [Security Requirements](#10-security-requirements)
11. [Deployment & Infrastructure](#11-deployment--infrastructure)
12. [Glossary](#12-glossary)

---

## 1. Introduction

### 1.1 Purpose

This document defines the software requirements for an online car parts store platform. The system will allow customers to browse, search, and purchase automotive parts online, while providing administrators with tools to manage products, orders, and supplier integrations.

### 1.2 Scope

The platform will:

- Serve as a B2C e-commerce storefront for automotive parts
- Integrate with multiple suppliers for automated product import, stock synchronization, and price updates
- Provide an admin panel for product, order, and supplier management
- Support vehicle-based part lookup (make/model/year filtering)
- Handle automatic margin calculations and inventory visibility rules

### 1.3 Intended Audience

- Project developers and engineers
- Project stakeholders and decision-makers
- QA/testing teams
- Future maintenance teams

### 1.4 References

- Reference site: [DeepCar & NLParts](https://deepcar-and-nlparts.eu/epages/960245024.sf/pt_PT/?ObjectPath=Categories)
- Example category structure: [Fiat Ducato Parts](https://deepcar-and-nlparts.eu/epages/960245024.sf/pt_PT/?ObjectPath=/Shops/960245024/Categories/pecas-auto/fiat/ducato/ducato-modelo-de-07-2006-a-04-2014)

### 1.5 Definitions & Abbreviations

| Term | Definition |
|------|------------|
| SKU | Stock Keeping Unit — unique product identifier |
| OEM | Original Equipment Manufacturer |
| Fitment | The compatibility relationship between a part and a vehicle |
| Margin Rule | A pricing rule that adds a markup to supplier cost price |
| Sync Job | A background process that updates product data from a supplier |

---

## 2. Overall Description

### 2.1 Product Perspective

The system is a standalone web application consisting of:

- A **React JS** single-page application (SPA) for the customer-facing storefront and admin panel
- A **Laravel 13** RESTful API backend
- A **MySQL** relational database
- Background job workers for supplier synchronization
- A task scheduler for periodic automated operations

### 2.2 User Classes and Characteristics

| User Class | Description | Access Level |
|------------|-------------|--------------|
| Guest | Unauthenticated visitor browsing the store | Read-only (products, categories) |
| Customer | Registered user who can place orders | Browse, cart, checkout, order history |
| Admin | Store administrator | Full access to admin panel |
| Super Admin | System owner | Full access including system settings, supplier config |

### 2.3 Operating Environment

- **Server:** Linux-based (Ubuntu 22.04+ or similar)
- **Runtime:** PHP 8.3+, Node.js 20+
- **Database:** MySQL 8.0+
- **Cache/Queue:** Redis 7+
- **Web Server:** Nginx or Apache
- **Client:** Modern web browsers (Chrome, Firefox, Safari, Edge — last 2 versions)

### 2.4 Constraints

- The system must handle catalogs of 100,000+ products
- Supplier sync must complete within reasonable time (< 30 minutes for full sync)
- The storefront must be responsive (mobile, tablet, desktop)
- The platform must support Portuguese (PT-PT) as the primary language, with English as secondary
- GDPR compliance is required for EU customers

### 2.5 Assumptions and Dependencies

- Suppliers will provide data via API endpoints, XML feeds, or CSV/Excel files
- At least one payment gateway will be integrated (e.g., Stripe, PayPal, or MB Way for Portugal)
- The store owner will provide supplier API credentials and documentation
- Hosting infrastructure will be provisioned separately

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│   ┌──────────────────┐       ┌──────────────────────────┐   │
│   │   Storefront     │       │     Admin Panel          │   │
│   │   (React SPA)    │       │     (React SPA)          │   │
│   └────────┬─────────┘       └────────────┬─────────────┘   │
│            │                              │                 │
└────────────┼──────────────────────────────┼─────────────────┘
             │          HTTPS/REST          │
┌────────────┼──────────────────────────────┼─────────────────┐
│            ▼          API LAYER           ▼                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Laravel 13 API Backend                 │   │
│   │                                                     │   │
│   │  ┌───────────┐ ┌───────────┐ ┌──────────────────┐  │   │
│   │  │ Auth      │ │ Products  │ │ Orders           │  │   │
│   │  │ Module    │ │ Module    │ │ Module           │  │   │
│   │  └───────────┘ └───────────┘ └──────────────────┘  │   │
│   │  ┌───────────┐ ┌───────────┐ ┌──────────────────┐  │   │
│   │  │ Supplier  │ │ Pricing   │ │ Vehicle/Fitment  │  │   │
│   │  │ Sync      │ │ Engine    │ │ Module           │  │   │
│   │  └───────────┘ └───────────┘ └──────────────────┘  │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└───────────┬───────────────┬───────────────┬─────────────────┘
            │               │               │
┌───────────▼───┐   ┌───────▼───┐   ┌───────▼───────────────┐
│   MySQL 8     │   │  Redis    │   │  File Storage         │
│   Database    │   │  Cache &  │   │  (CSV/XML uploads,    │
│               │   │  Queues   │   │   product images)     │
└───────────────┘   └───────────┘   └───────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                         │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │Supplier  │  │Supplier  │  │Payment   │  │Email     │  │
│   │API #1    │  │API #2    │  │Gateway   │  │Service   │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React JS | 19.x |
| Build Tool | Vite | 6.x |
| State Management | Zustand or Redux Toolkit | Latest |
| UI Components | Tailwind CSS + Headless UI | Latest |
| Backend Framework | Laravel | 13.x |
| Language | PHP | 8.3+ |
| Database | MySQL | 8.0+ |
| Cache & Queue | Redis | 7.x |
| Queue Monitor | Laravel Horizon | Latest |
| Search Engine | Meilisearch | Latest |
| API Authentication | Laravel Sanctum | Latest |
| Task Scheduling | Laravel Scheduler (Cron) | Built-in |
| File Storage | Laravel Filesystem (local/S3) | Built-in |

### 3.3 Module Breakdown

| Module | Responsibility |
|--------|---------------|
| **Auth Module** | Registration, login, password reset, role management |
| **Product Module** | Product CRUD, categories, brands, images, attributes |
| **Vehicle/Fitment Module** | Vehicle database (make/model/year), part-to-vehicle mapping |
| **Supplier Module** | Supplier config, import adapters, sync orchestration |
| **Pricing Engine** | Margin rules, price calculation, currency handling |
| **Inventory Module** | Stock tracking, visibility rules, low-stock alerts |
| **Order Module** | Cart, checkout, order lifecycle, invoicing |
| **Search Module** | Full-text search, filtering, faceted navigation |
| **Notification Module** | Email notifications, admin alerts |
| **Reporting Module** | Sales reports, stock reports, supplier performance |

---

## 4. Functional Requirements

### 4.1 Supplier Integration

#### FR-4.1.1 Supplier Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.1.1.1 | The system SHALL allow admins to add, edit, and deactivate suppliers | High |
| FR-4.1.1.2 | Each supplier SHALL have a configurable integration type: API, XML feed, or CSV/Excel file upload | High |
| FR-4.1.1.3 | The system SHALL store supplier-specific configuration (API keys, feed URLs, file paths, field mappings) | High |
| FR-4.1.1.4 | The system SHALL support a minimum of 10 concurrent suppliers | High |
| FR-4.1.1.5 | Each supplier SHALL have an active/inactive status toggle | Medium |

#### FR-4.1.2 Product Import

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.1.2.1 | The system SHALL import products from supplier feeds including: SKU, name, description, price, stock quantity, category, brand, images, and vehicle fitment data | High |
| FR-4.1.2.2 | The system SHALL map supplier-specific data fields to the internal product schema via configurable field mappings | High |
| FR-4.1.2.3 | The system SHALL support initial bulk import of a supplier's full catalog | High |
| FR-4.1.2.4 | The system SHALL support incremental/delta imports (only changed products) where the supplier supports it | Medium |
| FR-4.1.2.5 | The system SHALL log all import operations with: timestamp, supplier, records processed, records created, records updated, records failed, and error details | High |
| FR-4.1.2.6 | The system SHALL allow manual triggering of an import for any supplier | High |
| FR-4.1.2.7 | The system SHALL handle duplicate detection based on supplier SKU and/or OEM part number | High |

#### FR-4.1.3 Stock & Price Synchronization

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.1.3.1 | The system SHALL automatically synchronize stock quantities from all active suppliers | High |
| FR-4.1.3.2 | The system SHALL automatically synchronize cost prices from all active suppliers | High |
| FR-4.1.3.3 | When a product is available from multiple suppliers, the system SHALL track stock and price per supplier independently | High |
| FR-4.1.3.4 | The system SHALL recalculate the sell price using applicable margin rules whenever the cost price changes | High |
| FR-4.1.3.5 | The system SHALL provide a sync status dashboard showing last sync time, next scheduled sync, and sync health per supplier | Medium |

#### FR-4.1.4 Scheduled Synchronization

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.1.4.1 | The system SHALL support configurable sync schedules per supplier (e.g., every 15 min, hourly, every 6 hours, daily) | High |
| FR-4.1.4.2 | The default sync interval SHALL be 1 hour | High |
| FR-4.1.4.3 | The system SHALL execute sync jobs in the background without affecting storefront performance | High |
| FR-4.1.4.4 | The system SHALL retry failed sync jobs up to 3 times with exponential backoff | Medium |
| FR-4.1.4.5 | The system SHALL send an admin notification if a sync job fails after all retries | Medium |

### 4.2 Pricing & Margin Engine

#### FR-4.2.1 Margin Rules

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.2.1.1 | The system SHALL allow admins to define margin rules as a percentage markup or fixed amount | High |
| FR-4.2.1.2 | Margin rules SHALL be configurable at the following levels (in order of priority, highest first): individual product, product category, supplier, and global default | High |
| FR-4.2.1.3 | The system SHALL support price-range-based margins (e.g., products costing €0-10: +40%, €10-50: +30%, €50+: +20%) | Medium |
| FR-4.2.1.4 | The system SHALL automatically apply the highest-priority matching margin rule when calculating sell price | High |
| FR-4.2.1.5 | Admins SHALL be able to preview the effect of a margin rule change before applying it | Low |
| FR-4.2.1.6 | The system SHALL maintain an audit log of margin rule changes | Medium |

#### FR-4.2.2 Price Calculation

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.2.2.1 | Sell price SHALL be calculated as: `cost_price + margin_amount` | High |
| FR-4.2.2.2 | The system SHALL store both `cost_price` (from supplier) and `sell_price` (calculated) | High |
| FR-4.2.2.3 | Admins SHALL be able to manually override the sell price for any product | High |
| FR-4.2.2.4 | Manually overridden prices SHALL NOT be recalculated during sync unless the admin removes the override | High |
| FR-4.2.2.5 | The system SHALL support VAT/tax calculation on top of the sell price | Medium |

### 4.3 Inventory & Visibility

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.3.1 | The system SHALL automatically hide products from the storefront when stock reaches 0 across all suppliers | High |
| FR-4.3.2 | The system SHALL automatically show products on the storefront when stock becomes available again | High |
| FR-4.3.3 | Admins SHALL be able to configure a "grace period" before hiding (e.g., hide after 2 hours of zero stock) | Medium |
| FR-4.3.4 | Admins SHALL be able to manually override visibility regardless of stock status | Medium |
| FR-4.3.5 | The system SHALL provide a "low stock" threshold setting with admin notifications | Low |
| FR-4.3.6 | Hidden products SHALL remain in the database and admin panel, only hidden from the storefront | High |

### 4.4 Product Catalog

#### FR-4.4.1 Product Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.4.1.1 | The system SHALL support the following product fields: SKU, OEM number, name, slug, short description, full description, brand, category (hierarchical), weight, dimensions, images (multiple), and custom attributes | High |
| FR-4.4.1.2 | The system SHALL support hierarchical categories (e.g., Car Parts > Fiat > Ducato > 2006-2014 Model) | High |
| FR-4.4.1.3 | The system SHALL support bulk operations: bulk edit price/margin, bulk show/hide, bulk delete, bulk category assignment | Medium |
| FR-4.4.1.4 | The system SHALL support product image upload and management (multiple images per product, drag-to-reorder) | High |
| FR-4.4.1.5 | The system SHALL auto-generate SEO-friendly URLs/slugs from product names | Medium |

#### FR-4.4.2 Vehicle Fitment

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.4.2.1 | The system SHALL maintain a vehicle database with: Make, Model, Year Range (from-to), and Engine variant | High |
| FR-4.4.2.2 | Each product SHALL be linkable to one or more vehicles (many-to-many fitment relationship) | High |
| FR-4.4.2.3 | Customers SHALL be able to search/filter parts by selecting their vehicle (make > model > year) | High |
| FR-4.4.2.4 | The system SHALL display "fits your vehicle" indicators when a customer has selected their vehicle | Medium |
| FR-4.4.2.5 | The system SHALL allow importing fitment data from supplier feeds | High |

#### FR-4.4.3 Search & Filtering

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.4.3.1 | The system SHALL provide full-text search across product name, SKU, OEM number, and description | High |
| FR-4.4.3.2 | The system SHALL support faceted filtering by: category, brand, vehicle, price range, and availability | High |
| FR-4.4.3.3 | Search results SHALL be sortable by: relevance, price (asc/desc), name (A-Z/Z-A), and newest | Medium |
| FR-4.4.3.4 | The system SHALL provide autocomplete/suggestions in the search bar | Medium |
| FR-4.4.3.5 | Search SHALL return results in < 500ms for catalogs up to 200,000 products | High |

### 4.5 Customer-Facing Storefront

#### FR-4.5.1 Browsing & Navigation

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.5.1.1 | The storefront SHALL display a category navigation tree (mega menu or sidebar) | High |
| FR-4.5.1.2 | The storefront SHALL display product listing pages with: thumbnail, name, price, availability badge, and "add to cart" button | High |
| FR-4.5.1.3 | The storefront SHALL display product detail pages with: images (gallery), full description, specifications, price, stock status, fitment info, and related products | High |
| FR-4.5.1.4 | The storefront SHALL support pagination and configurable items-per-page on listing pages | Medium |
| FR-4.5.1.5 | The storefront SHALL include breadcrumb navigation | Medium |

#### FR-4.5.2 Shopping Cart

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.5.2.1 | Customers SHALL be able to add products to a shopping cart | High |
| FR-4.5.2.2 | The cart SHALL persist across sessions for logged-in customers | High |
| FR-4.5.2.3 | The cart SHALL display: product name, quantity (editable), unit price, line total, and cart total | High |
| FR-4.5.2.4 | The cart SHALL validate stock availability before proceeding to checkout | High |
| FR-4.5.2.5 | Guest users SHALL have a session-based cart that can be merged upon login/registration | Medium |

#### FR-4.5.3 Checkout & Payment

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.5.3.1 | The checkout process SHALL collect: billing address, shipping address, shipping method, and payment method | High |
| FR-4.5.3.2 | The system SHALL integrate with at least one payment gateway (e.g., Stripe, PayPal, or MB Way) | High |
| FR-4.5.3.3 | The system SHALL calculate shipping costs based on weight/destination (configurable rules or carrier API) | Medium |
| FR-4.5.3.4 | The system SHALL apply VAT/tax according to Portuguese/EU tax rules | High |
| FR-4.5.3.5 | The system SHALL generate an order confirmation with a unique order number | High |
| FR-4.5.3.6 | The system SHALL send an order confirmation email to the customer | High |

### 4.6 Order Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.6.1 | The system SHALL support the following order statuses: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded | High |
| FR-4.6.2 | Admins SHALL be able to view, filter, and search all orders | High |
| FR-4.6.3 | Admins SHALL be able to update order status with optional customer notification | High |
| FR-4.6.4 | The system SHALL generate invoices (PDF) for each order | Medium |
| FR-4.6.5 | Customers SHALL be able to view their order history and order details | High |
| FR-4.6.6 | The system SHALL deduct stock upon order confirmation | High |
| FR-4.6.7 | The system SHALL restore stock upon order cancellation | Medium |
| FR-4.6.8 | Admins SHALL be able to add tracking numbers and shipping information to orders | Medium |

### 4.7 User Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.7.1 | The system SHALL support customer registration with: name, email, password, phone (optional), and address | High |
| FR-4.7.2 | The system SHALL support login via email and password | High |
| FR-4.7.3 | The system SHALL support password reset via email | High |
| FR-4.7.4 | Customers SHALL be able to manage their profile, addresses, and saved vehicles | Medium |
| FR-4.7.5 | The admin panel SHALL support role-based access control (Super Admin, Admin, Staff) | Medium |

### 4.8 Admin Dashboard

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.8.1 | The dashboard SHALL display key metrics: total orders (today/week/month), revenue, top-selling products, low-stock alerts, and supplier sync status | Medium |
| FR-4.8.2 | The dashboard SHALL display recent orders and their statuses | Medium |
| FR-4.8.3 | The dashboard SHALL display supplier sync health and alerts | Medium |
| FR-4.8.4 | The system SHALL provide sales reports filterable by date range, category, and supplier | Low |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|------------|--------|
| NFR-5.1.1 | Page load time (storefront) | < 2 seconds (initial), < 500ms (subsequent navigation) |
| NFR-5.1.2 | API response time (95th percentile) | < 300ms |
| NFR-5.1.3 | Search response time | < 500ms for catalogs up to 200,000 products |
| NFR-5.1.4 | Concurrent users supported | Minimum 500 |
| NFR-5.1.5 | Supplier sync (hourly) | < 30 minutes for full catalog of 100,000 products |
| NFR-5.1.6 | Database query optimization | All listing queries < 100ms with proper indexing |

### 5.2 Scalability

| ID | Requirement |
|----|------------|
| NFR-5.2.1 | The system SHALL handle product catalogs of up to 500,000 SKUs |
| NFR-5.2.2 | The system SHALL support horizontal scaling of queue workers for sync jobs |
| NFR-5.2.3 | The database schema SHALL support efficient querying with proper indexing and partitioning strategies |

### 5.3 Reliability & Availability

| ID | Requirement |
|----|------------|
| NFR-5.3.1 | Target uptime: 99.5% (excluding planned maintenance) |
| NFR-5.3.2 | Supplier sync failures SHALL NOT affect storefront availability |
| NFR-5.3.3 | The system SHALL implement database backups (daily automated) |
| NFR-5.3.4 | Failed background jobs SHALL be retried with exponential backoff (max 3 retries) |

### 5.4 Usability

| ID | Requirement |
|----|------------|
| NFR-5.4.1 | The storefront SHALL be fully responsive (mobile, tablet, desktop) |
| NFR-5.4.2 | The storefront SHALL meet WCAG 2.1 Level AA accessibility standards |
| NFR-5.4.3 | The admin panel SHALL be usable on desktop browsers (responsive is a plus, not required) |
| NFR-5.4.4 | The storefront SHALL support Portuguese (PT-PT) and English languages |

### 5.5 Maintainability

| ID | Requirement |
|----|------------|
| NFR-5.5.1 | Code SHALL follow PSR-12 (PHP) and Airbnb/Standard (JavaScript) coding standards |
| NFR-5.5.2 | The system SHALL have automated tests with minimum 70% code coverage on critical paths (checkout, sync, pricing) |
| NFR-5.5.3 | The system SHALL use database migrations for all schema changes |
| NFR-5.5.4 | Adding a new supplier type SHALL require implementing a single adapter interface without modifying core sync logic |

---

## 6. Database Design

### 6.1 Entity Relationship Overview

```
┌──────────┐     ┌───────────────────┐     ┌──────────┐
│ suppliers│────<│ product_supplier   │>────│ products │
└──────────┘     └───────────────────┘     └──────────┘
                                                │
     ┌──────────────┐    ┌──────────────────┐   │
     │ categories   │<───│ (category_id)    │───┘
     │ (hierarchical)│   └──────────────────┘   │
     └──────────────┘                           │
                                                │
     ┌──────────┐     ┌───────────────────┐     │
     │ vehicles │────<│ product_vehicle   │>────┘
     └──────────┘     └───────────────────┘

     ┌──────────┐     ┌───────────────────┐     ┌──────────┐
     │  users   │────<│    orders         │>────│order_items│
     └──────────┘     └───────────────────┘     └──────────┘

     ┌──────────────┐
     │ margin_rules │──── (linked to supplier, category, or product)
     └──────────────┘

     ┌──────────────┐
     │  sync_logs   │──── (linked to supplier)
     └──────────────┘
```

### 6.2 Core Tables

#### `suppliers`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL | Supplier display name |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Internal supplier code |
| integration_type | ENUM('api','xml','csv') | NOT NULL | Feed type |
| config | JSON | NULLABLE | API keys, URLs, auth, field mappings |
| sync_interval_minutes | INT | DEFAULT 60 | How often to sync |
| is_active | BOOLEAN | DEFAULT TRUE | Enable/disable supplier |
| last_synced_at | TIMESTAMP | NULLABLE | Last successful sync |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `products`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| sku | VARCHAR(100) | UNIQUE, NOT NULL | Internal SKU |
| oem_number | VARCHAR(100) | NULLABLE, INDEX | OEM part number |
| name | VARCHAR(500) | NOT NULL | Product name |
| slug | VARCHAR(500) | UNIQUE, NOT NULL | URL-friendly name |
| short_description | TEXT | NULLABLE | Brief description |
| description | LONGTEXT | NULLABLE | Full HTML description |
| brand_id | BIGINT UNSIGNED | FK → brands.id, NULLABLE | |
| category_id | BIGINT UNSIGNED | FK → categories.id, NULLABLE | |
| sell_price | DECIMAL(10,2) | NOT NULL | Customer-facing price |
| cost_price | DECIMAL(10,2) | NULLABLE | Best supplier cost price |
| price_override | BOOLEAN | DEFAULT FALSE | If TRUE, sync won't update price |
| total_stock | INT | DEFAULT 0 | Aggregated stock across suppliers |
| weight_kg | DECIMAL(8,3) | NULLABLE | For shipping calculation |
| is_visible | BOOLEAN | DEFAULT TRUE | Storefront visibility |
| visibility_override | BOOLEAN | DEFAULT FALSE | If TRUE, auto-hide won't apply |
| hidden_at | TIMESTAMP | NULLABLE | When auto-hidden (for grace period) |
| meta_title | VARCHAR(255) | NULLABLE | SEO title |
| meta_description | VARCHAR(500) | NULLABLE | SEO description |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

**Indexes:** sku, oem_number, slug, brand_id, category_id, is_visible, (is_visible, category_id)

#### `product_supplier`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| product_id | BIGINT UNSIGNED | FK → products.id | |
| supplier_id | BIGINT UNSIGNED | FK → suppliers.id | |
| supplier_sku | VARCHAR(100) | NOT NULL | SKU in supplier's system |
| cost_price | DECIMAL(10,2) | NOT NULL | Supplier's price |
| stock_quantity | INT | DEFAULT 0 | Supplier's stock |
| is_preferred | BOOLEAN | DEFAULT FALSE | Preferred supplier for this product |
| last_synced_at | TIMESTAMP | NULLABLE | |
| raw_data | JSON | NULLABLE | Original supplier data (for debugging) |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

**Indexes:** UNIQUE(product_id, supplier_id), (supplier_id, supplier_sku), stock_quantity

#### `categories`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| parent_id | BIGINT UNSIGNED | FK → categories.id, NULLABLE | For hierarchy |
| name | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | NOT NULL | |
| description | TEXT | NULLABLE | |
| image | VARCHAR(500) | NULLABLE | Category image path |
| sort_order | INT | DEFAULT 0 | Display ordering |
| is_active | BOOLEAN | DEFAULT TRUE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

**Indexes:** parent_id, slug, UNIQUE(parent_id, slug)

#### `brands`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | |
| logo | VARCHAR(500) | NULLABLE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `vehicles`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| make | VARCHAR(100) | NOT NULL | e.g., Fiat |
| model | VARCHAR(100) | NOT NULL | e.g., Ducato |
| year_from | SMALLINT | NOT NULL | e.g., 2006 |
| year_to | SMALLINT | NULLABLE | e.g., 2014 (NULL = current) |
| engine | VARCHAR(255) | NULLABLE | Engine variant |
| body_type | VARCHAR(100) | NULLABLE | e.g., Van, Chassis Cab |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

**Indexes:** (make, model), (make, model, year_from, year_to)

#### `product_vehicle`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| product_id | BIGINT UNSIGNED | FK → products.id | |
| vehicle_id | BIGINT UNSIGNED | FK → vehicles.id | |

**Indexes:** PRIMARY(product_id, vehicle_id), vehicle_id

#### `product_images`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| product_id | BIGINT UNSIGNED | FK → products.id | |
| path | VARCHAR(500) | NOT NULL | File path or URL |
| alt_text | VARCHAR(255) | NULLABLE | |
| sort_order | INT | DEFAULT 0 | |
| is_primary | BOOLEAN | DEFAULT FALSE | Main product image |
| created_at | TIMESTAMP | | |

#### `margin_rules`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL | Rule description |
| supplier_id | BIGINT UNSIGNED | FK → suppliers.id, NULLABLE | NULL = applies to all |
| category_id | BIGINT UNSIGNED | FK → categories.id, NULLABLE | NULL = applies to all |
| product_id | BIGINT UNSIGNED | FK → products.id, NULLABLE | NULL = applies to all |
| price_min | DECIMAL(10,2) | NULLABLE | Min cost price for range rules |
| price_max | DECIMAL(10,2) | NULLABLE | Max cost price for range rules |
| margin_type | ENUM('percentage','fixed') | NOT NULL | |
| margin_value | DECIMAL(10,2) | NOT NULL | Percentage or fixed amount |
| priority | INT | DEFAULT 0 | Higher = takes precedence |
| is_active | BOOLEAN | DEFAULT TRUE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `users`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| password | VARCHAR(255) | NOT NULL | Hashed |
| phone | VARCHAR(50) | NULLABLE | |
| role | ENUM('customer','staff','admin','super_admin') | DEFAULT 'customer' | |
| email_verified_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `addresses`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| user_id | BIGINT UNSIGNED | FK → users.id | |
| type | ENUM('billing','shipping') | NOT NULL | |
| name | VARCHAR(255) | NOT NULL | |
| line_1 | VARCHAR(255) | NOT NULL | |
| line_2 | VARCHAR(255) | NULLABLE | |
| city | VARCHAR(100) | NOT NULL | |
| postal_code | VARCHAR(20) | NOT NULL | |
| country_code | CHAR(2) | DEFAULT 'PT' | |
| is_default | BOOLEAN | DEFAULT FALSE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `orders`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | e.g., ORD-2026-00001 |
| user_id | BIGINT UNSIGNED | FK → users.id | |
| status | ENUM('pending','confirmed','processing','shipped','delivered','cancelled','refunded') | DEFAULT 'pending' | |
| subtotal | DECIMAL(10,2) | NOT NULL | Before tax/shipping |
| tax_amount | DECIMAL(10,2) | NOT NULL | VAT amount |
| shipping_amount | DECIMAL(10,2) | NOT NULL | |
| total | DECIMAL(10,2) | NOT NULL | Final total |
| billing_address | JSON | NOT NULL | Snapshot at order time |
| shipping_address | JSON | NOT NULL | Snapshot at order time |
| payment_method | VARCHAR(50) | NULLABLE | |
| payment_reference | VARCHAR(255) | NULLABLE | Gateway transaction ID |
| tracking_number | VARCHAR(255) | NULLABLE | |
| shipping_carrier | VARCHAR(100) | NULLABLE | |
| notes | TEXT | NULLABLE | Admin notes |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `order_items`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| order_id | BIGINT UNSIGNED | FK → orders.id | |
| product_id | BIGINT UNSIGNED | FK → products.id | |
| supplier_id | BIGINT UNSIGNED | FK → suppliers.id, NULLABLE | Which supplier fulfills |
| product_name | VARCHAR(500) | NOT NULL | Snapshot |
| product_sku | VARCHAR(100) | NOT NULL | Snapshot |
| quantity | INT | NOT NULL | |
| unit_price | DECIMAL(10,2) | NOT NULL | Price at time of order |
| line_total | DECIMAL(10,2) | NOT NULL | quantity * unit_price |
| created_at | TIMESTAMP | | |

#### `sync_logs`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| supplier_id | BIGINT UNSIGNED | FK → suppliers.id | |
| type | ENUM('full_import','stock_sync','price_sync','incremental') | NOT NULL | |
| status | ENUM('running','completed','failed') | NOT NULL | |
| records_processed | INT | DEFAULT 0 | |
| records_created | INT | DEFAULT 0 | |
| records_updated | INT | DEFAULT 0 | |
| records_failed | INT | DEFAULT 0 | |
| error_message | TEXT | NULLABLE | |
| error_details | JSON | NULLABLE | Detailed error log |
| started_at | TIMESTAMP | NOT NULL | |
| completed_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | | |

---

## 7. API Specification

### 7.1 API Design Principles

- RESTful API following JSON:API conventions
- All endpoints prefixed with `/api/v1/`
- Authentication via Laravel Sanctum (Bearer token)
- Consistent error response format
- Pagination on all list endpoints (default: 20 items per page)

### 7.2 Public API Endpoints (Storefront)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | List products (paginated, filterable, searchable) |
| GET | `/api/v1/products/{slug}` | Get product details |
| GET | `/api/v1/categories` | List categories (tree structure) |
| GET | `/api/v1/categories/{slug}` | Get category with products |
| GET | `/api/v1/brands` | List all brands |
| GET | `/api/v1/vehicles/makes` | List vehicle makes |
| GET | `/api/v1/vehicles/models?make={make}` | List models for a make |
| GET | `/api/v1/vehicles/years?make={make}&model={model}` | List years for make/model |
| GET | `/api/v1/vehicles/{id}/products` | List products fitting a vehicle |
| GET | `/api/v1/search?q={query}` | Full-text product search |
| POST | `/api/v1/auth/register` | Customer registration |
| POST | `/api/v1/auth/login` | Customer login |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |

### 7.3 Authenticated Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/user/profile` | Get profile |
| PUT | `/api/v1/user/profile` | Update profile |
| GET | `/api/v1/user/addresses` | List saved addresses |
| POST | `/api/v1/user/addresses` | Add address |
| PUT | `/api/v1/user/addresses/{id}` | Update address |
| DELETE | `/api/v1/user/addresses/{id}` | Delete address |
| GET | `/api/v1/user/vehicles` | List saved vehicles |
| POST | `/api/v1/user/vehicles` | Save a vehicle |
| DELETE | `/api/v1/user/vehicles/{id}` | Remove saved vehicle |
| GET | `/api/v1/cart` | Get cart contents |
| POST | `/api/v1/cart/items` | Add item to cart |
| PUT | `/api/v1/cart/items/{id}` | Update cart item quantity |
| DELETE | `/api/v1/cart/items/{id}` | Remove cart item |
| POST | `/api/v1/checkout` | Process checkout |
| GET | `/api/v1/orders` | List customer's orders |
| GET | `/api/v1/orders/{orderNumber}` | Get order details |

### 7.4 Admin API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Dashboard metrics |
| **Products** | | |
| GET | `/api/v1/admin/products` | List all products (with filters) |
| POST | `/api/v1/admin/products` | Create product |
| GET | `/api/v1/admin/products/{id}` | Get product details |
| PUT | `/api/v1/admin/products/{id}` | Update product |
| DELETE | `/api/v1/admin/products/{id}` | Delete product |
| POST | `/api/v1/admin/products/bulk-action` | Bulk operations |
| **Categories** | | |
| GET | `/api/v1/admin/categories` | List categories |
| POST | `/api/v1/admin/categories` | Create category |
| PUT | `/api/v1/admin/categories/{id}` | Update category |
| DELETE | `/api/v1/admin/categories/{id}` | Delete category |
| **Orders** | | |
| GET | `/api/v1/admin/orders` | List all orders |
| GET | `/api/v1/admin/orders/{id}` | Get order details |
| PUT | `/api/v1/admin/orders/{id}/status` | Update order status |
| POST | `/api/v1/admin/orders/{id}/tracking` | Add tracking info |
| **Suppliers** | | |
| GET | `/api/v1/admin/suppliers` | List suppliers |
| POST | `/api/v1/admin/suppliers` | Create supplier |
| PUT | `/api/v1/admin/suppliers/{id}` | Update supplier |
| DELETE | `/api/v1/admin/suppliers/{id}` | Delete supplier |
| POST | `/api/v1/admin/suppliers/{id}/sync` | Trigger manual sync |
| GET | `/api/v1/admin/suppliers/{id}/logs` | Get sync logs |
| **Margin Rules** | | |
| GET | `/api/v1/admin/margin-rules` | List margin rules |
| POST | `/api/v1/admin/margin-rules` | Create margin rule |
| PUT | `/api/v1/admin/margin-rules/{id}` | Update margin rule |
| DELETE | `/api/v1/admin/margin-rules/{id}` | Delete margin rule |
| **Reports** | | |
| GET | `/api/v1/admin/reports/sales` | Sales report |
| GET | `/api/v1/admin/reports/stock` | Stock report |
| GET | `/api/v1/admin/reports/suppliers` | Supplier performance |

### 7.5 Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

## 8. User Interface Requirements

### 8.1 Storefront Pages

| Page | Key Components |
|------|---------------|
| **Home** | Hero banner, vehicle selector, featured categories, popular products, search bar |
| **Category Listing** | Sidebar filters (brand, price, vehicle), product grid/list toggle, sorting, pagination |
| **Product Detail** | Image gallery, price, stock status, add to cart, fitment table, description tabs, related products |
| **Search Results** | Search bar, result count, filters, product grid |
| **Cart** | Item list, quantity controls, subtotal, proceed to checkout |
| **Checkout** | Address form, shipping options, payment method, order summary |
| **Login/Register** | Form with validation |
| **My Account** | Profile, addresses, saved vehicles, order history |
| **Order Detail** | Order info, items, status timeline, tracking |

### 8.2 Admin Panel Pages

| Page | Key Components |
|------|---------------|
| **Dashboard** | KPI cards, recent orders table, sync status widgets, low-stock alerts |
| **Products List** | Data table with search, filters, bulk actions, quick edit |
| **Product Form** | Tabbed form: General, Pricing, Images, Fitment, SEO |
| **Categories** | Tree view with drag-and-drop reordering |
| **Orders List** | Data table with status filters, date range, search |
| **Order Detail** | Customer info, items, status update, tracking, notes |
| **Suppliers List** | Data table with sync status indicators |
| **Supplier Form** | Config fields, field mapping editor, sync schedule |
| **Margin Rules** | Rule list with inline editing, rule tester |
| **Sync Logs** | Log viewer with status filters, error details |

### 8.3 Design Requirements

- Clean, professional design suitable for automotive e-commerce
- Primary color palette: to be defined with stakeholder
- Mobile-first responsive design for storefront
- Consistent component library (buttons, forms, cards, tables)
- Loading states and skeleton screens for async content
- Toast notifications for user actions
- Confirmation modals for destructive actions

---

## 9. Third-Party Integrations

| Integration | Purpose | Priority |
|-------------|---------|----------|
| **Payment Gateway** (Stripe / PayPal / MB Way) | Process payments | High |
| **Meilisearch** | Full-text product search | High |
| **Email Service** (SMTP / Mailgun / SES) | Transactional emails | High |
| **File Storage** (Local / AWS S3) | Product images, import files | Medium |
| **Shipping Calculator** (CTT API or similar) | Portuguese shipping rates | Medium |
| **Google Analytics / Tag Manager** | Traffic analytics | Low |
| **reCAPTCHA** | Bot protection on forms | Low |

---

## 10. Security Requirements

| ID | Requirement |
|----|------------|
| SEC-10.1 | All API endpoints SHALL use HTTPS |
| SEC-10.2 | Passwords SHALL be hashed using bcrypt (Laravel default) |
| SEC-10.3 | API authentication SHALL use short-lived tokens (Sanctum) |
| SEC-10.4 | All user input SHALL be validated and sanitized (Laravel Form Requests) |
| SEC-10.5 | SQL injection prevention via Eloquent ORM and parameterized queries |
| SEC-10.6 | XSS prevention via React's built-in escaping and DOMPurify for rich content |
| SEC-10.7 | CSRF protection on all state-changing requests |
| SEC-10.8 | Rate limiting on authentication endpoints (max 5 attempts per minute) |
| SEC-10.9 | Supplier API credentials SHALL be encrypted at rest (Laravel's `encrypt()`) |
| SEC-10.10 | GDPR compliance: users can request data export and account deletion |
| SEC-10.11 | Admin actions SHALL be logged in an audit trail |
| SEC-10.12 | File uploads SHALL be validated for type and size, stored outside web root |

---

## 11. Deployment & Infrastructure

### 11.1 Environments

| Environment | Purpose |
|-------------|---------|
| Local | Developer workstations (Laragon / Docker) |
| Staging | Pre-production testing |
| Production | Live customer-facing environment |

### 11.2 Recommended Production Setup

| Component | Recommendation |
|-----------|---------------|
| Server | VPS with 4+ vCPUs, 8GB+ RAM (e.g., DigitalOcean, Hetzner, AWS) |
| Web Server | Nginx with PHP-FPM |
| PHP | 8.3+ with OPcache enabled |
| MySQL | 8.0+ with dedicated server or managed service |
| Redis | For cache, sessions, and queues |
| Queue Workers | Laravel Horizon with Supervisor |
| Scheduler | System cron running `php artisan schedule:run` every minute |
| SSL | Let's Encrypt (auto-renew) |
| CDN | Cloudflare or AWS CloudFront for static assets |
| Backups | Automated daily DB backups + file storage backups |

### 11.3 CI/CD

- Git-based workflow (GitHub / GitLab)
- Automated testing on pull requests
- Automated deployment to staging on merge to `develop`
- Manual promotion to production from staging
- Zero-downtime deployments (Laravel Envoyer or similar)

---

## 12. Glossary

| Term | Definition |
|------|-----------|
| Adapter | A class implementing the supplier interface for a specific integration type |
| Cost Price | The price charged by the supplier |
| Sell Price | The price shown to the customer (cost price + margin) |
| Fitment | The relationship indicating which parts are compatible with which vehicles |
| Margin Rule | A configurable rule that determines the markup applied to supplier prices |
| Sync Job | A background task that fetches and updates product data from a supplier |
| Grace Period | The configurable delay before hiding an out-of-stock product |
| SKU | Stock Keeping Unit, a unique identifier for a product |
| OEM Number | Original Equipment Manufacturer part number |
| Slug | URL-friendly version of a name (e.g., "brake-pads-fiat-ducato") |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-01 | — | Initial draft |

---

*End of Software Requirements Specification*
