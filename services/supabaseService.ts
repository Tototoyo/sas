import { getSupabaseClient } from '../lib/supabase';
import type {
  Staff,
  Shift,
  Task,
  Absence,
  SalaryAdvance,
  Bonus,
  Room,
  Bed,
  WalkInGuest,
  AccommodationBooking,
  Activity,
  SpeedBoatTrip,
  TaxiBoatOption,
  Extra,
  Booking,
  UtilityRecord,
  ExternalSale,
  PlatformPayment,
} from '../types';

export interface AllHostelData {
  staff: Staff[];
  shifts: Shift[];
  tasks: Task[];
  absences: Absence[];
  salaryAdvances: SalaryAdvance[];
  bonuses: Bonus[];
  rooms: Room[];
  walkInGuests: WalkInGuest[];
  accommodationBookings: AccommodationBooking[];
  activities: Activity[];
  speedBoatTrips: SpeedBoatTrip[];
  taxiBoatOptions: TaxiBoatOption[];
  extras: Extra[];
  bookings: Booking[];
  utilityRecords: UtilityRecord[];
  externalSales: ExternalSale[];
  platformPayments: PlatformPayment[];
  adminMasterPassword?: string;
}

export const SUPABASE_SQL_SCHEMA = `-- The Hideaway: Complete PostgreSQL Schema for Supabase
-- Run this script once in your Supabase SQL Editor (SQL Editor -> New Query -> Run)

-- 1. System Configuration & Master Access
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
    beds JSONB DEFAULT '[]'::jsonb,
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
`;

/**
 * Fetch all records from Supabase tables to hydrate application state.
 */
