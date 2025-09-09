import type { Driver, BaseUser } from './types';
import { UserRole } from './types';

export const DRIVERS: Driver[] = [
  {
    id: 'ravi.k',
    role: UserRole.DRIVER,
    name: 'Ravi Kumar',
    phone: '+91 98765 43210',
    vehicleNumber: 'MH 12 AB 3456',
    imageUrl: 'https://i.pravatar.cc/150?u=ravi.k',
    isAuthorized: true
  },
  {
    id: 'suresh.p',
    role: UserRole.DRIVER,
    name: 'Suresh Patel',
    phone: '+91 91234 56789',
    vehicleNumber: 'DL 03 XY 9876',
    imageUrl: 'https://i.pravatar.cc/150?u=suresh.p',
    isAuthorized: true
  },
    {
    id: 'manoj.s',
    role: UserRole.DRIVER,
    name: 'Manoj Sharma',
    phone: '+91 96543 21098',
    vehicleNumber: 'TN 22 PQ 5678',
    imageUrl: 'https://i.pravatar.cc/150?u=manoj.s',
    isAuthorized: true
  },
  {
    id: 'anil.s',
    role: UserRole.DRIVER,
    name: 'Anil Singh',
    phone: '+91 99887 76655',
    vehicleNumber: 'KA 05 MN 1234',
    imageUrl: 'https://i.pravatar.cc/150?u=anil.s',
    isAuthorized: false
  }
];

export const CUSTOMERS: BaseUser[] = [
    { id: 'priya.s', role: UserRole.CUSTOMER, name: 'Priya Sharma' },
    { id: 'amit.s', role: UserRole.CUSTOMER, name: 'Amit Singh' },
];

export const ADMINS: BaseUser[] = [
    { id: 'admin', role: UserRole.ADMIN, name: 'Admin User' },
];
