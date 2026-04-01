# Car Parts Online Store — Requirements Document

Prepared for: Client Review
Date: April 1, 2026
Version: 1.0
Status: Draft — Awaiting Client Approval

---

# What Is This Document?

This document describes everything the online car parts store will do. It is written in plain language so that everyone involved — whether technical or not — can understand, review, and approve the features before development begins.

Please read through each section carefully. If anything is unclear, missing, or needs to change, let us know before we start building.

---

# 1. Project Overview

## What Are We Building?

An online store where customers can search for and buy car parts. The store will automatically pull products from your suppliers, keep prices and stock up to date, and let you manage everything from an easy-to-use admin panel.

## Who Will Use It?

| Who | What They Do |
|-----|-------------|
| Visitors | Browse the store and search for parts without creating an account |
| Customers | Create an account, add items to cart, place orders, and track their purchases |
| Store Staff | Manage day-to-day operations like processing orders and updating products |
| Store Owner / Admin | Full control over the store: suppliers, pricing rules, settings, and reports |

---

# 2. How Customers Will Use the Store

## 2.1 Finding Parts

Customers need to find the right part for their car quickly. The store will offer three ways to do this:

Search by Vehicle
- Customer selects their car: Brand (e.g., Fiat) → Model (e.g., Ducato) → Year (e.g., 2006–2014)
- The store shows only parts that fit that specific car
- Example: A customer with a 2010 Fiat Ducato should only see parts compatible with that vehicle

Search by Keyword
- Customer types a part name, part number, or OEM reference into the search bar
- Results appear instantly as they type (autocomplete suggestions)
- Example: Typing "brake pad" shows all matching brake pads

Browse by Category
- Parts are organized into categories and subcategories, similar to the reference site
- Example: Car Parts → Fiat → Ducato → 2006–2014 Model → Brakes → Brake Pads
- Categories can be browsed through a menu on the website

## 2.2 Viewing a Product

When a customer clicks on a product, they will see:

- Product name and part number
- One or more photos of the product
- Price (including VAT)
- Whether it is in stock or not
- Which cars it fits (compatibility list)
- Full description and specifications
- Related products ("Customers also bought..." or "You might also need...")

## 2.3 Shopping Cart

- Customers can add products to a shopping cart
- They can change quantities or remove items
- The cart shows the total price
- If a customer logs in, their cart is saved and available next time they visit
- Before checkout, the system checks that all items are still in stock

## 2.4 Placing an Order

The checkout process will work as follows:

1. Customer enters shipping address (or selects a saved address)
2. Customer enters billing address (can be the same as shipping)
3. Customer chooses a shipping method (with cost shown)
4. Customer chooses a payment method (e.g., credit card, PayPal, MB Way)
5. Customer reviews the order summary (items, quantities, prices, shipping, VAT, total)
6. Customer confirms and pays
7. Customer receives an order confirmation by email

## 2.5 Customer Account

Registered customers can:

- View their order history and order status
- Track shipped orders (if a tracking number is provided)
- Save multiple shipping addresses
- Save their vehicles for faster part searching next time
- Update their personal details and password

---

# 3. Supplier Integration — The Heart of the System

This is the most important part of the platform. Instead of manually adding thousands of products, the system will automatically import them from your suppliers and keep everything up to date.

## 3.1 How Products Get Into the Store

```
SUPPLIER                          YOUR STORE

Supplier sends product    →    System receives the data
data (prices, stock,      →    System creates/updates products
descriptions, photos)     →    System applies your pricing rules
                          →    Products appear on the store
```

What data comes from suppliers?
- Product name and description
- Part number / reference number
- Photos
- Supplier's price (your cost)
- How many units are in stock
- Which cars the part fits

How does the data arrive?
The system supports three methods, depending on what each supplier offers:

| Method | How It Works |
|--------|-------------|
| API (automatic connection) | The system connects directly to the supplier's system and fetches data automatically |
| XML file (data feed) | The supplier provides a web link to a file that the system downloads and reads |
| CSV/Excel file (spreadsheet) | A spreadsheet file that can be uploaded manually or fetched from a link |