export async function fetchAllFromSupabase(): Promise<Partial<AllHostelData> | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const [
      staffRes,
      shiftsRes,
      tasksRes,
      absencesRes,
      advancesRes,
      bonusesRes,
      roomsRes,
      walkInRes,
      accommodationRes,
      activitiesRes,
      speedboatRes,
      taxiRes,
      extrasRes,
      bookingsRes,
      utilitiesRes,
      externalSalesRes,
      platformPaymentsRes,
      configRes,
    ] = await Promise.all([
      client.from('staff_members').select('*'),
      client.from('staff_shifts').select('*'),
      client.from('staff_tasks').select('*'),
      client.from('staff_absences').select('*'),
      client.from('staff_advances').select('*'),
      client.from('staff_bonuses').select('*'),
      client.from('rooms').select('*'),
      client.from('walk_in_guests').select('*'),
      client.from('accommodation_bookings').select('*'),
      client.from('activities').select('*'),
      client.from('speedboat_trips').select('*'),
      client.from('taxi_boat_options').select('*'),
      client.from('extras').select('*'),
      client.from('activity_bookings').select('*'),
      client.from('utility_records').select('*'),
      client.from('external_sales').select('*'),
      client.from('platform_payments').select('*'),
      client.from('system_config').select('*'),
    ]);

    const result: Partial<AllHostelData> = {};

    if (staffRes.data && staffRes.data.length > 0) {
      result.staff = staffRes.data.map((s: any) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        salary: Number(s.salary) || 0,
        contact: s.contact || '',
        employeeId: s.employee_id,
        loginId: s.login_id,
        password: s.password,
      }));
    }

    if (shiftsRes.data && shiftsRes.data.length > 0) {
      result.shifts = shiftsRes.data.map((sh: any) => ({
        id: sh.id,
        date: sh.date,
        staffName: sh.staff_name,
        startTime: sh.start_time,
        endTime: sh.end_time,
      }));
    }

    if (tasksRes.data && tasksRes.data.length > 0) {
      result.tasks = tasksRes.data.map((t: any) => ({
        id: t.id,
        description: t.description,
        assignedTo: t.assigned_to || '',
        dueDate: t.due_date,
        status: t.status,
      }));
    }

    if (absencesRes.data && absencesRes.data.length > 0) {
      result.absences = absencesRes.data.map((a: any) => ({
        id: a.id,
        staffId: a.staff_id,
        date: a.date,
        reason: a.reason,
      }));
    }

    if (advancesRes.data && advancesRes.data.length > 0) {
      result.salaryAdvances = advancesRes.data.map((adv: any) => ({
        id: adv.id,
        staffId: adv.staff_id,
        date: adv.date,
        amount: Number(adv.amount) || 0,
        reason: adv.reason,
      }));
    }

    if (bonusesRes.data && bonusesRes.data.length > 0) {
      result.bonuses = bonusesRes.data.map((b: any) => ({
        id: b.id,
        staffId: b.staff_id,
        date: b.date,
        amount: Number(b.amount) || 0,
        reason: b.reason,
      }));
    }

    if (roomsRes.data && roomsRes.data.length > 0) {
      result.rooms = roomsRes.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        condition: r.condition,
        maintenanceNotes: r.maintenance_notes || '',
        beds: Array.isArray(r.beds) ? r.beds : [],
      }));
    }

    if (walkInRes.data && walkInRes.data.length > 0) {
      result.walkInGuests = walkInRes.data.map((w: any) => ({
        id: w.id,
        guestName: w.guest_name,
        roomId: w.room_id || '',
        bedNumber: w.bed_number ? Number(w.bed_number) : undefined,
        checkInDate: w.check_in_date,
        numberOfNights: Number(w.number_of_nights) || 1,
        pricePerNight: Number(w.price_per_night) || 0,
        amountPaid: Number(w.amount_paid) || 0,
        paymentMethod: w.payment_method,
        nationality: w.nationality,
        idNumber: w.id_number,
        notes: w.notes,
        status: w.status,
      }));
    }

    if (accommodationRes.data && accommodationRes.data.length > 0) {
      result.accommodationBookings = accommodationRes.data.map((ab: any) => ({
        id: ab.id,
        guestName: ab.guest_name,
        platform: ab.platform,
        roomId: ab.room_id || '',
        bedNumber: ab.bed_number ? Number(ab.bed_number) : undefined,
        checkInDate: ab.check_in_date,
        numberOfNights: Number(ab.number_of_nights) || 1,
        totalPrice: Number(ab.total_price) || 0,
        amountPaid: Number(ab.amount_paid) || 0,
        status: ab.status,
      }));
    }

    if (activitiesRes.data && activitiesRes.data.length > 0) {
      result.activities = activitiesRes.data.map((act: any) => ({
        id: act.id,
        name: act.name,
        description: act.description || '',
        price: Number(act.price) || 0,
        imageUrl: act.image_url || '',
        commission: Number(act.commission) || 0,
        type: act.type || 'Internal',
        companyCost: Number(act.company_cost) || 0,
      }));
    }

    if (speedboatRes.data && speedboatRes.data.length > 0) {
      result.speedBoatTrips = speedboatRes.data.map((sb: any) => ({
        id: sb.id,
        route: sb.route,
        company: sb.company,
        price: Number(sb.price) || 0,
        cost: Number(sb.cost) || 0,
        commission: Number(sb.commission) || 0,
      }));
    }

    if (taxiRes.data && taxiRes.data.length > 0) {
      result.taxiBoatOptions = taxiRes.data.map((tx: any) => ({
        id: tx.id,
        name: tx.name,
        price: Number(tx.price) || 0,
        commission: Number(tx.commission) || 0,
      }));
    }

    if (extrasRes.data && extrasRes.data.length > 0) {
      result.extras = extrasRes.data.map((ex: any) => ({
        id: ex.id,
        name: ex.name,
        price: Number(ex.price) || 0,
        commission: Number(ex.commission) || 0,
      }));
    }

    if (bookingsRes.data && bookingsRes.data.length > 0) {
      result.bookings = bookingsRes.data.map((bk: any) => ({
        id: bk.id,
        itemId: bk.item_id,
        itemType: bk.item_type,
        itemName: bk.item_name,
        staffId: bk.staff_id || '',
        bookingDate: bk.booking_date,
        customerPrice: Number(bk.customer_price) || 0,
        numberOfPeople: Number(bk.number_of_people) || 1,
        discount: Number(bk.discount) || 0,
        extras: bk.extras || undefined,
        extrasTotal: Number(bk.extras_total) || 0,
        paymentMethod: bk.payment_method,
        receiptImage: bk.receipt_image || undefined,
        fuelCost: Number(bk.fuel_cost) || 0,
        captainCost: Number(bk.captain_cost) || 0,
        itemCost: Number(bk.item_cost) || 0,
        employeeCommission: Number(bk.employee_commission) || 0,
        hostelCommission: Number(bk.hostel_commission) || 0,
      }));
    }

    if (utilitiesRes.data && utilitiesRes.data.length > 0) {
      result.utilityRecords = utilitiesRes.data.map((u: any) => ({
        id: u.id,
        utilityType: u.utility_type,
        date: u.date,
        cost: Number(u.cost) || 0,
        billImage: u.bill_image || undefined,
      }));
    }

    if (externalSalesRes.data && externalSalesRes.data.length > 0) {
      result.externalSales = externalSalesRes.data.map((es: any) => ({
        id: es.id,
        date: es.date,
        amount: Number(es.amount) || 0,
        description: es.description || undefined,
      }));
    }

    if (platformPaymentsRes.data && platformPaymentsRes.data.length > 0) {
      result.platformPayments = platformPaymentsRes.data.map((pp: any) => ({
        id: pp.id,
        date: pp.date,
        platform: pp.platform,
        amount: Number(pp.amount) || 0,
        bookingReference: pp.booking_reference || undefined,
      }));
    }

    if (configRes.data && configRes.data.length > 0) {
      const passConfig = configRes.data.find((c: any) => c.key === 'admin_master_password');
      if (passConfig && typeof passConfig.value === 'string') {
        result.adminMasterPassword = passConfig.value;
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    return null;
  }
}

