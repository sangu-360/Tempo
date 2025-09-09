// Fix: Populating utils.ts with helper functions `sleep` and `generateId`.
// These are used for simulating network delay and creating unique IDs.
import { Booking, User } from './types';

// Simulate a delay for API calls
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A simple ID generator for new bookings/users
export const generateId = (prefix: string = '') => {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
};
