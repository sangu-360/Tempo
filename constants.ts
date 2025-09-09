// Fix: Populating constants.ts with mock data for users, drivers, and bookings.
// This data simulates a backend database for the application to function.
import { User, UserRole, Driver, Booking, BookingStatus } from './types';

export const USERS: User[] = [
  { id: 'priya.s', name: 'Priya Sharma', role: UserRole.CUSTOMER },
  { id: 'ravi.k', name: 'Ravi Kumar', role: UserRole.DRIVER },
  { id: 'admin', name: 'Admin', role: UserRole.ADMIN },
];

export const DRIVERS: Driver[] = [
    { id: 'ravi.k', name: 'Ravi Kumar', vehicleDetails: 'Tata Ace (MH 01 AB 1234)', currentLocation: 'Koramangala, Bangalore', isAvailable: true },
    { id: 'sanjay.m', name: 'Sanjay Mehta', vehicleDetails: 'Mahindra Bolero (KA 02 CD 5678)', currentLocation: 'Indiranagar, Bangalore', isAvailable: false },
    { id: 'amit.g', name: 'Amit Gupta', vehicleDetails: 'Ashok Leyland Dost (DL 03 EF 9101)', currentLocation: 'Jayanagar, Bangalore', isAvailable: true },
];

export const BOOKINGS: Booking[] = [
    { id: 'BK001', customerId: 'priya.s', driverId: 'ravi.k', pickupLocation: '123, MG Road, Bangalore', dropoffLocation: '456, HSR Layout, Bangalore', status: BookingStatus.COMPLETED, fare: 550, vehicleType: 'Tata Ace' },
    { id: 'BK002', customerId: 'priya.s', pickupLocation: '789, Whitefield, Bangalore', dropoffLocation: '101, Electronic City, Bangalore', status: BookingStatus.PENDING, vehicleType: 'Mahindra Bolero' },
];

export const ADMIN_PASSWORD = 'password123';
