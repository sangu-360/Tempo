// Fix: Populating types.ts with definitions used throughout the application.
// This resolves "is not a module" and "Cannot find name" errors.

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface Driver {
  id: string;
  name: string;
  role: UserRole.DRIVER;
  vehicleDetails: string;
  currentLocation: string;
  isAvailable: boolean;
  phone: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  DRIVER_FOUND = 'DRIVER_FOUND',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Booking {
  id: string;
  customerId: string;
  driverId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime?: string;
  status: BookingStatus;
  fare?: number;
}

export interface AppNotification {
  id: number;
  message: string;
  type: 'success' | 'info';
}
