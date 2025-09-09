// Fix: Populating the types.ts file with all necessary type definitions.
// This resolves 'Cannot find name' errors and module resolution issues.

export enum UserRole {
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export enum BookingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Booking {
  id: string;
  customerId: string;
  driverId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: BookingStatus;
  fare?: number;
  vehicleType: string;
}

export interface Driver {
    id: string;
    name: string;
    vehicleDetails: string;
    currentLocation: string;
    isAvailable: boolean;
}

export interface Location {
    lat: number;
    lng: number;
    address: string;
}
