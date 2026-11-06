# Mister Ceramic – Premium Automotive Detailing Website & Workshop Management Platform

A modern, visually stunning, full-stack web application and workshop operations platform built for **Mister Ceramic**, a professional car and motorcycle detailing, paint protection, and restoration studio in **Chegamanadu, Kottarakkara, Kollam, Kerala, India**.

---

## 🌟 Key Highlights & Architecture

### 1. Brand Identity & Visual Aesthetic
- **Luxury Automotive Studio Aesthetic**: Deep charcoal (`#08090B`) and black backgrounds, metallic silver gradients, and subtle champagne gold accents (`#D4AF37`).
- **Cinematic Photography**: High-resolution imagery of paint correction, reflection depth, ceramic beading, and superbike detailing.
- **Custom Shield Logo**: Geometric diamond-faceted emblem and sleek typography reflecting precision craftsmanship.
- **Interactive Before-and-After Comparison Slider**: Draggable optical divider comparing swirled paint vs mirror ceramic finishes.
- **Floating WhatsApp Connect**: One-click direct communication with pre-filled studio inquiries (`+91 92072 09105`).

### 2. Public Business Platform
- **Homepage (`/`)**: 10 dedicated sections including cinematic hero, brand philosophy, core disciplines, featured protection services, interactive transformation slider, studio excellence, recent deliveries, verified testimonials, booking CTA, and embedded Google Maps for Chegamanadu studio.
- **Services Catalogue (`/services`) & Detail Pages (`/services/[slug]`)**:
  - **Car Protection**: Paint Protection Film (PPF), Borophene 10H Coating, 9H Ceramic Quartz Coating, Graphene Coating, Sunfilm Installation.
  - **Car Detailing & Restoration**: Multi-Stage Paint Correction, Deep Interior Steam Detailing, Car Down-Draft Booth Respray & Restoration.
  - **Bike Services**: Motorcycle & Superbike 9H Ceramic Coating, Custom Tank & Console PPF Wrap, Nut-and-Bolt Detailing & Custom Painting.
  - Each service includes duration, application workflow, suitable vehicles, configured packages, warranty terms, and direct booking links.
- **Our Work / Portfolio (`/work`)**:
  - Filterable by 11 categories: PPF, Borophene, Ceramic, Graphene, Sunfilm, Car Detailing, Bike Detailing, Car Painting, Bike Painting, Restoration.
  - Before-and-after sliders and high-resolution photo lightbox.
- **About Us (`/about`)**: Studio philosophy, cleanroom installation bay, shortwave IR curing lamps, ultrasonic paint depth gauges.
- **Contact Page (`/contact`)**: Studio address, phone, WhatsApp, directions button, operating hours, and live inquiry submission form.

### 3. Real Appointment Booking System (`/book`)
- **7-Step Intuitive Flow**:
  1. Vehicle Classification (Car vs Bike).
  2. Vehicle Details (Brand, Model, Registration, Colour).
  3. Service Selection (Filtered for vehicle type).
  4. Treatment Package Selection (with features, pricing, warranty).
  5. Schedule Preferred Date & Drop-off Time Slot.
  6. Customer Details, Special Notes & Optional Vehicle Condition Photos.
  7. Review & Submit Booking.
- **Conflict Prevention**: Validates daily workshop bay intake limits (configurable in settings) to prevent overbooking confirmed slots.
- **Immediate Tracking Reference**: Generates unique reference code (`MC-YYYYMM-XXXX`) and WhatsApp notification link.

### 4. Live Customer Service Tracking (`/track`)
- **Secure Access Verification**: Verified via Booking Reference + Customer Phone Number (prevents unauthorized snooping).
- **10 Defined Status Stages**:
  1. *Booking Received*
  2. *Booking Confirmed*
  3. *Vehicle Received*
  4. *Initial Inspection*
  5. *Preparation and Cleaning*
  6. *Service in Progress*
  7. *Quality Inspection*
  8. *Ready for Delivery*
  9. *Delivered*
  10. *Cancelled*
- **Chronological Workshop Feed**: Real-time progress updates with milestone photos posted directly from the studio cleanroom.
- **Privacy Assurance**: Internal workshop technician notes are strictly hidden from customers.

### 5. Secure Admin Dashboard (`/admin`)
- **Role-Based Access Control**:
  - `ADMIN`: Full access to bookings, services, gallery, testimonials, business settings, and staff accounts.
  - `STAFF`: Access to bookings, bay intake, status history updates, and progress photo publishing.
- **Dashboard Overview (`/admin`)**: Live counts for total bookings, pending requests, confirmed slots, vehicles currently in bays, and ready deliveries.
- **Booking Management (`/admin/bookings`)**: Search by ID/phone/vehicle, filter by status, approve/reschedule, update status with audit history log, set expected delivery dates, add internal notes, and upload workshop progress photos.
- **Services Management (`/admin/services`)**: Create/edit treatments, configure packages, durations, and pricing.
- **Gallery Management (`/admin/gallery`)**: Upload before/after images, project cases, and vehicle specs.
- **Website Settings (`/admin/settings`)**: Update studio operating hours, address, phone numbers, Google Maps URL, and max daily intake slots.
- **Staff Accounts (`/admin/users`)**: Create and manage staff accounts and roles.

---

## 🛠 Technology Stack

- **Framework**: Next.js 14.2 (App Router, Server Actions, API Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom luxury automotive dark theme & metallic gold gradients
- **Icons**: Lucide React
- **ORM / Database**: Prisma ORM with SQLite for zero-config local execution & PostgreSQL/Supabase schema (`supabase/schema.sql`) for cloud deployment.
- **Authentication**: JWT session tokens signed with `jose` and HTTP-only cookies, password hashing with `bcryptjs`.
- **File Storage**: Local uploads to `public/uploads` with MIME validation + Supabase Storage compatibility.
- **SEO**: Dynamic `sitemap.xml`, `robots.txt`, Open Graph metadata, and `schema.org/AutoRepair` JSON-LD structured data for Kottarakkara and Kollam local search optimization.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup & Seeding
```bash
# Push schema to SQLite database
npx prisma db push

# Seed verified services, projects, testimonials, and demo accounts
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Configured Demo Credentials

### Studio Admin Portal: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Workshop Director (ADMIN)** | `admin@misterceramic.com` | `Admin@MisterCeramic2026` | Full Studio Management |
| **Lead Detailer (STAFF)** | `staff@misterceramic.com` | `Staff@MisterCeramic2026` | Intake, Bookings & Updates |

### Demo Vehicle Live Tracking: [http://localhost:3000/track](http://localhost:3000/track)
- **Booking Reference**: `MC-202611-0101`
- **Registered Phone**: `9207209105`
- **Vehicle**: BMW M3 Competition (Isle of Man Green Metallic)
- **Current Status**: *Service in Progress* (with ultrasonic paint depth readings & cleanroom TPU wrap photos)

---

## 📍 Business Information & Local SEO

- **Brand**: MISTER CERAMIC
- **Location**: Chegamanadu, Kottarakkara, Kollam, Kerala, India - 691506
- **Phone**: +91 92072 09105
- **Official Google Maps**: [View on Google Maps](https://www.google.com/maps/place/mister+ceramic/data=!4m2!3m1!1s0x3b0675fb65d87319:0x41a9e67271dc0506)
- **Target Keywords**: *Car detailing in Kottarakkara, PPF installation in Kottarakkara, Ceramic coating in Kollam, Borophene coating in Kollam, Bike detailing in Kollam, Car painting in Kottarakkara*.
