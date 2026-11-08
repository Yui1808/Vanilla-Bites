# VANILLA BITES — Haute Multi-Restaurant Food Ordering Marketplace

An architectural, multi-vendor culinary marketplace uniting independent master chefs, artisanal bakeries, and wood-fired pizzerias with discerning epicures. Powered by Next.js 14 App Router, Three.js / React Three Fiber 3D visuals, Prisma ORM, and a dedicated in-house restaurant fleet delivery architecture.

---

## 🍨 01. Visual Identity & Design System

The application embodies the **"Vanilla Aesthetic"** — luxury food advertising, editorial layouts, and immersive 3D product experiences.

### Color Palette
- **Vanilla Cream:** `#FFF8ED` (Primary Canvas)
- **Warm Ivory:** `#F8EBD8` (Elevated Layers)
- **Caramel:** `#C58B52` (Artisan Accents & Highlights)
- **Chocolate:** `#432719` (Editorial Headings & Contrasts)
- **Espresso:** `#251710` (Primary Structural Typography)
- **Soft Peach:** `#F4C9A4` (Glows & Micro-interactions)
- **White:** `#FFFFFF` (Card Backgrounds)

---

## 🏛️ 02. Core Business Architecture

### Non-Aggregated Restaurant-Direct Delivery Fleet
> **Crucial Rule:** Unlike standard aggregators (Swiggy/Zomato/DoorDash), VANILLA BITES **does not operate a centralized anonymous courier fleet**.
> 
> Each independent restaurant:
> 1. Registers, maintains, and manages its own dedicated delivery staff.
> 2. Equips couriers with temperature-controlled thermal packaging.
> 3. Dispatches and marks orders as `OUT_FOR_DELIVERY` and `DELIVERED`.
> 4. Customers receive real-time timestamped status updates with the assigned courier's name, vehicle model, and direct phone link.

### Single-Restaurant Cart Governance
- A customer basket holds items from **one restaurant at a time** to guarantee kitchen integrity and dispatch accountability.
- If a user attempts to add an item from another kitchen, a non-intrusive conflict modal allows them to either keep their existing basket or clear & switch.

---

## 💎 03. Key Features & Workflows

### 1. Interactive 3D Hero (`Three.js` / `@react-three/fiber` / `@react-three/drei`)
- Interactive centerpiece gourmet burger / vanilla dessert model.
- Procedural PBR materials with butter-glazed brioche bun, sesame seeds, molten raclette cheese, caramelized onion jam, and crisp organic lettuce.
- Floating caramelized shards, vanilla bean wafers, and ambient light reflections.
- Mouse parallax tilt and floating physics.

### 2. Discover & Storefronts (`/restaurants` & `/restaurants/[slug]`)
- Curation filters: Cuisine, 4.8+ Michelin & Guest rating, <30 Min express delivery, Open Now.
- Dedicated storefront page with restaurant cover, opening hours, delivery charges, min order, and guest reviews.
- Sticky category pills with smooth navigation.
- Bespoke dish customization modal (bun choices, toppings, cheese glazes, spice levels, cooking notes).

### 3. Cart & Server-Validated Checkout (`/checkout`)
- Price calculation strictly computed in **integer paise** (`amountInPaise`) to eliminate floating-point arithmetic errors.
- Real-time coupon engine (`VANILLA20`, `FEAST100`).
- Server-side price recalculation: client prices are never trusted.
- Payment options:
  - **Razorpay Test Mode:** Server-side HMAC SHA256 signature verification.
  - **Cash on Delivery (COD).**

### 4. Live Order Lifecycle Tracking (`/orders/[orderNumber]`)
- Real-time visual lifecycle stepper:
  `PENDING` → `ACCEPTED` → `PREPARING` → `READY_FOR_PICKUP` → `OUT_FOR_DELIVERY` → `DELIVERED`
- In-house courier details (Name, vehicle, direct call trigger).
- Complete timestamped audit history and itemized receipt.
- Background polling (`/api/orders/status`) for automated status updates.

### 5. Restaurant Control Suite (`/restaurant-dashboard`)
- **Overview & KPIs:** Revenue, active orders, today's volume, best sellers.
- **Kitchen & Dispatch Console:** Real-time order lifecycle advancement buttons and delivery staff assignment dropdown.
- **Menu Management:** Add dishes, set prices in ₹ INR, toggle stock availability, upload imagery.
- **Courier Fleet Management:** Register in-house delivery ambassadors (Name, Phone, Vehicle, Status).

### 6. Super Admin Console (`/admin`)
- Platform-wide GMV analytics, restaurant approvals/suspensions, user directories, coupon management, and global order audits.

---

## 🔑 04. Demo Accounts & Credentials

The database comes pre-seeded with realistic culinary demo data:

| Role | Email | Password | Access Route |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@vanillabites.com` | `admin123` | `/admin` |
| **Restaurant Owner** | `chef.marcus@vanillabites.com` | `password123` | `/restaurant-dashboard` |
| **Restaurant Owner 2** | `isabella@vanillabites.com` | `password123` | `/restaurant-dashboard` |
| **Customer** | `sophia@example.com` | `password123` | `/dashboard` |

> *Tip: On the `/login` page, you can click any of the 1-click demo credential pills to populate credentials automatically.*

---

## 🛠️ 05. Local Installation & Development

### 1. Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm

### 2. Setup
```bash
# Clone or enter the workspace
cd fake

# Install dependencies
npm install

# Push Prisma schema to SQLite database (dev.db)
npx prisma db push

# Seed realistic restaurants, dishes, coupons, orders, and delivery staff
npm run prisma:seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📦 06. Environment Variables (`.env`)

```env
# Database URL (SQLite for local zero-config, or PostgreSQL in production)
DATABASE_URL="file:./dev.db"

# JWT Secret for Session Authentication
JWT_SECRET="vanilla-bites-luxury-artisan-jwt-secret-key-998877"

# Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Razorpay Test Credentials (Test Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_mock_vanilla_bites"
RAZORPAY_KEY_ID="rzp_test_mock_vanilla_bites"
RAZORPAY_KEY_SECRET="mock_secret_key_vanilla_bites"
```

---

## 🚀 07. Production & Cloud Deployment (Vercel / Railway / Supabase)

1. **Database:**
   To deploy to Supabase or AWS RDS PostgreSQL, update `provider = "postgresql"` in `prisma/schema.prisma` and supply your PostgreSQL `DATABASE_URL`.
2. **Environment Variables:** Set `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, and real Razorpay credentials in your production host environment settings.
3. **Deploy:** Deploy directly with Vercel (`vercel`) or containerize with Docker.