## 3.2 Automatic Updates (Synchronization)

The system will automatically check suppliers for changes on a schedule you define:

- Default: Every 1 hour
- Configurable: You can set each supplier to update every 15 minutes, every hour, every 6 hours, or once a day
- What gets updated: Stock quantities and prices
- Manual option: You can also press a button to update from a supplier immediately

Example scenario:
> It's 10:00 AM. Supplier A has 50 brake pads in stock at €15 each.
> At 11:00 AM, the system checks again. Supplier A now has 48 brake pads at €15 each.
> The store automatically updates to show 48 in stock. No action needed from you.

## 3.3 What Happens When Something Goes Wrong?

- If a supplier update fails (e.g., their system is down), the store keeps showing the last known data
- The system will try again up to 3 times
- If it still fails, you get a notification alert
- The store never goes down because of a supplier issue — it simply keeps the old data until the next successful update

## 3.4 Multiple Suppliers

The store supports working with many suppliers at the same time:

- The same part can come from more than one supplier
- The system tracks stock and price from each supplier separately
- You can mark a "preferred supplier" for each product
- If one supplier runs out, the product stays available if another supplier has stock

---

# 4. Automatic Pricing — Margin Rules

You buy parts at a cost price from suppliers. The store needs to sell them at a higher price (your sell price). The system will calculate this automatically using rules you define.

## 4.1 How It Works

```
SUPPLIER PRICE (your cost)  +  YOUR MARGIN  =  STORE PRICE (what customer pays)
        €10.00              +     30%        =       €13.00
```

## 4.2 Types of Margin Rules

You can set margins in different ways:

| Rule Type | Example | Explanation |
|-----------|---------|-------------|
| Percentage | +30% | Add 30% to the supplier price |
| Fixed amount | +€5.00 | Add €5.00 to the supplier price |

## 4.3 Where Rules Can Be Applied

You can set different margins at different levels. The more specific rule always wins:

| Level | Example | When to Use |
|-------|---------|-------------|
| Global default | All products: +25% | A baseline margin for everything |
| Per supplier | Supplier A: +30%, Supplier B: +20% | When some suppliers are more expensive |
| Per category | Brakes: +35%, Filters: +20% | When some categories are more profitable |
| Per price range | Products under €10: +40%, Products over €50: +20% | Smaller parts usually need higher margins |
| Per product | Specific brake pad: sell at €25.00 | When you want to set an exact price |

Example with multiple rules:
> Global default: +25%
> Supplier A: +30%
> Brakes category: +35%
>
> A brake pad from Supplier A costs €10.
> Which rule applies? The most specific one — Brakes category: +35%
> Store price = €10 + 35% = €13.50

## 4.4 Manual Price Override

- You can always manually set a specific price for any product
- When you do this, the system will NOT change that price during automatic updates
- You can remove the override at any time to go back to automatic pricing

---

# 5. Automatic Stock Management

## 5.1 Hiding Out-of-Stock Products

When a product has zero stock from all suppliers:

