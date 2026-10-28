export enum EntityCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  'Needs Repair' = 'Needs Repair',
}

export enum TaskStatus {
  Pending = 'Pending',
  'In Progress' = 'In Progress',
  Completed = 'Completed',
}

// Fix: Add BedStatus enum for use in RoomManagement component.
export enum BedStatus {
    Ready = 'Ready',
    'Needs Cleaning' = 'Needs Cleaning',
}

// Added Role enum for permission control
export enum Role {
    Admin = 'Admin',
    Staff = 'Staff',
}

export enum PaymentStatus {
  Paid = 'Paid',
  'Deposit Paid' = 'Deposit Paid',
  Unpaid = 'Unpaid',
}

export interface PaymentType {
  id: string;
  name: string;
}

// Fix: Add Bed interface for use in RoomManagement component.
export interface Bed {
    id: string;
    number: number;
    status: BedStatus;
}

// Fix: Add Room interface for use in RoomManagement component.
export interface Room {
    id:string;
    name: string;
    condition: EntityCondition;
    maintenanceNotes: string;
    beds: Bed[];
}

// Fix: Add Asset interface for use in AssetManagement component.
export interface Asset {
  id:string;
  name: string;
  type: string;
  location: string;
  purchaseDate: string; // YYYY-MM-DD
  warranty: string; // YYYY-MM-DD
  supplier: string;
  condition: EntityCondition;
}

export interface Staff {
  id: string;
  name: string;
  role: Role;
  salary: number;
  contact: string;
  employeeId: string;
  loginId?: string;
  password?: string;
}

export interface Shift {
    id:string;
    date: string; // YYYY-MM-DD
    staffName: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
}

export interface Task {
  id: string;
  description: string;
  assignedTo: string; // staff id
  dueDate: string;
  status: TaskStatus;
}

export interface UtilityRecord {
    id: string;
    utilityType: string;
    date: string; // YYYY-MM-DD
    cost: number;
    billImage?: string; // base64 encoded image
}

export interface Absence {
  id: string;
  staffId: string; // The ID of the staff member
  date: string; // YYYY-MM-DD
  reason?: string; // Optional reason for absence
}

export interface SalaryAdvance {
  id: string;
  staffId: string; // The ID of the staff member
  date: string; // YYYY-MM-DD
  amount: number;
  reason?: string; // Optional reason for the advance
}

export interface Bonus {
  id: string;
  staffId: string; // The ID of the staff member
  date: string; // YYYY-MM-DD
  amount: number;
  reason?: string; // Reason or description for bonus (e.g. High Season Bonus, Performance, Tips)
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  commission?: number;
  type: 'Internal' | 'External';
  companyCost?: number;
}

export interface SpeedBoatTrip {
  id: string;
  route: string;
  company: string;
  price: number;
  cost: number;
  commission?: number;
}

export interface TaxiBoatOption {
  id: string;
  name: 'One Way' | 'Round Trip';
  price: number;
  commission?: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  commission?: number;
}

export interface WalkInGuest {
  id: string;
  guestName: string;
  roomId: string;
  bedNumber?: number;
  checkInDate: string; // YYYY-MM-DD
  numberOfNights: number;
  pricePerNight: number;
  amountPaid: number;
  paymentMethod: string;
  nationality?: string;
  idNumber?: string;
  notes?: string;
  status: PaymentStatus;
}

export interface AccommodationBooking {
  id: string;
  guestName: string;
  platform: string;
  roomId: string;
  bedNumber?: number;
  checkInDate: string; // YYYY-MM-DD
  numberOfNights: number;
  totalPrice: number;
  amountPaid: number; // Deposit from platform
  status: PaymentStatus;
}

export interface Booking {
  id: string;
  itemId: string;
  itemType: 'activity' | 'speedboat' | 'private_tour' | 'extra' | 'taxi_boat';
  itemName: string;
  staffId: string;
  bookingDate: string; // YYYY-MM-DD
  customerPrice: number;
  numberOfPeople: number;
  discount?: number;
  extras?: Omit<Extra, 'id' | 'commission'>[];
  extrasTotal?: number;
  paymentMethod: string;
  receiptImage?: string; // base64 encoded image
  fuelCost?: number;
  captainCost?: number;
  itemCost?: number; // Total cost for the hostel (e.g., what to pay the boat company)
  employeeCommission?: number;
  hostelCommission?: number;
}

export interface ExternalSale {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  description?: string;
}

export interface PlatformPayment {
  id: string;
  date: string; // YYYY-MM-DD
  platform: string;
  amount: number;
  bookingReference?: string;
}