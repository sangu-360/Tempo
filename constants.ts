// Fix: Populating constants.ts with mock data for users, drivers, and bookings.
// This data simulates a backend database for the application to function.
import { User, UserRole, Driver, Booking, BookingStatus } from './types';

export const USERS: User[] = [
  { id: 'priya.s', name: 'Priya Sharma', role: UserRole.CUSTOMER, phone: '9876543210' },
  { id: 'admin', name: 'Admin', role: UserRole.ADMIN },
];

export const DRIVERS: Driver[] = [
    { id: 'ravi.k', name: 'Ravi Kumar', role: UserRole.DRIVER, vehicleDetails: 'Tata Ace (MH 01 AB 1234)', currentLocation: 'Koramangala, Bangalore', isAvailable: true, phone: '1234567890' },
    { id: 'sanjay.m', name: 'Sanjay Mehta', role: UserRole.DRIVER, vehicleDetails: 'Mahindra Bolero (KA 02 CD 5678)', currentLocation: 'Indiranagar, Bangalore', isAvailable: true, phone: '2345678901' },
    { id: 'amit.g', name: 'Amit Gupta', role: UserRole.DRIVER, vehicleDetails: 'Ashok Leyland Dost (DL 03 EF 9101)', currentLocation: 'Jayanagar, Bangalore', isAvailable: true, phone: '3456789012' },
];

export const BOOKINGS: Booking[] = [
    { id: 'BK001', customerId: 'priya.s', driverId: 'ravi.k', pickupLocation: '123, MG Road, Bangalore', dropoffLocation: '456, HSR Layout, Bangalore', status: BookingStatus.COMPLETED, fare: 550 },
    { id: 'BK002', customerId: 'priya.s', pickupLocation: '789, Whitefield, Bangalore', dropoffLocation: '101, Electronic City, Bangalore', status: BookingStatus.PENDING },
];

export const ADMIN_PASSWORD = 'Hero@123';