- The system automatically hides it from the store (customers won't see it)
- When stock becomes available again, the product automatically reappears
- The product is never deleted — it is only hidden

## 5.2 Grace Period (Optional)

Sometimes stock goes to zero temporarily (e.g., a supplier is restocking). To avoid products appearing and disappearing constantly:

- You can set a waiting time (e.g., 2 hours) before the system hides a product
- If stock comes back within that time, the product stays visible
- This is optional and configurable

## 5.3 Manual Override

- You can force a product to always be visible (even with zero stock)
- You can force a product to always be hidden (even with stock available)
- This overrides the automatic behavior

---

# 6. Store Administration (Admin Panel)

## 6.1 Dashboard — Your Control Center

When you log into the admin panel, you will see a dashboard with:

- Today's sales — Number of orders and total revenue
- This week / this month — Sales overview
- Recent orders — The latest orders with their status
- Low stock alerts — Products running low on stock
- Supplier status — Whether each supplier sync is healthy or has issues
- Top selling products — Your best performers

## 6.2 Managing Products

From the admin panel, you can:

- View all products in a searchable, filterable list
- Edit any product's details, photos, pricing, and category
- Add products manually (not just from suppliers)
- Bulk actions: select multiple products to hide, show, change category, or delete
- See which supplier(s) each product comes from
- See the cost price and sell price side by side

## 6.3 Managing Categories

- Create, edit, and delete categories
- Organize them in a tree structure (parent → child → grandchild)
- Reorder categories by dragging and dropping
- Example structure:
  ```
  Car Parts
  ├── Fiat
  │   ├── Ducato
  │   │   ├── 2006–2014 Model
  │   │   │   ├── Brakes
  │   │   │   ├── Filters
  │   │   │   ├── Engine Parts
  │   │   │   └── ...
  │   │   └── 2014–Present Model
  │   ├── Punto
  │   └── 500
  ├── Volkswagen
  ├── Renault
  └── ...
  ```

## 6.4 Managing Orders

For each order, you can:

- See customer details, items ordered, and total
- Update the order status:
  - Pending → Order placed, awaiting confirmation
  - Confirmed → Payment received
  - Processing → Being prepared for shipping
  - Shipped → Sent to customer (add tracking number here)
  - Delivered → Customer received it
  - Cancelled → Order cancelled (stock is restored)
  - Refunded → Money returned to customer
- Add a tracking number and shipping company
- The customer gets an email notification whenever the status changes
- Generate an invoice (PDF) for each order

## 6.5 Managing Suppliers

For each supplier, you can:

- Set up the connection (API details, feed URL, or file upload)
- Define which data fields map to which product fields
- Set the sync schedule (how often to update)
- Turn a supplier on or off
- See sync history: when it last ran, whether it succeeded, how many products were updated
- Trigger a manual sync with one click

## 6.6 Managing Margin Rules

- View all active margin rules in one place
- Add, edit, or remove rules
- See a preview of how a rule change would affect prices before saving

## 6.7 Reports

Basic reports will be available:

- Sales report — Revenue by day/week/month, filterable by date range and category
- Stock report — Current stock levels, low-stock products
- Supplier report — Products per supplier, sync success rates

---

# 7. Customer Communication

## 7.1 Emails the System Will Send Automatically

| When | Email Sent |
|------|-----------|
| Customer registers | Welcome email with account confirmation |
| Customer places an order | Order confirmation with details and order number |
| Order status changes | Status update (e.g., "Your order has been shipped") |
| Tracking number added | Shipping notification with tracking information |
| Password reset requested | Password reset link |

## 7.2 Admin Notifications

| When | Notification |
|------|-------------|
| New order placed | Alert to admin |
| Supplier sync fails | Warning with details |
| Product stock reaches low threshold | Low stock alert |

---

# 8. Languages

- The store will be available in Portuguese (Portugal) as the primary language
- English will be available as a secondary language
- Customers can switch between languages on the website

---

# 9. Mobile Experience

- The store will work perfectly on phones, tablets, and computers
- The layout will automatically adjust to fit any screen size
- All features (browsing, searching, adding to cart, checkout) will work on mobile
- The admin panel is designed for use on a computer, but will be usable on tablets

---

# 10. Payment Methods

The store will support the following payment options (to be confirmed):

| Payment Method | Description |
|----------------|-------------|
| Credit/Debit Card | Visa, Mastercard — processed securely through Stripe |
| PayPal | Pay with PayPal account or guest checkout |
| MB Way | Popular mobile payment method in Portugal |

VAT (IVA) will be calculated automatically according to Portuguese and EU rules and shown clearly during checkout.

---

# 11. Security & Privacy

The store will protect customer data through:

- All data transmitted over a secure, encrypted connection (HTTPS — the padlock icon in the browser)
- Passwords stored in encrypted form (no one can read them, not even the admin)
- Payment information handled entirely by the payment provider (the store never sees or stores card numbers)
- Protection against common web attacks (fraud, bots, unauthorized access)
- Login protection: accounts are temporarily locked after multiple failed login attempts
- GDPR Compliance: Customers can request to download their data or delete their account, as required by EU law

---

# 12. What You Will Need to Provide

Before development begins, we will need the following from you:

| Item | Details |
|------|---------|
| Supplier information | API documentation, feed URLs, or sample CSV/Excel files from each supplier |
| Supplier credentials | API keys, login details, or access credentials for each supplier |
| Margin strategy | Your desired pricing rules (see Section 4) |
| Payment gateway accounts | Stripe, PayPal, and/or MB Way merchant accounts |
| Store branding | Logo, brand colors, and any design preferences |
| Domain name | The web address for the store (e.g., www.yourstore.pt) |
| Hosting preferences | If you have existing hosting, or we can recommend a provider |
| Content | About Us page, Contact information, Terms & Conditions, Privacy Policy, Return Policy |
| Email account | SMTP details for sending order confirmations and notifications |
| Tax information | VAT rate(s) applicable, NIF for invoicing |

---

# 13. Development Phases

The project will be built in phases so you can see progress along the way and provide feedback:

## Phase 1 — Foundation
What you'll see: The basic structure of the store and admin panel. You can log in, see the dashboard, and manage categories.

## Phase 2 — Supplier Engine
What you'll see: Products start appearing automatically from your suppliers. You can set margin rules and see prices calculated. Stock syncs on a schedule.

## Phase 3 — Storefront
What you'll see: The customer-facing store is live. Visitors can browse products, search by vehicle, and add items to cart.

## Phase 4 — Orders & Payments
What you'll see: Customers can complete purchases, pay online, and receive confirmation emails. You can manage orders in the admin panel.

## Phase 5 — Polish & Launch
What you'll see: Everything is refined, tested, and ready for real customers. Performance is optimized, and the store goes live.

---

# 14. After Launch — Ongoing Operations

Once the store is live, these things happen automatically:

| What | How Often |
|------|-----------|
| Supplier stock & price updates | Every hour (or your chosen interval) |
| Out-of-stock products hidden | Automatically |
| Restocked products shown | Automatically |
| Prices recalculated | Whenever supplier prices change |
| Database backups | Daily |
| Security updates | As needed |

You will only need to:

- Process and ship orders
- Monitor the dashboard for alerts
- Adjust margin rules as needed
- Add new suppliers if desired
- Handle customer inquiries

---

# 15. Summary of Key Features

| # | Feature | Included |
|---|---------|----------|
| 1 | Product import from suppliers (API, XML, CSV) | Yes |
| 2 | Automatic stock synchronization | Yes |
| 3 | Automatic price synchronization | Yes |
| 4 | Configurable sync schedule (e.g., hourly) | Yes |
| 5 | Automatic margin/markup on supplier prices | Yes |
| 6 | Multiple margin rule levels (global, supplier, category, product) | Yes |
| 7 | Automatic hiding of out-of-stock products | Yes |
| 8 | Support for multiple suppliers | Yes |
| 9 | Vehicle-based part search (make/model/year) | Yes |
| 10 | Full-text product search with autocomplete | Yes |
| 11 | Shopping cart and secure checkout | Yes |
| 12 | Multiple payment methods | Yes |
| 13 | Order management with status tracking | Yes |
| 14 | Customer accounts with order history | Yes |
| 15 | Admin dashboard with reports | Yes |
| 16 | Invoice generation (PDF) | Yes |
| 17 | Email notifications (orders, shipping, alerts) | Yes |
| 18 | Portuguese and English languages | Yes |
| 19 | Mobile-friendly design | Yes |
| 20 | GDPR compliance | Yes |

---

# Approval

By approving this document, you confirm that the features described above match your expectations for the car parts online store. Any changes requested after development begins may affect the timeline and cost.

| | Name | Date | Signature |
|---|------|------|-----------|
| Client | _________________ | _________________ | _________________ 
---

*This document describes WHAT the system will do. The technical details of HOW it will be built are documented separately in the Software Requirements Specification (SRS).*
