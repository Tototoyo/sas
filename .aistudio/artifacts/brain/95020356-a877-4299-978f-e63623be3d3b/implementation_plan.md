# Implementation Plan: Supabase PostgreSQL Integration for The Hideaway

Connect The Hideaway Hostel Management System to an external Supabase PostgreSQL database, enabling cloud persistence, real-time multi-device access, and centralized storage for rooms, bookings, staff credentials, bonus logic, and financial records.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your confirmed choices in Phase 1:
> - **Connection Strategy**: Connect directly to your external Supabase project via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` defined in `.env` / `.env.example`.
> - **Data Synchronization Scope**: Full cloud persistence across all modules (Rooms & Beds, Walk-ins, Online Bookings, Activities & Boat Tours, Staff Directory, Salaries & Bonuses, Utilities, and Accounting).
> - **Authentication & Password Management**: Store staff login credentials and the Admin Master Password hash securely in a dedicated Supabase `system_config` and `staff_members` table, preserving the current streamlined hostel workflow.
> - **Zero-Disruption Fallback**: The app will include automatic fallback to local offline storage if Supabase credentials are not yet populated in the environment, preventing any downtime or blank screen while setting up your project.

---

## 1. Overview & Core Concept

Currently, The Hideaway operates with rich client-side and `localStorage` state. Integrating Supabase introduces a scalable, cloud-hosted relational database (PostgreSQL) hosted on Supabase, allowing:
- **Multi-Device Live Sync**: Managers, front desk staff, and boat coordinators can access the system simultaneously from laptops, tablets, or phones with data persisting to the cloud.
- **Centralized Staff & Admin Control**: Admin can modify staff credentials or change the Master Password from anywhere, instantly reflected across all devices.
- **Relational Integrity**: Foreign keys ensure bookings cleanly link to activities, staff commissions track to employee IDs, and dorm bed reservations maintain consistent state.

---

## 2. User Experience & Visual Design

- **Connection Status Indicator**: A subtle, non-intrusive status pill in the top navigation header showing database connectivity (`🟢 Supabase Connected` or `🟡 Local Mode (Offline)` with a tooltip).
- **Settings & Supabase Setup Drawer (Admin Only)**: An Admin-only configuration dialog where the admin can view the connected Supabase Project URL, test connection latency, or run a one-click **"Export Local Data to Supabase"** migration to seed the database with current hostel records.
- **Instant Optimistic UI**: UI interactions (adding a walk-in, updating a bed condition, recording a bonus) update immediately in the interface while syncing to Supabase in the background, ensuring zero latency for front-desk operations.
- **Retained Visual Branding**: Maintains The Hideaway's tropical hostel aesthetic with crisp Tailwind CSS typography, responsive mobile cards, and clear tab navigation.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Hybrid Client-Service Architecture
- **Chosen Approach**: Use the official `@supabase/supabase-js` SDK with a centralized repository layer (`src/services/supabaseService.ts`).
- **Why**: Keeps frontend components clean and modular. Components interact through repository methods (`getRooms()`, `saveBooking()`, `updateStaff()`) rather than raw SQL or scattered API calls.
- **Alternative Considered**: Full backend REST server with Express and Prisma/Drizzle. Passed over to minimize operational overhead and leverage Supabase's built-in REST and real-time capabilities.

### Decision 2: Fallback & Offline Resilience
- **Chosen Approach**: Dual-mode storage. If Supabase keys are not set, the app gracefully runs in Local Storage mode with seed data intact. Once keys are provided, it auto-connects to cloud PostgreSQL.
- **Why**: Protects the hostel system from disruption during project setup, credential rotation, or network loss on Koh Lipe.

### Decision 3: Custom Staff & Admin Auth Table vs. Supabase Auth
- **Chosen Approach**: Manage hostel logins via Supabase PostgreSQL tables (`staff_members` and `system_config`) rather than requiring personal email addresses and verification links for each local hostel employee.
- **Why**: Hostel receptionists and boat crew often share shifts or operational accounts. Admins can directly set and view credentials in the Staff & HR UI without external email confirmations.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        The Hideaway Application                        │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 React UI & Management Modules                  │   │
│   │   [Rooms & Beds] [Booking] [Staff & HR] [Utilities] [Activities]│   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│   ┌────────────────────────────────▼───────────────────────────────┐   │
│   │             Data Repository Layer (supabaseService)            │   │
│   │   - Optimistic state cache                                     │   │
│   │   - Dual-mode router (Supabase Cloud <──> Local Storage)       │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     ▼ (HTTPS / WSS)
┌────────────────────────────────────────────────────────────────────────┐
│                     Supabase External Project                          │
│                                                                        │
│   ┌────────────────────────┐  ┌───────────────────────────────────┐    │
│   │   PostgreSQL Engine    │  │   Supabase PostgREST API          │    │
│   ├────────────────────────┴──┴───────────────────────────────────┤    │
│   │  Tables:                                                      │    │
│   │  - system_config (master_password, property_settings)         │    │
│   │  - staff_members (id, name, role, salary, login_id, password) │    │
│   │  - staff_bonuses, staff_advances, staff_absences, shifts      │    │
│   │  - rooms, beds (bungalows & dorms, condition, status)         │    │
│   │  - walk_in_guests, accommodation_bookings                     │    │
│   │  - activities, speedboat_trips, taxi_options, extras          │    │
│   │  - bookings (tour bookings, commission math, fuel/cost)        │    │
│   │  - utility_records, utility_categories                        │    │
│   │  - external_sales, platform_payments                          │    │
│   └───────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

### Complete SQL Migration Script (Ready for Supabase SQL Editor)

```sql
-- 1. System Configuration & Master Access
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default master password
INSERT INTO system_config (key, value)
VALUES ('admin_master_password', '"admin888"')
ON CONFLICT (key) DO NOTHING;

