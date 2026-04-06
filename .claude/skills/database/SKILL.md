---
name: database
description: Database schema and optimization patterns for the car-parts store. MySQL tables, relationships, indexing strategy. Use when creating migrations, optimizing queries, or modifying database schema.
---

# Car Parts Store - Database Schema & Conventions

## Core Tables
```
users          - id, name, email, password, role(enum:admin,staff,customer), phone, is_active
categories     - id, name, slug, parent_id(self-ref), description, image_path, sort_order, is_active, is_visible, soft_deletes
products       - id, name, slug, sku(unique), category_id(FK), description, cost_price, sell_price, stock_quantity, image_path, is_active, is_visible, soft_deletes
vehicles       - id, make, model, year_from, year_to, engine, soft_deletes
suppliers      - id, name, code(unique), type(enum:api,xml,csv), api_url, api_key, feed_url, config(json), default_margin_type, default_margin_value, sync_interval_minutes, is_active, last_synced_at, soft_deletes
orders         - id, user_id(FK), order_number(unique), status(enum), subtotal, tax, total, shipping_address(json), notes, soft_deletes
order_items    - id, order_id(FK), product_id(FK), quantity, unit_price, total_price
carts          - id, user_id(FK unique)
cart_items     - id, cart_id(FK), product_id(FK), quantity
margin_rules   - id, name, supplier_id(FK nullable), category_id(FK nullable), type(enum:percentage,fixed), value, min_price, max_price, priority, is_active
sync_logs      - id, supplier_id(FK), type(enum), status(enum), records_processed/created/updated/failed, error_message, started_at, completed_at
```

## Junction Tables
```
product_supplier  - product_id, supplier_id, supplier_sku, cost_price, stock_quantity, is_preferred, last_synced_at
product_vehicle   - product_id, vehicle_id
```

## Existing Indexes (performance migration applied)
- orders: (status, created_at)
- categories: (is_active, is_visible)
- vehicles: (make), (make, model) compound
- suppliers: (is_active)
- margin_rules: (is_active, priority)
- products: (category_id, is_visible, is_active) compound

## Query Optimization Rules
1. ALWAYS use `withCount()` for counts instead of eager loading full relations
2. Use `with()` only for relations that will be accessed in the response
3. Use compound indexes for queries that filter on multiple columns together
4. Use `when()` for conditional query building
5. Paginate all list queries - never `->get()` without limits
6. Use `select()` to limit columns when full model isn't needed

## Migration Conventions
- Table creates: `YYYY_MM_DD_000001_create_{table}_table.php`
- Alterations: `YYYY_MM_DD_000001_add_{feature}_to_{table}.php`
- Always include `$table->timestamps()` and `$table->softDeletes()` on entity tables
- Foreign keys with `->constrained()->cascadeOnDelete()` or `->nullOnDelete()`
- Run: `php artisan migrate` from backend directory