/**
 * Background entity upsert to Supabase
 */
export async function syncEntityToSupabase(tableName: string, record: Record<string, any>): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(tableName).upsert(record);
    if (error) {
      console.warn(`Supabase upsert to ${tableName} failed:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase upsert error on ${tableName}:`, err);
    return false;
  }
}

/**
 * Background entity deletion from Supabase
 */
export async function deleteEntityFromSupabase(tableName: string, id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(tableName).delete().eq('id', id);
    if (error) {
      console.warn(`Supabase delete from ${tableName} failed:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase delete error on ${tableName}:`, err);
    return false;
  }
}

/**
 * Export current local records into Supabase PostgreSQL (1-click migration)
 */
export async function seedAllLocalDataToSupabase(
  data: AllHostelData
): Promise<{ success: boolean; message: string; counts?: Record<string, number> }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client is not connected. Please save URL & Key first.' };
  }

  try {
    const counts: Record<string, number> = {};

    // 1. Staff Members
    if (data.staff.length > 0) {
      const staffRows = data.staff.map(s => ({
        id: s.id,
        name: s.name,
        role: s.role,
        salary: s.salary,
        contact: s.contact,
        employee_id: s.employeeId,
        login_id: s.loginId || s.employeeId.toLowerCase(),
        password: s.password || 'staff123',
      }));
      const { error } = await client.from('staff_members').upsert(staffRows);
      if (error) throw new Error(`Staff upload: ${error.message}`);
      counts.staff = staffRows.length;
    }

    // 2. Staff Shifts
    if (data.shifts.length > 0) {
      const shiftRows = data.shifts.map(sh => ({
        id: sh.id,
        date: sh.date,
        staff_name: sh.staffName,
        start_time: sh.startTime,
        end_time: sh.endTime,
      }));
      await client.from('staff_shifts').upsert(shiftRows);
      counts.shifts = shiftRows.length;
    }

    // 3. Staff Tasks
    if (data.tasks.length > 0) {
      const taskRows = data.tasks.map(t => ({
        id: t.id,
        description: t.description,
        assigned_to: t.assignedTo || null,
        due_date: t.dueDate,
        status: t.status,
      }));
      await client.from('staff_tasks').upsert(taskRows);
      counts.tasks = taskRows.length;
    }

    // 4. Staff Absences
    if (data.absences.length > 0) {
      const absenceRows = data.absences.map(a => ({
        id: a.id,
        staff_id: a.staffId,
        date: a.date,
        reason: a.reason || null,
      }));
      await client.from('staff_absences').upsert(absenceRows);
      counts.absences = absenceRows.length;
    }

    // 5. Staff Advances
    if (data.salaryAdvances.length > 0) {
      const advanceRows = data.salaryAdvances.map(adv => ({
        id: adv.id,
        staff_id: adv.staffId,
        date: adv.date,
        amount: adv.amount,
        reason: adv.reason || null,
      }));
      await client.from('staff_advances').upsert(advanceRows);
      counts.salaryAdvances = advanceRows.length;
    }

    // 6. Staff Bonuses
    if (data.bonuses.length > 0) {
      const bonusRows = data.bonuses.map(b => ({
        id: b.id,
        staff_id: b.staffId,
        date: b.date,
        amount: b.amount,
        reason: b.reason || null,
      }));
      await client.from('staff_bonuses').upsert(bonusRows);
      counts.bonuses = bonusRows.length;
    }

    // 7. Rooms
    if (data.rooms.length > 0) {
      const roomRows = data.rooms.map(r => ({
        id: r.id,
        name: r.name,
        condition: r.condition,
        maintenance_notes: r.maintenanceNotes || '',
        beds: r.beds,
      }));
      const { error } = await client.from('rooms').upsert(roomRows);
      if (error) throw new Error(`Rooms upload: ${error.message}`);
      counts.rooms = roomRows.length;
    }

    // 8. Walk-in Guests
    if (data.walkInGuests.length > 0) {
      const walkInRows = data.walkInGuests.map(w => ({
        id: w.id,
        guest_name: w.guestName,
        room_id: w.roomId || null,
        bed_number: w.bedNumber || null,
        check_in_date: w.checkInDate,
        number_of_nights: w.numberOfNights,
        price_per_night: w.pricePerNight,
        amount_paid: w.amountPaid,
        payment_method: w.paymentMethod,
        nationality: w.nationality || null,
        id_number: w.idNumber || null,
        notes: w.notes || null,
        status: w.status,
      }));
      const { error } = await client.from('walk_in_guests').upsert(walkInRows);
      if (error) throw new Error(`Walk-ins upload: ${error.message}`);
      counts.walkInGuests = walkInRows.length;
    }

    // 9. Accommodation Bookings
    if (data.accommodationBookings.length > 0) {
      const bookingRows = data.accommodationBookings.map(ab => ({
        id: ab.id,
        guest_name: ab.guestName,
        platform: ab.platform,
        room_id: ab.roomId || null,
        bed_number: ab.bedNumber || null,
        check_in_date: ab.check_in_date || ab.checkInDate,
        number_of_nights: ab.numberOfNights,
        total_price: ab.totalPrice,
        amount_paid: ab.amountPaid,
        status: ab.status,
      }));
      const { error } = await client.from('accommodation_bookings').upsert(bookingRows);
      if (error) throw new Error(`Online bookings upload: ${error.message}`);
      counts.accommodationBookings = bookingRows.length;
    }

    // 10. Activities
    if (data.activities.length > 0) {
      const actRows = data.activities.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description || null,
        price: a.price,
        image_url: a.imageUrl || null,
        commission: a.commission || 0,
        type: a.type || 'Internal',
        company_cost: a.companyCost || 0,
      }));
      await client.from('activities').upsert(actRows);
      counts.activities = actRows.length;
    }

    // 11. Speedboat Trips
    if (data.speedBoatTrips.length > 0) {
      const sbRows = data.speedBoatTrips.map(sb => ({
        id: sb.id,
        route: sb.route,
        company: sb.company,
        price: sb.price,
        cost: sb.cost,
        commission: sb.commission || 0,
      }));
      await client.from('speedboat_trips').upsert(sbRows);
      counts.speedBoatTrips = sbRows.length;
    }

    // 12. Taxi Boat Options
    if (data.taxiBoatOptions.length > 0) {
      const taxiRows = data.taxiBoatOptions.map(tx => ({
        id: tx.id,
        name: tx.name,
        price: tx.price,
        commission: tx.commission || 0,
      }));
      await client.from('taxi_boat_options').upsert(taxiRows);
      counts.taxiBoatOptions = taxiRows.length;
    }

    // 13. Extras
    if (data.extras.length > 0) {
      const extraRows = data.extras.map(ex => ({
        id: ex.id,
        name: ex.name,
        price: ex.price,
        commission: ex.commission || 0,
      }));
      await client.from('extras').upsert(extraRows);
      counts.extras = extraRows.length;
    }

    // 14. Activity Bookings
    if (data.bookings.length > 0) {
      const bRows = data.bookings.map(b => ({
        id: b.id,
        item_id: b.itemId,
        item_type: b.itemType,
        item_name: b.itemName,
        staff_id: b.staffId || null,
        booking_date: b.bookingDate,
        customer_price: b.customerPrice,
        number_of_people: b.numberOfPeople,
        discount: b.discount || 0,
        extras: b.extras || null,
        extras_total: b.extrasTotal || 0,
        payment_method: b.paymentMethod,
        receipt_image: b.receiptImage || null,
        fuel_cost: b.fuelCost || 0,
        captain_cost: b.captainCost || 0,
        item_cost: b.itemCost || 0,
        employee_commission: b.employeeCommission || 0,
        hostel_commission: b.hostelCommission || 0,
      }));
      await client.from('activity_bookings').upsert(bRows);
      counts.activityBookings = bRows.length;
    }

    // 15. Utility Records
    if (data.utilityRecords.length > 0) {
      const utilRows = data.utilityRecords.map(u => ({
        id: u.id,
        utility_type: u.utilityType,
        date: u.date,
        cost: u.cost,
        bill_image: u.billImage || null,
      }));
      await client.from('utility_records').upsert(utilRows);
      counts.utilityRecords = utilRows.length;
    }

    // 16. External Sales
    if (data.externalSales.length > 0) {
      const saleRows = data.externalSales.map(es => ({
        id: es.id,
        date: es.date,
        amount: es.amount,
        description: es.description || null,
      }));
      await client.from('external_sales').upsert(saleRows);
      counts.externalSales = saleRows.length;
    }

    // 17. Platform Payments
    if (data.platformPayments.length > 0) {
      const paymentRows = data.platformPayments.map(pp => ({
        id: pp.id,
        date: pp.date,
        platform: pp.platform,
        amount: pp.amount,
        booking_reference: pp.bookingReference || null,
      }));
      await client.from('platform_payments').upsert(paymentRows);
      counts.platformPayments = paymentRows.length;
    }

    // 18. Admin Master Password
    if (data.adminMasterPassword) {
      await client.from('system_config').upsert({
        key: 'admin_master_password',
        value: data.adminMasterPassword,
      });
      counts.systemConfig = 1;
    }

    return {
      success: true,
      message: 'All hostel records successfully exported and synchronized to Supabase PostgreSQL!',
      counts,
    };
  } catch (error: any) {
    console.error('Failed to seed Supabase data:', error);
    return {
      success: false,
      message: error?.message || 'Failed to seed records to Supabase. Check if the SQL schema has been created in your Supabase dashboard.',
    };
  }
}