-- 2. Staff Members & Credentials
CREATE TABLE IF NOT EXISTS staff_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Staff',
    salary NUMERIC NOT NULL DEFAULT 0,
    contact TEXT,
    employee_id TEXT NOT NULL UNIQUE,
    login_id TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Staff HR: Bonuses, Advances, Absences, Tasks, Shifts
CREATE TABLE IF NOT EXISTS staff_bonuses (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS staff_advances (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS staff_absences (
    id TEXT PRIMARY KEY,
    staff_id TEXT REFERENCES staff_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS staff_tasks (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    assigned_to TEXT REFERENCES staff_members(id) ON DELETE SET NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS staff_shifts (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    staff_name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL
);

-- 4. Rooms and Beds
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    condition TEXT NOT NULL DEFAULT 'Good',
    maintenance_notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS beds (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Ready'
);

-- 5. Bookings: Walk-ins & Online Platforms
CREATE TABLE IF NOT EXISTS walk_in_guests (
    id TEXT PRIMARY KEY,
    guest_name TEXT NOT NULL,
    room_id TEXT REFERENCES rooms(id),
    bed_number INTEGER,
    check_in_date DATE NOT NULL,
    number_of_nights INTEGER NOT NULL DEFAULT 1,
    price_per_night NUMERIC NOT NULL,
    amount_paid NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    nationality TEXT,
    id_number TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS accommodation_bookings (
    id TEXT PRIMARY KEY,
    guest_name TEXT NOT NULL,
    platform TEXT NOT NULL,
    room_id TEXT REFERENCES rooms(id),
    bed_number INTEGER,
    check_in_date DATE NOT NULL,
    number_of_nights INTEGER NOT NULL DEFAULT 1,
    total_price NUMERIC NOT NULL,
    amount_paid NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Deposit Paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Activities, Tours, Boats & Bookings
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
    commission NUMERIC DEFAULT 0,
    type TEXT NOT NULL DEFAULT 'Internal',
    company_cost NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS speedboat_trips (
    id TEXT PRIMARY KEY,
    route TEXT NOT NULL,
    company TEXT NOT NULL,
    price NUMERIC NOT NULL,
    cost NUMERIC NOT NULL,
    commission NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS taxi_boat_options (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    commission NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS extras (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    commission NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS activity_bookings (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    item_name TEXT NOT NULL,
    staff_id TEXT REFERENCES staff_members(id),
    booking_date DATE NOT NULL,
    customer_price NUMERIC NOT NULL,
    number_of_people INTEGER NOT NULL DEFAULT 1,
    discount NUMERIC DEFAULT 0,
    extras JSONB,
    extras_total NUMERIC DEFAULT 0,
    payment_method TEXT NOT NULL,
    receipt_image TEXT,
    fuel_cost NUMERIC DEFAULT 0,
    captain_cost NUMERIC DEFAULT 0,
    item_cost NUMERIC DEFAULT 0,
    employee_commission NUMERIC DEFAULT 0,
    hostel_commission NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Utilities & Financial Extras
CREATE TABLE IF NOT EXISTS utility_records (
    id TEXT PRIMARY KEY,
    utility_type TEXT NOT NULL,
    date DATE NOT NULL,
    cost NUMERIC NOT NULL,
    bill_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS external_sales (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS platform_payments (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    platform TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    booking_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 5. Step-by-Step Implementation Strategy

1. **Step 1: Install `@supabase/supabase-js` Dependency**
   - Install the official Supabase JavaScript SDK.
2. **Step 2: Environment Configuration & Client Setup**
   - Create `src/lib/supabase.ts` with singleton client initialization and `.env.example` guidance for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. **Step 3: Service & Synchronization Layer (`src/services/supabaseService.ts`)**
   - Provide strongly typed CRUD operations for all hostel entities.
   - Include auto-sync from current local mock data to Supabase if the database is initially empty.
4. **Step 4: Connect UI State in `App.tsx`**
   - Bind rooms, walk-in bookings, staff credentials, bonus calculations, and activities to the Supabase data service.
   - Add connection status indicator in the top header.
5. **Step 5: Admin Supabase Connection Settings Modal**
   - Give Admin the ability to input/test their Supabase project URL & key directly or check sync status.
6. **Step 6: Build Verification**
   - Run `compile_applet` to confirm zero TypeScript and bundling errors.
