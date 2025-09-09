export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum AppScreen {
  LOGIN = 'LOGIN',
  CUSTOMER_DASHBOARD = 'CUSTOMER_DASHBOARD',
  DRIVER_DASHBOARD = 'DRIVER_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
}

export interface BaseUser {
    id: string; // username
    role: UserRole;
    name: string;
}

export interface Driver extends BaseUser {
  role: UserRole.DRIVER;
  phone: string;
  vehicleNumber: string;
  imageUrl: string;
  isAuthorized: boolean;
}

export interface Booking {
  id: number;
  pickup: string;
  dropoff: string;
  customerName: string;
  customerPhone: string;
  bookingTime: string;
  status: BookingStatus;
  customerId: string;
  assignedDriver?: Driver;
}
